<template>

  <div class="dh-pop" v-if="isShow">
    <div class="dh-popBox">
      <span><a @click="hide()"></a></span>
      <div class="dh-internationalPopMain">
        <span><a></a> </span>
        <dl>
          <dt>仅高级用户才可以查看国际品牌目录</dt>
          <!--<dt v-else>继续查询国际品牌目录</dt>-->
          <dd>
            <!--<a class="dl-textLink" @click.stop="payInfo">付费查询</a>-->
            <a class="dl-button" @click.stop="applyInfo">请客服联系我</a>
          </dd>
        </dl>
      </div>
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
