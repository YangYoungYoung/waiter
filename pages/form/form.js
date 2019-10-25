// pages/form/form.js
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
    
    this.getOrderList();
  },


  //查看订单列表
  getOrderList: function() {
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let orderId = wx.getStorageSync('orderId');
    if (orderId == '' || orderId == undefined) {
      common.showTip('当前没有订单', 'loading');
      return
    }

    let url = "order/select";
    var params = {
      shopId: 1,
      orderId: orderId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          console.log('res.data.data :', res.data.data);
          let orderList = res.data.data.jsonArray;
          let totalPrice = res.data.data.totalPrice;
          that.setData({
            orderList: orderList,
            totalPrice: totalPrice
          })
        }
      });
  },
  //加菜,跳转到菜单页面
  toAddOrder: function() {
    let orderId = wx.getStorageSync('orderId');
    wx.redirectTo({
      url: '../menu/menu?orderId=' + orderId,
    })
  },
  //跳转到桌位列表
  toTable:function(){
    //清除订单ID
    wx.removeStorageSync('orderId');
    wx.redirectTo({
      url: '../table/table',
    })
  }
})