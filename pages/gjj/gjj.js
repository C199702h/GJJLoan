// pages/auth/auth.js
const commonData = require('../../utils/data.js')
const commonUtil = require('../../utils/util.js')

Page({
    data: {
        GjjUrl: ''
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var gjjUrl = this.getGjjUrl(options);
        console.log('gjjUrl:' + gjjUrl);
        this.setData({'GjjUrl': gjjUrl});
    },
    onReady: function () {
        // 页面渲染完成
        //this.refreshImgToken();
        //this.setData({'GjjSrc':'http://www.baidu.com'})
    },
    onShow: function () {
        // 页面显示
        if (!!wx.getStorageSync('HideTime') && (new Date().getTime() - wx.getStorageSync('HideTime') > 1 * 60 * 1000)) {
            wx.setStorageSync('HideTime', 0);
            wx.redirectTo({
                url: '../auth/auth',
            });

        }
    },
    onHide: function () {
        // 页面隐藏
        wx.setStorageSync('HideTime', new Date().getTime());
    },
    onUnload: function () {
        // 页面关闭
    },

    getGjjUrl: function (res) {
        if (!res) {
            return;
        }
        var url = res.gjjUrl + '?sign=' + res.sign + '&orderSn=' + res.orderSn + '&appKey=' + res.appKey + '&token=' + res.token + '&timestamp=' + res.timestamp + '&redirectUrl=' + res.redirectUrl + '&cid=30';
        return url;

    }

})