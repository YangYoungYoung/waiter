// pages/menu/menu.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
var tableId = wx.getStorageSync('tableId');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    totalCount: 0,
    totalPrice: 0,
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.orderId!=undefined||options.orderId!=''){
      let orderId = options.orderId;
      wx.setStorageSync('orderId', orderId);
    }
    var shopId = wx.getStorageSync('shopId');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getOrderList();
  },
  //获取订单列表
  getOrderList: function() {
    let that = this;
    let shopId = wx.getStorageSync('shopId');
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
        let goods = res.data.data;
        console.log("返回值是：" + goods);
        that.setData({
          goods: goods
        })

      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  selectMenu: function(e) {
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString()
    })
    // console.log(this.data.toView);
  },
  //添加到购物车
  addCart(e) {
    let that = this;
    let totalCount = that.data.totalCount;
    var goods = that.data.goods;
    var index = e.currentTarget.dataset.itemIndex;
    console.log('index is:', index);
    var parentIndex = e.currentTarget.dataset.parentindex;
    goods[parentIndex].dish[index].number++;
    totalCount++;
    console.log('totalCount is:', totalCount);
    var mark = 'a' + index + 'b' + parentIndex;
    var number = goods[parentIndex].dish[index].number;
    var dishName = goods[parentIndex].dish[index].dishName;
    var dishId = goods[parentIndex].dish[index].id;
    console.log('dishId is:', dishId);
    var dishImage = goods[parentIndex].dish[index].dishImage;
    var dishPrice = goods[parentIndex].dish[index].dishPrice;
    // let tableId = wx.getStorageSync('tableId');
    let url = 'cart/add'

    var params = {
      shopId: 1,
      dishId: dishId,
      dishImage: dishImage,
      dishName: dishName,
      number: number,
      dishPrice: dishPrice,
      tableId: tableId
    }
    let method = "POST";
    // wx.showLoading({
    //     title: '加载中...',
    //   }),
    network.POST(url, params, method).then((res) => {
      // wx.hideLoading();
      if (res.data.code == 200) {
        console.log('增加成功');
        let totalPrice = res.data.data.totalPrice;
        // var carArray1 = that.data.carArray.filter(item => item.mark != mark)
        // carArray1.push(detailArray)
        // console.log(carArray1);
        that.setData({
          totalCount: totalCount,
          totalPrice: totalPrice,
          goods: goods
        })
      }
    });
  },
  //数量减
  decreaseCart: function(e) {
    let that = this;
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    let totalCount = that.data.totalCount;
    var goods = that.data.goods;
    goods[parentIndex].dish[index].number--;
    totalCount--;
    // var number = goods[parentIndex].productList[index].number;
    var mark = 'a' + index + 'b' + parentIndex;
    var dishId = goods[parentIndex].dish[index].id;
    
    console.log('dishId is:', dishId);
    let url = 'cart/reduceNumber'
    var params = {
      shopId: 1,
      dishId: dishId,
      tableId: tableId
    }
    let method = "GET";
    // wx.showLoading({
    //     title: '加载中...',
    //   }),
    network.POST(url, params, method).then((res) => {
      // wx.hideLoading();
      if (res.data.code == 200) {
        console.log('减少成功');
        let totalPrice = res.data.data.totalPrice;
        // var carArray1 = that.data.carArray.filter(item => item.mark != mark)
        // carArray1.push(detailArray)
        // console.log(carArray1);
        that.setData({
          totalCount: totalCount,
          totalPrice: totalPrice,
          goods: goods
        })
        // that.calTotalPrice();
      }
    });
  },
  //跳转到购物车
  toCart: function() {
    wx.navigateTo({
      url: '../cart/cart',
    })
  }
})