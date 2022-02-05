/**
 * @desc    path配置文件
 * @author  crab.xie
 * @date    2018-04-16
 * @param requestUrl 正式环境
 * @param testRuquestUrl 测试环境
 */
const project = {
  requestUrl: "https://api.vphotos.cn/vphotominiapp/",
  testRuquestUrl: "https://api-fat.vphotos.cn/vphotominiapp/",
  devRuquestUrl: "https://api-dev.vphotos.cn/vphotominiapp/",
  locationUrl: "http://10.3.151.145:8080/vphotossaas/",
  temporaryUrl: "https://api-fat.vphotos.cn/vphotosgallery/",
  appId: "wx39e5227247bf6815",
  userMock: false
}

/**
 * @desc    request配置文件
 * @author  crab.xie
 * @date    2018-04-16
 * @param wechat 微信相册原有接口
 * @param mini 小程序新增接口
 */
const requestConfig = {
  default: "wechat",
  wechat: {
    prefix: "wechat/album/",
    projectUrl: "requestUrl"
  },
  mini: {
    prefix: "mini/app/",
    projectUrl: "requestUrl"
  },
  temp: {
    prefix: "wechat/album/",
    projectUrl: "temporaryUrl"
  }
}
/**
 * @desc    API请求接口库
 * @author  crab.xie
 * @date    2018-04-16
 * 后缀要加 + Model, 如indexModel
 * @param url 请求action
 * @param api 请求location @type 'wechat' ||  'mini'
 * @param unToken 不需要token
 * @param userUid 需要uId
 */

let modelConfig = {
  getModelConfig(modelName) {
    let model = modelConfig[modelName];
    let api = model.api || requestConfig.default;
    let _requestConfig = requestConfig[api];
    let baseUrl = project[_requestConfig.projectUrl];
    let url = _requestConfig.prefix + model.url;
    let fullUrl = baseUrl + url;
    return fullUrl
  },
  getPhotoListByWeChatIdModel: {
    // 获取相册照片列表
    url: 'getPhotoListByWeChatId',
    userUid: true,
    userWechatToken: true
  },
  getAlbumTagModel: {
    // 获取相册tag
    url: 'getAlbumTag',
    userWechatToken: true,
    unToken: true
  },
  getCoverInfoModel: {
    // 获取相册封面title
    url: 'getCoverInfo',
    unToken: true
  },
  getPhotoMetaDetailModel: {
    // 获取照片元信息
    url: 'getPhotoMetaDetail',
    unToken: true
  },
  //获取赞过照片列表
  getUserLikesModel: {
    url: "getUserLikes"
  },
  //获取浏览过的相册列表
  findVisitHistoryModel: {
    url: "findVisitHistoryByPage",
    api: "mini"
  },
  // 新版历史记录
  findVisitHistoryByPageModel: {
    url: "findVisitHistoryByPage",
    api: "mini"
  },
  analyseModel: {
    // 相册浏览量日志收集
    url: 'analyse',
    userUid: true,
    unToken: true
  },
  analysePhotosModel: {
    // 大图浏览量日志收集
    url: 'analysePhotos',
    userUid: true
  },
  likePhotoModel: {
    // 点赞
    url: 'likePhoto',
    userUid: true
  },
  getAllColumnContentsModel: {
    // 精彩图片
    url: 'getAllColumnContents',
    api: "mini",
    unToken: true
  },
  findColumnContentModel: {
    // 精彩图片内容
    url: 'findColumnContent',
    api: "mini",
    unToken: true
  },
  //获取今日直播相册
  findPublicAlbumPageModel: {
    url: "findPublicAlbumPage",
    api: "mini",
    unToken: true
  },
  authByJsCodeModel: {
    // 基础授权
    url: 'authByJsCode',
    api: "mini",
    unToken: true
  },
  authenticationModel: {
    // 用户信息授权
    url: 'authentication',
    api: "mini",
    unToken: true
  },
  getuIdModel: {
    // 获取uid
    url: 'getuId'
  },
  createRequirementModel: {
    // 预约单提交
    url: 'createRequirement',
    api: 'mini'
  },
  getAllCityListModel: {
    // 获取城市列表
    url: 'getAllCityList'
  },
  getPhotoUrlModel: {
    // 获取原图
    url: 'getPhotoUrl',
    userUid: true
  },
  getWeChatInfoModel: {
    // 相册信息
    url: 'getWeChatInfo',
    userWechatToken: true,
    unToken: true
  },
  sendSMSModel: {
    // 验证码
    url: 'sendSMS'
  },
  mergePhotoModel: {
    // 拼图
    url: 'mergePhoto'
  },
  getUserMergePhotosModel: {
    //我的拼图列表
    url: 'getUserMergePhotos'
  },
  healthCheckModel: {
    //token检测
    url: 'healthCheck',
    api: "mini"
  },
  findWeChatIdModel: {
    // 换取wechatId
    url: 'findWeChatId',
    api: "mini",
    userUid: true
  },
  findCoverInfoModel: {
    // 单相册信息
    url: 'findCoverInfo',
    userWechatToken: true,
    unToken: true
  },
  getMultiAlbumStyleHomePageModel: {
    // 多相册信息
    url: 'getMultiAlbumStyleHomePage'
  },
  findMultiAlbumCodeModel: {
    // 换取集合页code
    url: 'findMultiAlbumCode',
    api: "mini",
    userUid: true
  },
  findSubColumnListModel: {
    // 获取栏目，热门大片
    url: 'findSubColumnList',
    api: "mini",
    unToken: true
  },
  logoutModel: {
    // 退出登录-token过期
    url: 'logout'
  },
  mergeMultiPhotoModel: {
    //相框文字拼图
    url: "mergeMultiPhoto"
  },
  findFaceInAlbumModel: {
    // 人脸识别
    url: 'findFaceInAlbum',
    userUid: true
  },
  findFaceHistoryModel: {
    // 人脸识别历史
    url: 'findFaceHistory',
    userUid: true
  },
  logErrorModel: {
    // 接口错误提交信息
    url: 'logError',
  },
  framedPhotoModel: {
    // 添加照片到相框
    url: 'framedPhoto',
  },
  findPhotoFrameListModel: {
    // 返回所有相框列表
    url: 'findPhotoFrameList',
  },
  getActivityListModel: {
    // 单相册活动详情
    url: "getActivityList"
  },
  findQuotationModel: {
    // 换一句
    url: "findQuotation"
  },
  findChoiceLabelAndPhotosModel: {
    // 活动精选
    url: "findChoiceLabelAndPhotos",
    userWechatToken: true
  },
  findChoicePhotosInBannerModel: {
    // 精选banner
    url: "findChoicePhotosInBanner",
    userWechatToken: true
  },
  unlockWechatModel: {
    // 密码相册
    url: "unlockWechat",
    userUid: true
  },
  getSimplePhotoListByWeChatIdModel: {
    //最近视频或照片
    url: "getSimplePhotoListByWeChatId"
  },
  getUserInfoModel: {
    // 密码相册
    url: "getUserInfo",
    userUid: true
  },
  getPhotoRankModel: {
    //top10
    url: "getPhotoRank",
    userUid: true
  }
}

module.exports = {
  modelConfig
}