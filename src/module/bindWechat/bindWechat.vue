<template>
  <div class="cp-bindWechat">
    <!-- 绑定 -->
    <div v-if="mode=='bind'" class="cp-bindingBox">
      <div class="cp-remindTop">绑定即可在微信端处理订单，不错过任何一单生意</div>
      <div class="cp-bindingHead">
        <span class="cp-logoBox"></span>
      </div>
      <div class="cp-bindingFrom">
        <ul>
          <li>
            <p>手机号码：</p>
            <span>
              <input type="text" v-model="mobile">
              <a href="javascript:;" v-show="mobile.length>0" v-on:click="mobile=''">×</a>
            </span>
          </li>
          <li class="cp-verification">
            <p>手机验证码：</p>
            <span>
              <input type="text" v-model="verifyCode">
              <a href="javascript:;" v-show="verifyCode.length>0" v-on:click="verifyCode=''">×</a>
            </span>
            <a href="javascript:;" :class="{ 'cp-disable': isSendingVerifyCode }" v-on:click="sendVerifyCode">{{verifyCode_ButtonText}}</a>
          </li>
          <li class="cp-button">
            <a href="javascript:;" v-on:click="bindWechat">绑定</a>
          </li>
          <li class="cp-payAttention">请使用已在智配Store APP 内登录的账号进行绑定</li>
        </ul>
      </div>
    </div>

    <!-- 解绑 -->
    <div v-if="mode=='unbind'" class="cp-bindingBox">
      <div class="cp-remindTop">当前可在微信端接收订单消息</div>
      <div class="cp-bindingHead">
        <span class="cp-bindingIcon"></span>
      </div>

      <div class="cp-relieveMain">
        <ul>
          <li class="cp-bindingText">当前绑定门店</li>
          <li class="cp-shopName">{{companyName}}</li>
          <li class="cp-button">
            <a href="javascript:;" v-on:click="unbindWechat">解除绑定</a>
          </li>
        </ul>
      </div>
    </div>


    <!-- 绑定成功 -->
    <div v-if="mode=='bindsuccess'" class="cp-bindingBox">
      <div class="cp-bindingHead">
        <span class="cp-bindingIcon"></span>
      </div>

      <div class="cp-relieveMain">
        <ul>
          <li class="cp-bindingText">当前绑定门店</li>
          <li class="cp-shopName">{{companyName}}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import {
    Toast
  } from "mint-ui";
  import {
    MessageBox
  } from 'mint-ui';
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "bindWechat",
    mixins: [commonMixin],
    components: {},
    data() {
      return {
        mode: "", //bind or unbind or bindsuccess
        openId: this.getQueryString("openid"),
        mobile: "",
        verifyCode: "",
        verifyCode_ButtonText: "获取验证码",
        isSendingVerifyCode: false,
        companyName: ""
      }
    },
    created() {},
    mounted() {
      this.init();
    },
    methods: {

      //初始化
      init() {
        var _this = this;

        if (_this.openId == "error") {
          Toast("未取得微信授权信息");
          return;
        }

        //决定模式
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/usercenter/GetUserByOpenId",
          dataType: "JSON",
          data: {
            openId: _this.openId
          },
          success: function (response) {
            if (response.Header.ErrorCode != 0) {
              Toast(response.Header.Message);
              return;
            }
            var result = response.Body;
            if (result == null) {
              _this.mode = "bind";
            } else {
              _this.mode = "unbind";
              _this.companyName = result.companyName.length == 0 ? "未知" : result.companyName;
            }
          }
        });
      },

      //发送验证码
      sendVerifyCode() {
        var _this = this;

        if (_this.isSendingVerifyCode) return;

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/usercenter/SendBindWechatVerifyCode",
          dataType: "JSON",
          data: {
            mobile: _this.mobile
          },
          success: function (response) {
            if (response.Header.ErrorCode != 0) {
              Toast(response.Header.Message);
              return;
            }
            Toast("发送成功");
            _this.isSendingVerifyCode = true;

            var num = 600;
            var myInterval = setInterval(function () {
              if (num == 0) {
                _this.isSendingVerifyCode = false;
                num = 600;
                _this.verifyCode_ButtonText = "获取验证码";
                clearInterval(myInterval);
              } else {
                _this.verifyCode_ButtonText = Math.round(num / 10) + "s后重发";
                num--;
              }
            }, 100);
          }
        });
      },

      //绑定微信
      bindWechat(data) {
        var _this = this;

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/usercenter/BindWechat",
          dataType: "JSON",
          data: {
            mobile: _this.mobile,
            verifyCode: _this.verifyCode,
            openId: _this.openId
          },
          success: function (response) {
            if (response.Header.ErrorCode != 0) {
              Toast(response.Header.Message);
              return;
            }
            var result = response.Body;
            _this.companyName = result.companyName.length == 0 ? "未知" : result.companyName;

            Toast("绑定成功");

            //2秒后展示成功界面
            setTimeout(() => {
              _this.mode = "bindsuccess";
            }, 2000);
          }
        });
      },

      //解绑微信
      unbindWechat(data) {
        var _this = this;

        MessageBox.confirm('', {
          title: '确定解除绑定?',
          message: '解除绑定后在微信内无法接收到订单推送消息',
          confirmButtonText: '解除绑定',
          cancelButtonText: '取消'
        }).then(action => {
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/usercenter/UnbindWechat",
            dataType: "JSON",
            data: {
              openId: _this.openId
            },
            success: function (response) {
              if (response.Header.ErrorCode != 0) {
                Toast(response.Header.Message);
                return;
              }
              Toast("操作成功");
              //2秒后刷新页面
              setTimeout(() => {
                _this.init();
              }, 2000);
            }
          });
        });
      },
    },
  }

</script>

<style>
  @import url("../../assets/css/app.css");

  .cp-bindWechat {
    width: 100%;
    height: 100%;
  }

  /*微信绑定的样式*/

  .cp-bindingBox {
    width: 100%;
    height: 100%;
    background: #fffafb;
    overflow-x: hidden;
    overflow-y: auto;
    float: left;
    clear: left;
  }

  .cp-remindTop {
    width: 100%;
    height: .88rem;
    background: #fff2be;
    border-bottom: 1px solid #e30000;
    font-size: .32rem;
    line-height: .88rem;
    text-align: center;
    color: #f0a001;
    float: left;
    clear: left;
  }

  .cp-bindingHead {
    width: 100%;
    height: 6.84rem;
    background: url(../../assets/images/top_BG.png) no-repeat center top;
    background-size: 100%;
    display: flex;
    text-align: center;
    vertical-align: middle;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .cp-bindingHead span {
    display: block;
  }

  .cp-bindingHead span.cp-logoBox {
    width: 3.68rem;
    height: 3.8rem;
    background: url(../../assets/images/pic_logo_white.png) no-repeat center top;
    background-size: 100%;
  }

  .cp-bindingFrom {
    width: 100%;
    padding: 0 .68rem;
    float: left;
    clear: left;
  }

  .cp-bindingFrom li {
    width: 100%;
    margin-top: .4rem;
    float: left;
    clear: left;
  }

  .cp-bindingFrom li p {
    width: 100%;
    height: auto;
    font-size: .32rem;
    line-height: .72rem;
    text-align: left;
    color: #999596;
    float: left;
    clear: left;
  }

  .cp-bindingFrom li span {
    width: 100%;
    float: left;
    clear: left;
  }

  .cp-bindingFrom li.cp-verification span {
    width: 5.6rem;
  }

  .cp-bindingFrom li span input {
    width: 100%;
    height: auto;
    border: 1px solid #e8e8e8;
    padding: .2rem .82rem .2rem .12rem;
    font-size: .36rem;
    line-height: .72rem;
    text-align: left;
    color: #333;
    float: left;
    clear: left;
  }

  .cp-bindingFrom li span input:focus {
    border: 1px solid #999;
  }

  .cp-bindingFrom li span input.cp-error {
    border: 1px solid #fd3b5c;
    color: #fd3b5c;
  }

  .cp-bindingFrom li a {
    width: 100%;
    height: auto;
    background-image: linear-gradient(to right, #f31341 0%, #fc3b60 100%);
    font-size: .48rem;
    line-height: 1.12rem;
    text-align: center;
    color: #fff;
    float: left;
    clear: left;
  }

  .cp-bindingFrom li.cp-verification a {
    width: 2.72rem;
    height: auto;
    background: #fd3b5c;
    font-size: .36rem;
    float: right;
    clear: none;
  }

  .cp-bindingFrom li.cp-payAttention {
    margin: 0;
    font-size: .32rem;
    line-height: 1.08rem;
    text-align: center;
    color: #fd3b5c;
  }

  .cp-bindingFrom li a.cp-disable,
  .cp-bindingFrom li.cp-verification a.cp-disable {
    background: #dad9e2;
  }

  .cp-bindingFrom li.cp-verification a.cp-retransmission {
    color: #9f9db1;
  }

  .cp-bindingFrom li span a,
  .cp-bindingFrom li.cp-verification span a {
    width: .82rem;
    height: 1.12rem;
    margin-top: -1.12rem;
    background: none;
    font-size: .48rem;
    line-height: 1rem;
    color: #acacac;
    position: relative;
    z-index: 3;
    float: right;
    clear: none;
  }

  /*toast提醒*/

  .cp-toastBox {
    width: 5.12rem;
    height: 1.12rem;
    margin: -.56rem 0 0 -2.56rem;
    background: rgba(0, 0, 0, 0.78);
    border-radius: .2rem;
    font-size: .36rem;
    line-height: 1.12rem;
    text-align: center;
    color: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 120;
  }

  /*解除绑定相关样式*/

  .cp-bindingHead span.cp-bindingIcon {
    width: 2.48rem;
    height: 4.2rem;
    background: url(../../assets/images/pic_binding.png) no-repeat center top;
    background-size: 2.44rem;
  }

  .cp-relieveMain {
    width: 100%;
    height: auto;
    padding: 1.2rem .68rem 0;
    float: left;
    clear: left;
  }

  .cp-relieveMain li {
    width: 100%;
    height: auto;
    text-align: center;
    float: left;
    clear: left;
  }

  .cp-relieveMain li.cp-bindingText {
    font-size: .32rem;
    line-height: .64rem;
    color: #999;
  }

  .cp-relieveMain li.cp-shopName {
    font-size: .56rem;
    line-height: 1.2rem;
    color: #333;
  }

  .cp-relieveMain li.cp-button {
    padding-top: .48rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cp-relieveMain li.cp-button a {
    width: auto;
    height: auto;
    padding: 0 .96rem;
    border-radius: .513rem;
    border: 1px solid #fd3b5c;
    font-size: .36rem;
    line-height: 1rem;
    text-align: center;
    color: #fd3b5c;
  }

  /*解除绑定的确认弹层*/

  .cp-relievePop {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.48);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 120;
  }

  .cp-relievePopBox {
    width: 8rem;
    height: 4.32rem;
    margin: -2.16rem 0 0 -4rem;
    background: #fff;
    border-radius: .32rem;
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 124;
  }

  .cp-relievePopText {
    width: 100%;
    height: 3.04rem;
    padding-top: .8rem;
    float: left;
    clear: left;
  }

  .cp-relievePopText p,
  .cp-relievePopText span {
    width: 100%;
    height: auto;
    line-height: .64rem;
    text-align: center;
    float: left;
    clear: left;
  }

  .cp-relievePopText p {
    font-size: .36rem;
    color: #333;
  }

  .cp-relievePopText span {
    font-size: .32rem;
    color: #fd3b5c;
  }

  .cp-relievePopButton {
    width: 100%;
    border-top: 1px solid #d8d8d8;
    float: left;
    clear: left;
  }

  .cp-relievePopButton a {
    width: 50%;
    font-size: .4rem;
    line-height: 1.28rem;
    text-align: center;
    color: #2c83e6;
    float: left;
    clear: none;
  }

  .cp-relievePopButton a.cp-leftButton {
    border-right: 1px solid #d8d8d8;
  }

</style>
