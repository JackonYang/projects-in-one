# wechat-mp-driver

更易用的微信公众号 API

主要是根据自己的业务场景定制，并适当牺牲安全性需求。

代码不多，api 和 demo 直接看代码。

- [api.py](api.py)
- [demos.py](demos.py)

已支持的 API：

- 上传 article list 到草稿箱
- 上传文章的图片。不占用公众号的素材库中图片数量的100000个的限制
- 上传永久的素材图片
- 获取已上传的图片 list
- 测试与公众号的 connection。主要是鉴权、IP 白名单。
