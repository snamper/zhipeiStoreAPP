<template>
  <div id="helpCenter">
    <!--<headers title="帮助中心"></headers>-->
    <!--style="margin-top: 1.16rem"-->
    <div class="cs-wechat" >
      如有问题可关注微信公众号“智配”，随时为您服务
    </div>
    <div class="cs-FAQBox">
      <p>常见问题</p>
      <a v-for="item in list" @click="toOtrerPage(item.link)">{{item.question}}</a>
    </div>

    <div class="cs-helpFool">
      <a @click="contactme">客服联系我</a>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  import {commonMixin} from '../../config/base/commonMixin.js';
  // import headers from '../../components/headers.vue';

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "helpCenter",
    mixins: [commonMixin],
    components: {
      // headers,
    },
    created(){
      var _this = this;
      _this.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('native_SetTitle', "帮助中心", function (response) {
        });
      });
    },
    mounted(){

      this.getData();
      this.listenBackEvent();
    },
    data(){
      return {
        list:[]
      }
    },
    methods:{
      getData(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/common/GetHelpCenter",
          dataType: "JSON",
          success: function(data) {

            if(data.Body){
              _this.list = data.Body;
            }
          }
        });
      },
      contactme(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/common/ContactSalesman',
          dataType: "JSON",
          success: function (data) {
            if(data.Header.ErrorCode==0){
              Toast('稍后会有客服联系您，请保持电话畅通')
            }else {
              Toast(data.Header.Message);
            }
          }
        })
      },
      toOtrerPage(link){

        window.location.href=link
      }
    }
  }
</script>

<style scoped>

  /*帮助中心页面*/
  .cs-wechat {
    width: 100%;
    padding: .32rem .32rem .32rem 1.16rem;
    border-bottom: 1px solid #dce6ef;
    background: #fff url(../../assets/images/icon_WeChat.png) no-repeat .32rem center;
    background-size: .64rem;
    font-size: .36rem;
    line-height: .64rem;
    text-align: left;
    color: #333;
    float: left;
    clear: left;
  }

  .cs-FAQBox {
    width: 100%;
    padding-bottom: 1.32rem;
    float: left;
    clear: left;
  }

  .cs-FAQBox p {
    width: 100%;
    padding: .2rem .32rem 0;
    border-bottom: 1px solid #dce6ef;
    font-size: .32rem;
    line-height: .64rem;
    text-align: left;
    color: #b0c5db;
    float: left;
    clear: left;
  }

  .cs-FAQBox a {
    width: 100%;
    padding: 0 .8rem 0 .32rem;
    border-bottom: 1px solid #dce6ef;
    background: #fff url(../../assets/images/arrow_gray.png) no-repeat 9.52rem center;
    background-size: auto .32rem;
    font-size: .36rem;
    line-height: 1.28rem;
    text-align: left;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    clear: left;
  }

  .cs-helpFool {
    width: 100%;
    height: 1.32rem;
    background: #fff;
    border-top: 1px solid #dce6ef;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 5;
  }

  .cs-helpFool a {
    width: 50%;
    padding-top: .8rem;
    background: url(../../assets/images/icon_customerService.png) no-repeat center top;
    background-size: .64rem;
    font-size: .32rem;
    line-height: .32rem;
    text-align: center;
    color: #337fd5;
    float: left;
    clear: left;
  }


</style>
