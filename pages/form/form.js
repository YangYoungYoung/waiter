// pages/form/form.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isAllPrint: true,
    totalPrice: 0,
    show: false, //action是否显示
    actions: [{
        id: 1,
        name: '上菜',
        disabled: false
      },
      // {
      //   id: 2,
      //   name: '起菜',
      //   disabled: false
      // },
      {
        id: 2,
        name: '退菜',
        disabled: false
      }
    ],
    dishIndex: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow: function() {
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
          // for(var i = 0; i < orderList.length; i++) {
          //   if(!orderList[i].isPrint){
          //     that.setData({
          //       isAllPrint:false
          //     })
          //   }
          // }
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
  toTable: function() {
    //清除订单ID
    wx.removeStorageSync('orderId');
    wx.redirectTo({
      url: '../table/table',
    })
  },
  //弹出action
  onShowAciton(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    console.log('当前的index:', index);
    that.setData({
      show: true,
      dishIndex: index
    })
  },
  //关闭actionSheet
  onClose() {
    this.setData({
      show: false
    });
  },
  //选择actionSheet
  onSelect(event) {
    console.log(event.detail.id);
    let id = event.detail.id;
    let that = this;
    switch (id) {

      case 1:
        //当前为划菜
        console.log("当前为划菜");
        that.serving();
        that.onClose();
        break;
        // case 2:
        //   //当前为起菜
        //   console.log("当前为起菜");
        //   that.onClose();
        //   break;
      case 2:
        //当前为退菜
        console.log("当前为退菜");
        that.returnDish();
        that.onClose();
        break;
      default:
        break;
    }
  },
  //起菜
  serving: function() {
    let that = this;
    let dishIndex = that.data.dishIndex;
    let orderList = that.data.orderList;
    let shopId = wx.getStorageSync('shopId');
    let orderId = wx.getStorageSync('orderId');
    let dishId = orderList[dishIndex].dishId;
    let url = 'order/changeStatusByOrderIdAndDishId';
    let params = {
      shopId: 1,
      orderId: orderId,
      dishId: dishId,
      status: 2 //上菜的状态
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          common.showTip('成功', 'success');
          console.log('res.data.data :', res.data.data);
          that.getOrderList();
        }
      });
  },
  //退菜
  returnDish: function() {
    let that = this;
    let orderId = wx.getStorageSync("orderId");
    let dishIndex = that.data.dishIndex;
    let orderList = that.data.orderList;
    let dishId = orderList[dishIndex].dishId;
    

    let url = 'order/changeStatusByOrderIdAndDishId';
    let params = {
      shopId: 1,
      orderId: orderId,
      dishId: dishId,
      status: 3 //退菜的状态
    }
    let method = "GET"
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip('成功', 'success');
          // loi[index].returnReason = returnReason;
          // console.log("loi[index].returnReason :", loi[index].returnReason);
          // that.setData({
          //   loi: loi
          // })
          that.onShow();
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  //全部打印
  printAll: function() {
    let that = this;
    let orderId = wx.getStorageSync("orderId");
    let url = 'print/sendMsgAll';
    let params = {
      shopId: 1,
      orderId: orderId,

    }
    let method = "GET"
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip('成功', 'success');

        }
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  //打印部分菜品
  printDishs: function() {
    let url = 'print/sendMsg';
    let params = {
      shopId: 1,
      orderId: orderId,

    }
    let method = "GET"
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip('成功', 'success');

        }
      }).catch((errMsg) => {
        wx.hideLoading();
        console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },

})