# projects-in-one

我的独立项目，都在这里。

| 项目 | 类型 | 简介 |
| --- | --- | --- |
| chatbot [小程序](projects/miniapp-chatbot/) & [server](projects/chatbot-server/)  | 小程序 | 聊天机器人，UI 是微信小程序。[使用说明](versions-preview/chatbot)
| [writer-infra-2021](projects/writer-infra-2021/) | website | 根据模版，帮助用户自动写文章，自动发布文章。[主要页面的截图预览](versions-preview/writer-infra-2021/) |
| [article_generator](projects/article_generator/) | framework | 用于快速开发一套每天自动写文章的系统 |
| [wechat_mp_driver](projects/wechat_mp_driver/) | SDK | 更易用的微信公众号 API |
| [evernote2](projects/evernote2/) | SDK | A simple, yet elegant EverNote SDK. 并提供了一键导出 Evernote 所有笔记的命令行工具 |

# Notes

## 常用命令

```bash
# dev env to run all projects & libs
make setup-all

# test all projects & libs
make test-all
```

## 敏感数据

主要是用户名、密码等。都放在单独的 private repo 里。

```bash
# setup
make setup-private-data

# update data
make update-private-data
```

## 回归测试 & flake8

```bash
# test all projects & libs
make test-all
```

Notes:

1. django 的例子，参考 [writer-infra-2021](projects/writer-infra-2021/)
2. 某一行不统计 coverage: `# pragma: no cover`
3. 某一行不检查 flake8: `# noqa F403`
