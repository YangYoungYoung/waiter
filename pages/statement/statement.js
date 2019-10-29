// pages/statement/statement.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo();
  },
  //获取本日信息
  getInfo: function() {
    let that = this;
    let url = 'boss/selectAll'
    var params = {
      shopId: 1
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          let hotList = res.data.data.hotList;
          that.setData({
            dishList: hotList
          })
        }
      });
  }

})