<template>
  <div class="el-myPointsPage">

    <!-- 积分展示 -->
    <div class="el-myPointsBox">
      <!-- 送出的积分公式 -->
      <div class="el-myPointsMain">
        <div class="el-pointsBox">
          <p>送出的积分</p>
          <span><b>{{pointData.repairDepotSendScore}}</b></span>
          <a @click="toIntegralDetailPage(0)">详情</a>
        </div>
        <span class="el-minusSign"></span>
        <div class="el-pointsBox">
          <p>车主已兑换</p>
          <span><b>{{pointData.customerUseScore}}</b></span>
          <a @click="toIntegralDetailPage(1)">详情</a>
        </div>
        <span class="el-equalSign"></span>
        <div class="el-pointsBox">
          <p>车主未兑换</p>
          <span><b>{{pointData.customerValidScore}}</b></span>
        </div>
      </div>
      <!-- 红色的等号 -->
      <div class="el-equalSignRed"></div>
      <!-- 抵用的积分公式 -->
      <div class="el-myPointsMain el-pointsOffsetBox">
        <div class="el-pointsBox">
          <p>可抵用积分</p>
          <span><b>{{pointData.repairDepotSendScore}}</b></span>
        </div>
        <span class="el-minusSign"></span>
        <div class="el-pointsBox">
          <p>已抵用积分</p>
          <span><b>{{pointData.repairDepotUseScore}}</b></span>
          <a @click="tointegralDeductionDetails">详情</a>
        </div>
        <span class="el-equalSign"></span>
        <div class="el-pointsBox el-pointsOffset">
          <p>剩余可用积分</p>
          <span><b>{{pointData.repairDepotValidScore}}</b></span>
          <span class="el-equalSignRedText">{{pointData.repairDepotValidScoreMoney}}</span>
        </div>
      </div>
      <!-- 底部文案信息 -->
      <div class="el-equalExplain">向您的供货商采购在线支付时，直接抵现金使用。</div>
    </div>

    <!-- slogan展示 -->
    <!-- <div class="el-sloganBox"></div> -->

    <!-- 如何得积分 -->
    <div class="eo-myPointsPic">
      <img src="../../assets/images/mypoints_pic_01.png">
      <img src="../../assets/images/mypoints_pic_02.png">
      <img src="../../assets/images/mypoints_pic_03.png">
      <img src="../../assets/images/mypoints_pic_04.png">
      <img src="../../assets/images/mypoints_pic_05.png">
      <img src="../../assets/images/mypoints_pic_06.png">
    </div>

  </div>
</template>

<script>
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  import {
    Toast
  } from "mint-ui";

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "myPoints",
    mixins: [commonMixin],
    created() {

    },
    mounted() {
      var _this = this;
      _this.LoadComplete(function () {
        _this.nativeLsitenBack('native_CloseWebview');
        _this.setTitle('我的积分');
        _this.GetRepairDepotScore();
      })

    },
    data() {
      return {
        pointData: {}
      }
    },
    methods: {
      toIntegralDetailPage(type) {
        var baseUrl = window.location.protocol + "//" + window.location.host + "/integralDetails.html?cf=1&type=" + type;
        window.location.href = baseUrl;
      },
      tointegralDeductionDetails(){
        var baseUrl = window.location.protocol + "//" + window.location.host + "/integralDeductionDetails.html?cf=1";
        window.location.href = baseUrl;
      },

      //获取积分信息
      GetRepairDepotScore() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/RepairDepot/GetRepairDepotScore",
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.pointData = str.Body
            } else {
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
  @import url("../../assets/css/mypointsstyle.css");

</style>
