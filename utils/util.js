var appConfig = require('../config.js');
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function groupBy(arr, key) {
  let result = arr.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

<<<<<<< HEAD
  let results = [];
  for (let k in result) {
    results.push({
      [key]: k,
      data: result[k]
    })
  }
  return results;
=======
function http(url, method, data, callBack) {
  var header = 
    { 'Content-Type': 'application/x-www-form-urlencoded' }
  
  wx.request({
    url: appConfig.server + url,
    data: data,
    method: method,
   // header:header,
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
    }
  })
>>>>>>> c388b38ab7f254ba436d3eb2319aa9cc4e20b90e
}

// 去前后空格  
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息  
function isError(msg, that) {
  that.setData({
    showTopTips: true,
    errorMsg: msg
  })
}

// 清空错误信息  
function clearError(that) {
  that.setData({
    showTopTips: false,
    errorMsg: ""
  })
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  trim: trim,
  isError: isError,
  groupBy: groupBy,
  clearError: clearError
}  