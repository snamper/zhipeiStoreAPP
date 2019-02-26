<!-- 通栏广告 -->
<template>
  <div v-if="isLaunch" :class="mainClass">
    <img :src="advertObject.advertFile" v-on:click="landing">
  </div>
</template>

<script>
  import {
    commonMixin
  } from '../config/base/commonMixin.js';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "bannerAdvert",
    props: ['styleMode'], //样式模式 "style_No1"(默认) or "style_No2" or "style_No3"
    mixins: [commonMixin],
    components: {},
    data() {
      return {
        isLaunch: false,
        advertObject: null,
        mainClass: "ec-advertisingBox",
      }
    },
    created() {
      var _this = this;
      this.init();
    },
    mounted() {
      var _this = this;
      this.mainClass = "ec-advertisingBox";
      if (this.$props.styleMode == "style_No2") this.mainClass = "ec-advertisingBox02";
      if (this.$props.styleMode == "style_No3") this.mainClass = "ec-advertisingBox03";
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
            advertSpace: 5 //5:APP扫码结果通栏广告
          },
          success: function (response) {
            if (response.Header.ErrorCode != 0) return;
            if (!response.Body) return;

            _this.advertObject = response.Body;
            _this.isLaunch = true;
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

    }
  }

</script>

</style>
