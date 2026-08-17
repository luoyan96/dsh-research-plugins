# 阶段 4：代码复现与受控实验

## 目标

提供仓库发现/分析、受审批的代码执行和实验结果标准化，默认安全、可中止、可复现。

## 任务

1. 实现 `code_search`、`repo_clone`、`repo_analyze`，记录来源 URL、commit、许可证和分析证据。
2. 实现 `experiment_plan_create`、`experiment_run`、`experiment_read`；执行前强制审批和资源预算。
3. 通过 Harness sandbox/approval 能力运行，禁止绕过权限系统。
4. 记录命令、git revision、环境指纹、数据集版本、参数、资源、stdout/stderr、退出码、时间和 metrics。
5. 支持取消、超时、失败和结果解析错误；所有状态均保存为 Experiment Artifact。

## 验收

未批准的命令不能执行；一次实验可从记录中复跑；超时/失败具有完整日志且不被伪装为成功。

## 给代码 AI 的 Prompt

```text
在 dsh-research-plugins 实现阶段 4。先阅读目标 Harness 的 sandbox、approval、terminal 相关实现，使用其公开扩展点；不得执行宿主机任意命令或绕过审批。

实现 code_search/repo_clone/repo_analyze 与实验计划、执行、读取工具。repo_clone、依赖安装、大下载、GPU/付费资源、删除/覆盖均须明确批准。实验记录必须包含 command、git commit、environment fingerprint、dataset version、parameters、logs、exit code、metrics 和时间。实现 mock sandbox 测试，包括未批准、超时、取消、失败、损坏 metrics。不要实现 UI 或论文写作逻辑。
```
