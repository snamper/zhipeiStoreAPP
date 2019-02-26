<template>
    <div class="horseRaceLamp" >
        <!-- 报价提醒框 -->
        <div class="bp-offerRemindBox"  @click="isOfferResult==1?gotoPage():isOfferResult==4?againLoad():''">
            <p><b class="str5">{{message}}</b></p>
            <a v-if="isOfferResult==1" class="bp-distributorLink"></a>
            <a v-else>刷新</a>
        </div>
        <!-- 下拉手势 -->
		 <!-- <div class="bp-gestureDown" v-if="isOfferResult!=1"  @click="refreshOrderData()" ></div> -->
    </div>
</template>
<script>
import { commonMixin } from "../config/base/commonMixin.js";
// import jqueryOne from "../assets/js/jquery-1.10.2.js";
import liMarquee from "../assets/js/jquery.liMarquee.js";
import headers from "../components/headers.vue";
var resourceUrl = process.env.apiDomain;
export default {
  props: [
    "status",
    "shopOrderId",
    "isOfferResult",
    "quoteOrderIDs",
    "lampType",
    "lastTime"
  ],
  name: "horseRaceLamp",
  mixins: [commonMixin],
  components: {
    headers: headers
  },
  data() {
    return {
      isFirst: true,
      message: "",
      url: "",
      // getOrderDate:[],
      // shopOrderId:0,
      timekey: null
    };
  },
  created() {
    var _this = this;
    if (_this.isFirst) {
      // _this.isFirst=false;
      _this.getOrderDate();
    }
    _this.loopImplement();
  },
  mounted() {
    var _this = this;
    // _this.remindBox();//页面渲染完再加载跑马灯文字效果
  },
  methods: {
    loopImplement() {
      var _this = this;
      // alert("loopImplement")
      _this.isFirst = false;
      _this.timekey = setInterval(function() {
        _this.getOrderDate();
      }, 5000);
    },
    //找货快速报价 获取订单信息
    getOrderDate() {
      var _this = this;
      if (_this.$props.shopOrderId == 0) {
        return;
      }
      if (_this.$props.isOfferResult == 4) {
        if (_this.$props.lastTime.length <= 0) {
          _this.$emit("isLampAction", false);
          return;
        }
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetShopOrderAlertByTime",
          dataType: "JSON",
          data: {
            lastTime: _this.$props.lastTime //按照上一次 请求数据的最后时间来查询订单
          },
          beforeSend: function() {},
          success: function(data) {
            if (data.Body) {
              _this.message = data.Body.alertMsg;
              clearInterval(_this.timekey);
              _this.$emit("isLampAction", true);
            } else {
              _this.$emit("isLampAction", false);
            }
          }
        });
      } else {
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetShopOrderAlertByShopID",
          dataType: "JSON",
          data: {
            ShopOrderID: _this.$props.shopOrderId, //分类ID列表
            QuoteOrderIDs: _this.$props.quoteOrderIDs
          },
          beforeSend: function() {},
          complete: function() {},
          success: function(data) {
            if (data.Body) {
              // _this.getOrderDate=data.Body;
              _this.message = data.Body.alertMsg;
              _this.url = data.Body.linkUrl;

              clearInterval(_this.timekey);
              _this.$emit("isLampAction", true);
              if (_this.$props.lampType == 1) {
                //  _this.isFirst=false;
                clearInterval(_this.timekey);
                _this.setupWebViewJavascriptBridge(function (bridge) {
                  bridge.callHandler('native_JumpUrl', {url:_this.url}, function (response) {

                  })
                })
                // window.location.href = _this.url;
                // //调到采购订单页
                // _this.setupWebViewJavascriptBridge(function (bridge) {
                //   bridge.callHandler('native_GoCustomerOrders', '', function (response) {
                //
                //   });
                // });
              }
            } else {
              _this.$emit("isLampAction", false);
              // _this.$emit("isLampAction",true)
            }
          }
        });
      }
    },

    //加载跑马灯文字效果
    remindBox() {
      $(".str5").liMarquee({
        hoverstop: false
      });
    },
    //跳转页面
    gotoPage() {
      //根据status状态跳转页面
      var _this = this;
      // _this.isFirst=false;
      location.href = _this.url;
    },
    againLoad() {
      var _this = this;
      _this.isFirst = true;
      _this.$emit("isAgainLoad", true);
      _this.$emit("isLampAction", false);
      _this.loopImplement();
    }
  }
};
</script>

<style>
@import url("../assets/css/app.css");
@import url("../assets/css/offerstyle.css");
</style>
