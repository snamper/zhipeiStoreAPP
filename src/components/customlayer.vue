<template>
  <div class="cr-customer" v-if="isShow">
    <div class="cr-box weat">
      <span class="cr-img cr-weat"></span>
      <p class="pwet">排队中...</p>
      <span class="cr-font cr-fontweat" v-show="status" style="display: block">您有{{value}}次免排队特权</span>
      <div v-show="enable" @click="tostep">有特权可免排队，去领取&gt;&gt;</div>
      <span class="button" @click="shubit" v-show="btn">立即使用</span>
    </div>
    <a @click="hide"></a>
  </div>
</template>

<script>
  export default {
    name: "customlayer",
    data(){
      return {
        isShow:false,
        status:true,
        enable:true,
        value:0,
        btn:true,
        brandUrl:'',
        type:'',
        brandName:'',
        brandId:''
      }
    },
    methods:{
      show(brandUrl, type, brandName,brandId){

        this.isShow =true;
        this.brandUrl = brandUrl;
        this.type = type;
        this.brandName = brandName;
        this.brandId=brandId
      },
      hide(){
        this.isShow =false;
        this.$emit("hide");
      },
      setValue(data){
        this.value=data;
      },
      shubit(){
        this.$emit("Submit",this.brandUrl,this.type,this.brandName,this.brandId);
      },
      butHide(){
        this.btn=false
      },
      tostep(){
        this.$emit("tostep");
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/css/app.css");
  @import url("../assets/css/customer.css");
</style>
