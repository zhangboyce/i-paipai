var appConfig = require('../config.js');

let __formatDateToArray__ = date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day, hour, minute, second];
};

let __formatNumber__ = n => n.toString()[1] ? n : '0' + n

function formatTime(date) {
  let array = __formatDateToArray__(date);
  return array.slice(0, 3).map(__formatNumber__).join('-') + ' ' + array.slice(3, 6).map(__formatNumber__).join(':')
}

function formatDate(date) {
  let array = __formatDateToArray__(date);
  return array.slice(0, 3).map(__formatNumber__).join('-')
}

function formatText(date) {
  let array = __formatDateToArray__(date).slice(0, 3);
  let days = parseInt((new Date().getTime() - date.getTime()) / 86400000);

  return days == 0 ? '今天' : days == 1 ? '昨天' : days == 2 ? '前天' : array.map(__formatNumber__).join('-');
}

function groupBy(arr, key) {
  let result = arr.reduce((rv, x) => { (rv[x[key]] = rv[x[key]] || []).push(x); return rv; }, {});
  let results = [];
  for (let k in result) {
    results.push({
      [key]: formatText(new Date(k)),
      data: result[k]
    })
  }
  return results;
}

// 去前后空格  
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports = { formatTime, formatDate, trim, groupBy };