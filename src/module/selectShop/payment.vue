<template>
  <div id="pagment">
    <div class="paymentPage">
		  <!-- 首单立抵8元 -->
		  <div class="el-paymentActivities" v-show="isFristDiscount">每单最高可低8元</div>

      <div class="dh-choiceService">
        <a :class="{'dh-selected':item.selected}" v-for="(item,index) in list" :key="index" @click="select(item,index)">
          <p>畅查{{item.title}}</p>
          <span><b>￥</b>{{item.price}}</span>
        </a>
      </div>

      <div class="dh-serviceExplain">服务：高级功能</div>

      <div class="dh-paymentMain">
        <ul>
          <li v-for="(item,index) in payTypeList" :class="{'dh-selected':item.selected}" :key="index" @click="selectPayType(item)">
            <span :class="item.calssIconName"></span>
            <p>{{item.name}}
              <b v-show="item.childShow">{{item.childText}}</b>
            </p>
          </li>

          <!--<li :class="{'dh-selected':payType}" @click="selectPayType">-->
          <!--<span class="dh-alipayIcon"></span>-->
          <!--<p>微信支付<b>（升级到最新版本才可使用）</b></p>-->
          <!--</li>-->

        </ul>
      </div>
      <div class="el-paymentDiscount" v-if="isFristDiscount">
        <dl>
          <dt>
            <p>请选择优惠方式</p>
            <span>您的可用积分：<b>{{DisCountInfo.RepairScore}}</b></span>
          </dt>
          <dd class="el-prohibit" v-if="DisCountInfo.CashUseScore<=0">
            <p>最高可抵<b>8</b>元，需使用<b>800</b>积分</p>
            <span>积分不足，无法享受立抵优惠；送车主积分可得等量积分</span>
            <a @click="tomyPoints">如何赚积分？</a>
				  </dd>
          <dd class="el-selected" v-else>
            <p>积分立抵<b>{{DisCountInfo.CashUseScore}}</b>元，使用<b>{{DisCountInfo.UseScore}}</b>积分</p>
            <span>最高可抵<b>{{DisCountInfo.CashMaxUseScore}}</b>元，需使用<b>{{DisCountInfo.MaxUseScore}}</b>积分</span>
            <a @click="tomyPoints">如何赚积分？</a>
          </dd>
        </dl>
      </div>
      <div class="dh-paymentFool">
        <p>总金额：<b>￥{{(price.price-DisCountInfo.CashUseScore).toFixed(2)}}</b></p>
        <a @click="submit">确认支付</a>
      </div>

    </div>
  </div>
</template>

<script>
  import router from "../../router/selectShop.js";
  import {commonMixin} from '../../config/base/commonMixin.js';
  import {Toast} from "mint-ui";
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "payment",
    mixins: [commonMixin],
    components:{

    },
    mounted(){
      this.setTitle('付费详情');

      //原生监听返回
      this.nativeLsitenBack();
      var _this = this;
      _this.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("native_GetVersion", "", function (response) {
          if(_this.androidOrios() !=2){
            if (response > 2.96) {
              _this.payTypeList[1].childShow = false;
            }else {
              _this.payTypeList[1].childShow = true;
            }
          }else {
            if (response > 2.97) {
              _this.payTypeList[1].childShow = false;
            }else {
              _this.payTypeList[1].childShow = true;
            }
          }
        })
      })
      // this.payTypeList[1].childShow = true;
      this.getJoinFristDiscount();

    },
    data(){
      return {
        list:[
          {
            title:' 1 个月',
            price:8,
            selected:true,
            set:1
          },
          {
            title:'2 个月',
            price:16,
            selected:false,
            set:2
          },
          {
            title:' 3 个月',
            price:24,
            selected:false,
            set:3
          }
        ],
        payTypeList:[
          {
            payType:1,
            name:'支付宝',
            selected:true,
            calssIconName:'dh-alipayIcon',
            // dh-alipayIcon
            childText:'',
            childShow:false
          },
          {
            payType:2,
            name:'微信',
            selected:false,
            calssIconName:'wx-alipayIcon',
            childText:'（升级到最新版本才能使用）',
            childShow:false
          }
        ],
        type:1, //默认支付类型支付包
        // payType:true,
        vinCode: this.getQueryString("v"),
        isFristDiscount : false,
        DisCountInfo:{CashUseScore:0},
      }
    },
    computed:{
      price:function(){
        var obj = null;
        for(var i=0;i<this.list.length;i++){
          if(this.list[i].selected==true){
            obj = this.list[i]
          }
        }
        return obj
      }
    },
    methods:{
      tomyPoints(){
        var baseUrl = window.location.protocol + "//" + window.location.host + "/myPoints.html?cf=1"
        // window.location.href=baseUrl;
        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_JumpUrl", {url: baseUrl}, function (response) {});
        });
      },
      select(data,index){
        for(var i=0;i<this.list.length;i++){
          this.list[i].selected =false
        }
        for(var i=0;i<this.list.length;i++){
          if(this.list[i].price ==data.price){
            this.list[i].selected = true;
          }
        }
      },
      //提交支付
      getJoinFristDiscount(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/RepairDepot/IsJoinFirstVinScore',
          dataType: "JSON",
          data:{},
          success: function (data) {
            if(data.Header.ErrorCode == 0){
              // data.Body.IsJoin = true;
              // data.Body.CashUseScore=0;
              _this.isFristDiscount = data.Body.IsJoin;
              _this.DisCountInfo = data.Body;
            }else {
              Toast(data.Header.Message)
            }
          }
        })
      },
      selectDiscount(){
         var _this = this;
         if(_this.DisCountInfo.UseScore > 0)
         {

         }else{
           Toast('您还没有积分，请通过保养记录获取');
         }

      },
      //提交支付
      submit(){

        // if(this.payType==false){
        //   Toast('请选择支付方式');
        //   return;
        // }

        for(var i=0;i<this.payTypeList.length;i++){
          if(this.payTypeList[i].selected==true){
            this.type = this.payTypeList[i].payType;
          }
        }

        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Auto/SubmitVinAutoParamLimitPurchase',
          dataType: "JSON",
          data:{
            set:_this.price.set,
            payType:_this.type,
            vinCode:_this.vinCode,
            useScore:_this.DisCountInfo.UseScore
          },
          success: function (data) {
            if(data.Header.ErrorCode == 0){
              if(data.Body.isSuccess)
              {
                Toast('支付成功');
                setTimeout(() => {
                  window.history.back(-1);
                }, 1000);

              }else{
                _this.transferPayment(data.Body)
              }
            }else {
              Toast(data.Header.Message)
            }
          }
        })
      },
      //选择支付方式
      selectPayType(data){

        if(data.childShow){
          Toast('升级到最新版本才可使用，请至应用市场升级');
          return;
        }
        for(var i=0;i<this.payTypeList.length;i++){
          this.payTypeList[i].selected = false;
          if(this.payTypeList[i].payType == data.payType){
            this.payTypeList[i].selected = !this.payTypeList[i].selected;
          }
        }
        // this.payType = !this.payType
      },

      //调用支付宝接口
      transferPayment(data){
        var _self=this;
        var data = {
          // "orderId": data.orderId,
          "payType": _self.type, //1支付宝，2微信，3银联
          "credential":data.credential,
        };
        if(_self.type==2){
          data.credential = JSON.parse(data.credential)
        }
        if(_self.androidOrios()==1) {
          data = JSON.stringify(data);
        };
        _self.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_Pay', data, function (response) {

            var response=response;

            if(_self.androidOrios()==1){
              response=JSON.parse(response);
            };
            if(_self.type ==2){
              if(_self.androidOrios() == 2){
                response = JSON.parse(response);
              }
            }

            if(response.payResult==1){

              window.history.back(-1);

            }
          })
        })
      },
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/shopChoose/paymentstyle.css");
</style>
