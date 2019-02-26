<template>
  <div> </div>
</template>

<script>
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "advertRedirect",
    mixins: [commonMixin],
    components: {},
    data() {
      return {}
    },
    created() {
    },
    mounted() {
      this.goRedirect();
    },
    methods: {
      // 重定向
      goRedirect() {
        var _this = this;
        var advertId = this.getQueryString('adid');
        var backurl = this.getQueryString('backurl');
        this.ajax({
          method: "POST",
          url: resourceUrl + "/ad/savelanding",
          dataType: "JSON",
          data: {
            advertId: advertId
          },
          success: function (data) {
            window.location.replace(backurl);
          },
          error: function () {
            window.location.replace(backurl);
          }
        });
      }
    },
  }

</script>

<style>
  @import url("../../assets/css/app.css");

</style>
