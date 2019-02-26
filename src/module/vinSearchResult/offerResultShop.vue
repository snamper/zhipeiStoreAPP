<template>
    <div class="offerResultShop bx-queryResultsBG" >
        <!--<headers title="快速调货" offerStatus="4" offerVin="1"></headers>-->
        <!-- 报价提醒框 -->
        <horseRaceLamp v-show="isShowLamp"
        v-on:isLampAction="getShowLamp"
        v-bind:isOfferResult="1"
        v-bind:lampType="1"
        v-bind:shopOrderId="shopOrderId"
        v-bind:quoteOrderIDs="0"  ref="raceLamp" ></horseRaceLamp>

        <!-- 一键询价 报价页面顶部加载成功效果 -->
        <!-- :style="{'margin-top': isShowLamp ? '1.04rem' : '' }" -->
        <!-- style="margin-top: 1.04rem;" -->
        <div class="bo-offerTop bs-loadSuccess"  :style="{'margin-top': isShowLamp ? '0rem' : '0rem' }" >
            <p v-if="isOneResultShop">已通知以下 {{shopCount}} 家汽配店为您报价，请耐心等待</p>
            <a v-if="isOneResultShop" @click="goRepairPage()">查看报价清单</a>
            <p v-if="!isOneResultShop">已通知发货，请耐心等待</p>
        </div>

        <!-- 一件询价 报价表格 -->
        <!-- style="padding-bottom: 1.82rem;"  -->
        <div class="bo-offerTableBox" >
            <div class="bo-offerTableTop">
                <ul>
                    <li class="bo-offerNumber">编号</li>
                    <li class="bo-offerShop">店名</li>
                    <li class="bo-offerName">姓名</li>
                    <li class="bo-offerTel">联系他</li>
                </ul>
            </div>
            <div class="bo-offerTable">
                <table cellpadding="0" cellspacing="0" border="0">
                    <tr v-for="(item,index) in getShopData.shopList">
                        <td class="bo-offerNumber">{{index+1}}</td>
                        <td class="bo-offerShop">{{item.cloudShopName}}</td>
                        <td class="bo-offerName">{{item.contacts}}</td>
                        <td class="bo-offerTel" @click="contactShop(item.mobile)">
                            <a ></a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <!--弹出成-->
        <div class="cb-orderSuccessPop" v-show="isHide">
            <div class="cb-orderSuccessBox">
                <a  class="cb-orderSuccessPic" @click="toActivity">
                    <img src="../../assets/images/pic_orderSuccess1.png">
                </a>
                <a  class="cb-closeBox" @click="hideMeth"></a>
            </div>
        </div>

    </div>
</template>

<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import { commonMixin } from "../../config/base/commonMixin.js";
import router from "../../router/vinSearchResult.js";
import horseRaceLamp from "../../components/horseRaceLamp.vue";
var resourceUrl = process.env.apiDomain;
export default {
  name: "offerResultShop",
  mixins: [commonMixin],
  components: {
    // headers: headers,
    horseRaceLamp: horseRaceLamp
  },
  data() {
    return {
      isHide: false,
      getShopData: [],
      isShowLamp: true,
      shopCount: 0,
      shopOrderId: this.$route.params.shopOrderId
        ? this.$route.params.shopOrderId
        : this.getQueryString('shopOrderId'),
      isOneResultShop: true,
      vinCode: this.$route.params.vinCode ? this.$route.params.vinCode : this.getQueryString('v')
    };
  },
  created() {
    var _this = this;
    _this.setTitle('快速调货');
    _this.getCloudShopList();
    setTimeout(function() {
      Indicator.close();
    }, 2000);
  },
  mounted() {
    var _this = this;
    _this.getsuccess();
    // 只有备货下单成功
    if(_this.getQueryString('model')=="beihuo"){

      _this.LoadComplete(function(){
        _this.nativeLsitenBack('native_CloseWebview');
      })
    }else {
      if(_this.androidOrios() == 2){
        _this.LoadComplete(function(){
          _this.setupWebViewJavascriptBridge(function(bridge){
            bridge.callHandler('native_BackBtn', '', function (response) {
              router.push({
                name: "offerInquiryNew",
                query:{
                  v:_this.vinCode
                }
              })
            })
          })
        })
      }else {
        _this.setupWebViewJavascriptBridge(function(bridge){
          bridge.callHandler('native_BackBtn', '', function (response) {
            router.push({
              name: "offerInquiryNew",
              query:{
                v:_this.vinCode
              }
            })
          })
        })
      }
    }
  },
  methods: {
    getShowLamp(data) {
      var _this = this;
      _this.isShowLamp = data;
    },
    hideMeth() {
      var _this = this;
      _this.isHide = false;
    },
    toActivity() {
      var baseUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        "/activity.html?cf=1";
      // window.location.href = base
      this.setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler("native_JumpUrl", { url: baseUrl }, function(
          response
        ) {});
      });
    },
    getCloudShopList() {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/Order/GetCombineOrder",
        dataType: "JSON",
        data: {
          shopOrderId: _this.shopOrderId //15999
          //  "shopOrderId":15999
        },
        beforeSend: function() {},
        success: function(data) {
          if (data.Body) {
            _this.getShopData = data.Body;
            _this.shopCount = data.Body.shopCount;
            if (_this.shopCount <= 1) {
              _this.isOneResultShop = false;
            }
            if (data.Body.isRedOpen == 1) {
              _this.getAuthorization(_this.shopOrderId);
            }
          } else {
            Toast({
              message: data.Header.Message,
              position: "center",
              duration: 1500
            });
          }
        }
      });
    },
    // 跳转至“报价列表”页
    goRepairPage() {
      var _this = this;
      var url =
        window.location.protocol +
        "//" +
        window.location.host +
        "/repairFactoryList.html?shopOrderId=" +
        _this.shopOrderId +
        "&offer=1";
      _this.setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler("native_JumpUrl", { url: url }, function(
          response
        ) {});
      });
    },
    //联系店铺
    contactShop(mobile) {
      var _this = this;
      _this.setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler("native_CallPhone", mobile, function(response) {});
      });
    },
    //获取红包的拼争
    getAuthorization(parentOrderId) {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/UserCenter/GetUserAliUserID",
        dataType: "JSON",
        success: function(data) {
          _this.getRedPacket(parentOrderId, data.Body);
        }
      });
    },
    //领取红包
    getRedPacket(parentOrderId, data) {
      var _this = this;
      var data = {
        orderId: parentOrderId,
        mainTitle: data.mainTitle,
        descText: data.descText,
        isAuthorization: data.isAuthorization //1 有凭证 0 无凭证
      };
      if (_this.androidOrios() == 1) {
        data = JSON.stringify(data);
      }
      _this.setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler("native_RedPacket", data, function(response) {});
      });
    },
    //下单成功
    getsuccess() {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/Special/IsShopOrderJoinActivity",
        dataType: "JSON",
        data: {
          ShopOrderID: _this.shopOrderId,
          ActivityStatus: 0
        },
        success: function(data) {
          if (data) {
            _this.isHide = data.Body;
          }
        }
      });
    }
  }
};
</script>

<style>
@import url("../../assets/css/app.css");
@import url("../../assets/css/offerChoice.css");
.bx-queryResultsBG {
  background: #edf2f7 url(../../assets/images/pic_queryResults.png) no-repeat
    right bottom;
  background-size: 100%;
  min-height: 100%;
}
.cb-orderSuccessPop {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.48);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 60;
}
.cb-orderSuccessBox {
  width: 8rem;
  height: 8.24rem;
  border-radius: 0.32rem;
  margin: -4.12rem 0 0 -4rem;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 66;
}
.cb-orderSuccessBox a.cb-orderSuccessPic {
  width: 8rem;
  height: 8.24rem;
  border-radius: 0.32rem;
  display: block;
  overflow: hidden;
  float: left;
  clear: left;
}
.cb-orderSuccessBox a.cb-orderSuccessPic img {
  vertical-align: middle;
  border: 0 none;
  width: 100%;
  height: 100%;
}
.cb-orderSuccessBox a.cb-closeBox {
  width: 0.68rem;
  height: 0.68rem;
  background: url(../../assets/images/icon_closeButton.png) no-repeat center
    center;
  background-size: 0.64rem;
  position: absolute;
  bottom: -1.28rem;
  left: 50%;
  margin-left: -0.34rem;
  z-index: 64;
}
</style>
