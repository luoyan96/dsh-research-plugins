import { Context } from "@deepseek-ai/cordis";
//#region src/index.d.ts
declare const name = "research-core";
declare const inject: string[];
declare const VERSION = "0.1.0";
interface Config {
  workspaceRoot?: string;
}
declare function apply(ctx: Context, config?: Config): void;
//#endregion
export { Config, VERSION, apply, inject, name };