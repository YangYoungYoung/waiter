// pages/statement/statement.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeId:0,
    time:'',
    pickerIndex:0,
    times:[
      {
        id:0,
        time:'本日'
      },
      {
        id: 1,
        time: '本周'
      },
      {
        id: 2,
        time: '本月'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var date = util.formatDate(new Date());
    this.setData({
      date: date,
    });
    this.getInfo();
  },
  //获取本日信息
  getInfo: function() {
    let that = this;
    let id = that.data.timeId;
    console.log('timeId is:', id);
    if(id==2){
      var url = 'boss/income/month'
    }else if(id==1){
      var url = 'boss/income/week'
    }else{
      var url = 'boss/income/today'
    }
    
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
          let today = res.data.data.today;
          let totalTurnover = res.data.data.totalTurnover;
          that.setData({
            dishList: hotList,
            today: today,
            totalTurnover: totalTurnover

          })
        }
      });
  },
  //选择日期
  bindPickerChange: function (e) {
    let that = this;
    let times = that.data.times;
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    var id = times[e.detail.value].id;
    let time = times[e.detail.value].time;
    console.log('picker发送选择改变，id携带值为', id);
    that.setData({
      pickerIndex: e.detail.value,
      timeId: id,
      time: time
    })
    that.getInfo();
  },
  //查询本周
  // checkdate:function(){
  //   let that = this;
  //   let url = 'boss/income/week'
  //   var params = {
  //     shopId: 1
  //   }
  //   let method = "GET";
  //   wx.showLoading({
  //     title: '加载中...',
  //   }),
  //     network.POST(url, params, method).then((res) => {
  //       wx.hideLoading();
  //       console.log("返回值是：" + res.data);
  //       if (res.data.code == 200) {
  //         let hotList = res.data.data.hotList;
  //         that.setData({
  //           dishList: hotList
  //         })
  //       }
  //     });
  // }
})