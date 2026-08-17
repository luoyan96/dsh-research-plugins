# 阶段 1：Project 与 Artifact 基础

## 目标

实现长期科研项目和可审计产物的本地持久化，使 Session 之外仍能恢复研究上下文。

## 任务

1. 定义并校验 `Project`、`Artifact`、`SourceRef`、`ResearchState` 类型与 schema 版本。
2. 建立项目目录、`project.json`、Artifact 索引和安全路径解析；禁止越出项目工作区写入。
3. 实现最小工具：`project_create`、`project_get`、`artifact_save`、`artifact_list`、`artifact_get`。
4. 保存 Artifact 的来源、创建者、hash、时间、schema 版本与状态。
5. 为并发写入、非法路径、无来源的事实性 Artifact、schema 迁移添加测试。

## 验收

关闭并重启后能读取 Project 与 Artifact；任何 Artifact 都能定位到文件和来源；非法路径被拒绝。

## 给代码 AI 的 Prompt

```text
在 dsh-research-plugins 实现阶段 1 的 Project/Artifact 服务与工具。保持 HarnessAdapter 边界；只支持本地项目工作区，不做云同步。

请实现带 schema 校验的 Project、Artifact、SourceRef、ResearchState 类型，安全的路径解析及 project_create/project_get/artifact_save/artifact_list/artifact_get。Artifact 保存必须原子化，记录 hash、created_at、schema_version、source refs。测试重启恢复、路径穿越、并发写、格式错误和缺少来源。不要实现论文搜索或桌面 UI。输出工具 schema、文件布局和测试结果。
```
