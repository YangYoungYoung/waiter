//封装的HTTPS的请求类
const app = getApp()

// var API_URL = 'https://api.ugo365.xyz/api/';
var API_URL = 'http://192.168.5.115:8080/';

// var API_URL = 'https://www.congyue88.com/congyue/';
// var API_URL = 'https://shop.congyue88.com/congyue/';
// var API_URL = 'http://62.234.16.210:8080/congyue/';
var defaulContentType = 'application/x-www-form-urlencoded; charset=UTF-8';

function POST(url, params, method, contenTTypeCust) {
  // console.log('dev - url',url) ;
  // console.log('dev - param',params) ; 
  // console.log('dev - method',method) ; 
  // console.log('dev - contenTTypeCust',contenTTypeCust) ;

  var contentType = defaulContentType;
  if (typeof contenTTypeCust != 'undefined') {
    contentType == contenTTypeCust;
  }
  console.log('dev - contenTTypeCust', contentType);
  let promise = new Promise(function(resolve, reject) {

    wx.request({
      url: API_URL + url,
      data: params,
      method: method,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        // console.log('返回结果：' + res)
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject('获取信息错误');
        }
      },
      fail: function(e) {
        reject('网络出错');
      }
    })
  });
  return promise
}
module.exports = {
  POST: POST
}