<template>
  <div id="friendPayment" style="height: 100%" v-show="openId">
    <div class="eu-friendPaymentPage" v-if="!isPaySuccess">
      <div class="eu-frendPaymentBox">
        <div class="eu-frendPaymentHead">
          <p>{{userInfo.userName}}</p>
          <span>要查品牌目录，快帮他付款吧</span>
        </div>
        <div class="eu-frendPaymentMain">
          <dl>
            <dt>
              <p v-show="!shixiao">￥<b>{{userInfo.price}}</b></p>
              <span v-show="!shixiao">智配VIP {{userInfo.title}}</span>
            </dt>
            <dd>
              <!--可操作-->
              <a @click="pamentinfo" v-show="!shixiao">支付￥{{userInfo.price}}</a>
              <!--不可操作-->
              <a class="eu-prohibit" v-show="shixiao">已失效</a>
            </dd>
          </dl>
        </div>
      </div>

    </div>
    <div class="eu-paymentSuccessPage" v-else>
      <div class="eu-paymentSuccessBox">
        <p>支付成功</p>
        <span>智配VIP {{userInfo.title}}：<b>￥{{userInfo.price}}</b></span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Toast
  } from 'mint-ui';
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';

  var resourceUrl = process.env.apiDomain;
  // var resourceUrl="http://app.cjmltest.cn/api";
  export default {
    name: "friendpay",
    mixins: [commonMixin],
    components: {},
    data() {
      return {
        openId: this.getQueryString("openid"),
        isPaySuccess:false,
        key:this.getQueryString('cachekey'),
        userInfo:{},
        shixiao:false
      }
    },
    created() {
      this.init();
    },
    mounted() {


    },
    methods: {
      GetCjmlReplacePay(){

        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Auto/GetCjmlReplacePay',
          dataType: "JSON",
          data:{
            key: _this.key,
          },
          success:function(str){
            if(str.Header.ErrorCode ==0){
              //-1表示用户订单已失效；0代表未支付；1代表已支付
              if(str.Body.state== -1){
                Toast('链接已失效，请重新分享')
                _this.shixiao= true;

              }else {
                if(str.Body.state==1){
                  _this.shixiao= true;
                  Toast('朋友已支付')
                }else {
                  _this.shixiao= false;
                }

              }
              //如果没有完善信息就展示用户的电话号码；
              if(!str.Body.userName){
                str.Body.userName = str.Body.mobile
              }
              _this.userInfo=str.Body;
            }else {
              Toast(data.Header.Message);
            }
          }
        })
      },
      init() {
        var _this = this;
        if (!_this.isWechat()) {
          Toast("请在微信内操作");
          return;
        }
        // debugger;

        if(_this.openId == "" || _this.openId == null){
          var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7b0473fabf5fab02&redirect_uri=https%3A%2F%2Fapp.zhipeicloud.com%2FwechatRedirect.html&response_type=code&scope=snsapi_base&state="+encodeURIComponent(window.location.href)+"#wechat_redirect";
          window.location.href = url;
          return;
        }

        if (_this.openId == "error") {
          Toast("未取得微信授权信息");
          return;
        }
        console.log(_this.openId);
        _this.GetCjmlReplacePay();
        _this.ajax({
          method: "POST",
          url: 'https://app.zhipeicloud.com' + "/wx/WeiXinJsSdk/GetJsApiTicket",
          data: {
            initUrl: window.location.href.split("#")[0], //当前页面URL
            WixinType: 2 //微信号区别 1:cjml 2:zhipei
          },
          dataType: "JSON",
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }
            var data = res.Body;
            //微信实例化
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data.appId, // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.signature, // 必填，签名
              jsApiList: [ // 必填，需要使用的JS接口列表
                'chooseWXPay',
                'onMenuShareAppMessage'
              ]
            });

            wx.ready(function(){
              var shareurl = window.location.href;

              shareurl = _this.updateQueryStringParameter(shareurl,'openid','');
              var myShareContent = {
                title: "帮我付款才是真友谊", // 分享标题
                desc: "你的一小笔开支，是我们关系的一大步，为我付款吧~　", // 分享描述
                link: shareurl, // 分享链接
                imgUrl:"https://c1.51cjml.com/webresources/zhipeihome/pc/images/icon_app.png", // 分享图标
              }

              wx.onMenuShareAppMessage({
                title: myShareContent.title, // 分享标题
                desc: myShareContent.desc, // 分享描述
                link: myShareContent.link, // 分享链接
                imgUrl: myShareContent.imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                  wx.closeWindow();
                  // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                  // 用户取消分享后执行的回调函数
                }

              });
            })
          }
        })



      },

      pamentinfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl +'/auto/SubmitCjmlReplacePay',
          data: {
            openID: _this.openId,
            key: _this.key,
          },
          dataType: "JSON",
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }

            var payConfig= JSON.parse(res.Body);
            wx.chooseWXPay({
              timestamp: payConfig.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: payConfig.nonceStr, // 支付签名随机串，不长于 32 位
              package: payConfig.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: payConfig.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: payConfig.sign, // 支付签名
              success: function (res) {
                // 支付成功后的回调函数
                _this.isPaySuccess = true;
                Toast("支付成功");
              }
            });
          }
        })
      }
    }
  }

</script>

<style scoped>
</style>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/friendpay.css");

</style>
