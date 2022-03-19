/**
 * @desc    API请求接口类封装
 * @author  crab.xie
 * @date    2018-04-13
 */

import getModel from 'api.js';
import utils from '../utils/util.js';

/**
 * Restful POST 请求 API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {String}   sourceStr   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestRestPostApi(url, params, sourceStr, successFun, failFun, completeFun) {
  requestRestApi(url, params, 'POST', sourceStr, successFun, failFun, completeFun)
}

function requestRestGetApi(url, params, sourceStr, successFun, failFun, completeFun) {
  requestRestApi(url, params, 'GET', sourceStr, successFun, failFun, completeFun)
}

/**
 * @param requestUrl 正式环境
 * @param testRuquestUrl 测试环境
 */
const project_config = {
  domainMode: 'devRuquestUrl',
  userMock: false,
  requestUrl: "https://writer.jackon.me",
  devRuquestUrl: "http://192.168.2.4:18000",
}

let url_config = {
  'submit_image_download': '/downloader/submit-task',
  'getPhotoList': '/downloader/get-result/{task_id}',
}

function format(s, params) {
  let formatted = s;
  for( let arg in params ) {
      formatted = formatted.replace("{" + arg + "}", params[arg]);
  }
  return formatted;
}

function getFullUrl(key, params) {
  let domain = project_config[project_config.domainMode];
  let url = format(url_config[key], params);
  let fullUrl = domain + url;
  return fullUrl;
}
/**
 * Restful 请求 API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {String}   method      请求类型
 * @param  {String}   sourceStr   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestRestApi(urlName, params, method, sourceStr, successFun, failFun, completeFun) {
  let contentType = 'application/json'

  // joint url
  let fullUrl = getFullUrl(urlName, params);
  // console.log(fullUrl);

  wx.request({
    url: fullUrl,
    method: method,
    data: params,
    header: { 'Content-Type': contentType },
    success: function (res) {
      let info = res.data || res;
      if (info.code == 1001) {
      } else {
        typeof successFun == 'function' && successFun(info, sourceStr);
        // let messages = info.code + ": " + info.message;
        // utils.toast(messages);
        // console.log(info.code, info.message);
      }
    },
    fail: function (res) {
      let info = res.data || res;
      // typeof failFun == 'function' && failFun(info, sourceStr);
      utils.toast('网络繁忙，请稍后再试！');
      console.log(sourceStr, "接口调用失败！", info);
    },
    complete: function (res) {
      let info = res.data || res;
      typeof completeFun == 'function' && completeFun(info, sourceStr)
    }
  })
}

/**
 * POST请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {String}   sourceStr   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestPostApi(url, params, sourceStr, successFun, failFun, completeFun) {
  requestApi(url, params, 'POST', sourceStr, successFun, failFun, completeFun)
}

/**
 * GET请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {String}   sourceStr   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestGetApi(url, params, sourceStr, successFun, failFun, completeFun) {
  requestApi(url, params, 'GET', sourceStr, successFun, failFun, completeFun)
}

/**
 * 请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {String}   method      请求类型
 * @param  {String}   sourceStr   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestApi(url, params, method, sourceStr, successFun, failFun, completeFun) {
  if (method == 'POST') {
    var contentType = 'application/x-www-form-urlencoded'
  } else {
    var contentType = 'application/json'
  }

  // is need token
  let token = wx.getStorageSync('token');
  if (!getModel.modelConfig[url].unToken && !!token){
    params.token = token;
  }

  // is need wechatToken
  let wechatToken = wx.getStorageSync('wechatToken');
  if (getModel.modelConfig[url].userWechatToken && !!wechatToken) {
    params.wechatToken = wechatToken;
  }
  
  // is need uId
  let uIdNum = wx.getStorageSync('uid');
  if (getModel.modelConfig[url].userUid && !!uIdNum) {
    params.uId = uIdNum;
  }  

  // joint url
  let fullUrl = getModel.modelConfig.getModelConfig(url);
  // console.log(fullUrl);
  
  wx.request({
    url: fullUrl,
    method: method,
    data: params,
    header: { 'Content-Type': contentType },
    success: function (res) {
      let info = res.data || res;
      if (info.code == 1001) {
        wx.removeStorageSync("userInfo");
        wx.removeStorageSync("token");
        wx.removeStorageSync("uid");
        utils.goTab("pages/me/me");
        utils.toast('登录已过期，请重新登录！');
        console.log(sourceStr, "登录已过期，请重新登录！");
      }else{
        typeof successFun == 'function' && successFun(info, sourceStr);
        // let messages = info.code + ": " + info.message;
        // utils.toast(messages);
        // console.log(info.code, info.message);
      }
    },
    fail: function (res) {
      let info = res.data || res;
      // typeof failFun == 'function' && failFun(info, sourceStr);
      if (url == "findFaceInAlbumModel") {
          utils.showModal();
        } else {
          utils.toast('网络繁忙，请稍后再试！');
        };
      console.log(sourceStr, "接口调用失败！");
    },
    complete: function (res) {
      let info = res.data || res;
      typeof completeFun == 'function' && completeFun(info, sourceStr)
    }
  })
}

module.exports = {
  requestPostApi,
  requestGetApi,
  requestRestPostApi,
  requestRestGetApi,
}
