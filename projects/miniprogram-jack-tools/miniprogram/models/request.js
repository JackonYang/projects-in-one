/**
 * @desc    API请求接口类封装
 * @author  crab.xie
 * @date    2018-04-13
 */

import getModel from 'api.js';
import utils from '../utils/util.js';

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
  requestGetApi
}
