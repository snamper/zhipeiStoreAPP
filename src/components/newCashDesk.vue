<template>
  <div class="el-discountChoicePop">
    <div class="el-discountChoiceBox" v-if="showMode==showMode_setting.setPoints">
      <div class="el-discountChoiceMain el-couponPopBox">
        <dl>
          <dt>
            <p>请选择优惠方式</p>
            <span>您的可用积分：<a>{{validScore}}</a></span>
          </dt>
          <dd class="el-integralNo">
            <p v-show="scoreHelpText">{{scoreHelpText}}</p>
            <a @click="tomyPoints">如何赚积分？</a>
          </dd>
          <dd>
            <div class="el-couponBox" v-for="(item,index) in list" :key="index" v-show="list.length>0">
              <template v-if="item.type==1">
                <span></span>
                <div class="el-couponMainBox">
                  <p>积分立抵<b>{{item.spendScoreAmountText}}</b>元，使用<b>{{item.spendScore}}</b>积分</p>
                  <span>最高可抵<b>{{item.maxScoreAmountText}}</b>元，需要<b>{{item.maxScore}}</b>积分</span>
                  <span class="el-couponChoice" :class="judge(item)" @click="Choice(item)"></span>
                </div>
              </template>
              <template v-if="item.type==2">
                <span></span>
                <div class="el-couponMainBox">
                  <template v-if="item.maxScore>0">
                    <p>免息分期支付（3期）+ 积分立抵<b>{{item.spendScoreAmountText}}</b>元</p>
                    <span>最高可抵<b>{{item.maxScoreAmountText}}</b>元，需要<b>{{item.maxScore}}</b>积分</span>
                  </template>
                  <template v-else>
                    <p>免息分期支付（3期）</p>
                    <span></span>
                  </template>
                  <span class="el-couponChoice" :class="judge(item)" @click="Choice(item)"></span>
                </div>
              </template>
              <template v-if="item.type==3">
                <span></span>
                <div class="el-couponMainBox">
                  <template v-if="item.maxScore>0">
                    <p>免息分期支付（6期）+ 积分立抵<b>{{item.spendScoreAmountText}}</b>元</p>
                    <span>最高可抵<b>{{item.maxScoreAmountText}}</b>元，需要<b>{{item.maxScore}}</b>积分</span>
                  </template>
                  <template v-else>
                    <p>免息分期支付（6期）</p>
                    <span></span>
                  </template>
                  <span class="el-couponChoice" :class="judge(item)" @click="Choice(item)"></span>
                </div>
              </template>
            </div>
            <div class="el-couponBox el-discountNo">
              <span></span>
              <div class="el-couponMainBox">
                <p>不使用优惠</p>
                <span class="el-couponChoice" :class="{'el-couponSelected':typeData.selected}"
                      @click="ChoiceNo(typeData)"></span>
              </div>
            </div>
          </dd>
        </dl>
      </div>
      <div class="el-discountChoiceFool">
        <a @click="submit">确定</a>
      </div>
    </div>
    <!--收银台-->
    <div class="dm-paymentPop" v-if="showMode==showMode_setting.PayType">

      <div class="dm-paymentBox">
        <div class="dm-paymentTitle">
          <p>收银台</p>
          <!--<a @click="isshow=false">×</a>-->
        </div>
        <div class="dm-paymentMain">
          <div class="el-paymentTotalBox" v-show="titletext>0">
            <p>付款总金额</p>
            <span>￥<b>{{titletext}}</b></span>
          </div>
          <div class="dm-paymentMode" v-for="(item,index) in dataList" :key="index" :class="{'dm-paymentModeNoLink':item.IsPostPay==false}" @click="item.IsPostPay==true?payType(item):''">
            <span><img :src="item.ChannelImg"></span>
            <div class="dm-paymentModeMain">
              <dl>
                <dt>{{item.ChannelName}}</dt>
                <dd>{{item.ChannelDesc}}</dd>
              </dl>
            </div>
            <div class="dm-byStagesBox" v-if="item.SubChannel">
              <ul>
                <li v-for="(i,ind) in item.SubChannel" :class="{'dm-selected':ind==0}" @click.stop="i.IsPostPay==true?payType(i):''">
                  <p>{{i.ChannelName}}</p>
                  <span v-html="i.ChannelDesc"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="dm-paymentNo" >
          <a @click="cancelPayment">暂不支付</a>
        </div>
        <!-- <div class="dm-paymentFool">
            <a href="">付款</a>
        </div> -->
      </div>

    </div>
    <!--升级-->
    <div class="ec-jurisdictionPop" v-if="showMode==showMode_setting.Update">
      <div class="ec-upgradeBox">
        <div class="ec-upgradeMain">
          <ul>
            <li class="ec-upgradeBanner">
              <img src="../assets/images/pic_upgrade1.png">
              <img src="../assets/images/pic_upgrade2.png">
            </li>
            <li class="ec-upgradeText">请至应用市场升级
              <br>
              “智配APP”为最新版本
            </li>
            <li class="ec-upgradeButton">
              <a @click="quit">知道了</a>
            </li>
          </ul>
        </div>
        <a @click="quit">×</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Toast
  } from 'mint-ui';
  import {commonMixin} from "../config/base/commonMixin.js";
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "newCashDesk",
    mixins: [commonMixin],
    props:['subData','modalType'],
    mounted(){
      this.PickOrderPromotion();
      this.checkVersion();
    },
    data(){
      return {
        isShow:false,
        showMode:0, //展示模式
        showMode_setting: { //展示模式枚举设置
          setPoints: 1, //设置积分，
          PayType: 2, //支付方式，
        },
        list:[],
        validScore:'',
        typeData:{  //默认不适用优惠
          type:0,
          spendScore:0,
          selected:false,
        },
        scoreHelpText:'',
        shopOrderId:'',
        cloudShopId:'',
        dataList:[],
        resultdataInfo:null,
        titletext:'',
        spendScore:0,
        PromotionSelectType:0,
        ShowVlue:true
      }
    },
    methods:{
      //验证版本
      checkVersion(){
        var _this = this;
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_GetVersion", "", function (response) {
            if(_this.androidOrios() !=2){
              if (response > 2.96) {
                _this.ShowVlue = true;
              }else {
                _this.ShowVlue = false;
              }
            }else {
              if (response > 2.97) {
                _this.ShowVlue = true;
              }else {
                _this.ShowVlue = false;
              }
            }

          })
        })
      },//验证版本
      checkVersion(){
        var _this = this;
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_GetVersion", "", function (response) {
            if(_this.androidOrios() !=2){
              if (response > 2.96) {
                _this.ShowVlue = true;
              }else {
                _this.ShowVlue = false;
              }
            }else {
              if (response > 2.97) {
                _this.ShowVlue = true;
              }else {
                _this.ShowVlue = false;
              }
            }

          })
        })
      },
      quit(){
        this.cancelPayment();
        var _this = this;
        _this.showMode=_this.showMode_setting.PayType;
      },
      payType(type){
        var _this = this;
        if(type.ChannelID ==201){
          if(_this.ShowVlue==false){
            _this.showMode=_this.showMode_setting.Update
            return;
          }
        }
        if(_this.modalType ==0){
          var data ={
            ShopOrderId: _this.subData.shopOrderId, //订单ID
            ShopID: _this.subData.cloudShopId, //店铺ID
            ChannelID: type.ChannelID, //支付渠道ID
            spendScore:_this.spendScore||0,
            PromotionSelectType: _this.PromotionSelectType||0
          }
          var url = '/Order/PayShopOrder'
        }else {
          var data ={
            sRepairDepotId:_this.subData.sRepairDepotId,
            channelID: type.ChannelID // 支付渠道ID
          }
          var url = '/Bill/PayRepairDepotBill'
        }
        _this.ajax({
          method: "POST",
          url: resourceUrl + url,
          dataType: "JSON",
          data: data,
          success: function(str) {
            if (str.Header.ErrorCode == 0) {
             _this.SettingPaymentMethod(str.Body, type);
            }
          }
        });
      },
      cancelPayment(){
        this.$emit('cancelPayment')
      },
      SettingPaymentMethod(key, info){
        var _this = this;
        var data = {
          // payType: info.payType||1, //1支付宝，2微信，3银联
          credential: key
        };
        if(info.ChannelID == 201){
          data.payType = 2
        }else {
          data.payType = 1
        }
        if (data.payType == 2) {
          data.credential = JSON.parse(data.credential);
        }
        if (_this.androidOrios() == 1) {
          data = JSON.stringify(data);
        }
        _this.setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler("native_Pay", data, function(response) {
            var response = response;

            if (_this.androidOrios() == 1) {
              response = JSON.parse(response);
            }
            if(info.ChannelID ==201){
              if(_this.androidOrios() == 2){
                response = JSON.parse(response);
              }
            }
            if (response.payResult == 1) {
              _this.$emit('paymentCallback')
            }
          });
        });
      },
      PickOrderPromotion(){
        var _this = this;

        if(_this.modalType ==0){
          var data = {
            cloudShopId:_this.subData.cloudShopId, //云商ID
            shopOrderId: _this.subData.shopOrderId, //订单ID
            type:0
          }
        }else {
          var data ={
            sRepairDepotId:_this.subData.sRepairDepotId,
            type:1,
          }
        }
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/PickOrderPromotion",
          dataType: "JSON",
          data:data,
          success:function(str){
            if(str.Header.ErrorCode == 0){
              if(str.Body.details.length>0){
                _this.list = str.Body.details;
                _this.validScore = str.Body.validScore;
                _this.scoreHelpText = str.Body.scoreHelpText;
                //显示积分抵扣
                _this.showMode = _this.showMode_setting.setPoints;
              }else {
                _this.ChoiceType({spendScore:0, type:0})
              }
            }else {
              Toast(str.Header.ErrorCode)
            }
          }
        })
      },
      tomyPoints(){
        var baseUrl = window.location.protocol + "//" + window.location.host + "/myPoints.html?cf=1"

        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_JumpUrl", {url: baseUrl}, function (response) {});
        });
      },
      submit(){
        var submitData={}; //需要提交的类型数据
        for(var i=0;i<this.list.length;i++){
          if(this.list[i].selected){
            submitData.type=this.list[i].type;
            submitData.spendScore = this.list[i].spendScore
          }
        }

        if(JSON.stringify(submitData) =="{}"){
          if(this.typeData.selected){
            submitData.type = this.typeData.type;
            submitData.spendScore = this.typeData.spendScore;
          }
        }
        if(JSON.stringify(submitData) =="{}"){
          Toast('请选择优惠方式');
          return;
        }
        this.ChoiceType(submitData)
      },
      ChoiceType(data){

        var _this = this;
        _this.spendScore = data.spendScore;
        _this.PromotionSelectType = data.type
        if(_this.modalType ==0){
          var datas = {
            shopOrderId: _this.subData.shopOrderId, //订单ID
            ShopID: _this.subData.cloudShopId, //店铺ID
            spendScore:data.spendScore,
            PromotionSelectType:data.type
          }
          var url = '/Order/GetCashier';
        }else {
          var datas = {
            sRepairDepotId:_this.subData.sRepairDepotId
          }
          var url = '/Bill/GetBillCashier';
        }
        _this.ajax({
          method: "POST",
          url: resourceUrl + url,
          dataType: "JSON",
          data: datas,
          success: function(str) {
            if (str.Header.ErrorCode == 0) {
              _this.dataList = str.Body.PayList;
              _this.titletext = str.Body.PayMoney;
              _this.showMode = _this.showMode_setting.PayType;
            } else {
              Toast(str.Header.Message);
            }
          }
        });
      },
      judge(data){
        if(data.isEnable){
          if(data.selected){
            return 'el-couponSelected'
          }else {
            return ''
          }
        }else {
          return 'el-couponProhibit'

        }
      },
      Choice(data){
        if(data.isEnable){
          this.typeData.selected = false;
          for(var i=0;i<this.list.length;i++){
            this.list[i].selected = false;
            if(this.list[i].type == data.type){
              this.list[i].selected = true;
            }
          }
        }

      },
      ChoiceNo(obj){
        for(var i=0;i<this.list.length;i++){
          this.list[i].selected = false;
        }
        obj.selected = true;
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/css/paymentPop.css");
  @import url("../assets/css/preferentialWay.css");

  /*升级提醒弹层*/
  .ec-upgradeBox {
    width: 84%;
    height: 10.4rem;
    background: #fff;
    border-radius: .4rem;
    overflow: hidden;
    position: relative;
    float: left;
    clear: left;
  }

  .ec-upgradeBox>a {
    width: 1.04rem;
    height: 1.04rem;
    font-size: .72rem;
    line-height: .96rem;
    text-align: center;
    color: #fff;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 20;
  }

  .ec-upgradeMain,
  .ec-upgradeMain li {
    width: 100%;
    float: left;
    clear: left;
  }

  .ec-upgradeMain li.ec-upgradeBanner img {
    width: 100%;
    float: left;
    clear: left;
  }

  .ec-upgradeMain li.ec-upgradeText {
    padding: .64rem .72rem;
    font-size: .44rem;
    line-height: .8rem;
    text-align: center;
    color: #282828;
  }

  .ec-upgradeMain li.ec-upgradeButton {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ec-upgradeMain li.ec-upgradeButton a {
    width: 4.32rem;
    height: auto;
    border: 1px solid #f62928;
    border-radius: .62rem;
    font-size: .48rem;
    line-height: 1.2rem;
    text-align: center;
    color: #f62a2a;
    float: left;
    clear: none;
  }
  /*权限提醒弹层*/
  .ec-jurisdictionPop {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.48);
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 300;
  }
</style>
