<template>
  <div class="receivablesOrder" >
    <!--<headers title="关于我们"></headers>-->
    <div class="ec-receivablesOrderPage" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"

    :class="{'ec-bottom':JSON.stringify(monthOrderInfo) == '[]'}" >

      <div class="ec-noData " v-show="JSON.stringify(dayOrderInfo) == '[]' && JSON.stringify(monthOrderInfo) == '[]' && loadDataComplete" >您的订单都已处理完成</div>


       <div class="ec-daySettlement" v-if="JSON.stringify(dayOrderInfo) != '[]'">
    		<div class="ec-settlementTitle">
    			<span></span>
    			<p>日结订单</p>
    		</div>

        <!-- 单个订单 -->
        <div class="ec-receivablesOrderOne" v-for="(order,index) in dayOrderInfo" :key="index">
            <p  :class="{'ec-selected':(order.IsSelect&& order.paymentMethod!=2),'dy-receivablesShopName':(order.paymentMethod==2)}"  @click="orderIsShow(order)" >{{order.cloudShopName}}</p>
            <div class="ec-orderMain">
                <dl>
                    <dt>
                        <p>{{order.vinCodeDetail.brandName}} {{order.vinCodeDetail.modelName}} {{order.vinCodeDetail.subName}}</p>
                        <span>{{order.vinCodeDetail.vinCode}}</span>
                    </dt>
                    <dd>
                        <p>{{order.OrderPaymentDisPlayValue}}</p>
                        <span>{{order.createTimeDisPlayValue}}</span>
                    </dd>
                </dl>
            </div>
            <div class="ec-orderMainTable">
                <div class="ec-orderTableTop">
                    <p>共{{order.orderTotalCount}}件商品，合计{{Number(order.payableAmount).toFixed(2)}}元整</p>
                    <!-- <a @click="orderIsOpen(order)">查看详情</a> -->
                     <!-- <a v-show="order.paymentMethod==2" @click="GetCashier(order)" style="margin-right: 0.3rem;">支付</a> -->
                    <!-- <a  @click="GetCashier(order)" style="margin-right: 0.3rem;">支付</a> -->
                </div>
                <div class="ec-orderTable" v-show="order.IsOpen">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <thead>
                            <tr>
                                <td class="ec-tdName">商品信息</td>
                                <td class="ec-tdNumber">数量</td>
                                <td class="ec-tdPrice">价格</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr  v-for="(detail,index) in order.orderDetails" :key="index" >
                                <td class="ec-tdName">{{detail.brandName}} {{detail.categoryName}} {{detail.wareName}}</td>
                                <td class="ec-tdNumber">{{detail.wareCount}}</td>
                                <td class="ec-tdPrice">￥{{Number(detail.warePrice).toFixed(2)}}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <div class="ec-orderButtonBox">
                    <a  @click="GetCashier(order)" class="ec-orderButton">付款收货</a>
	            </div>
        </div>


        </div>



      <div class="ec-monthSettlement" v-show="JSON.stringify(monthOrderInfo) != '[]'">
          <div class="ec-settlementTitle">
    			<span></span>
    			<p>月结订单</p>
    		</div>


        <!-- 单个订单 -->
        <div class="ec-receivablesOrderOne" v-for="(order,index) in monthOrderInfo" :key="index">
            <p  :class="{'ec-selected':(order.IsSelect&& order.paymentMethod!=2),'dy-receivablesShopName':(order.paymentMethod==2)}"  @click="orderIsShow(order)" >{{order.cloudShopName}}</p>
            <div class="ec-orderMain">
                <dl>
                    <dt>
                        <p>{{order.vinCodeDetail.brandName}} {{order.vinCodeDetail.modelName}} {{order.vinCodeDetail.subName}}</p>
                        <span>{{order.vinCodeDetail.vinCode}}</span>
                    </dt>
                    <dd>
                        <p>{{order.OrderPaymentDisPlayValue}}</p>
                        <span>{{order.createTimeDisPlayValue}}</span>
                    </dd>
                </dl>
            </div>
            <div class="ec-orderMainTable">
                <div class="ec-orderTableTop">
                    <p>共{{order.orderTotalCount}}件商品，合计{{order.payableAmount}}元整</p>
                    <a @click="orderIsOpen(order)">{{order.IsOpen?"收起详情":"查看详情"}}</a>
                     <!-- <a v-show="order.paymentMethod==2" @click="GetCashier(order)" style="margin-right: 0.3rem;">支付</a> -->
                    <!-- <a  @click="GetCashier(order)" style="margin-right: 0.3rem;">支付</a> -->
                </div>
                <div class="ec-orderTable" v-show="order.IsOpen">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <thead>
                            <tr>
                                <td class="ec-tdName">商品信息</td>
                                <td class="ec-tdNumber">数量</td>
                                <td class="ec-tdPrice">价格</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr  v-for="(detail,index) in order.orderDetails" :key="index" >
                                <td class="ec-tdName">{{detail.brandName}} {{detail.categoryName}} {{detail.wareName}}</td>
                                <td class="ec-tdNumber">{{detail.wareCount}}</td>
                                <td class="ec-tdPrice">￥{{Number(detail.warePrice).toFixed(2)}}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>


    </div>

    <div class="ec-buttonFool" v-show="JSON.stringify(monthOrderInfo) != '[]'">
        <a @click="batchFinishOrder()">确认收货</a>
    </div>
    <!--新的支付收银台-->
    <newCashDesk ref="newCashDesk" v-bind:subData="subData" v-if="newCashDeskShow"
    v-on:paymentCallback="paymentCallback" v-on:cancelPayment="cancelPayment" v-bind:modalType="0"></newCashDesk>
  </div>
</template>

<script>
import { commonMixin } from "../../config/base/commonMixin.js";
import shareFriends from "../../components/shareFriends.vue";
import newCashDesk from '../../components/newCashDesk'

import { Toast, InfiniteScroll, Indicator } from "mint-ui";

//不写第二个参数，就直接打包在`/JS` 目录下。
// import Vue from 'vue'
//FF74F5E41054C94194E2222566BE6922DB395D62D9ECB308F6DF4E66F8A3A52F6B81A8EADC4DEEDC 测试userticket
var resourceUrl = process.env.apiDomain;

export default {
  name: "receivablesOrder",
  mixins: [commonMixin],
  components: {
    shareFriends,
    newCashDesk
  },
  data() {
    return {
      version: "",
      loadDataComplete:false,
      sharePop: false,
      dayOrderInfo: [],
      monthOrderInfo: [],
      pageIndex: 1,
      pageSize: 999999,
      busy: false, //是否正在加载过程中
      spendScore:'',
      PromotionSelectType:"",
      newCashDeskShow:false,
      subData:{},
    };
  },
  created() {
    this.setTitle("待收货订单");

    //this.GetTradeList();
  },
  mounted() {
    var _this = this;

    _this.LoadComplete(function() {
      _this.nativeLsitenBack("native_CloseWebview");
    });
    _this.setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler("native_GetVersion", "", function(response) {
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
    },
    orderIsShow(o) {
      o.IsSelect = !o.IsSelect;
    },
    orderIsOpen(o) {
      o.IsOpen = !o.IsOpen;
    },
    loadMore() {
      Indicator.open({
        spinnerType: "fading-circle"
      });
      //this.busy = true;
      var _this = this;
      //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        //这里请求接口去拿数据，实际应该是调用一个请求数据的方法
        console.log(_this.pageIndex + 1);

        _this.GetTradeList();
      }, 100);
    },
    GetTradeList() {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/UserCenter/GetOrderList",
        dataType: "JSON",
        data: {
          pageIndex: _this.pageIndex,
          pageSize: _this.pageSize
        },
        success: function(data) {
          if (data.Header.ErrorCode == 0) {
            //        this.dayOrderInfo = [];
            // this.monthOrderInfo = [];
            _this.dayOrderInfo = _this.dayOrderInfo.concat(data.Body.DayOrders);
            _this.monthOrderInfo = _this.monthOrderInfo.concat(
              data.Body.MonthOrders
            );

            if (_this.pageIndex * _this.pageSize >= data.Body.totalCount) {
              _this.busy = true; //已经是最后一页了，不需要再触发滚动加载了
              _this.loadDataComplete = true;
              if (_this.pageIndex != 1) {
                // Toast("没有更多数据了");
              }
            } else {
              _this.busy = false;
            }

            _this.pageIndex = _this.pageIndex + 1;
          } else {
            Toast(data.Header.Message);
            _this.busy = true;
          }
        }
      });
    },
    GetCashier(data) {
      this.newCashDeskShow = true;
      this.subData={
        cloudShopId:data.cloudShopId, //云商ID
        shopOrderId: data.shopOrderId //订单ID
      }
    },
    //支付回调
    paymentCallback(){
      // this.newCashDeskShow = false;
      window.location.reload()
    },
    cancelPayment(){
      this.newCashDeskShow = false;
    },
    reload() {
      this.pageIndex = 1;
      this.dayOrderInfo = [];
      this.monthOrderInfo = [];
      this.GetTradeList();
    },
    batchFinishOrder() {
      var _this = this;
      var order = _this.monthOrderInfo.filter(x => x.IsSelect);

      if (order.length == 0) {
        Toast("请先选中需要确认收货的订单！");
        return;
      }

      _this.ajax({
        method: "POST",
        url: resourceUrl + "/Order/batchFinishOrder",
        dataType: "JSON",
        data: {
          Orders: order.map(function(item) {
            return {
              cloudShopId: item.cloudShopId,
              shopOrderId: item.shopOrderId
            };
          })
        },
        success: function(data) {
          if (data.Header.ErrorCode == 0) {
            _this.reload();
          } else {
            Toast(data.Header.Message);
          }
        }
      });
    }
  }
};
</script>

<style>
@import url("../../assets/css/app.css");
@import url("../../assets/css/receivablesorderstyle.css");
@import url("../../assets/css/paymentPop.css");

.ec-bottom {
  padding-bottom: 0.4rem;
}
</style>
