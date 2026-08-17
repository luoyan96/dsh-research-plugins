import "./domain/index.mjs";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
//#region src/domain/validation.ts
const IDENTIFIER = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;
function requireIdentifier(value, field) {
	if (!IDENTIFIER.test(value)) throw new Error(`${field} must be 1-128 URL-safe characters`);
}
function requireNonEmpty(value, field) {
	if (value.trim().length === 0) throw new Error(`${field} must not be empty`);
}
function requireArtifactStatus(value) {
	if (value !== "draft" && value !== "final" && value !== "failed") throw new Error("status must be draft, final, or failed");
}
function validateSources(sources, factual) {
	if (factual && sources.length === 0) throw new Error("factual artifacts require at least one source");
	for (const source of sources) {
		requireIdentifier(source.id, "source.id");
		requireNonEmpty(source.locator, "source.locator");
	}
}
//#endregion
//#region src/artifact-store.ts
/** Local-only, atomic store. Every path is derived from validated ids under workspaceRoot. */
var ArtifactStore = class {
	workspaceRoot;
	writeTails = /* @__PURE__ */ new Map();
	constructor(workspaceRoot) {
		this.workspaceRoot = workspaceRoot;
	}
	async createProject(input) {
		requireNonEmpty(input.name, "name");
		const id = input.id ?? randomUUID();
		requireIdentifier(id, "project id");
		const root = this.projectRoot(id);
		await mkdir(root, { recursive: true });
		const projectPath = resolve(root, "project.json");
		try {
			return JSON.parse(await readFile(projectPath, "utf8"));
		} catch (error) {
			if (!isMissing(error)) throw error;
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const project = {
			schema_version: 1,
			id,
			name: input.name.trim(),
			created_at: now,
			updated_at: now
		};
		await writeJsonAtomic(projectPath, project);
		await writeJsonAtomic(resolve(root, "artifacts.json"), {
			schema_version: 1,
			artifacts: []
		});
		return project;
	}
	async getProject(id) {
		requireIdentifier(id, "project id");
		return this.readJson(resolve(this.projectRoot(id), "project.json"));
	}
	async saveArtifact(projectId, input) {
		return this.withProjectLock(projectId, async () => this.saveArtifactUnlocked(projectId, input));
	}
	async saveArtifactUnlocked(projectId, input) {
		await this.getProject(projectId);
		requireNonEmpty(input.type, "type");
		validateSources(input.sources, input.factual ?? true);
		const status = input.status ?? "draft";
		requireArtifactStatus(status);
		const id = input.id ?? randomUUID();
		requireIdentifier(id, "artifact id");
		const root = this.projectRoot(projectId);
		const relativePath = `artifacts/${id}.md`;
		const outputPath = this.safePath(root, relativePath);
		await mkdir(dirname(outputPath), { recursive: true });
		const content = input.content.replace(/\r\n/g, "\n");
		await writeAtomic(outputPath, content);
		const artifact = {
			schema_version: 1,
			id,
			project_id: projectId,
			type: input.type.trim(),
			path: relativePath,
			sha256: createHash("sha256").update(content).digest("hex"),
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			status,
			sources: [...input.sources]
		};
		const indexPath = resolve(root, "artifacts.json");
		const index = await this.readJson(indexPath);
		if (index.artifacts.some((existing) => existing.id === id)) throw new Error(`artifact already exists: ${id}`);
		await writeJsonAtomic(indexPath, {
			...index,
			artifacts: [...index.artifacts, artifact]
		});
		return artifact;
	}
	async listArtifacts(projectId) {
		await this.getProject(projectId);
		return (await this.readJson(resolve(this.projectRoot(projectId), "artifacts.json"))).artifacts;
	}
	async getArtifact(projectId, artifactId) {
		requireIdentifier(artifactId, "artifact id");
		const artifact = (await this.listArtifacts(projectId)).find((item) => item.id === artifactId);
		if (artifact === void 0) throw new Error(`artifact not found: ${artifactId}`);
		return {
			artifact,
			content: await readFile(this.safePath(this.projectRoot(projectId), artifact.path), "utf8")
		};
	}
	projectRoot(id) {
		return this.safePath(resolve(this.workspaceRoot, "research-projects"), id);
	}
	safePath(root, child) {
		const candidate = resolve(root, child);
		const rel = relative(root, candidate);
		if (rel === "" || rel.startsWith(`..${sep}`) || rel === ".." || resolve(root) === candidate) throw new Error("unsafe project path");
		return candidate;
	}
	async readJson(path) {
		const value = JSON.parse(await readFile(path, "utf8"));
		if (typeof value !== "object" || value === null || !("schema_version" in value) || value.schema_version !== 1) throw new Error(`unsupported or malformed research schema in ${path}`);
		return value;
	}
	async withProjectLock(projectId, operation) {
		const previous = this.writeTails.get(projectId) ?? Promise.resolve();
		let release = () => void 0;
		const current = new Promise((resolveRelease) => {
			release = resolveRelease;
		});
		const tail = previous.then(() => current);
		this.writeTails.set(projectId, tail);
		await previous;
		try {
			return await operation();
		} finally {
			release();
			if (this.writeTails.get(projectId) === tail) this.writeTails.delete(projectId);
		}
	}
};
function isMissing(error) {
	return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
async function writeAtomic(path, text) {
	const temporary = `${path}.${randomUUID()}.tmp`;
	await writeFile(temporary, text, "utf8");
	await rename(temporary, path);
}
async function writeJsonAtomic(path, value) {
	await writeAtomic(path, `${JSON.stringify(value, null, 2)}\n`);
}
//#endregion
//#region src/index.ts
const name = "research-core";
const inject = ["tools"];
const VERSION = "0.1.0";
const sourceSchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		id: {
			type: "string",
			required: true
		},
		kind: {
			type: "string",
			required: true,
			enum: [
				"paper",
				"dataset",
				"repository",
				"note",
				"other"
			]
		},
		locator: {
			type: "string",
			required: true
		},
		accessedAt: { type: "string" }
	}
};
const artifactOutput = {
	type: "object",
	additionalProperties: false,
	properties: {
		schema_version: {
			type: "integer",
			required: true
		},
		id: {
			type: "string",
			required: true
		},
		project_id: {
			type: "string",
			required: true
		},
		type: {
			type: "string",
			required: true
		},
		path: {
			type: "string",
			required: true
		},
		sha256: {
			type: "string",
			required: true
		},
		created_at: {
			type: "string",
			required: true
		},
		status: {
			type: "string",
			required: true
		},
		sources: {
			type: "array",
			required: true,
			items: sourceSchema
		}
	}
};
function apply(ctx, config = {}) {
	const store = new ArtifactStore(config.workspaceRoot ?? process.cwd());
	ctx.tools.register(defineTool({
		name: "research_health",
		description: "Report the installed research plugin version and available local services. Does not access the network or filesystem.",
		parameters: {},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					plugin_version: {
						type: "string",
						required: true
					},
					schema_version: {
						type: "integer",
						required: true
					},
					services: {
						type: "array",
						required: true,
						items: { type: "string" }
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: `research-core ${value.plugin_version}; services: ${value.services.join(", ")}`
			}]
		},
		execute: async () => ({
			plugin_version: VERSION,
			schema_version: 1,
			services: ["projects", "artifacts"]
		})
	}));
	ctx.tools.register(defineTool({
		name: "project_create",
		description: "Create or return a local research project.",
		parameters: {
			name: {
				type: "string",
				required: true
			},
			id: { type: "string" }
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					schema_version: {
						type: "integer",
						required: true
					},
					id: {
						type: "string",
						required: true
					},
					name: {
						type: "string",
						required: true
					},
					created_at: {
						type: "string",
						required: true
					},
					updated_at: {
						type: "string",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: `project ${value.id} ready`
			}]
		},
		execute: (args) => store.createProject(args)
	}));
	ctx.tools.register(defineTool({
		name: "project_get",
		description: "Read a local research project by id.",
		parameters: { project_id: {
			type: "string",
			required: true
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					schema_version: {
						type: "integer",
						required: true
					},
					id: {
						type: "string",
						required: true
					},
					name: {
						type: "string",
						required: true
					},
					created_at: {
						type: "string",
						required: true
					},
					updated_at: {
						type: "string",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: `project ${value.id}: ${value.name}`
			}]
		},
		execute: (args) => store.getProject(args.project_id)
	}));
	ctx.tools.register(defineTool({
		name: "artifact_save",
		description: "Atomically save a local research artifact with provenance. Factual artifacts require source references.",
		parameters: {
			project_id: {
				type: "string",
				required: true
			},
			id: { type: "string" },
			type: {
				type: "string",
				required: true
			},
			content: {
				type: "string",
				required: true
			},
			sources: {
				type: "array",
				required: true,
				items: sourceSchema
			},
			status: {
				type: "string",
				enum: [
					"draft",
					"final",
					"failed"
				]
			},
			factual: { type: "boolean" }
		},
		output: {
			schema: artifactOutput,
			render: (_args, value) => [{
				type: "text",
				text: `saved artifact ${value.id} (${value.sha256.slice(0, 12)})`
			}]
		},
		execute: (args) => store.saveArtifact(args.project_id, args)
	}));
	ctx.tools.register(defineTool({
		name: "artifact_list",
		description: "List the provenance metadata for artifacts in a local project.",
		parameters: { project_id: {
			type: "string",
			required: true
		} },
		output: {
			schema: {
				type: "array",
				items: artifactOutput
			},
			render: (_args, value) => [{
				type: "text",
				text: `${value.length} artifacts`
			}]
		},
		execute: (args) => store.listArtifacts(args.project_id)
	}));
	ctx.tools.register(defineTool({
		name: "artifact_get",
		description: "Read one local research artifact and its provenance metadata.",
		parameters: {
			project_id: {
				type: "string",
				required: true
			},
			artifact_id: {
				type: "string",
				required: true
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					artifact: {
						...artifactOutput,
						required: true
					},
					content: {
						type: "string",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: `artifact ${value.artifact.id}\n${value.content}`
			}]
		},
		execute: (args) => store.getArtifact(args.project_id, args.artifact_id)
	}));
}
//#endregion
export { VERSION, apply, inject, name };
