# DSH Research Core

面向 DeepSeek Harness（DSH）的本地科研基础插件。它为科研 Skills 提供可审计的项目与 Artifact 存储；科研 SOP 仍由 Skills 定义，本插件不生成或伪造文献、引用和实验结果。

> 当前可用版本是阶段 0–1：只包含本地 Project / Artifact 能力。不包含论文搜索、PDF 解析、引用验证或实验执行。

## 安装

需要 Node.js 22.19+、pnpm，以及已可运行的 DSH。

将本仓库安装到 DSH 的 `web` profile：

```powershell
dsh plugin --profile web add github:luoyan96/dsh-research-plugins
```

安装后启动或重启 DSH：

```powershell
dsh web
```

从仓库目录本地开发或试装时，使用：

```powershell
git clone https://github.com/luoyan96/dsh-research-plugins.git
cd dsh-research-plugins
dsh plugin --profile web add .
dsh web
```

`dsh plugin` 会读取包内的 `cordis.patch.yml`，自动把 `research-core` 加入该 profile；不需要手工复制配置文件。

## 验证安装

在 DSH 对话中请求：

```text
调用 research_health，检查科研插件是否可用。
```

成功结果会包含 `plugin_version`、`schema_version`，以及 `projects`、`artifacts` 两项服务。

## 当前工具

| 工具 | 用途 |
|---|---|
| `research_health` | 无 I/O 地报告版本与已挂载服务。 |
| `project_create` / `project_get` | 创建或读取本地科研项目。 |
| `artifact_save` | 原子保存带来源、状态、时间戳和 SHA-256 的 Artifact。事实性产物必须提供来源。 |
| `artifact_list` / `artifact_get` | 列出或读取某项目的 Artifact 与正文。 |

默认数据目录是运行 DSH 时的工作区下的 `research-projects/`。可在启动 DSH 前设置 `DSH_RESEARCH_WORKSPACE`，将其改到指定目录：

```powershell
$env:DSH_RESEARCH_WORKSPACE = 'D:\research-workspace'
dsh web
```

## 与科研 Skills 配合

本插件与 [dsh-research-skills](https://github.com/luoyan96/dsh-research-skills) 分工：Skills 负责综述、阅读、研究空白、复现和写作流程；本插件负责确定性的本地数据与工具能力。现阶段 Skills 可以使用项目和 Artifact 工具保存可追溯的中间产物。

## 开发与验证

```powershell
pnpm install
pnpm run ci
pnpm pack --dry-run
```

测试覆盖持久化恢复、缺少来源、路径穿越、并发写入、损坏 schema，以及 DSH 工具注册。

## 路线图

后续阶段的边界与验收条件位于 [`docs/phases`](docs/phases)：

1. 论文检索、获取和解析；
2. 引用验证与 Claim → Evidence 溯源；
3. 代码复现和受审批实验；
4. 兼容性、迁移与发布稳定化。

依赖 DSH 的代码必须保留在插件入口与适配边界，禁止修改上游 Harness 源码。
