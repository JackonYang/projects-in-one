/**
 * @param requestUrl 正式环境
 * @param testRuquestUrl 测试环境
 */
const projectConfig = {
  domainMode: 'devRuquestUrl',
  userMock: false,
  requestUrl: "https://writer.jackon.me",
  devRuquestUrl: "http://localhost:18000",
}

let urlConfig = {
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
  let domain = projectConfig[projectConfig.domainMode];
  let url = format(urlConfig[key], params);
  let fullUrl = domain + url;
  return fullUrl;
}

module.exports = {
  getFullUrl: getFullUrl,
}