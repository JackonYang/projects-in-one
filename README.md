# projects-in-one

我的独立项目，都在这里。

| 项目 | 类型 | 简介 |
| --- | --- | --- |
| [writer-infra-2021](projects/writer-infra-2021/) | website | 根据模版，帮助用户自动写文章，自动发布文章 |
| [article_generator](projects/article_generator/) | framework | 用于快速开发一套每天自动写文章的系统 |
| [wechat_mp_driver](projects/wechat_mp_driver/) | SDK | 更易用的微信公众号 API |

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

## 回归测试

```bash
# test all projects & libs
make test-all
```

Notes:

1. django 的例子，参考 [writer-infra-2021](projects/writer-infra-2021/)
2. 某一行不统计 coverage: `# pragma: no cover`
