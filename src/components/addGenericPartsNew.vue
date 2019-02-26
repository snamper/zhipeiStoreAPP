<template>
  <!-- 参数详情弹层 -->
  <div class="dq-addGenericParts" v-show="isshow">
    <div class="dq-addGenericPartsBox">
      <div class="dq-popHead">
        <p>添加通用件</p>
        <a @click="hide">×</a>
      </div>
      <div class="dq-popCenter">
        <div class="dq-screen" id="dq-screen">
          <!--<span class="dq-selected" style="border-right: 1px solid #d8d8d8;"><b>品类</b></span>&lt;!&ndash; 选中后增加样式：class="dq-selected"，并且增加style="border-right: 1px solid #d8d8d8;" &ndash;&gt;-->
          <span v-for="(item,index) in tebSelect" :key="index" :class="{'dq-selected':item.selected}" @click="tabsele(item,index,$event)"><b>{{item.name}}</b></span><!-- 选中后增加样式：class="dq-selected"，并且增加style="border-left: 1px solid #d8d8d8;" -->
          <div class="dq-screenBox" v-show="type1">
            <ul>
              <li>
                <span v-for="(item,index) in categorys" :key="index" :class="{'dq-selected':item.isSelected}" @click="leftSele(item)">{{item.categoryName}}</span>
              </li>
              <li class="dq-screenButton">
                <a @click="boxleft">取消</a>
                <a class="dq-right" @click="submit">确定</a>
              </li>
            </ul>
          </div>
          <div class="dq-screenBox" v-show="type2">
            <ul>
              <li class="dq-brandBox">
                <span v-for="(item,index) in brands" :key="index" :class="{'dq-selected':item.isSelected}" @click="rightSele(item)">{{item.brandName}}</span>
              </li>
              <li class="dq-screenButton">
                <a @click="boxright">取消</a>
                <a class="dq-right" @click="submit">确定</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="dq-productList">
          <ul v-infinite-scroll="listOneLoadMore" infinite-scroll-disabled="listOneBusy" infinite-scroll-distance="10" v-show="wares.length>0">
            <li v-for="(item,index) in wares" :key="index">
    						<span class="dq-productPic">
    							<img v-if="item.images.length>0" :src="item.images[0]" @click="showCarImg(item.images,$event,0,0)">
                  <img v-else src="../assets/images/icon_logoGray.png">
    						</span>
              <div class="dq-productRight">
                <dl>
                  <dt>{{item.brandName}} {{item.categoryName}} {{item.wareName}}</dt>
                  <dd>{{item.description}}</dd>
                  <dd>
                    <p>{{item.warePrice}}</p>
                    <span>
    										<a class="dq-plus" @click="exchange(item)">+</a>
    									</span>
                  </dd>
                </dl>
              </div>
            </li>
          </ul>

          <div class="aa-nodataBox" v-show="wares.length==0">
            <span class="aa-noDataPic"></span>
          </div>
        </div>
      </div>
      <div class="dq-popFool">
        <a @click="hide">关闭</a>
      </div>
    </div>
    <!--查看Logo图片-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { InfiniteScroll } from 'mint-ui';
  import {Indicator} from 'mint-ui';
  import {commonMixin} from "../config/base/commonMixin.js";
  import photowipe from './photoswipe';
  Vue.use(InfiniteScroll);
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "addGenericPartsNew",
    mixins: [commonMixin],
    props:['shopid'],
    components:{
      photowipe: photowipe,
    },
    data(){
      return {
        isshow:false,
        tebSelect:[
          {
            name:'品类',
            type:1,
            selected:false
          },
          {
            name:'品牌',
            type:2,
            selected:false
          }
        ],
        type1:false,
        type2:false,
        listOneBusy: true,
        brands:[],
        categorys:[],
        wares:[],
        pageIndex:1,
        // shopid:''
        submitstate:false,
        options: {
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
        maxslideImg:[]
        // nodata:false
      }
    },
    methods:{
      showCarImg(images, el, index, isImage){
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
        this.isshow = true;
        this.GetShopSelfWares();
      },
      hide(){
        this.isshow = false;
        this.tebSelect[0].selected=false;
        this.tebSelect[1].selected=false;
        this.wares=[];
        this.pageIndex = 1;
        this.submitstate = false;
        this.listOneBusy = true;
        this.type1= false;
        this.type2= false;
        $('#dq-screen span').css({'border-right':'','border-left':''});
      },
      tabsele(data,index,ev){
        var el = ev.currentTarget;
        $(el).css({'border-right':'1px solid #d8d8d8','border-left':'1px solid #d8d8d8'});
        if(data.type ==1){
          this.type1 = true;
          this.type2 = false;
        }else {
          this.type2 = true;
          this.type1 = false;
        }
        for(var i=0;i<this.tebSelect.length;i++){
          this.tebSelect[i].selected = false;
        }
        for(var i=0;i<this.tebSelect.length;i++){
          if(this.tebSelect[i].type ==data.type ){
            this.tebSelect[i].selected=true
          }
        }
      },
      boxleft(){
        this.type1= false;
        this.tebSelect[0].selected=false;
        this.tebSelect[1].selected=false;
        $('#dq-screen span').css({'border-right':'','border-left':''});
      },
      boxright(){
        this.type2= false;
        this.tebSelect[0].selected=false;
        this.tebSelect[1].selected=false;
        $('#dq-screen span').css({'border-right':'','border-left':''});
      },
      listOneLoadMore(){
        var _this = this;
        _this.listOneBusy = true;
        if(_this.submitstate){
          if(_this.listOneBusy) {
            _this.pageIndex++;
            _this.GetShopSelfWaresByCategory(_this.bId,_this.cId)
          }
        }else {
          if(_this.listOneBusy) {
            _this.pageIndex++;
            _this.GetShopSelfWares();
          }
        }
      },
      GetShopSelfWares(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/order/GetShopSelfWares",
          dataType: "JSON",
          data: {
            shopId: _this.$props.shopid,
            pageIndex:_this.pageIndex
          },
          beforeSend: function () {
            Indicator.open({
              spinnerType: 'fading-circle'
            });
          },
          complete: function () {
            setTimeout(function () {
              Indicator.close();
            }, 1);
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.setbrands(str.Body.brands);
              _this.setcategorys(str.Body.categorys);
              if(str.Body.wares.length>0){
                _this.wares = _this.wares.concat(str.Body.wares);
                _this.setwares(_this.wares);
                _this.listOneBusy = false;
              }else {
                _this.listOneBusy = true;

              }

            }
          }
        })
      },
      setbrands(data){
        this.brands = data;
      },
      setcategorys(data){
        this.categorys = data;
      },
      setwares(data){
        this.wares = data;
      },
      leftSele(ite){
        ite.isSelected = !ite.isSelected
      },
      rightSele(ite){
        ite.isSelected = !ite.isSelected
      },
      submit(){
        this.type1= false;
        this.type2= false;
        this.tebSelect[0].selected=false;
        this.tebSelect[1].selected=false;
        this.submitstate = true;
        $('#dq-screen span').css({'border-right':'','border-left':''});
        var _this = this;
        _this.bId = [];
        _this.cId = [];
        for(var i=0;i<_this.brands.length;i++){
          if(_this.brands[i].isSelected){
            _this.bId.push(_this.brands[i].brandId)
          }
        }

        for(var i=0;i<_this.categorys.length;i++){
          if(_this.categorys[i].isSelected){
            _this.cId.push(_this.categorys[i].categoryId)
          }
        }
        _this.wares = [];
        _this.pageIndex = 1;
        _this.GetShopSelfWaresByCategory(_this.bId,_this.cId)
      },
      GetShopSelfWaresByCategory(bId,cId){
        var _this = this;

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/order/GetShopSelfWaresByCategory",
          dataType: "JSON",
          data:{
            shopId: _this.$props.shopid,
            pageIndex:_this.pageIndex,
            bId:bId,
            cId:cId
          },
          beforeSend: function () {
            Indicator.open({
              spinnerType: 'fading-circle'
            });
          },
          complete: function () {
            setTimeout(function () {
              Indicator.close();
            }, 1);
          },
          success:function(str){
            if(str.Header.ErrorCode == 0){
              if(str.Body.length>0){
                _this.wares = _this.wares.concat(str.Body);
                _this.setwares(_this.wares);
                _this.listOneBusy = false;
              }else {
                _this.listOneBusy = true;
              }
            }

          }
        })
      },
      exchange(item){
        this.$emit('addProduct',{
          wareKind: item.wareKind, //商品类型
          wareId: item.wareId, //商品ID
          wareName: item.wareName, //商品名称
          brandId: item.brandId, //品牌ID
          brandName: item.brandName, //品牌名称
          categoryId: item.categoryId, //品类ID
          categoryName: item.categoryName, //品类名称
          sortPrice: item.sortPrice, //参考价
          warePrice: item.warePrice, //展示用价格
          wareCount: 1 //商品数量
        });
      }

    }
  }
</script>

<style scoped>
  /*添加通用件弹层*/
  .dq-addGenericParts {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.48);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 300;
  }

  .dq-addGenericPartsBox {
    width: 100%;
    height: auto;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
  }

  .dq-addGenericPartsBox .dq-popHead {
    width: 100%;
    height: 1.04rem;
    background: #edf2f7;
    float: left;
    clear: left;
  }

  .dq-addGenericPartsBox .dq-popHead p {
    width: auto;
    height: 1.04rem;
    margin-left: .32rem;
    font-size: .4rem;
    line-height: 1.04rem;
    text-align: left;
    color: #878f9e;
    float: left;
    clear: left;
  }

  .dq-addGenericPartsBox .dq-popHead a {
    width: auto;
    height: 1.04rem;
    margin-right: .32rem;
    font-size: .56rem;
    line-height: .96rem;
    text-align: left;
    color: #d53533;
    float: right;
    clear: none;
  }

  .dq-addGenericPartsBox .dq-popFool {
    width: 100%;
    float: left;
    clear: left;
  }

  .dq-addGenericPartsBox .dq-popFool a {
    width: 100%;
    height: 1.28rem;
    background: #e74c3c;
    font-size: .48rem;
    line-height: 1.28rem;
    text-align: center;
    color: #fff;
    float: left;
    clear: none;
  }

  .dq-addGenericPartsBox .dq-popFool a.dq-right {
    background: #d53533;
  }

  .dq-addGenericPartsBox .dq-popCenter {
    width: 100%;
    float: left;
    clear: left;
  }

  .dq-addGenericPartsBox .dq-popCenter .dq-screen {
    width: 100%;
    border: 1px solid #d8d8d8;
    background: #fff;
    position: relative;
    float: left;
    clear: left;
  }

  .dq-addGenericPartsBox .dq-popCenter .dq-screen > span {
    width: 50%;
    padding: .2rem 0;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    float: left;
    clear: none;
  }


  .dq-addGenericPartsBox .dq-popCenter .dq-screen > span b {
    width: auto;
    max-width: 4rem;
    background: url(../assets/images/arrow_gray_down.png) no-repeat right center;
    background-size: .32rem;
    padding-right: .64rem;
    font-size: .36rem;
    font-weight: normal;
    line-height: .72rem;
    text-align: center;
    color: #333;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    float: left;
    clear: left;
  }

  .dq-addGenericPartsBox .dq-popCenter .dq-screen > span.dq-selected {
    z-index: 30;
  }

  .dq-addGenericPartsBox .dq-popCenter .dq-screen > span.dq-selected b {
    background-image: url(../assets/images/arrow_gray_up.png);
    color: #d53533;
  }

  .dq-screenBox {
    width: 100%;
    height: auto;
    padding-top: .32rem;
    border: 1px solid #d8d8d8;
    background: #fff;
    position: absolute;
    top: 1.09rem;
    left: 0;
    z-index: 20;
  }

  .dq-screenBox li {
    width: 100%;
    height: auto;
    max-height: 6rem;
    overflow-y: auto;
    float: left;
    clear: left;
  }

  .dq-screenBox li > span {
    width: 2.1rem;
    height: auto;
    min-height: 1.48rem;
    border: 1px solid #d8d8d8;
    margin-left: .32rem;
    margin-bottom: .32rem;
    font-size: .32rem;
    line-height: .64rem;
    text-align: center;
    color: #666;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: none;
  }

  .dq-screenBox li > span.dq-selected {
    border: 1px solid #d53533;
    background: url(../assets/images/icon_screenSelected.png) no-repeat right bottom;
    background-size: .48rem;
    color: #d53533;
  }

  .dq-screenBox li.dq-screenButton {
    width: 100%;
    border-top: 1px solid #e8e8e8;
    background: #f6f6f6;
    margin: 0;
    padding: .24rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .dq-screenBox li.dq-screenButton a {
    width: auto;
    height: auto;
    border: 1px solid #d53533;
    background: #fff;
    padding: 0 .32rem;
    margin: 0 .32rem;
    font-size: .32rem;
    line-height: .64rem;
    text-align: center;
    color: #d53533;
    float: left;
    clear: none;
  }

  .dq-screenBox li.dq-screenButton a.dq-right {
    background: #d53533;
    color: #fff;
  }

  .dq-productList {
    width: 100%;
    height: 10rem;
    overflow: auto;
    float: left;
    clear: left;
  }

  .dq-productList ul {
    width: 100%;
    padding-left: .32rem;
    float: left;
    clear: left;
  }

  .dq-productList li {
    width: 100%;
    padding: .32rem 0;
    border-bottom: 1px solid #d8d8d8;
    float: left;
    clear: left;
  }

  .dq-productList li span.dq-productPic {
    width: 1.44rem;
    height: 1.44rem;
    margin-right: .32rem;
    border: 1px solid #e8e8e8;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: none;
  }

  .dq-productList li span.dq-productPic img {
    width: auto;
    height: auto;
    max-width: 1.32rem;
    max-height: 1.32rem;
  }

  .dq-productRight {
    width: 7.6rem;
    float: left;
    clear: none;
  }

  .dq-productRight dt {
    width: 100%;
    height: auto;
    font-size: .36rem;
    line-height: .64rem;
    text-align: justify;
    color: #333;
    float: left;
    clear: left;
  }

  .dq-productRight dd {
    width: 100%;
    height: auto;
    font-size: .32rem;
    line-height: .64rem;
    text-align: justify;
    color: #f39c12;
    float: left;
    clear: left;
  }

  .dq-productRight dd p {
    width: auto;
    height: auto;
    font-size: .4rem;
    line-height: 1.04rem;
    text-align: justify;
    color: #e74c3c;
    float: left;
    clear: none;
  }

  .dq-productRight dd span {
    width: auto;
    float: right;
    clear: none;
  }

  .dq-productRight dd span a {
    width: 1.04rem;
    height: 1.04rem;
    border-radius: .52rem;
    border: 1px solid #d8d8d8;
    font-size: .4rem;
    line-height: .92rem;
    text-align: center;
    color: #666;
    /*display: flex;
      justify-content: center;
      align-items: center;*/
    float: left;
    clear: none;
  }

  .dq-productRight dd span a.dq-reduce {
    color: #666;
  }

  .dq-productRight dd span a.dq-plus {
    background: #e74c3c;
    border-color: #e74c3c;
    font-size: .6rem;
    color: #fff;
  }

  .dq-productRight dd span b {
    width: 1.04rem;
    height: 1.04rem;
    font-size: .4rem;
    font-weight: normal;
    line-height: .76rem;
    text-align: center;
    color: #666;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: none;
  }
  .aa-nodataBox {
    width: 100%;
    padding: 3rem;
    float: left;
    clear: left;
  }
  .aa-noDataPic {
    width: 100%;
    height: 3.6rem;
    background: url(../assets/images/icon_noData.png) no-repeat center center;
    background-size: 2.8rem;
    display: block;
    float: left;
    clear: left;
  }
</style>
