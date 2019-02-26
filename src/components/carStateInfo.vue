<template>
  <div class="ec-carDetails" v-show="isShowView">
    <ul>
      <li v-for="(item,index) in vinJYData" v-if="item.ParamValue" :key="index">
        <span>{{item.ParamName}}</span>
        <p>{{item.ParamValue}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "carStateInfo",
    data(){
      return {
        isShowView:false,
        vinJYData:[]
      }
    },
    methods:{
      setValue(data){
        this.vinJYData = data
      },
      show(){
        this.isShowView=true;
      },
      hide(){
        this.isShowView=false;
      }
    }
  }
</script>

<style scoped>
  /*车型详情*/
  .ec-carDetails {
    width: 92%;
    height: auto;
    background: #fff;
    border-top: 1px solid #ccc;
    padding-left: .4rem;
    overflow: hidden;
    /*overflow-y: auto;*/
    position: fixed;
    top: 0;
    bottom: 0;
    left: .4rem;
    right: 0;
    z-index: 100;
  }
  .ec-carDetails ul {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    float: left;
    clear: left;
  }
  .ec-carDetails li {
    width: 100%;
    padding: .2rem .4rem .2rem 0;
    border-bottom: 1px solid #dce6ef;
    box-sizing: border-box;
    float: left;
    clear: left;
  }
  .ec-carDetails li span {
    width: 30%;
    padding-right: .32rem;
    font-size: .36rem;
    line-height: .56rem;
    text-align: left;
    color: #999;
    word-wrap: break-word;
    box-sizing: border-box;
    float: left;
    clear: none;
  }
  .ec-carDetails li p {
    width: 70%;
    font-size: .36rem;
    line-height: .56rem;
    text-align: left;
    color: #333;
    word-wrap: break-word;
    box-sizing: border-box;
    float: left;
    clear: none;
  }
</style>
