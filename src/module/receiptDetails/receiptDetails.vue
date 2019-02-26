<template>
  <div class="eg-receiptDetailsPage">
    <!-- 店铺名称及月份 -->
    <div class="eg-receiptDetailsShop">
      <p>{{cloudShopName}}</p>
      <span>{{billDate}}</span>
    </div>
    <!-- 收款单详情 -->
    <div class="eg-receiptDetailsMain">
      <div class="eg-receiptDetailsOne" v-for="(item,index) in wares" :key="index" v-if="wares.length>0">
        <dl>
          <dt @click="toreceivablesOrder(item)">{{item.brandName}} {{item.categoryName}} {{item.wareName}}</dt>
          <dd>
            <div class="eg-dataNameBox">
              <span class="eg-number">数量</span>
              <span class="eg-unitPrice">单价</span>
              <span class="eg-totalPrice">总价</span>
            </div>
            <div class="eg-dataMainBox" v-for="(it,ind) in item.wareDetail" :key="ind" :class="[it.wareCount<0?'eg-dataMainRed':'eg-dataMainBlack']">
              <span class="eg-number">{{it.wareCount}}</span>
              <span class="eg-unitPrice">{{it.warePrice}}</span>
              <span class="eg-totalPrice">{{it.totalPrice}}</span>
            </div>
          </dd>
        </dl>
      </div>
    </div>
    <!-- 收款单底部按钮 -->
    <div class="eg-receiptDetailsFool" v-show="statementStatus==5">
      <div class="eg-left">
        <dl>
          <dt>
            <p>共{{totalWareCount}}件商品，合计：</p>
            <span>{{totalAmount}}</span>
          </dt>
          <dd><a @click="contactMerchant(shopMobile)">如有问题，请联系商家确认</a></dd>
        </dl>
      </div>
      <a class="eg-receiptDetailsButton" @click="payment">确认无误，进行付款</a>
    </div>

    <paymentPop ref="paymentPop" v-on:tonoPay="tonoPay" v-on:payType="payType"></paymentPop>

    <!--新的支付收银台-->
    <newCashDesk ref="newCashDesk" v-bind:subData="subData" v-if="newCashDeskShow"
                 v-on:paymentCallback="paymentCallback" v-on:cancelPayment="cancelPayment" v-bind:modalType="1"></newCashDesk>
  </div>
</template>

<script>
  import {commonMixin} from '../../config/base/commonMixin.js'
const paymentPop = r => require.ensure([], () => r(require('../../components/paymentPop')));
  import newCashDesk from '../../components/newCashDesk'
var resourceUrl = process.env.apiDomain
import { Toast} from 'mint-ui'
export default {
    name: 'receiptDetails',
    mixins: [commonMixin],
    components: {
      paymentPop,
      newCashDesk
    },
    data () {
      return {
        sRepairDepotId: this.getQueryString('sRepairDepotId'),
        cloudShopName: '',
        billDate: '',
        totalAmount: '',
        totalWareCount: '',
        wares: [],
        shopMobile:'', //商家电话号码
        statementStatus:0,  //5表示未支付10已支付
        newCashDeskShow:false,
        subData:{},
      }
    },
    created () {
      this.setTitle('收款单详情')
  },
    mounted () {
      var _this = this
      _this.nativeLsitenBack()
      // 获取单个收款订单详情；
      _this.GetRepairDepotBillDetail()
  },
    methods: {
      //支付回调
      paymentCallback(){
        // this.newCashDeskShow = false;
        window.location.reload()
      },
      cancelPayment(){
        this.newCashDeskShow = false;
      },
      //联系商家
      contactMerchant(tel){
        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_CallPhone', tel, function (response) {
          })
        })
      },
      // 获取订单详情
      GetRepairDepotBillDetail () {
        var _this = this
        _this.ajax({
          method: 'POST',
          url: resourceUrl + '/Bill/GetRepairDepotBillDetail',
          dataType: 'JSON',
          data: {
            sRepairDepotId: _this.sRepairDepotId
          },
          success:function(str){
            if (str.Header.ErrorCode === 0) {
              _this.cloudShopName = str.Body.cloudShopName
              _this.billDate = str.Body.billDate
              _this.totalAmount = str.Body.totalAmount
              _this.totalWareCount = str.Body.totalWareCount
              _this.wares = str.Body.wares
              _this.shopMobile = str.Body.shopMobile
              _this.statementStatus = str.Body.statementStatus
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //页面跳转
      toreceivablesOrder (data) {
        var _this = this
        var baseUrl = window.location.protocol + '//' + window.location.host + '/receivableOrderDisplay.html?cf=1&sRepairDepotDetailId=' + _this.sRepairDepotId
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {url: baseUrl}, function (response) {})
        })
        // window.location.href = baseUrl
      },
      //确认无误，进行付款
      payment () {
        var _this = this
        this.newCashDeskShow = true;
        this.subData={
          sRepairDepotId:_this.sRepairDepotId,
        }
      },
      tonoPay () {
        var _this = this
        _this.$refs.paymentPop.hide()
      },
      payType (data, type) {
        var _this = this
        _this.ajax({
          method: 'POST',
          url: resourceUrl + '/Bill/PayRepairDepotBill',
          dataType: 'JSON',
          data: {
            sRepairDepotId: _this.sRepairDepotId,
            channelID: type.ChannelID // 支付渠道ID
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.setRedPacketPay(str.Body)
            }
          }
        })
      },
      // 调用支付宝接口
      setRedPacketPay (key) {
        var _this = this
        var data = {
          payType: 1, // 1支付宝，2微信，3银联
          credential: key
        }
        if (_this.androidOrios() == 1) {
          data = JSON.stringify(data)
        }
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_Pay', data, function (response) {
            var response = response

            if (_this.androidOrios() == 1) {
              response = JSON.parse(response)
            }
            if (response.payResult == 1) {
              window.location.reload()
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/receiptstyle.css");
  @import url("../../assets/css/paymentPop.css");
</style>
