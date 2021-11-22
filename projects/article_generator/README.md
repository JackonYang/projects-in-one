# article-generator

framework, 用于快速开发一套每天自动写文章的系统。

## 核心思路

生成文章的标准流程是：

1. 开发 template
2. 下载 data
3. 渲染
4. 同步到各平台
5. 每天/每周 重复执行 1-4

这个 framework 的目标：

1. 内置常见的标准流程，用户只需要传入 template 和 data，并配置一下规则。
2. 可以快速开发一套新的标准流程。


## 版本记录

1. WIP 支持彩票文章
2. Pending 支持 nature 文章
3. 支持 deep learning model based writing


## Usage Notes

dev env setup:

```bash
pip3 install -r requirements.txt
```

run all tests
```bash
python3 main.py
```
