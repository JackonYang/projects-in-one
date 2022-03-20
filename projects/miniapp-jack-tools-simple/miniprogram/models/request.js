/**
 * @desc    API请求接口类封装
 */

import utils from '../utils/util.js';
import { getFullUrl } from './api_config.js';

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

module.exports = {
  requestRestPostApi,
  requestRestGetApi,
}
