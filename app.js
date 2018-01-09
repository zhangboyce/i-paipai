//app.js
var util = require('./utils/util.js');
App({
  onLaunch: function () {
    var that = this;
    wx.checkSession({
      success: function () {
        wx.getStorage({
          key: 'sessionId',
          success: function (res) {
            that.globalData.sessionId = res.data;
          },
          fail: function () {
            that.login();
          }
        });
        wx.getStorage({
          key: 'userInfo',
          success: function (res) {
            that.globalData.userInfo = res.data;
          },
          fail: function () {
            that.login();
          }
        });
      },
      fail: function () {
        that.login();
      }
    })

  },
  onShow: function () {

  },
  onUnload: function () {
  },
  login: function () {
    var that = this;
    wx.login({
      success: res => {
      
        wx.getUserInfo({
          withCredentials: true,
          success: function (data) {
            util.http('api/user/login/' + res.code, 'GET', {}, function (data) {
              that.setSession(data.sessionId);
            })
            that.setUserInfo(data.userInfo);
          },
          fail: function (res) {
            that.authorizeLoginFail();
          }
        })
      }
    })
  },

  authorizeLoginFail: function () {
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
        } else {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用小程序，请点击授权按钮，勾选用户信息。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    that.login();
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  setUserInfo: function (data) {
    this.globalData.userInfo = data;
    wx.setStorage({
      key: "userInfo",
      data: data
    })
  },
  setSession: function (data) {
    this.globalData.sessionId = data;
    wx.setStorage({
      key: "sessionId",
      data: data
    })
  },
  globalData: {
    userInfo: null,
    sessionId: null
  }
})