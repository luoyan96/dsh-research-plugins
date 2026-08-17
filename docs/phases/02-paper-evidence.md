# 阶段 2：论文与证据能力

## 目标

提供可追溯的 `paper_search`、`paper_fetch`、`paper_parse`，支持 Skills 形成真实文献产物。

## 任务

1. 定义 Provider 抽象和标准 Paper schema；第一批 Provider 仅接 OpenAlex、Crossref、arXiv 中实际可稳定接入者。
2. 实现检索、元数据获取、去重候选和统一来源/时间戳记录。
3. 实现经批准的 PDF 获取、缓存、内容 hash、大小限制和失败状态。
4. 接入可替换 PDF parser，输出文本区块、章节、参考文献、页码/位置；解析失败必须可报告。
5. 将论文和解析结果保存为 Artifact，并为 provider mock、无网、重复 DOI、损坏 PDF 写测试。

## 验收

同一论文可由不同来源合并但保留全部来源；每条解析内容有页码/位置；网络或解析失败不会生成虚构内容。

## 给代码 AI 的 Prompt

```text
在 dsh-research-plugins 实现阶段 2。以阶段 1 的 Paper/Artifact/SourceRef 模型为基础，新增 provider 抽象与 paper_search、paper_fetch、paper_parse 工具。只接入有官方 API/公开协议、且可通过 mock 测试的来源；密钥放环境变量，不记录或输出密钥。

PDF 下载要支持用户批准、大小限制、hash、缓存和明确错误；解析结果要有页码或可定位 offset，不能把摘要当全文。所有外部响应先做 schema 校验。实现离线 mock 测试，覆盖重复、无结果、HTTP 失败、损坏 PDF 和解析失败。不要把综述逻辑写进插件。
```
