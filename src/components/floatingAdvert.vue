<!-- 浮层广告 -->
<template>
  <div v-if="isLaunch" class="cl-popupAd">
    <div class="cl-popupAdBox">
      <span>
        <img :src="advertObject.advertFile" v-on:click="landing">
      </span>
      <a v-if="!advertObject.needForceLanding" href="javascript:;" v-on:click="close"></a>
    </div>
  </div>
</template>

<style>
  /* @import url("../assets/css/app.css"); */

  .cl-popupAd {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.48);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 120;
  }

  .cl-popupAdBox {
    width: 92%;
    height: 12.04rem;
    position: fixed;
    left: 4%;
    top: 50%;
    margin-top: -6.6rem;
    z-index: 124;
  }

  .cl-popupAdBox span {
    width: 100%;
    height: 100%;
    display: block;
    float: left;
    clear: left;
  }

  .cl-popupAdBox span img {
    width: 100%;
    float: left;
    clear: left;
  }

  .cl-popupAdBox a {
    width: .64rem;
    height: .64rem;
    margin: .56rem 4.28rem 0;
    background: url(../assets/images/icon_closeButton.png) no-repeat center center;
    background-size: .64rem;
    float: left;
    clear: left;
  }

</style>

<script>
  import {
    commonMixin
  } from '../config/base/commonMixin.js';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "floatingAdvert",
    props: [],
    mixins: [commonMixin],
    components: {},
    data() {
      return {
        isLaunch: false,
        advertObject: null,
      }
    },
    created() {
      var _this = this;
      this.init();
    },
    mounted() {
      var _this = this;
    },
    methods: {
      init() {
        var _this = this;
        //获取广告
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Ad/GetSingleAdvertBySpace",
          dataType: "JSON",
          data: {
            advertSpace: 6 //6:APP扫码结果浮层广告
          },
          success: function (response) {
            if (response.Header.ErrorCode != 0) return;
            if (!response.Body) return;

            _this.advertObject = response.Body;
            _this.isLaunch = true;

            if (_this.advertObject.needForceLanding) {
              //强制着陆场合, 3秒后强制着陆
              setTimeout(() => {
                _this.isLaunch = false;
                _this.landing();
              }, 3000);

            } else {
              //非强制着陆场合, 5秒后自动关闭
              setTimeout(() => {
                _this.isLaunch = false;
              }, 5000);
            }
          }
        });
      },
      landing() {
        var _this = this;

        //记录着陆
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Ad/savelanding",
          dataType: "JSON",
          data: {
            advertId: _this.advertObject.advertId
          },
          success: function (response) {
            //do nothing
          }
        });

        //跳转着陆页
        if (_this.androidOrios() > 0) {
          _this.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('native_JumpUrl', {
              url: _this.advertObject.landingPage
            }, function (response) {});
          });
        } else {
          window.location.href = _this.advertObject.landingPage;
        }

      },
      close() {
        var _this = this;

        //记录关闭
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Ad/saveclosing",
          dataType: "JSON",
          data: {
            advertId: _this.advertObject.advertId
          },
          success: function (response) {
            //do nothing
          }
        });

        //关闭
        _this.isLaunch = false;
      },
    }
  }

</script>

</style>
