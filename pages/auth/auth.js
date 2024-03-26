// pages/auth/auth.js

const commonData = require('../../utils/data.js')
const commonUtil = require('../../utils/util.js')
Page({
    data: {
        SMSButtonText: '获取验证码',
        ImgSrc: ''
    },
    timerHandle: null,
    maxTime: 90,
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady: function () {
        // 页面渲染完成
        //this.refreshImgToken();
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },

    readyToGjj: function () {
        var that = this;
        commonUtil.wx_request_server({
            url: 'GJJPreQuery.do',
            header: {
                'Accept-Language': 'zh-CN'
            },
            method: 'POST',
            dataType: 'json',
            page: this,
            success: function (res) {
                var gjjUrl = that.getGjjUrl(res);
                if (!gjjUrl) {
                    commonUtil.wx_showModal('返回数据为空:' + res)
                    return;
                }
                console.log(gjjUrl);
                wx.redirectTo({
                    url: '../gjj/gjj?gjjUrl=' + gjjUrl,
                    success: function (res) {
                    },
                    fail: function (res) {
                    },
                    complete: function (res) {
                    },
                });
            },
            fail: function (error) {

            }
        });
    },

    getGjjUrl: function (res) {
        if (!res.data) {
            return;
        }
        var url = res.data.GoToUrl + '&sign=' + res.data.Sign + '&orderSn=' + res.data.OrderSn + '&appKey=' + res.data.AppKey + '&token=' + res.data.Token + '&timestamp=' + res.data.Timestamp + '&redirectUrl=' + res.data.CallBackUrlForMiniProgram;
        return url;

    },

    authClient: function (e) {
        //this.setData({'ShowNext':true});
        if (!this.checkInput1()) {
            return;
        }
        var that = this;

        commonUtil.wx_request_server({
            url: 'SmsPasswordValidate.do',
            data: {
                MobilePhoneNo: this.data.MobilePhoneNo,
                SmsPassword: this.data.SmsPassword,
                OtpUUID: this.data.OtpUUID
            },
            page: this,
            success: function (res) {
                that.stopTimer();
                that.readyToGjj();
            },
            fail: function () {
                that.stopTimer();
                //that.readyToGjj();
            }
        });
    },

    checkInput1: function () {
        if (!this.checkInput()) {
            return false
        }
        if (!this.data.SmsPassword) {
            commonUtil.wx_showModal('请输入短信验证码');
            return false;
        }
        if (!this.data.OtpUUID) {
            commonUtil.wx_showModal('请先获取短信验证码');
            return false;
        }
        if (!commonUtil.validator(this.data.SmsPassword, 'SMS')) {
            commonUtil.wx_showModal('短信验证码格式不正确，请重新输入');
            return false;
        }
        return true;
    },

    checkInput: function () {

        if (!this.data.MobilePhoneNo) {
            commonUtil.wx_showModal('请输入手机号码');
            return false;
        }
        if (!commonUtil.validator(this.data.MobilePhoneNo, 'PhoneNumber')) {
            commonUtil.wx_showModal('手机号码格式不正确，请重新输入');
            return false;
        }

        return true;
    },

    changeTimerText: function () {
        if (this.maxTime > 0) {
            this.maxTime--;
            this.setData({SMSButtonText: '' + this.maxTime + '秒后可重新获取'});
        } else {
            this.stopTimer();
        }

    },

    startTimer: function () {
        this.timerHandle = setInterval(this.changeTimerText, 1000);
    },

    stopTimer: function () {
        this.setData({SMSButtonText: '获取验证码'});
        clearInterval(this.timerHandle);
        this.maxTime = 90;
        this.setData({SmsBtnLoading: false, SmsBtnDisabled: false});
    },

    //获取短信验证码
    getSMS: function () {
        if (!this.checkInput()) {

            return;
        }
        var that = this;
        this.setData({SmsBtnLoading: true, SmsBtnDisabled: true});
        commonUtil.wx_request_server({
            url: 'SmsPasswordApply.do',
            data: 'MobilePhoneNo=' + this.data.MobilePhoneNo,
            page: this,
            success: function (res) {

                that.setData({
                    OtpUUID: res.data.OtpUUID,
                    SMSButtonText: that.maxTime + '秒后可重新获取',
                    SmsBtnLoading: false
                });
                that.startTimer();
                that.setData({});
            },
            fail: function () {
                that.setData({SmsBtnLoading: false, SmsBtnDisabled: false});
            }
        });
    },

    inputMobile: function (e) {
        this.setData({'MobilePhoneNo': e.detail.value});
    },
    inputSMS: function (e) {
        this.setData({'SmsPassword': e.detail.value});
    },
    inputVToken: function (e) {
        this.setData({'_vTokenName': e.detail.value});
    },
    // bindblur_MoiblePhone: function (e) {
    //   if (!commonUtil.validator(this.data.MobilePhoneNo, 'PhoneNumber')) {
    //     commonUtil.wx_showModal('手机号码格式不正确，请重新输入');
    //   }
    // },
    bindblur_VToken: function (e) {
        if (!commonUtil.validator(this.data._vTokenName, 'VToken')) {
            commonUtil.wx_showModal('图形验证码格式不正确，请重新输入');
        }
    }
    // bindblur_SMS: function (e) {
    //   if (!commonUtil.validator(this.data.SmsPassword, 'SMS')) {
    //     commonUtil.wx_showModal('短信验证码格式不正确，请重新输入');
    //   }
    // }
})