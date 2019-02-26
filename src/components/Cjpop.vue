<template>
  <div class="cj-pop" v-show="isShow">
    <div class="cj-popBox">
      <p>
        <b>已成功兑换1桶机油</b>
        <span>会尽快为您送达</span>
      </p>
      <a class="cj-close" @click="close"></a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Cjpop",
    data(){
      return{
        isShow:false,
      }
    },
    methods:{
      close(){
        this.hide()
      },
      show(){
        this.isShow=true;
      },
      hide(){
        this.isShow=false;
      }
    }
  }
</script>

<style scoped>
  .cj-pop {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.48);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .cj-popBox {
    width: 84%;
    height: 6.52rem;
    background: #fff;
    border-radius: .32rem;
    margin-top: -2.76rem;
    position: fixed;
    left: 8%;
    top: 50%;
    z-index: 33;
  }

  .cj-popBox p {
    width: 100%;
    height: 6.52rem;
    padding-top: 1.6rem;
    float: left;
    clear: left;
  }

  .cj-popBox p b {
    width: 100%;
    height: 2.68rem;
    background: url(../assets/images/icon_success.png) no-repeat center top;
    background-size: 1.7rem;
    padding-top: 1.9rem;
    font-size: .44rem;
    line-height: .78rem;
    text-align: center;
    color: #1abc9c;
    display: block;
    float: left;
    clear: left;
  }

  .cj-popBox p span {
    width: 100%;
    font-size: .32rem;
    line-height: .64rem;
    text-align: center;
    color: #999;
    display: block;
    float: left;
    clear: left;
  }

  .cj-popBox a.cj-close {
    width: .64rem;
    height: .64rem;
    margin: 1.28rem 3.83rem 0;
    background: url(../assets/images/icon_closeButton.png) no-repeat center center;
    background-size: .64rem;
    float: left;
    clear: left;
  }

</style>
