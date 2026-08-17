window.__ModuleLoader__.load({
	id: "dsh-research-plugins",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region src/client/research-launcher.ts
		const workflows = [
			{
				name: "论文检索",
				summary: "建立查询矩阵，检索、去重并生成带覆盖说明的排序文献简报。",
				prompt: "/paper-search-pro：围绕「请填写研究问题」检索近 5 年文献，先给出查询矩阵和检索范围。"
			},
			{
				name: "系统综述",
				summary: "从 protocol、筛选记录到证据提取和主题化综合，保留排除理由。",
				prompt: "/systematic-literature-review：围绕「请填写综述问题」建立 protocol，先确认纳入排除标准。"
			},
			{
				name: "论文精读 / 审稿",
				summary: "用论文中可定位的证据进行批评、复现性检查和修订建议排序。",
				prompt: "/academic-paper-review：请评审我将提供的论文，先说明可访问内容与审稿范围。"
			},
			{
				name: "研究假设",
				summary: "提出可证伪的竞争假设、最小判别实验与不可篡改研究日志。",
				prompt: "/hypothesis-research-loop：探索「请填写研究方向」，先提出可证伪的竞争假设和最小实验。"
			},
			{
				name: "统计分析",
				summary: "先审计数据和实验设计，再选择检验、效应量与不确定性报告。",
				prompt: "/statistical-result-analysis：我将提供结果文件；先确认分析单位、指标和实验设计。"
			},
			{
				name: "论文写作 / 回复审稿",
				summary: "建立 claim-to-evidence map，再进行写作、修订或 rebuttal。",
				prompt: "/research-writing-and-rebuttal：我将提供稿件和证据材料；先建立 claim-to-evidence map。"
			}
		];
		const launcherId = "dsh-research-plugin-launcher";
		const modalId = "dsh-research-plugin-modal";
		function setComposerDraft(prompt) {
			const textarea = document.querySelector("[data-composer-seat] textarea");
			if (textarea === null) return;
			(Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set)?.call(textarea, prompt);
			textarea.dispatchEvent(new Event("input", { bubbles: true }));
			textarea.focus();
		}
		function closeModal() {
			document.getElementById(modalId)?.remove();
		}
		function openModal() {
			if (document.getElementById(modalId) !== null) return;
			const overlay = document.createElement("div");
			overlay.id = modalId;
			overlay.setAttribute("role", "dialog");
			overlay.setAttribute("aria-modal", "true");
			overlay.setAttribute("aria-label", "科研插件");
			overlay.style.cssText = [
				"position:fixed",
				"inset:0",
				"z-index:9999",
				"display:grid",
				"place-items:center",
				"padding:24px",
				"background:rgba(20,24,32,.28)",
				"backdrop-filter:blur(3px)"
			].join(";");
			const panel = document.createElement("section");
			panel.style.cssText = [
				"width:min(860px,100%)",
				"max-height:min(760px,calc(100vh - 48px))",
				"overflow:auto",
				"padding:24px",
				"border-radius:20px",
				"background:Canvas",
				"color:CanvasText",
				"box-shadow:0 24px 70px rgba(0,0,0,.22)",
				"font:inherit"
			].join(";");
			panel.innerHTML = "<div style=\"display:flex;align-items:flex-start;justify-content:space-between;gap:16px\"><div><h2 style=\"margin:0;font-size:22px\">科研插件</h2><p style=\"margin:7px 0 0;color:color-mix(in srgb, CanvasText 60%, transparent);line-height:1.55\">选择一个科研工作流。点击“去使用”会把预设模板填入当前输入框，你可以修改后再发送。</p></div><button type=\"button\" data-close style=\"border:0;background:transparent;color:inherit;font-size:26px;line-height:1;cursor:pointer\" aria-label=\"关闭\">×</button></div>";
			const grid = document.createElement("div");
			grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:12px;margin-top:20px";
			for (const workflow of workflows) {
				const card = document.createElement("article");
				card.style.cssText = "display:flex;min-height:154px;flex-direction:column;align-items:flex-start;padding:16px;border:1px solid color-mix(in srgb, CanvasText 12%, transparent);border-radius:14px;background:color-mix(in srgb, Canvas 96%, CanvasText 3%)";
				const title = document.createElement("h3");
				title.textContent = workflow.name;
				title.style.cssText = "margin:0;font-size:16px";
				const summary = document.createElement("p");
				summary.textContent = workflow.summary;
				summary.style.cssText = "margin:9px 0 16px;line-height:1.5;font-size:13px;color:color-mix(in srgb, CanvasText 65%, transparent)";
				const use = document.createElement("button");
				use.type = "button";
				use.textContent = "去使用";
				use.style.cssText = "margin-top:auto;padding:7px 11px;border:0;border-radius:9px;background:#ffb994;color:#2b201a;font:inherit;font-size:13px;font-weight:600;cursor:pointer";
				use.addEventListener("click", () => {
					setComposerDraft(workflow.prompt);
					closeModal();
				});
				card.append(title, summary, use);
				grid.append(card);
			}
			panel.append(grid);
			overlay.append(panel);
			overlay.addEventListener("click", (event) => {
				if (event.target === overlay) closeModal();
			});
			panel.querySelector("[data-close]")?.addEventListener("click", closeModal);
			document.body.append(overlay);
		}
		function attach() {
			if (document.getElementById(launcherId) !== null) return;
			const seat = document.querySelector("[data-composer-seat]");
			if (seat === null) return;
			const launcher = document.createElement("button");
			launcher.id = launcherId;
			launcher.type = "button";
			launcher.textContent = "科研插件";
			launcher.style.cssText = [
				"display:block",
				"width:min(520px,calc(100% - 32px))",
				"margin:12px auto 0",
				"padding:10px 14px",
				"border:1px solid rgba(255,185,148,.7)",
				"border-radius:12px",
				"background:rgba(255,185,148,.16)",
				"color:inherit",
				"font:600 14px/20px inherit",
				"cursor:pointer",
				"text-align:left"
			].join(";");
			launcher.addEventListener("click", openModal);
			seat.append(launcher);
		}
		/** Re-attach after DSH swaps its resident composer during a workspace/session transition. */
		function mountResearchLauncher() {
			attach();
			const observer = new MutationObserver(attach);
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
			return () => {
				observer.disconnect();
				document.getElementById(launcherId)?.remove();
				closeModal();
			};
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* The new-session composer has no additive root slot in DSH yet. Mount against
		* its stable `data-composer-seat` host so the launcher survives the blank /
		* active session transition without replacing DSH's workspace or model UI.
		*/
		const inject = [];
		function apply(ctx) {
			ctx.effect(() => mountResearchLauncher(), "dsh-research-plugins: new-session launcher");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
