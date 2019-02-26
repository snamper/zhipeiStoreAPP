<template>
  <div id="ycfLanding">
  </div>
</template>

<script>
  import {
    Toast
  } from 'mint-ui';
  import {
    MessageBox
  } from 'mint-ui';
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "ycfLanding",
    mixins: [commonMixin],
    components: {},
    created() {
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        action: this.getQueryString('action'),
        cacheKey: this.getQueryString('cachekey'),
        vin: this.getQueryString('vin'),
        repairDepotKeeperId: this.getQueryString('rdk'),
        agentTicket: this.getQueryString('agentticket'),
      }
    },
    methods: {
      init() {

        var _this = this;

        //去保养记录页
        var gotoMaintainRecordReader = function (vin, repairDepotKeeperId, agentTicket) {
          window.location.href = window.location.protocol + "//" + window.location.host + "/maintainRecordReader.html?vin=" + vin + "&rdk=" + repairDepotKeeperId + "&agentticket=" + agentTicket;
        }

        if (this.action == "pay") {
          //去支付
          if (!this.cacheKey) {
            MessageBox.alert('数据异常!');
          } else {
            // //去支付
            // window.location.href = window.location.protocol + "//" + window.location.host + "/maintainRecordPay.html?key=" + this.cacheKey;

            //去保养记录页
            //cachKey的结构是"vinCode|repairDepotKeeperId|agentTicket"
            var splitResult = this.cacheKey.split("|");
            var myVin = splitResult[0] || "";
            var myRepairDepotKeeperId = splitResult[1] || "";
            var myAgentTicket = splitResult[2] || "";

            try {
              my.getEnv(function (res) {
                if (res.miniprogram) {
                  // 运行在小程序环境里
                  my.postMessage({
                    action: "saveStorage",
                    vin: myVin,
                    rdk: myRepairDepotKeeperId,
                    agentticket: myAgentTicket
                  });
                }
              });
            } catch (e) {
            }

            gotoMaintainRecordReader(myVin, myRepairDepotKeeperId, myAgentTicket);
          }
        } else {
          if (!this.vin || !this.repairDepotKeeperId || !this.agentTicket) {

            // 测试环境
            // this.repairDepotKeeperId = "67";
            // this.agentTicket = "2596B26C78BEC4DA5C697BF433BB1C295835DD5BE874FCFD8F084DA753E94C78C0DE433940364E80";

            // 公网环境
            this.repairDepotKeeperId = "42570";
            this.agentTicket = "F59CFDD1B419E95A4662F5142FF505FB6A8D3FA7D58AC4DEFE7F83D6A16946C88F9E543A1898DADF";

            //去养车付首页
            window.location.href = window.location.protocol + "//" + window.location.host + "/ycfHomepage.html?rdk=" + this.repairDepotKeeperId + "&agentticket=" + this.agentTicket;
          } else {
            //去保养记录页
            gotoMaintainRecordReader(this.vin, this.repairDepotKeeperId, this.agentTicket);
          }

        }
      }
    }
  }

</script>
<style>
  .box {
    text-align: center;
    color: #999;
    padding-top: 5rem;
    font-size: .5rem;
  }
</style>