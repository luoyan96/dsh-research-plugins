# dsh-research-plugins

ResearchOS 的 DeepSeek Harness 集成与确定性科研能力仓库。这里提供 Project、Artifact、论文、引用、代码和实验工具；不把科研 SOP 写进插件。

## 开发顺序

| 阶段 | 文档 | 交付物 | 解锁 |
|---|---|---|---|
| 0 | [集成基线](docs/phases/00-foundation.md) | Plugin/Profile、兼容层、测试骨架 | skills 阶段 0 |
| 1 | [项目与产物](docs/phases/01-project-and-artifacts.md) | Project/Artifact 服务与工具 | desktop 阶段 1 |
| 2 | [论文证据](docs/phases/02-paper-evidence.md) | 搜索、获取、解析工具 | skills 阶段 1、desktop 阶段 2 |
| 3 | [引用与溯源](docs/phases/03-citation-provenance.md) | 引用验证、证据关系 | skills 阶段 2 |
| 4 | [代码与实验](docs/phases/04-code-and-experiments.md) | 复现、受控执行、结果读取 | skills 阶段 3、desktop 阶段 3 |
| 5 | [稳定化发布](docs/phases/05-release-compatibility.md) | 版本、迁移、安全与发布包 | desktop 阶段 5 |

对 Harness 的依赖必须经 `HarnessAdapter` 隔离；禁止修改上游 `D:\deepseek-agent\deepseek-harness` 源码。
