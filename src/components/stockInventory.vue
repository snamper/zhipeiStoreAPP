<template>
  <div class="db-setMealRecommendPop" v-show="isHide">
    <div class="db-setMealRecommend">
      <div class="db-setMealRecommendTitle">
        <p>智能推荐备货清单</p>
        <a @click="showToust()"><!--点击后增加 class:db-click -->
          <div class="db-supernatant">
            <span></span>
            <p>这里是说明性文案这里是说明性文案这里是说明性文案这里是说明性文案</p>
          </div>
        </a>
        <a class="db-close" @click="hide()">×</a>
      </div>
      <div class="db-setMealRecommendTab">
        <a :class="{'db-selected':item.selected == true}" v-for="(item) in tabList" @click="tabSelect(item)">
          <p>{{item.name}}</p>
          <span>{{item.dis}}</span>
        </a>
      </div>
      <!-- 有数据 -->
      <div class="df-setMealRecommendThead" v-if="list.length>0">
        <p class="df-tdName">商品</p>
        <p class="df-tdHistoryNumber">过去四周用量</p>
        <p class="df-tdRecommendNumber">推荐数量</p>
      </div>
      <div class="db-setMealRecommendMain" v-if="list.length>0">
        <div class="db-commodityListBox">
          <!--<div class="db-boxTitle"><span class="one">过去四周用量</span><span class="tow" v-show="list[0].wares[0].showWareCount">推荐数量</span></div>-->
          <div class="db-commodityBox" v-for="(item,index) in list">
            <p class="db-commodityCategory">{{item.groupName}}</p>
            <div class="db-commodityOne" :class="{'db-commodityOneSelected':it.selected == true}" v-for="it in item.wares" @click="selectedlist(it)">
              <dl>
                <dt>
                  <p class="db-commodityName">
                    <i>{{it.brandName}} {{it.wareName}}</i>
                    <a  class="db-info" v-on:click.stop="seeDetails(it)">详情</a>
                  </p>

                  <a  class="db-commodityNumber" v-show="it.showWareCount" @click.stop="changeCount(it,index)">×{{it.wareCount}}</a>
                  <span class="db-commodityPrice" :style="{'margin-right':it.showWareCount?null:'1.6rem'}">{{it.totalCount}}</span>
                </dt>
              </dl>
              <!--<div style="width: auto" class="cv-alias" :class="{'cv-takeUp':it.selecteds}" v-on:click.stop="isOpen(it,$event)" v-show="it.otherCodes.length>0">-->
                <!--<dl>-->
                  <!--<template v-for="(other,index) in it.otherCodes">-->
                    <!--<dt v-if="index==0">{{other}}</dt>-->
                    <!--<dd v-else>{{other}}</dd>-->
                  <!--</template>-->
                <!--</dl>-->
              <!--</div>-->
            </div>
          </div>

        </div>
      </div>
      <!-- 无数据 -->
      <div class="db-setMealRecommendMain" v-if="list.length==0">
        <div class="db-commodityListBox">
          <div class="db-dataNo">暂无推荐商品</div>
        </div>
      </div>

      <div class="db-setMealRecommendFool">
        <a @click="hide">取消</a>
        <a class="db-right" @click="shubmitAdd()">添加</a>
      </div>

      <!--上平数量加减弹层-->
      <div class="cf-numberEditPop" v-show="isShowChangeShopCartPop">
        <ul>
          <li class="cf-numberEdit">
            <p>修改数量</p>
            <span>
            <a href="javascript:void(0);" v-on:click="increment(changeShopCartItem)">-</a>
            <b>{{changeShopCartItem.wareCount}}</b>
            <a href="javascript:void(0);" v-on:click="changeShopCartItem.wareCount++">+</a>
          </span>
          </li>
          <li class="cf-numberEditButton">
            <a href="javascript:void(0);" class="cf-buttonLeft"
               v-on:click="isShowChangeShopCartPop=false;changeShopCartItem.wareCount=changeShopCartItem.oldcount">取消</a>
            <a href="javascript:void(0);" v-on:click="isShowChangeShopCartPop=false">确认</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui';
  export default {
    name: "stockInventory",
    data(){
      return {
        isHide:false,
        list:[],
        listAll:[],
        tabList:[
          {
            name:'套餐A',
            dis:'必选套餐',
            selected:true,
            index:1
          },
          {
            name:'套餐B',
            dis:'常规套餐',
            selected:false,
            index:2
          },
          {
            name:'套餐C',
            dis:'全面套餐',
            selected:false,
            index:3
          },
          {
            name:'套餐D',
            dis:'常用配件',
            selected:false,
            index:4
          }
        ], // tab 选择数据
        selecteList:[],
        changeShopCartItem: {},  // 正在编辑数量的购物车商品
        isShowChangeShopCartPop: false,
      }
    },
    methods:{
      show(){
        this.isHide = true;
      },
      hide(){
        this.isHide =false;
      },
      setValue(val,index){
        for(var i=0;i<this.tabList.length;i++){
          this.tabList[i].selected = false;
          if(this.tabList[i].index == index){
            this.tabList[i].selected = true;
          }
        }
        var _this = this;
        _this.listAll = val;
        if(index==1){
          _this.list = _this.listAll.set_a;
        }else if(index==2){
          _this.list = _this.listAll.set_b;
        }else if(index==3){
          _this.list = _this.listAll.set_c;
        }else{
          _this.list = _this.listAll.set_d;
        }

      },
      selectedlist(it){

        for(var i=0;i<this.list.length;i++){
          for(var j=0;j<this.list[i].wares.length;j++){
            if(it.wareId == this.list[i].wares[j].wareId){
              this.list[i].wares[j].selected = !this.list[i].wares[j].selected;
            }
          }

        }
      },
      tabSelect(it){
        for(var i=0;i<this.tabList.length;i++){
          this.tabList[i].selected = false;
          if(this.tabList[i].index == it.index){
            this.tabList[i].selected = true;
          }
        }
        var _this = this;
        if(it.index==1){
          _this.list = _this.listAll.set_a;
        }else if(it.index==2){
          _this.list = _this.listAll.set_b;
        }else if(it.index==3){
          _this.list = _this.listAll.set_c;
        }else {
          _this.list = _this.listAll.set_d;
        }

        // debugger;
      },
      shubmitAdd(){

        if(this.getSelected().length==0){
          Toast('请选择商品');
          return;
        }
        this.$emit("addPriceLeve", this.selecteList);
      },
      //获取选择项
      getSelected(){
        this.selecteList=[];
        for(var i=0;i<this.list.length;i++){
          for(var j=0;j<this.list[i].wares.length;j++){
            if(this.list[i].wares[j].selected == true){
              this.selecteList.push(this.list[i].wares[j])
            }
          }
        }
        return this.selecteList
      },
      showToust(){
        Toast("根据过去四周实际订单中产品型号和产品数量推荐");
      },
      //查看详情
      seeDetails(item){
        this.$emit("seeDetails", item);
      },
      isOpen(data,event){
        if(data.selecteds ==false || data.selecteds ==null){
          this.$set(data,'selecteds',true)
        }else {
          this.$set(data,'selecteds',false)
        }
      },
      // 修改商品数量
      changeCount(item,index) {
        this.changeShopCartItem = item;
        this.changeShopCartItem.index=index;
        this.changeShopCartItem.oldcount = this.changeShopCartItem.wareCount;
        this.isShowChangeShopCartPop = true;
      },
      //减少商品
      increment(changeShopCartItem){
        if(changeShopCartItem.wareCount>1){
          changeShopCartItem.wareCount--
        }else {
          return
        }
      },
      //提交商品数量

    }
  }
</script>

<style scoped>
  .db-boxTitle {
    position: relative;
    top: 0.8rem;
    left: 50%;
    width: 100%;
    font-size: .36rem;
  }
  .db-boxTitle span {
    color: #f2900c;
  }
  .db-boxTitle .tow {
    margin-left: .8rem;
  }
  .db-info {
    color: #4556ea;
    margin-left: .5rem;
    vertical-align: middle;
    width: .96rem;
    font-size: .32rem;
    line-height: .64rem;
    text-align: right;
  }
</style>
