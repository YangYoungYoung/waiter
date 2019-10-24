// pages/login/login.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    pwd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  //获取工号
  getName: function(e) {
    let name = e.detail.value;
    this.setData({
      name: name
    })
  },
  //获取密码
  getPwd: function(e) {
    let pwd = e.detail.value;
    this.setData({
      pwd: pwd
    })
  },
  //提交
  submit: function() {
    let that = this;
    let name = that.data.name;
    let pwd = that.data.pwd;
    if (name == '' || name == undefined) {
      common.showTip('请输入工号', 'loading');
      return
    }
    if (pwd == '' || pwd == undefined) {
      common.showTip('请输入密码', 'loading');
      return
    }
    
    // let shopId = wx.getStorageSync('shopId');
    // if (userId == '' || userId == undefined) {
    //   common.showTip("请先登录", "loading");
    //   return;
    // }
    // let url = "address/list?userId=" + userId;
    let url = 'menu/selectAll'
    var params = {
      shopId: 1
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
       
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  }
})