// pages/table/table.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
        name: '订单详情',
        disabled: false
      },
      {
        id: 4,
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
  }


})