<template>
  <div class="ec-receivablesOrderPage" style="padding-bottom: 0.4rem">
    <!-- 月结订单 -->
    <!--ec-monthSettlement-->
    <div class="ec-daySettlement" v-show="monthOrderInfo.length>0">
      <div class="ec-settlementTitle">
        <span></span>
        <p>月结帐单</p>
      </div>
      <!-- 单个订单 -->
      <div class="ec-receivablesOrderOne" v-for="(order,index) in monthOrderInfo" :key="index">
        <p>{{order.cloudShopName}}</p>
        <div class="ec-orderMain">
          <dl>
            <dt>
              <p>{{order.carInfo}}</p>
              <span>{{order.vinCode}}</span>
            </dt>
            <dd>
              <p>{{order.paymentMethod}}</p>
              <span>{{order.createTime}}</span>
            </dd>
          </dl>
        </div>
        <div class="ec-orderMainTable">
          <div class="ec-orderTableTop">
            <!--<p>共40件商品，合计￥300元整</p>-->
            <!--<a href="">查看详情</a>-->
          </div>
          <div class="ec-orderTable">
            <table cellpadding="0" cellspacing="0" border="0">
              <thead>
              <tr>
                <td class="ec-tdName">商品信息</td>
                <td class="ec-tdNumber">数量</td>
                <td class="ec-tdPrice">价格</td>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(detail,index) in order.wareDetail" :key="ind">
                <td class="ec-tdName">{{detail.brandName}} {{detail.categoryName}} {{detail.wareName}}</td>
                <td class="ec-tdNumber">{{detail.wareCount}}</td>
                <td class="ec-tdPrice">{{detail.warePrice}}</td>
              </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!--无数据情况-->
    <div class="ec-noData" v-show="monthOrderInfo.length==0">暂无数据</div>
  </div>
</template>

<script>
  import {commonMixin} from '../../config/base/commonMixin.js'
  import {Toast} from 'mint-ui'

  var resourceUrl = process.env.apiDomain

  export default {
    name: 'receivableOrderDisplay',
    mixins: [commonMixin],
    data() {
      return {
        monthOrderInfo: [],
        sRepairDepotDetailId: this.getQueryString('sRepairDepotDetailId'), //订单id
        // wareId: this.getQueryString('wareId') // 商品id
      }
    },
    created() {
      this.setTitle('月结账单')
    },
    mounted() {
      this.nativeLsitenBack('native_CloseWebview')

      this.GetBillWareForOrderDetail()
    },
    methods: {
      //获取月结详情列表
      GetBillWareForOrderDetail(){
        var _this = this;
        _this.ajax({
          method: 'POST',
          url: resourceUrl + '/Bill/GetBillWareForOrderDetail',
          dataType: 'JSON',
          data: {
            sRepairDepotId: _this.sRepairDepotDetailId,
            // wareId: _this.wareId // 支付渠道ID
          },
          success:function(str){
            if(str.Header.ErrorCode == 0){
              _this.monthOrderInfo = str.Body.orders
            }else {
              Toast(str.Header.Message)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/receivablesorderstyle.css");
</style>
