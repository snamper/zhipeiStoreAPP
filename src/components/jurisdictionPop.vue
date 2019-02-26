<template>
  <div class="ec-jurisdictionPop" v-if="isshow">
    <div class="ec-jurisdictionPopBox" v-show="type">
      <dl>
        <dt>{{shareText}}</dt>
        <dd class="ec-button" @click="share"><a>立即分享</a></dd>
      </dl>
      <a @click="hide()">×</a>
    </div>

    <div class="ec-jurisdictionPopBox ec-jurisdictionPopBoxTextNo" v-show="!type">
      <dl>
        <!--<dt>{{shareText}}</dt>-->

        <dd class="ec-button" @click="patment"><a>付费查看<b>(8元/月)</b></a></dd>
        <dd class="ec-link" @click="share"><a>继续分享</a></dd>

      </dl>
      <a @click="hide()">×</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "jurisdictionPop",
    data(){
      return {
        isshow:false,
        list:{},
        type:false,
        shareText:''
      }
    },
    methods:{
      show(){
        this.isshow = true;
      },
      hide(){
        this.isshow = false;
      },
      setValue(data,type,shareText){
        this.list = data;
        this.type = type;
        this.shareText = shareText
      },
      share(){
        this.$emit('weixinshare',this.list);
      },
      patment(){
        this.$emit('weinxinmayment',this.list);
      }
    }

  }
</script>

<style scoped>

</style>
