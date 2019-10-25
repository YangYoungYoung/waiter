// pages/table/table.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    peopleNumber: '', //就餐人数
    tableId:'',
    showAction: false,
    floorId: '',
    tableSizeId: '',
    statusId: '',
    areaId: '',
    // select: true,
    tableList: [],
    statusArray: [{
        id: -1,
        name: '全部',
        checked: 'true'
      },
      {
        id: 0,
        name: '空闲',
        // checked: 'true'
      },
      {
        id: 1,
        name: '未点单',
        // checked: 'true'
      },
      {
        id: 2,
        name: '用餐中',
        // checked: 'true'
      },
      {
        id: 3,
        name: '待清台',
        // checked: 'true'
      },
    ],
    actions: [{
        id: 1,
        name: '开台',
        disabled: false
      },
      {
        id: 2,
        name: '点餐',
        disabled: false
      },
      {
        id: 3,
        name: '加餐',
        disabled: false
      },
      {
        id: 4,
        name: '订单详情',
        disabled: false
      },
      {
        id: 5,
        name: '清台',
        disabled: false
      },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var shopId = wx.getStorageSync('shopId');
    this.getFloor();
    this.getArea();
    this.getTableSize();
  },
  onShow: function() {
    this.getTableList();
  },

  //选择不同的区域来查询桌位
  bindPickerChange: function(e) {
    let that = this;
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    var id = that.data.floor[e.detail.value].id;
    console.log('picker发送选择改变，id携带值为', id);
    that.setData({
      pickerIndex: e.detail.value,
      floorId: id
    })
    that.onShow();
  },

  //点击radio-group中的列表项事件
  updataRadio: function(res) {
    console.log("选中的标签：" + res.detail.value);
    var arrs = this.data.statusArray;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].id == res.detail.value) {
        arrs[x].checked = true;
      } else {
        arrs[x].checked = false;
      }
    }
    let statusId = res.detail.value;
    if (statusId == -1) {
      statusId = "";
    }
    that.setData({
      statusArray: arrs,
      statusId: statusId
    })
    that.onShow();

  },
  //查询桌位
  getTableList: function() {
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let floorId = that.data.floorId;
    let tableSizeId = that.data.tableSizeId;
    let statusId = that.data.statusId;
    let areaId = that.data.areaId;
    let url = 'table/index/tableList'
    var params = {
      shopId: 1,
      floorId: floorId,
      speId: tableSizeId,
      status: statusId,
      area: areaId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          let tableList = res.data.data.tableList;
          let tableSize = res.data.data.specification;
          let floor = res.data.data.floor;
          let area = res.data.data.area;
          that.setData({
            tableList: tableList,
            // tableSize: tableSize,
            // floor: floor,
            // area: area
          })
        }
      });
  },
  //选择桌位类型
  selectSize: function(e) {
    let that = this;
    var index = e.currentTarget.dataset.index;
    let tableSize = that.data.tableSize;
    let tableSizeId = tableSize[index].id;
    console.log('tableSizeId is', tableSizeId);
    console.log('inex is', index);
    for (var i = 0; i < tableSize.length; i++) {
      if (i == index) {
        tableSize[i].select = true;
      } else {
        tableSize[i].select = false;
      }
    }
    if (tableSizeId == 0) {
      tableSizeId = ''
    }
    that.setData({
      tableSizeId: tableSizeId,
      tableSize: tableSize
    })
    that.onShow();
  },
  //选择区域
  chooseArea: function(e) {
    let that = this;
    let areaId = e.currentTarget.dataset.id;

    let area = that.data.area;
    for (var i = 0; i < area.length; i++) {
      if (area[i].id == areaId) {
        area[i].select = true
      } else {
        area[i].select = false
      }
    }
    if (areaId == 0) {
      areaId = ''
    }
    console.log('areaId is:', areaId);
    that.setData({
      area: area,
      areaId: areaId
    })
    that.onShow();
  },
  //获取楼层
  getFloor: function(e) {
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let url = 'table/index/floor'
    var params = {
      shopId: 1,
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          let floor = res.data.data.floor;
          //楼层
          if (floor.length > 0) {
            that.setData({
              floorSelect: true
            })
          }
          that.setData({
            floor: floor
          })
        }
      });
  },
  //获取桌位类型
  getTableSize: function() {
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let url = 'table/index/specification'
    var params = {
      shopId: 1,
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          let tableSize = res.data.data.specification;
          if (tableSize.length > 0) {
            for (var i = 0; i < tableSize.lenghth; i++) {
              tableSize[i].select = false;
            }
            let table = {
              id: 0,
              specification: '全部',
              select: true
            }
            tableSize.unshift(table);
            console.log('tableSize is:', tableSize);
          }
          that.setData({
            tableSize: tableSize
          })
        }
      });
  },
  //获取区域列表
  getArea: function() {
    let that = this;
    let shopId = wx.getStorageSync('shopId');
    let url = 'table/index/area';
    let floorId = that.data.floorId;

    var params = {
      shopId: 1,
      floorId: floorId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          let area = res.data.data.area;
          //区域
          if (area.length > 0) {
            for (var i = 0; i < area.lenghth; i++) {
              area[i].select = false;
            }
            let obj = {
              area: '全部',
              id: 0,
              select: true
            }
            area.unshift(obj);
            console.log('area is:', area);
          }
          that.setData({
            area: area
          })
        }
      });
  },
  //弹出action
  showAction(e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    //点击桌位的Id
    var tableId = e.currentTarget.dataset.id;
    // that.setData({
    //   index: index
    // })
    that.setData({
      tableId: tableId
    })
    console.log("status is:", status);
    // console.log("index is:", index);
    var actions = that.data.actions;
    //根据桌位状态展示不同的菜单可选项
    if (status == 0) {
      //空闲状态，只可以开桌
      for (var i = 0; i < actions.length; i++) {
        if (i != 0) {
          actions[i].disabled = true;
        } else {
          actions[i].disabled = false;
        }
      }
      that.setData({
        actions: actions
      })
    } else if (status == 1) {
      //当前为未点餐状态，可以点餐和清台
      for (var i = 0; i < actions.length; i++) {

        if (i == 1 || i == 4) {
          // console.log("dangqina ");
          actions[i].disabled = false;
        } else {
          actions[i].disabled = true;
        }
      }
      that.setData({
        actions: actions
      })
    } else if (status == 2) {
      //当前为进行中状态,可以加餐，清台，查看订单状态
      for (var i = 0; i < actions.length; i++) {

        if (i == 2 || i == 3 || i == 4) {
          actions[i].disabled = false;
        } else {
          actions[i].disabled = true;
        }
      }
      that.setData({
        actions: actions
      })
    } else {
      //当前为待清台状态，只可以清台
      for (var i = 0; i < actions.length; i++) {

        if (i != 4) {
          actions[i].disabled = false;
        } else {
          actions[i].disabled = true;
        }
      }
      that.setData({
        actions: actions
      })
    }
    this.setData({
      showAction: true
    });
  },
  //关闭action
  onActionClose: function() {
    this.setData({
      showAction: false
    })
  },
  //选择actionSheet
  onActionSelect: function(event) {
    console.log('菜单action：', event.detail.id);
    var id = event.detail.id;
    var that = this;
    switch (id) {
      case 1:
        //当前为开台的时候,弹出就餐人数的弹窗
        that.showDialogBtn();
        break;
      case 2:
        //当前为点餐，跳转到点餐的页面
        console.log("当前为点餐，跳转到点餐的页面");
        wx.navigateTo({
          url: '../menu/menu',
        })
        break;
      case 3:
        //当前为加餐
        console.log("当前为加餐");
        wx.navigateTo({
          url: '../menu/menu',
        })
        break;
        // case 4:
        //   //当前为划菜
        //   console.log("当前为划菜");
        //   wx.navigateTo({
        //     url: '../order/order',
        //   })
        //   break;
        // case 5:
        //   //当前为起菜
        //   console.log("当前为起菜");
        //   that.qiCai();
        //   break;
        // case 6:
        //   //当前为顾客转台
        //   console.log("当前为顾客转台");
        //   that.showChangeModalFunction();
        //   let index = that.data.index;
        //   let diningTableList = that.data.diningTableList;
        //   let fromDiningTableId = diningTableList[index].id;
        //   //查询当前可用的桌位
        //   let changeSeatNumber = that.data.changeSeatNumber;
        //   let changeRegion = that.data.changeRegion;
        //   that.changeQueryTable(0, 0);

        //   that.setData({
        //     fromDiningTableId: fromDiningTableId
        //   })

        //   break;
      case 4:
        //当前为订单详情
        console.log("当前为订单详情");
        wx.navigateTo({
          url: '../order/order',
        })
        break;
      case 5:
        //当前为清台
        console.log("当前为清台");
        that.clearDiningTable();
        break;
      default:
        break;
    }
    that.onActionClose();
  },



  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
    this.openTable();
  },
  /**
   * 实际就餐人数对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.openTable();
    this.hideModal();
  },
  //开台的接口
  openTable: function() {
    let that = this;

    let url = "table/updateTableStatus"
    let method = "GET"
    // let index = that.data.index;
    // let diningTableList = that.data.diningTableList;
    let peopleNumber = that.data.peopleNumber; //实际就餐人数
    let tableId = that.data.tableId;
    console.log('tableId is:', tableId);
    var params = {
      shopId: 1,
      population: peopleNumber,
      status:1,
      tableId: tableId                                
    }
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        //后台交互
        if (res.data.code == 200) {
          common.showTip("开台成功", "success");
          that.onShow();
          that.onActionClose();
        } else {
          var message = res.data.message
          common.showTip(message, "loading");
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
  //获取输入框里面的值
  inputChange: function(e) {
    this.setData({
      peopleNumber: e.detail.value
    })
  },
})