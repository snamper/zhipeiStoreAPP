<template>
  <div class="aboutUs">
    <!--<headers title="关于我们"></headers>-->
    <div class="bz-aboutUs">
      <!--关于我们的logo和版本好-->
      <div class="bz-brandLogoInfo">
        <div class="bz-autoBrandLogo">
          <img src="../../assets/images/aboutUs/storeLogo.png"/>
        </div>
        <div class="bz-abuoutVersion">
          <p>智配Store</p>
          <p>V{{version}}</p>
          <p>使用iphone 6 或安卓系统5.0、处理器四核，后置摄像头1200万像素以上设备，识别效果更佳。</p>
        </div>
      </div>
      <!-- APP的二维码 -->
      <div class="bz-aboutCode">
        <img src="../../assets/images/aboutUs/erweima.png"/>
      </div>
      <!-- APP介绍文案 -->
      <div class="bz-aboutText">
        <span>VIN码扫描APP是一款基于OCR技术的采集解析Vin码(车架号)的软件，轻轻一扫，就可获得车辆的相关信息，简单、便捷。</span>
      </div>
      <!-- 底部固定按钮 -->
      <div class="bz-abotuFool" v-on:click="shareApp()">
        <a>分享APP</a>
      </div>
    </div>

    
    <!-- 分享APP -->
    <shareFriends v-if="sharePop" v-on:shareFriendsHide="shareFriendsHide" v-bind:shareFlag="1"></shareFriends>
  </div>
</template>

<script>
  import {commonMixin} from '../../config/base/commonMixin.js';
  // import headers from '../../components/headers.vue';

  import shareFriends from '../../components/shareFriends.vue';

  //不写第二个参数，就直接打包在`/JS` 目录下。
  // import Vue from 'vue'
  var resourceUrl = process.env.apiDomain;


  export default {
    name: "aboutUs",
    mixins: [commonMixin],
    components: {
      shareFriends,
    },
    data() {
      return {
        version: "",
        sharePop: false,
      }
    },
    created() {
      this.setTitle('关于我们');
    },
    mounted() {
      var _this = this;

      _this.LoadComplete(function(){
        _this.nativeLsitenBack('native_CloseWebview');
      })
      _this.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('native_GetVersion', "", function (response) {
          _this.version = response;
        });
      });
      // this.listenBackEvent("native_CloseWebview");
    },
    methods: {
      // 点击分享App
      shareApp() {
        var _this = this;
        _this.sharePop = true;
      },
      // 获取分享传递的数据
      shareFriendsHide(data) {
        var _this = this;
        _this.sharePop = data;
      }
    },
  }
</script>

<style>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/aboutstyle.css");
</style>
