<template>
  <div id="maintainRecordPay">
    <div v-if="info" class="ed-paymentPage">
      <!-- 总金额 -->
      <div class="ed-paymentMoney">
        <p>支付金额</p>
        <span>{{info.amountText}}</span>
        <span class="ed-integralPrice">{{info.viewAmount}}</span>
      </div>
      <!-- 支付信息 -->
      <div class="ed-paymentExplain">
        <ul>
          <li>
            <span>门店：</span>
            <p>{{info.repairDepotName}}</p>
          </li>
          <li>
            <span>地址：</span>
            <p>{{info.repairDepotAddress}}</p>
          </li>
          <li>
            <span>车型：</span>
            <p>{{info.vinCodeDesc}}</p>
          </li>
          <li>
            <span>VIN码：</span>
            <p>{{info.vinCode}}</p>
          </li>
        </ul>
      </div>
      <!-- 支付按钮 -->
      <div class="ed-paymentButton">
        <a href="javascript:;" @click="goPay">立即支付</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Toast
  } from 'mint-ui';
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainRecordPay",
    mixins: [commonMixin],
    components: {},
    created() { },
    mounted() {
      this.init();
    },
    data() {
      return {
        cacheKey: this.getQueryString('key'),
        info: null
      }
    },
    methods: {
      init() {
        var _this = this;

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetPaymentCache",
          dataType: "JSON",
          data: {
            cacheKey: _this.cacheKey,
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }
            _this.info = res.Body;
          }
        });
      },
      goPay() {
        var _this = this;

        if (!_this.isAliPay()) {
          Toast("请在支付宝内操作");
          return;
        }

        var gotoMaintainRecordReader = function () {
          ap.redirectTo({
            url: window.location.protocol + "//" + window.location.host + "/maintainRecordReader.html",
            data: {
              vin: _this.info.vinCode,
              rdk: _this.info.repairDepotKeeperId,
              agentticket: _this.info.agentTicket,
            }
          });
        }

        _this.ajax({
          method: "POST",
          url: resourceUrl + '/MaintainRecord/GetPaymentString',
          data: {
            cacheKey: _this.cacheKey,
          },
          dataType: "JSON",
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }
            ap.tradePay({
              orderStr: res.Body
            }, function (res) {
              if (res.resultCode != 9000) return; //9000:订单支付成功

              //支付成功后跳转保养记录页
              ap.showToast({
                content: '支付成功',
              }, function () {
                try {
                  // 判断是否运行在小程序环境里
                  my.getEnv(function (res) {
                    if (res.miniprogram) {
                      my.postMessage({
                        action: "saveStorage",
                        vin: _this.info.vinCode,
                        rdk: _this.info.repairDepotKeeperId,
                        agentticket: _this.info.agentTicket
                      });
                      setTimeout(() => {
                        gotoMaintainRecordReader();
                      }, 2000);
                    } else {
                      gotoMaintainRecordReader();
                    }
                  });
                } catch (e) {
                  gotoMaintainRecordReader();
                }

              });
            });
          }
        })
      }
    }
  }

</script>

<style scoped>
</style>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/maintainRecordPay.css");
</style>