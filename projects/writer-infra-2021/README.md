# writer-infra-2021

根据模版，帮助用户自动写文章，自动发布文章。

## 核心思路

Pipeline 上关键是 4 步

1. 模版
2. 爬虫 + UI 界面
3. 渲染（生成文章）
4. 同步文章


## 版本记录

#### Version 0.1

计划 2011.11.21 完成，进行中。

背景：每天跟随别人发文章。2-3 篇，每篇文章 40-50 张图片。全部手动保存。耗时约 20 分钟。

目标：把流程自动化，耗时降到 3 分钟以内。


## Usage Notes

dev env setup:

```bash
pip3 install -r requirements.txt
```

start server

```bash
make server
```
