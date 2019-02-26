<template>
  <div class="es-exchangeIntegralPage">

    <!-- 单个积分记录 -->
      <div class="es-exchangeIntegralOneBox es-deductionIntegralOneBox" :class="{'es-vinSetMeal':itme.jumpUrl==''}" v-for="(itme,index) in list" :key="index">
        <dl @click="toOrderDetails(itme)">
          <dt>
            <p>{{itme.scoreTitle}}</p>
            <span :class="{'es-plusIntegral':itme.scoreType==3}">{{itme.scoreText}}</span>
          </dt>
          <dd>
            <p>{{itme.scoreMemo}}</p>
            <span>{{itme.createTime}}</span>
          </dd>
        </dl>
      </div>
    <!-- 单个积分记录 -->
    <!--<div class="es-exchangeIntegralOneBox es-deductionIntegralOneBox">-->
      <!--<dl>-->
        <!--<dt>-->
          <!--<p>积分退还（取消订单）</p>-->
          <!--<span class="es-plusIntegral">+1000<b>积分 (抵扣 10 元)</b></span>-->
        <!--</dt>-->
        <!--<dd>-->
          <!--<span>2018.12.21</span>-->
        <!--</dd>-->
      <!--</dl>-->
    <!--</div>-->
    <div class="ec-noData" v-if="list.length==0">暂无数据</div>
  </div>
</template>

<script>
  import {commonMixin} from '../../config/base/commonMixin.js';
  import {Toast} from "mint-ui";

  var resourceUrl = process.env.apiDomain;
    export default {
      name: "integralDeductionDetails",
      mixins: [commonMixin],
      created(){
      },
      mounted(){
        var _this = this;
        _this.nativeLsitenBack();
        _this.GetRepairDepotUseScoreList();
        _this.setTitle('已抵用积分');


      },
      data(){
        return {
          list:[],
        }
      },
      methods:{
        GetRepairDepotUseScoreList(){
          var _this = this;
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/RepairDepot/GetRepairDepotUseScoreList",
            dataType: "JSON",
            success:function(str) {
              if (str.Header.ErrorCode == 0) {
                _this.list= str.Body

              } else {
                Toast(str.Header.Message)
              }
            }
          })
        },
        toOrderDetails(data){
          var baseUrl = data.jumpUrl;
          if(baseUrl){
            // window.location.href = baseUrl;
            this.setupWebViewJavascriptBridge(function (bridge) {
              bridge.callHandler('native_JumpUrl', {url: baseUrl}, function (response) {});
            });
          }

        }
      }
    }
</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/mypointsstyle.css");
</style>
