# 阶段 5：稳定化、兼容与发布

## 目标

把研发原型变成可安装、可升级、可诊断的研究能力包。

## 任务

1. 固化公开 API、工具 schema、Artifact schema 和 Harness 兼容矩阵。
2. 为 schema、Project 数据和 Plugin 配置提供迁移与备份策略。
3. 完成权限审计、密钥处理、日志脱敏、依赖许可清单与威胁建模。
4. 生成可安装的 Plugin/Profile 包、版本说明和升级/回滚文档。
5. 建立端到端 smoke：Project → Paper → Artifact → Citation → Experiment plan。

## 验收

新安装、升级、失败回滚和与支持 Harness 版本的加载均可重复验证；敏感值不写入 Artifact 或日志。

## 给代码 AI 的 Prompt

```text
在 dsh-research-plugins 实现阶段 5 的发布稳定化。不要扩展新功能；只固化兼容性、迁移、安全和可观测性。

请生成版本化工具/schema 契约、兼容矩阵、迁移与备份方案、日志脱敏和密钥边界、依赖许可报告及一条端到端 smoke 测试。发布包必须可由独立干净目录安装；失败迁移需保留原数据。输出安装、升级、回滚和诊断文档，并列出已知限制。
```
