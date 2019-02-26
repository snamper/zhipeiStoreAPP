<template>
  <div class="aa-carAdaptation" v-show="isshow">

    <div class="maskBox"></div>

    <div class="aa-carAdaptationBox aa-shopPop" style="/* display: block; */">
      <div class="aa-carPopHead">
        <p>确认收货地址</p>
        <a @click="close">×</a>
      </div>
      <div class="cj-ReceivingAdd">

        <div class="cj-remindText">兑换后将直接发货给您，请先确认收货信息是否有误</div>

        <div class="cj-receivingAddMain">
          <ul>
            <li><input type="" name="" placeholder="收货人姓名" v-model="addressInfo.realName"></li>
            <li><input type="" name="" placeholder="手机号码" v-model="addressInfo.mobile"></li>

            <li><input type="" name="" placeholder="详细地址" v-model="addressInfo.companyAddress"></li>
          </ul>
        </div>
      </div>
      <div class="cj-popFool">
        <a @click="submit">确定</a>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "addressInfo",
    data(){
      return {
        isshow:false,
        addressInfo:{}
      }
    },
    methods:{
      show(){
        this.isshow=true;
      },
      hide(){
        this.isshow=false;
      },
      close(){
        this.hide();
      },
      setValue(data){
        this.addressInfo = data;
      },
      submit(){
        this.$emit("addresSubmit",this.addressInfo);
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/css/app.css");

  .cj-ReceivingAdd {
    width: 100%;
    float: left;
    clear: left;
  }

  .cj-remindText {
    width: 100%;
    padding: 0 .32rem;
    font-size: .36rem;
    line-height: .96rem;
    text-align: left;
    color: #e74c3c;
    float: left;
    clear: left;
  }

  .cj-receivingAddMain {
    width: 100%;
    border-top: 1px solid #dce6ef;
    float: left;
    clear: left;
  }

  .cj-receivingAddMain li {
    width: 100%;
    height: 1.28rem;
    padding: 0 .32rem;
    background: #fff;
    border-bottom: 1px solid #dce6ef;
    float: left;
    clear: left;
    position: relative;
  }

  .cj-receivingAddMain li input {
    width: 100%;
    height: 1rem;
    margin: .14rem 0;
    border: none;
    background: #fff;
    font-size: .36rem;
    line-height: 1rem;
    text-align: left;
    color: #333;
    float: left;
    clear: left;
  }

  .cj-receivingAddMain li input::-webkit-input-placeholder {
    color: #bcbcbc;
  }

  .cj-receivingAddMain li.cj-rangeAdd {
    /*background: #fff url(../assets/images/arrow_link_gray.png) no-repeat 9.2rem center;*/
    background-size: .48rem;
  }

  .cj-receivingAddMain li.cj-rangeAdd span {
    height: 1.28rem;
    border: none;
    background: #fff;
    font-size: .36rem;
    line-height: 1.28rem;
    text-align: left;
    color: #bcbcbc;
  }

  .cj-receivingAddMain li.cj-rangeAdd span.cj-selected {
    color: #333;
  }

  .cj-popFool {
    width: 100%;
    float: left;
    clear: left;
  }

  .cj-popFool a {
    width: 100%;
    height: 1.28rem;
    background: #d53533;
    font-size: .48rem;
    line-height: 1.28rem;
    text-align: center;
    color: #fff;
    float: left;
    clear: left;
  }
</style>
