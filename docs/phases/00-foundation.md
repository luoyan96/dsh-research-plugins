# 阶段 0：Harness 集成基线

## 目标

建立单一 `research-core` Plugin、Research Profile 和可替换的 HarnessAdapter，验证本仓库能以外部扩展加载。

## 任务

1. 初始化 TypeScript/pnpm 工程、lint、单元测试和本地开发说明。
2. 创建 `research-core` 插件入口、Profile 和 `HarnessAdapter` 接口；把 Harness 特有 API 限制在 adapter 内。
3. 注册一个只读 `research_health` 工具，返回插件版本和可用服务，不访问网络。
4. 定义领域类型的版本策略与 schema 校验策略。
5. 加入加载 smoke test 和对目标 Harness 版本的兼容性检查。

## 验收

Harness 可加载 Plugin/Profile，Agent 能调用 `research_health`，并且替换 adapter 不影响领域服务测试。

## 给代码 AI 的 Prompt

```text
在 D:\deepseek-agent\dsh-research-plugins 实现阶段 0。请先阅读本地 deepseek-harness 的插件、profile、skill 文档和相邻 dsh-catnap-desktop 的已验证结构；不要猜测 API，也不要修改上游 Harness。

实现最小 research-core 外部插件、Research Profile、HarnessAdapter 边界、research_health 工具、类型/schema 校验、lint 和 smoke test。任何 Harness API 只能在 adapter 或插件入口出现。此阶段禁止网络、论文服务、数据库迁移和 UI。完成后给出实际启动/测试命令及其输出摘要。
```
