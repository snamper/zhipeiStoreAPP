<template>
  <!-- 国际品牌查询弹层 有免费天数 -->
  <div class="dh-pop" v-if="isShow">
    <div class="dh-popBox">
      <div class="dh-internationalPopMain">
        <dl>
          <dt v-if="count>0">您还可以查询国际品牌{{count}}天</dt>
          <dt v-else>您已不能查询国际品牌</dt>
          <dd><a class="dh-textLink" @click.stop="payInfo">付费详情</a></dd>
          <dd><a class="dh-button" @click.stop="applyInfo">获取免费查看国际目录机会</a></dd>
          <dd><a class="dh-knowLink" v-show="bottom" @click.stop="goIt">知道了</a></dd>
        </dl>
      </div>
      <a @click="hide"></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "dhPop",
    data(){
      return {
        isShow:false,
        count:0,
        bottom:true,
        brandUrl:'',
        type:'',
        brandName:'',
        brandId:'',
        access:''
      }
    },
    methods:{
      show(brandUrl, type, brandName,brandId,access){
        this.isShow = true;
        this.brandUrl = brandUrl;
        this.type = type;
        this.brandName = brandName;
        this.brandId=brandId;
        this.access = access
      },
      hide(){
        this.isShow = false;
      },
      setCount(data){
        if(data){
          this.count = data;
        }
      },
      setBottomHide(){
        this.bottom=false;
      },
      setBottomShow(){
        this.bottom=true;
      },
      payInfo(){
        this.$emit("payInfo");
      },
      applyInfo(){
        this.$emit("applyInfo",this.access);
      },
      goIt(){
        this.$emit("goIt",this.brandUrl,this.type,this.brandName,this.brandId);
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/css/shopChoose/paymentstyle.css");

</style>
