<template>
  <div class="es-exchangeIntegralPage">

    <!-- 单个积分记录 -->
    <!--<div class="el-integralDetailsBox" v-for="(item) in list" :key="index" v-if="list.length>0" v-show="false">-->
      <!--<p>{{item.createTime}}</p>-->
      <!--<div class="el-integralDetailsMain">-->
        <!--<p class="el-carBox">{{item.autoInfo}}</p>-->
        <!--<p class="el-vinBox">VIN码：{{item.vinCode}}</p>-->
        <!--<span>{{item.score}}</span>-->
      <!--</div>-->
    <!--</div>-->
    <div class="es-exchangeIntegralOneBox" v-for="(item) in list" :key="index" v-if="list.length>0" @click="toMaintainRecord(item)">
      <dl>
        <dt>
          <p>{{item.autoInfo}}</p>
          <span v-show="item.score!='0'">{{item.score}}<b>积分</b></span>
        </dt>
        <dd>
          <p>VIN码：{{item.vinCode}}</p>
          <span>{{item.createTime}}</span>
        </dd>
      </dl>
    </div>
    <div class="ec-noData" v-if="list.length==0">暂无数据</div>
  </div>
</template>

<script>
  import {commonMixin} from '../../config/base/commonMixin.js';
  import {Toast} from "mint-ui";

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "integralDetails",
    mixins: [commonMixin],
    created(){
      // this.setTitle('已送出积分');
    },
    mounted(){
      var _this = this;
      //获取详情信息
      _this.LoadComplete(function(){
        _this.nativeLsitenBack();
        if(_this.type==0){
          _this.GetRepairDepotSendScoreList();
          _this.setTitle('已送出积分');
        }else {
          _this.setTitle('已兑换积分');
          _this.GetCustomerUseScoreList();
        }
      })
      this.$nextTick(function () {
        $('html,body').animate({scrollTop: 0}, 800)
      })


    },
    data(){
      return {
        list:[],
        type:this.getQueryString('type')
      }
    },
    methods:{
      GetRepairDepotSendScoreList(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/RepairDepot/GetRepairDepotSendScoreList",
          dataType: "JSON",
          success:function(str) {
            if (str.Header.ErrorCode == 0) {
              _this.list = str.Body

            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      GetCustomerUseScoreList(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/RepairDepot/GetCustomerUseScoreList",
          dataType: "JSON",
          success:function(str) {
            if (str.Header.ErrorCode == 0) {
              _this.list = str.Body

            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      toMaintainRecord(data){
        var baseUrl = window.location.protocol + "//" + window.location.host + "/maintainRecord.html?cf=1&v=" + data.vinCode+'&mainrecid=' + data.maintainRecordId;
        window.location.href = baseUrl;
      }

    }
  }
</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/mypointsstyle.css");
</style>
