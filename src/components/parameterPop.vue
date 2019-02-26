<template>
  <div class="dl-parameterPop" v-if="isshow">
    <div class="dl-parameterPopBox">
      <div class="dl-parameterPopMain">
        <div class="dl-productTab">
          <a v-for="(item,index) in tabList" :key="index" :class="{'dl-selected':item.selected}" @click="selectedTab(item)">{{item.name}}</a>
        </div>
        <div class="dl-productMain" v-show="infoleft">
          <div class="dl-productPic" v-show="imgList.length>0" id="sweper">

            <mt-swipe :auto="0" :speed="600">
              <mt-swipe-item v-for="(item,index) in imgList" :key="index">
              <span>
                <img :src="item" @click="showCarImg(imgList,$event,index,0)">
              </span>
              </mt-swipe-item>
            </mt-swipe>
          </div>
          <div class="dl-productName">
            {{dataInfo.brandName}} {{dataInfo.shopWareNo}}
            <b class="dl-series" v-show="dataInfo.series">{{dataInfo.series}}</b>
            <b class="dl-imported" v-show="dataInfo.place">{{dataInfo.place}}</b>
          </div>
          <div class="dl-productOrderCode" v-show="dataInfo.otherCodes.length>0">
            <p>其他编码</p>
            <span>{{dataInfo.otherCodes | joins(',') |sum }}</span>
          </div>
          <div class="dl-productParameter" v-if="dataInfo.properties.length>0">
            <ul>
              <li v-for="(item,index) in dataInfo.properties" :key="index">
                <span>{{item.name}}</span>
                <p>{{item.value}}</p>
              </li>
            </ul>
          </div>
          <div class="dl-productParameterNodata" v-else></div>
        </div>
        <div class="dl-productMain" v-show="!infoleft">
          <div class="dl-applyCarBox" v-show="autoDetail.length>0">
            <div class="dl-brandSingle"  v-for="(item,index) in autoDetail" :key="index">
              <p>{{item.abName}}</p>
              <div class="dl-carSystemSingle" v-for="(ite,ind) in item.details" :key="ind">
                <dl>
                  <dt>{{ite.amName}}&nbsp;  {{ite.asName}}</dt>

                  <dd v-for="(i,d) in ite.aparams" :class="[i%2==0?'dl-lineSingular':'dl-linePlural']">
                    <span class="dl-left">{{i.param}}</span>
                    <span class="dl-right" :style="{float:i.param?'':'left'}">{{i.year}}</span>
                  </dd>
                </dl>
              </div>
            </div>

          </div>
        </div>
      </div>
      <a @click="isshow=false;infoleft=true;"></a>
    </div>
    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>

  import { Swipe, SwipeItem } from 'mint-ui';
  import photowipe from './photoswipe';
  export default {
    name: "parameterPop",
    components:{
      'mt-swipe':Swipe,
      'mt-swipe-item':SwipeItem,
      photowipe
    },
    data(){
      return {
        isshow:false,
        imgList:[],
        options:{
          getThumbBoundsFn(index) {
            var thumbnail = document.querySelectorAll('.action_carimg')[0];
            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            var rect = thumbnail.getBoundingClientRect();
            var ret = {
              x: rect.left + rect.width / 2,
              y: rect.top + pageYScroll + rect.height / 2,
              w: 0
            };
            return ret;
          }
        },
        maxslideImg: [],
        dataInfo:{},
        tabList:[{
          name:'商品详情',
          selected:true,
        },{
          name:'适配车型',
          selected:false,
        }],
        infoleft:true,
        wareId:'',
        autoDetail:[]
      }
    },
    //局部过滤器
    filters:{
      sum: function (value) {
        return value  ;
      },
      cal: function (value, begin, xing) {
        return value + begin + xing;
      },
      joins: function(value,str){
        return value.join(str);
      }
    },
    methods:{
      //显示图片
      showCarImg(images, el, index, isImage) {
        //阻止事件冒泡
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(event.currentTarget).addClass("action_carimg");

        var _self = this;
        var imgInfo = images;
        _self.maxslideImg.splice(0);
        $.each(imgInfo, function (i, item) {
          _self.maxslideImg.push({
            src: item
          });
        });

        this.$refs.photowipe.show(index, false, isImage);
      },
      show(){
        this.isshow= true;
        this.tabList = [
          {
            name:'商品详情',
            selected:true,
          },{
            name:'适配车型',
            selected:false,
          }
        ]
      },
      hide(){
        this.isshow= false;
      },
      setValue(data){
        this.imgList = data.images;
        this.dataInfo = data;

      },
      setRight(data){
        this.autoDetail = data;
      },
      setWareId(data){
        this.wareId = data;
      },
      //tab切换
      selectedTab(data){
        for(var i=0;i<this.tabList.length;i++){
          this.tabList[i].selected = false;
          if(this.tabList[i].name == data.name){
            this.tabList[i].selected = true;
          }
        }

        if(data.name == '商品详情'){
          this.infoleft = true;
        }else {
          var _this = this;
          this.$emit("tabRight", function(){
            _this.infoleft = false;
          },this.wareId);

        }

      }
    }

  }
</script>

<style scoped>
  @import url("../assets/css/seePricePop.css");
  /*äº§å“å‚æ•°è¯¦æƒ…*/
  .dl-parameterPop {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.48);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 300;
  }

  .dl-parameterPopBox {
    width: 9.2rem;
    /*height: 11.92rem;*/
    /*height: auto;*/
    margin: -5.96rem 0 0 -4.6rem;
    background: #f9f9f9;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 210;
  }

  .dl-parameterPopMain {
    width: 9.2rem;
    height: 11.92rem;
    overflow-y: auto;
    overflow-x: hidden;
    float: left;
    clear: left;
    background: #fff;
  }
  .dl-productTab {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8d8d8;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 3;
    float: left;
    clear: left;
  }
  .dl-productTab a {
    width: auto;
    height: .96rem;
    margin: .08rem 1.28rem 0;
    font-size: .4rem;
    line-height: .88rem;
    text-align: center;
    color: #666;
    float: left;
    clear: none;
  }
  .dl-productTab a.dl-selected {
    color: #e74c3c;
    border-bottom: .08rem solid #e74c3c;
  }
  .dl-productMain {
    width: 100%;
    height: 100%;
    max-height: 10.86rem;
    overflow-x: hidden;
    overflow-y: auto;
    float: left;
    clear: left;
  }

  .dl-productPic {
    width: 100%;
    height: 5.12rem;
    background: #fff;
    border-bottom: 1px solid #d8d8d8;
    position: relative;
    float: left;
    clear: left;
  }

  .dl-productPic span {
    width: 100%;
    height: 5.12rem;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .dl-productPic span img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 4.12rem;
    /*margin-bottom: 0.2rem;*/
  }

  .dl-productPicTab {
    width: 100%;
    height: .64rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 4;
  }

  .dl-productPicTab dd {
    width: .56rem;
    height: .56rem;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: none;
  }

  .dl-productPicTab dd b {
    width: .2rem;
    height: .2rem;
    border: 1px solid #fff;
    background: rgba(0, 0, 0, 0.36);
    border-radius: .1rem;
  }

  .dl-productPicTab dd.dl-selected b {
    width: .28rem;
    height: .28rem;
    background: #d53533;
    border-radius: .14rem;
  }

  .dl-productName {
    width: 100%;
    padding: .2rem .32rem;
    font-size: .36rem;
    line-height: .56rem;
    text-align: left;
    color: #333;
    float: left;
    clear: left;
  }

  .dl-productName b {
    width: auto;
    padding: 0 .08rem;
    margin-left: .2rem;
    height: .4rem;
    font-size: .28rem;
    font-weight: normal;
    line-height: .4rem;
    color: #fff;
    border-radius: .08rem;
    display: inline-block;
  }

  .dl-productName b.dl-series {
    background: #3498db;
  }

  .dl-productName b.dl-imported {
    background: #e74c3c;
  }

  .dl-productOrderCode {
    width: 100%;
    padding-left: .32rem;
    background: #fff;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    float: left;
    clear: left;
  }

  .dl-productOrderCode p {
    width: 8.56rem;
    border-bottom: 1px solid #e8e8e8;
    font-size: .32rem;
    line-height: .96rem;
    text-align: left;
    color: #999;
    float: left;
    clear: left;
  }

  .dl-productOrderCode span {
    width: 8.56rem;
    padding: .12rem 0;
    font-size: .32rem;
    line-height: .8rem;
    text-align: left;
    color: #333;
    word-break: break-all;
    float: left;
    clear: left;
  }

  .dl-productParameter {
    width: 100%;
    padding-left: .32rem;
    margin-top: .32rem;
    background: #fff;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    float: left;
    clear: left;
  }

  .dl-productParameter ul {
    margin-top: -1px;
  }

  .dl-productParameter li {
    width: 100%;
    border-bottom: 1px solid #d8d8d8;
    float: left;
    clear: left;
  }

  .dl-productParameter li span {
    width: 40%;
    font-size: .32rem;
    line-height: .56rem;
    text-align: left;
    color: #999;
    padding: .2rem 0;
    float: left;
    clear: left;
  }

  .dl-productParameter li p {
    width: 60%;
    font-size: .32rem;
    line-height: .56rem;
    text-align: left;
    color: #333;
    padding: .2rem 0;
    float: left;
    clear: none;
  }

  .dl-parameterPopBox > a {
    width: .68rem;
    height: .68rem;
    background: url(../assets/images/icon_closeButton.png) no-repeat center center;
    background-size: .64rem;
    position: absolute;
    bottom: -1.28rem;
    left: 50%;
    margin-left: -.34rem;
    z-index: 64;
  }

  /*0911 适配车型相关的调整*/
  .dl-applyCarBox {
    width: 100%;
    float: left;
    clear: left;
  }
  .dl-brandSingle {
    width: 100%;
    margin-top: .32rem;
    padding: 0 .32rem .32rem;
    background: #fff;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    float: left;
    clear: left;
  }
  .dl-brandSingle>p {
    width: 100%;
    border-bottom: 1px solid #d8d8d8;
    font-size: .4rem;
    line-height: .96rem;
    text-align: left;
    color: #333;
    float: left;
    clear: left;
  }
  .dl-carSystemSingle {
    width: 100%;
    float: left;
    clear: left;
  }
  .dl-carSystemSingle dt {
    width: 100%;
    height: .76rem;
    padding: 0 .32rem;
    background: #e5faff;
    font-size: .36rem;
    line-height: .76rem;
    text-align: left;
    color: #666;
    float: left;
    clear: left;
  }
  .dl-carSystemSingle dd {
    width: 100%;
    height: auto;
    padding: .08rem .32rem;
    float: left;
    clear: left;
  }
  .dl-carSystemSingle dd span {
    height: auto;
    font-size: .32rem;
    line-height: .64rem;
    text-align: left;
    color: #666;
    float: left;
    clear: none;
  }
  .dl-carSystemSingle dd span.dl-left {
    width: 55%
  }
  .dl-carSystemSingle dd span.dl-right {
    width: 43%;
    float: right;
  }
  .dl-carSystemSingle dd.dl-lineSingular {
    background: #fff;
  }
  .dl-carSystemSingle dd.dl-linePlural {
    background: #f8f8f8;
  }

  /*0911 è°ƒæ•´*/
  .dl-productParameterNodata {
    width: 100%;
    height: auto;
    min-height: 5.6rem;
    padding-left: .32rem;
    background: #fff url(../assets/images/icon_noData.png) no-repeat center center;
    background-size: 2.24rem;
    border-top: 1px solid #d8d8d8;
    /*border-bottom: 1px solid #d8d8d8;*/
    float: left;
    clear: left;
  }

  /*0911 适配车型相关的调整*/
  .dl-applyCarBox {
    width: 100%;
    float: left;
    clear: left;
  }
  .dl-brandSingle {
    width: 100%;
    margin-top: .32rem;
    padding: 0 .32rem .32rem;
    background: #fff;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    float: left;
    clear: left;
  }
  .dl-brandSingle>p {
    width: 100%;
    border-bottom: 1px solid #d8d8d8;
    font-size: .4rem;
    line-height: .96rem;
    text-align: left;
    color: #333;
    float: left;
    clear: left;
  }
  .dl-carSystemSingle {
    width: 100%;
    float: left;
    clear: left;
  }
  .dl-carSystemSingle dt {
    width: 100%;
    height: .76rem;
    padding: 0 .32rem;
    background: #e5faff;
    font-size: .36rem;
    line-height: .76rem;
    text-align: left;
    color: #666;
    float: left;
    clear: left;
  }
  .dl-carSystemSingle dd {
    width: 100%;
    height: auto;
    padding: .08rem .32rem;
    float: left;
    clear: left;
  }
  .dl-carSystemSingle dd span {
    height: auto;
    font-size: .32rem;
    line-height: .64rem;
    text-align: left;
    color: #666;
    float: left;
    clear: none;
  }
  .dl-carSystemSingle dd span.dl-left {
    width: 55%
  }
  .dl-carSystemSingle dd span.dl-right {
    width: 43%;
    float: right;
  }
  .dl-carSystemSingle dd.dl-lineSingular {
    background: #fff;
  }
  .dl-carSystemSingle dd.dl-linePlural {
    background: #f8f8f8;
  }

  /*轮播眼样式*/
  .mint-swipe {
    height: 200px;
    color: #fff;
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
  }

  .mint-swipe-item {
    line-height: 200px;
    /*background: red;*/
  }

  .slide1 {
    background-color: #0089dc;
    color: #fff;
  }

  .slide2 {
    background-color: #ffd705;
    color: #000;
  }

  .slide3 {
    background-color: #ff2d4b;
    color: #fff;
  }
  #sweper .mint-swipe .mint-swipe-indicators .mint-swipe-indicator{
    opacity: 0.5;
    border: 1px solid #fff;
    background: rgba(0,0,0,0.36);
  }
  #sweper .mint-swipe-indicators .is-active {
    background-color: #d53533;
  }
</style>
