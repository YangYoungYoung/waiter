//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    menuList:[
      {
        icon:'../images/zhuowei_icon.png',
        title:'桌位状态',
        content:'随时随地查看桌位状态',
      },
      {
        icon: '../images/turnover_icon.png',
        title: '营业额记录',
        content: '随时随地查看营业额',
      },
    
    ]
  },
  
  onLoad: function () {
   
  },
  toIndex:function(e){
    let index = e.currentTarget.dataset.index;
    console.log('index is', index);
    if(index==0){
      wx.navigateTo({
        url: '../table/table',
      })
    }
    else{
      wx.navigateTo({
        url: '../statement/statement',
      })
    }
  }
})
