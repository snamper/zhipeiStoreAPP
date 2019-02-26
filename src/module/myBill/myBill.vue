<template>
  <div id="bill" style="height: 100%;">
    <div class="dz-myBillPage">
      <!-- 我的账单顶部门店信息 -->
      <div class="dz-myBillShop" v-show="showDataPaker">
        <dl>
          <dt><p @click="GetParterShopList">{{shopName}}</p></dt>
          <dd class="dz-dateBox">

            <p @click="chengeDate">{{startTime}} <i v-show="startTime">-</i> {{endTime}}</p>
          </dd>
          <dd class="dz-stateBox">
            <p @click="showstates">{{statusText}}</p>
            <div class="dz-openBox" v-if="iscollectionStatus">
              <div class="dz-openJiao"><span></span></div>
              <div class="dz-openMain">
                <a v-for="(item,index) in collection" :key="index" @click="checkSelected(item)">{{item.name}}</a>
              </div>
            </div>
          </dd>
        </dl>
      </div>
      <!-- 我的账单顶部门店信息 编辑日期 -->
      <div class="dz-myBillShop" v-show="false">
        <dl>
          <dt><p @click="GetParterShopList">{{shopName}}</p></dt>
          <dd class="dz-dateEditBox">
            <span>开始时间</span>
            <p @click="startChange">{{startTime}}</p>
          </dd>
          <dd class="dz-dateEditBox">
            <span>结束时间</span>
            <p @click="endChange">{{endTime}}</p>
          </dd>
        </dl>
      </div>
      <!-- 我的账单 总计 -->
      <div class="dz-myBillTotal" style="display: flex;">
        <ul>
          <li>
            <span>商品总数（件）</span>
            <p>{{totalCount}}</p>
          </li>
          <li>
            <span>商品总价（元）</span>
            <p>{{totalAmount.toFixed(2)}}</p>
          </li>
        </ul>
      </div>



      <!-- 我的账单 表格 -->
      <div class="dz-myBillTable" v-if="shopOrderLister.length>0">
        <table cellpadding="0" cellspacing="0" border="0">
          <thead>
          <tr>
            <td class="dz-tdBrand">品牌</td>
            <td class="dz-tdCategory">品类</td>
            <td class="dz-tdCommodity">商品</td>
            <td class="dz-tdNumber">数量</td>
            <td class="dz-tdPrice">价格</td>
          </tr>
          </thead>
          <tbody >
            <tr v-for="(item,index) in shopOrderLister" :key="index" @click="iscollectionStatus = false">
              <td class="dz-tdBrand">{{item.brandName}}</td>
              <td class="dz-tdCategory">{{item.categoryName}}</td>
              <td class="dz-tdCommodity">{{item.wareName}}</td>
              <td class="dz-tdNumber">{{item.wareCount}}</td>
              <td class="dz-tdPrice">{{item.priceText}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 我的账单 暂无数据 -->
      <div class="dz-myBillTable" v-else>
        <table cellpadding="0" cellspacing="0" border="0">
          <thead>
          <tr>
            <td class="dz-tdBrand">品牌</td>
            <td class="dz-tdCategory">品类</td>
            <td class="dz-tdCommodity">商品</td>
            <td class="dz-tdNumber">数量</td>
            <td class="dz-tdPrice">价格</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td colspan="5" class="dz-dataNo">
              <span>暂无数据，请重新筛选</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>


    </div>

    <!--选择供应商-->
    <div class="dz-switchShopPop" v-if="shopnameList.length>0" v-show="showliist">
      <div class="dz-switchShopBox">
        <div class="dz-switchShopHead">
          <p>请选择供货商</p>
          <a @click="showliist=false">×</a>
        </div>
        <div class="dz-switchShopMain">
          <ul>
            <li v-for="(item,index) in shopnameList" :key="index" @click="searchDataList(item)">
              <p>{{item.shopName}}</p>
              <span>{{item.address}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--<div style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;opacity: .5;background: #000;z-index: 2000" v-show="moduleVShow"></div>-->
    <!--起始时间-->
    <mt-datetime-picker
      type="date"
      ref="startPicker"
      v-model="strStartTime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      @cancel="checkinCancel"
      @change = "doOnModalClick"
      :endDate="mixDate"
      :startDate="maxDate"

    >
    </mt-datetime-picker>
    <!--结束时间-->
    <mt-datetime-picker
      type="date"
      ref="ednPicker"
      v-model="strEndTime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirmend"
      @cancel="endCheckinCancel"
      :endDate="mixDate"
      :startDate="maxDate"
    >
    </mt-datetime-picker>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {commonMixin} from '../../config/base/commonMixin.js';
  import {Toast} from "mint-ui";
  import { MessageBox } from 'mint-ui';
  import { DatetimePicker } from 'mint-ui';
  var resourceUrl = process.env.apiDomain;
  Vue.component(DatetimePicker.name, DatetimePicker);
  export default {
    name: "myBill",
    mixins: [commonMixin],
    created(){
      this.setTitle('我的账单');
    },
    mounted(){
      var _this = this;
      _this.LoadComplete(function(){

        _this.nativeLsitenBack('native_CloseWebview');

      })

      _this.GetParterShop();
      _this.initTime();

      // _this.GetAccountBalance();

    },
    data(){
      return {
        shopId:this.getQueryString('shopId'),
        showDataPaker:true,
        shopName:'',
        shopnameList:[],
        showliist:false,
        startTime:'',
        strStartTime:'',
        endTime:'',
        strEndTime:'',
        status:2,
        statusText:'已付款',
        shopOrderLister:[],
        totalCount:0,
        totalAmount:0,
        startStatus:false,
        endSttus:false,
        mixDate:new Date(new Date().valueOf()+(3600*24*30*1000*(12-(new Date().getMonth()+1)))),
        maxDate:new Date('2018/01/01'),
        iscollectionStatus:false, //是否显示收款
        collection:[
          {
            name:'全部状态',
            type:0,
          },
          {
            name:'待付款',
            type:1,
          },
          {
            name:'已付款',
            type:2,
          }
        ], //默认收款状态
        toasttext:'请选择开始时间',
        // moduleVShow:true  //默认显示
      }
    },
    methods:{
      initTime(){
        var _this = this;
        // _this.endTime = _this.fmtDate(new Date());
        _this.strEndTime = _this.fmtDate(new Date());
        var time = new Date().valueOf()-(3600*24*30*1000);
        // _this.startTime = _this.fmtDate(time);
        _this.strStartTime = _this.fmtDate(time);

        _this.$refs.startPicker.open();
        _this.$refs.startPicker.closeOnClickModal = false;


        $(".mint-popup-bottom").prepend("<div class='toastBoxalset'>" + _this.toasttext + "</div>");


      },
      //获取店铺信息
      GetParterShop(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetParterShop",
          dataType: "JSON",
          data: {
            shopId: _this.shopId
          },
          success:function(str){
            if(str.Header.ErrorCode ==0){
              _this.shopName = str.Body.shopName
            }else {
              Toast(str.Header.Message);
            }
          }
        })
      },
      //获取店铺信息
      GetParterShopList(){
        this.iscollectionStatus = false;
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetParterShopList",
          dataType: "JSON",
          success:function(str){
            if(str.Header.ErrorCode ==0){
              _this.shopnameList = str.Body;
              _this.showliist = true;
            }
          }
        })
      },
      searchDataList(data){
        if(data.shopId){
          this.shopId = data.shopId;
          this.shopName = data.shopName;
          //获取数据列表
          this.GetAccountBalance();
          this.showliist = false;
        }
      },
      GetAccountBalance(){
        this.iscollectionStatus = false;
        var _this = this;
        var dataInfoSearch ={
          shopId:_this.shopId,
          startDate: _this.startTime,
          endDate: _this.endTime,
          status: _this.status
        }
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/cloudshop/GetAccountBalance",
          dataType: "JSON",
          data:dataInfoSearch,
          success:function(str){
            if(str.Header.ErrorCode ==0){
              _this.shopOrderLister=str.Body.wares;
              _this.totalCount = str.Body.totalCount;
              _this.totalAmount = str.Body.totalAmount;
            }else {
              _this.shopOrderLister=[];
              Toast(str.Header.Message);
            }
          }
        })
      },
      //获取当前时间
      fmtDate(obj){

        var date =  new Date(obj);
        var y = date.getFullYear(); //使用新方法
        var m = "0"+(date.getMonth()+1);
        var d = "0"+date.getDate();
        return y+"/"+m.substring(m.length-2,m.length)+"/"+d.substring(d.length-2,d.length);
      },
      handleConfirm(date){
        // debugger;
        var time = this.fmtDate(date)
        this.startTime = time;
        this.strStartTime = time;

        $(".mint-popup-bottom .toastBoxalset").remove();
        this.$refs.ednPicker.open();
        this.$refs.ednPicker.closeOnClickModal = false;
        this.toasttext = '请选择结束时间'
        $(".mint-popup-bottom").prepend("<div class='toastBoxalset'>" + this.toasttext + "</div>");
      },
      startChange(){
        this.$refs.startPicker.open();
      },
      handleConfirmend(date){
        var time = this.fmtDate(date)
        this.endTime = time;
        this.strEndTime = time;
        this.endSttus=true;
        // this.moduleVShow = false;
        $(".mint-popup-bottom .toastBoxalset").remove();
        this.checkinfodate();
      },
      endChange(){
        this.$refs.ednPicker.open();
      },
      //请求数据
      checkinfodate(){
          this.showDataPaker = true;
          this.GetAccountBalance();

      },
      chengeDate(){
        this.iscollectionStatus = false;
        // this.moduleVShow = true;
        this.toasttext = '请选择开始时间';
        $(".mint-popup-bottom .toastBoxalset").remove();
        this.$refs.startPicker.open();
        debugger;
        $(".mint-popup-bottom").prepend("<div class='toastBoxalset'>" + this.toasttext + "</div>");


      },
      checkSelected(data){
        this.status = data.type;
        this.statusText = data.name;
        this.GetAccountBalance();
        this.iscollectionStatus = false;

      },
      showstates(){
        this.iscollectionStatus = true;
      },
      checkinCancel(){
        Toast({
          message:'请选择开始时间',
          duration:3000,
          className:'lxlclassName'
        });
        this.$refs.startPicker.open();
        // return;
      },
      endCheckinCancel(){
        Toast({
          message:'请选择结束时间',
          duration:3000,
          className:'lxlclassName'
        });
        this.$refs.ednPicker.open();
      },
      doOnModalClick(){
        debugger;
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/mybillstyle.css");

</style>
