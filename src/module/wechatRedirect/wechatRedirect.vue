<template>
  <div> </div>
</template>

<script>
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "wechatRedirect",
    mixins: [commonMixin],
    components: {},
    data() {
      return {}
    },
    created() {},
    mounted() {
      this.goRedirect();
    },
    methods: {
      // 重定向
      goRedirect() {
        var _this = this;

        var code = this.getQueryString("code") || this.getQueryString("CODE");
        var jumpUrl = this.getQueryString("state") || this.getQueryString("STATE");

        this.ajax({
          method: "POST",
          url: "//app.zhipeicloud.com/wx/OAuth/GetAccessToken",
          dataType: "JSON",
          data: {
            code: code,
            WixinType: 2 //微信号区别 1:cjml 2:zhipei
          },
          success: function (response) {
            if (response.Header.ErrorCode != 0) {
              console.log("GetAccessToken失败!");
              jumpUrl = _this.updateQueryStringParameter(jumpUrl, "openid", "error")
              window.location.replace(jumpUrl); //失败了也执行跳转, openid=error
              return;
            }
            var data = response.Body;

            if (data == null) {
              console.log("未能取得授权信息!");
              jumpUrl = _this.updateQueryStringParameter(jumpUrl, "openid", "error")
              window.location.replace(jumpUrl); //失败了也执行跳转, openid=error
              return;
            }

            jumpUrl = _this.updateQueryStringParameter(jumpUrl, "openid", data.openid)

            //跳转
            window.location.replace(jumpUrl);
          },
          error: function () {
            console.log("GetAccessToken发生异常!");
            jumpUrl = _this.updateQueryStringParameter(jumpUrl, "openid", "error")
            window.location.replace(jumpUrl); //失败了也执行跳转, openid=error
          }
        });
      }
    },
  }

</script>

<style>
  @import url("../../assets/css/app.css");
</style>
