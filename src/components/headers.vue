<template>
  <div class="headers">
    <div class="headBox">
      <a href="javascript:void(0);" class="returnLink" v-show="status!=0&&offerStatus!=3" v-on:click="offerStatus==1||offerStatus==3?closeView():goUpPage()"></a>
      <p>{{title}}</p>
      <template v-if="rightBtnText && rightBtnText.length>0">
        <a href="javascript:void(0);" v-on:click="rightBtnEvent()" class="homeLinkFinish">{{rightBtnText}}</a>
      </template>
      <template v-else>
        <a href="javascript:void(0);" v-on:click="goHome()" class="homeLink" v-show="status!=0&&offerStatus!=1&&offerStatus!=2"></a>
      </template>
    </div>
  </div>
</template>

<script>
  // import offerRouter from "../router/vinSearchResult.js";
  import { commonMixin } from '../config/base/commonMixin.js';
  export default {
    props: ["title", "status", "only", "offerStatus", "shopOrderId", "back", "isGoHome", "vinCode", "jumpType", "offerVin", "rightBtnText"],
    name: 'headers',
    mixins: [commonMixin],
    data: function () {
      return {
        SearchkeyValue: "",
        inputVal: "",
        appType: this.androidOrios(),
      }
    },
    methods: {
      cleanLocal() {
        var _this = this;
        if (_this.$props.offerVin) {
          localStorage.removeItem('vinChoiceSelectShops');//清除勾选的常用店铺信息
          localStorage.removeItem('CategoryListOld');//选择配件
          localStorage.removeItem('audioResult');//清除已经缓存下的录音
          localStorage.removeItem('CJML_APP_choosedParams');//清除缓存——产品参数
          localStorage.removeItem('CategoryList');
          localStorage.removeItem('CJML_APP_selectShops');//清除——勾选的常用店铺Id
          localStorage.removeItem('CJML_APP_vinSelfSelectShops');//清除缓存——新增的供货商
          localStorage.removeItem('CJML_APP_pageNum');//清除缓存——用户是否点击查看更多
          localStorage.removeItem('CJML_APP_CategoryPageNum');//清除缓存——用户是否点击查看更多
        }
      },
      rightBtnEvent() {
        this.$emit("rightBtnEvent");
      },
      goHome() {
        this.cleanLocal();
        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_GoHome', '', function (response) { });
        });
      },
      closeView() {
        var _this = this;
        _this.cleanLocal();
        if (_this.$props.isGoHome) {
          _this.goHome();
        } else {
          //关闭当前页面
          _this.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('native_CloseWebview', '', function (response) { });
          });
        }
      },
      goUpPage() {
        var _this = this;
        _this.cleanLocal();
        if (_this.$props.back) {
          _this.closeView();
        }
        /*	else{
            if(_this.$props.vinCode){
              debugger;
              localStorage.removeItem('vinChoiceSelectShops');
              // offerRouter.push({
              // 	name: 'offerInquiryNew',
              // 	params:{
              // 		pushShop:1,
              // 		vinCode:_this.$props.vinCode,
              // 	}
              // });
            }else{
              debugger;
              // offerRouter.push({
              // 	name: 'offerInquiryNew',
              // 	params:{
              // 		vinCode:_this.$props.vinCode,
              // 	}
              // });
            }
          }*/
      }
    },
    mounted() {

    }
  }
</script>

<style>
  @import url("../assets/css/app.css");
  /*头部标题栏通用样式*/

  .headBox {
    width: 100%;
    height: 1.16rem;
    background: #d53533;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 55;
  }

  .headBox p {
    width: 6.64rem;
    height: 1.16rem;
    margin-left: -3.32rem;
    font-size: .44rem;
    line-height: 1.16rem;
    text-align: center;
    color: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 2;
  }

  .returnLink {
    width: 1.28rem;
    height: 1.16rem;
    background: url(../assets/images/return.png) no-repeat center left;
    background-size: 1.24rem;
    padding-left: .4rem;
    font-size: .46rem;
    line-height: 1.16rem;
    text-align: left;
    color: #fff;
    position: absolute;
    left: .32rem;
    top: 0;
    z-index: 3;
  }

  .homeLink {
    width: 1.12rem;
    height: 1.16rem;
    background: url(../assets/images/icon_home_w.png) no-repeat center center;
    background-size: .48rem;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3;
  }

  .homeLinkFinish {
    width: 1.72rem;
    height: 1.16rem;
    line-height: 1.16rem;
    font-size: .42rem;
    color: #fff;
    position: absolute;
    right: .32rem;
    top: 0;
    z-index: 3;
    text-align: center;
  }

  /*VIN码查询框样式*/

  .aa-vinSearchBox {
    width: 100%;
    height: 1.2rem;
    background: #d53533;
    position: fixed;
    top: 1.15rem;
    left: 0;
    z-index: 30;
  }

  .aa-vinSearchBox span {
    width: 93.6%;
    height: .88rem;
    margin: 0 .32rem;
    background: #fff;
    border-radius: .44rem;
    display: inline-block;
  }

  .aa-vinSearchBox span input {
    width: 83%;
    height: .88rem;
    border-radius: .44rem;
    margin-left: .02rem;
    padding-left: .32rem;
    font-size: .48rem;
    line-height: .88rem;
    text-align: left;
    color: #333;
    float: left;
    clear: none;
  }

  .aa-vinSearchBox span .searchContainer {
    width: 90%;
    height: .88rem;
    border-radius: .44rem;
    margin-left: .02rem;
    padding-left: .32rem;
    font-size: .48rem;
    line-height: .88rem;
    text-align: left;
    color: #333;
    float: left;
    clear: none;
  }

  .aa-vinSearchBox span .searchContainer .keyValue {
    max-width: 3.24rem;
    float: left;
    height: .6rem;
    margin-top: 0.14rem;
    margin-left: .1rem;
    line-height: .6rem;
    padding: 0 .4rem 0 .2rem;
    border-radius: .1rem;
    font-size: .373rem;
    background: #fff1f2 url(../assets/images/down.png) no-repeat right center;
    background-size: .2rem;
    color: #af1018;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .aa-vinSearchBox span a {
    width: .88rem;
    height: .88rem;
    display: inline-block;
    float: right;
    clear: none;
  }

  .aa-vinSearchBox span a.aa-closeLink {
    width: .48rem;
    height: .48rem;
    margin: .2rem .1rem;
    background: #ccc;
    border-radius: .24rem;
    font-size: .36rem;
    line-height: .42rem;
    text-align: center;
    color: #fff;
  }

  .aa-vinSearchBox span a.aa-searchLink {
    background: url(../assets/images/icon_query.png) no-repeat center center;
    background-size: .48rem;
  }

  .aa-carChooseExhibition {
    width: 93.6%;
    height: .88rem;
    margin: 0 .32rem;
    padding: .2rem .16rem;
    background: #fff;
    border-radius: .44rem;
    display: inline-block;
    overflow-x: auto;
  }

  .aa-carChooseExhibition li {
    width: auto;
    height: .48rem;
    margin: 0 .16rem;
    font-size: .36rem;
    line-height: .48rem;
    text-align: left;
    color: #333;
    float: left;
    clear: none;
  }
</style>