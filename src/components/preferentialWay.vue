<template>
  <div class="el-discountChoicePop" v-if="isShow">
    <div class="el-discountChoiceBox">
      <div class="el-discountChoiceMain el-couponPopBox">
        <dl>
          <dt>
            <p>请选择优惠方式</p>
            <span>您的可用积分：<a>{{validScore}}</a></span>
          </dt>
          <dd class="el-integralNo">
            <p v-show="scoreHelpText">{{scoreHelpText}}</p>
            <a @click="tomyPoints">如何赚积分？</a>
          </dd>
          <dd>
            <div class="el-couponBox" v-for="(item,index) in list" :key="index" v-show="list.length>0">
              <template v-if="item.type==1">
                <span></span>
                <div class="el-couponMainBox">
                  <p>积分立抵<b>{{item.spendScoreAmountText}}</b>元，使用<b>{{item.spendScore}}</b>积分</p>
                  <span>最高可抵<b>{{item.maxScoreAmountText}}</b>元，需要<b>{{item.maxScore}}</b>积分</span>
                  <span class="el-couponChoice" :class="judge(item)" @click="Choice(item)" ></span>
                </div>
              </template>
              <template v-if="item.type==2">
                <span></span>
                <div class="el-couponMainBox">
                  <template v-if="item.maxScore>0">
                    <p>免息分期支付（3期）+ 积分立抵<b>{{item.spendScoreAmountText}}</b>元</p>
                    <span>最高可抵<b>{{item.maxScoreAmountText}}</b>元，需要<b>{{item.maxScore}}</b>积分</span>
                  </template>
                  <template v-else>
                    <p>免息分期支付（3期）</p>
                    <span></span>
                  </template>
                  <span class="el-couponChoice" :class="judge(item)" @click="Choice(item)"></span>
                </div>
              </template>
              <template v-if="item.type==3">
                <span></span>
                <div class="el-couponMainBox">
                  <template v-if="item.maxScore>0">
                    <p>免息分期支付（6期）+ 积分立抵<b>{{item.spendScoreAmountText}}</b>元</p>
                    <span>最高可抵<b>{{item.maxScoreAmountText}}</b>元，需要<b>{{item.maxScore}}</b>积分</span>
                  </template>
                  <template v-else>
                    <p>免息分期支付（6期）</p>
                    <span></span>
                  </template>
                  <span class="el-couponChoice" :class="judge(item)" @click="Choice(item)" ></span>
                </div>
              </template>
            </div>
            <div class="el-couponBox el-discountNo">
              <span></span>
              <div class="el-couponMainBox">
                <p>不使用优惠</p>
                <span class="el-couponChoice" :class="{'el-couponSelected':typeData.selected}" @click="ChoiceNo(typeData)"></span>
              </div>
            </div>
          </dd>
        </dl>
      </div>
      <div class="el-discountChoiceFool">
        <a @click="submit">确定</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Toast
  } from 'mint-ui';
  import { commonMixin } from "../config/base/commonMixin.js";
  export default {
    name: "preferentialWay",
    mixins: [commonMixin],
    data(){
      return {
        isShow:false,
        list:[],
        validScore:'',
        typeData:{  //默认不适用优惠
          type:0,
          spendScore:0,
          selected:false,
        },
        scoreHelpText:''
      }
    },
    methods:{
      tomyPoints(){
        var baseUrl = window.location.protocol + "//" + window.location.host + "/myPoints.html?cf=1"

        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_JumpUrl", {url: baseUrl}, function (response) {});
        });
      },
      setValue(data,validScore,scoreHelpText){
        this.list = data;
        if(this.list.length==0){
          this.typeData.selected = true;
        }
        this.validScore = validScore;
        this.scoreHelpText = scoreHelpText
      },
      show(){
        this.isShow = true;
      },
      hide(){
        this.isShow = false;
        this.typeData.selected = false
      },
      submit(){
        var submitData={}; //需要提交的类型数据
        for(var i=0;i<this.list.length;i++){
          if(this.list[i].selected){
            submitData.type=this.list[i].type;
            submitData.spendScore = this.list[i].spendScore
          }
        }

        if(JSON.stringify(submitData) =="{}"){
          if(this.typeData.selected){
            submitData.type = this.typeData.type;
            submitData.spendScore = this.typeData.spendScore;
          }
        }
        if(JSON.stringify(submitData) =="{}"){
          Toast('请选择优惠方式');
          return;
        }
        this.$emit('ChoiceType',submitData)
      },
      judge(data){
        if(data.isEnable){
          if(data.selected){
            return 'el-couponSelected'
          }else {
            return ''
          }
        }else {
          return 'el-couponProhibit'

        }
      },
      Choice(data){
        if(data.isEnable){
          this.typeData.selected = false;
          for(var i=0;i<this.list.length;i++){
            this.list[i].selected = false;
            if(this.list[i].type == data.type){
              this.list[i].selected = true;
            }
          }
        }

      },
      ChoiceNo(obj){
        for(var i=0;i<this.list.length;i++){
          this.list[i].selected = false;
        }
        obj.selected = true;
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/css/preferentialWay.css");
</style>
