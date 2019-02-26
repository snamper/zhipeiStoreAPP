<template>
  <div class="eg-receiptListPage">
    <!-- 单个月份的收款单 -->
    <div class="eg-receiptMainMonth" v-for="(item,index) in shopBillList" :key="index" v-if="shopBillList.length>0">
      <div class="eg-receiptMonthTitle">
        <p>{{item.billDate}}</p>
        <span>合计：<b>{{item.totalAmount}}</b></span>
      </div>
      <div class="eg-receiptListBox" v-show="item.shopBill.length>0">
        <ul>
          <li v-for="(it,ind) in item.shopBill" :key="ind" @click="toReceiptDetails(it)">
            <p>{{it.cloudShopName}}</p>
            <span class="eg-price">{{it.payableAmount}}</span>
            <!--0  5未结算10已结算-->
            <span class="eg-labelBox" :class="[it.statementStatus==10?'eg-alreadyClear':'eg-uncleared']"></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="ec-noData" v-if="shopBillList.length==0">暂无数据</div>
  </div>
</template>

<script>
  import {commonMixin} from '../../config/base/commonMixin.js';
  var resourceUrl = process.env.apiDomain;
  import { Toast} from "mint-ui";
  export default {
    name: "receiptList",
    mixins: [commonMixin],
    data(){
      return {
        shopBillList:[],
      }
    },
    created(){
      this.setTitle("收款单");
    },
    mounted(){
      var _this = this;
      _this.nativeLsitenBack('native_CloseWebview');
      //兼容ios返回更新数据
      _this.LoadComplete(function(){
        if (_this.androidOrios() != 2){
          _this.getReceiptList()
        }
      })
      //获取收款单列表
      _this.getReceiptList()

    },
    methods:{
      getReceiptList(){
        var _this = this;

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Bill/GetRepairDepotBillList",
          dataType: "JSON",
          success:function(str){
            if(str.Header.ErrorCode ==0){
              _this.shopBillList = str.Body;
            }else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      toReceiptDetails(data){
        var _this = this;
        var baseUrl = window.location.protocol + "//" + window.location.host + "/receiptDetails.html?cf=1&sRepairDepotId=" + data.sRepairDepotId
        window.location.href = baseUrl;
        // _this.setupWebViewJavascriptBridge(function (bridge) {
        //   bridge.callHandler('native_JumpUrl', {url: baseUrl}, function (response) {})
        // })
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/receiptstyle.css");
</style>
