<template>
  <!--收银台-->
  <div class="dm-paymentPop" v-show="isshow">

    <div class="dm-paymentBox">
      <div class="dm-paymentTitle">
        <p>收银台</p>
        <!--<a @click="isshow=false">×</a>-->
      </div>
      <div class="dm-paymentMain">
        <div class="el-paymentTotalBox" v-show="titletext>0">
          <p>付款总金额</p>
          <span>￥<b>{{titletext}}</b></span>
        </div>
        <div class="dm-paymentMode" v-for="(item,index) in dataList" :key="index" :class="{'dm-paymentModeNoLink':item.IsPostPay==false}" @click="item.IsPostPay==true?payType(item):''">
          <span><img :src="item.ChannelImg"></span>
          <div class="dm-paymentModeMain">
            <dl>
              <dt>{{item.ChannelName}}</dt>
              <dd>{{item.ChannelDesc}}</dd>
            </dl>
          </div>
          <div class="dm-byStagesBox" v-if="item.SubChannel">
            <ul>
              <li v-for="(i,ind) in item.SubChannel" :class="{'dm-selected':ind==0}" @click.stop="i.IsPostPay==true?payType(i):''">
                <p>{{i.ChannelName}}</p>
                <span v-html="i.ChannelDesc"></span>
              </li>
            </ul>
          </div>
        </div>
        <!--<div class="dm-paymentMode">-->
          <!--<span><img src="../assets/images/icon_huabei.png"></span>-->
          <!--<div class="dm-paymentModeMain">-->
            <!--<dl>-->
              <!--<dt>花呗月结</dt>-->
              <!--<dd>当月付，下月还</dd>-->
            <!--</dl>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="dm-paymentMode">-->
          <!--<span><img src="../assets/images/icon_zhifubao.png"></span>-->
          <!--<div class="dm-paymentModeMain">-->
            <!--<dl>-->
              <!--<dt>现金结</dt>-->
              <!--<dd></dd>-->
            <!--</dl>-->
          <!--</div>-->
        <!--</div>-->


      </div>
      <div class="dm-paymentNo" >
        <a @click="tonoPay">暂不支付</a>
      </div>
      <!-- <div class="dm-paymentFool">
          <a href="">付款</a>
      </div> -->
    </div>

  </div>
</template>

<script>
  export default {
    name: "paymentPop",
    data(){
      return {
        isshow:false,
        dataList:[],
        resultdataInfo:null,
        titletext:''
      }
    },
    methods:{
      show(data){
        this.isshow = true;
        this.resultdataInfo = data;
      },
      hide(){
        this.isshow = false;
      },
      setValue(data){
        this.dataList=data.PayList;
        this.titletext = data.PayMoney
      },
      selected(){

      },
      tonoPay(){
        this.$emit("tonoPay",this.resultdataInfo);
      },
      payType(type){
        this.$emit("payType",this.resultdataInfo,type);
      }
    }

  }
</script>

<style>
  @import url("../assets/css/paymentPop.css");
</style>
