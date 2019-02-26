<template>
  <div id="pagment" style="height: 100%;">
    <div class="paymentPage"  v-if="!issuccess">
      <div class="eu-sloganBanner" @click="adExplainPop=true">
        <img src="../../assets/images/pic_sloganVIP.png">
      </div>
      <div class="dh-choiceService">
        <a :class="{'dh-selected':item.selected}" v-for="(item,index) in list" :key="index" @click="select(item,index)">
          <p>VIP {{item.title}}</p>
          <span><b>￥</b>{{item.salePrice}}</span>
          <span class="et-originalPrice" v-show="item.price">{{item.price}}</span>
          <span class="eu-labelRecommend" v-if="item.isRecommend"></span>
        </a>
      </div>
      <div class="et-memberPrivilege">
        <img src="../../assets/images/pic_privilege.png">
      </div>
      <!--<div class="dh-serviceExplain">可查看{{brandName}}{{price.title}}国际品牌目录</div>-->

      <div class="dh-paymentMain">
        <ul>
          <li v-for="(item,index) in payTypeList" :class="{'dh-selected':item.selected}" :key="index" @click="selectPayType(item)">
            <span :class="item.calssIconName"></span>
            <p>{{item.name}}
              <b v-show="item.childShow">{{item.childText}}</b>
            </p>
          </li>
        </ul>
      </div>
      <div class="dh-paymentMain eu-replacePayment">
        <ul>
          <li @click="shareFriend">
            <span class="eu-replacePaymentIcon"></span>
            <p>邀请微信好友代我付款</p>
          </li>
        </ul>
      </div>

      <!-- <div class="ev-adExplainLink">
        <a @click="adExplainPop=true" >关于智配插播广告的情况说明</a>
      </div> -->
      <div class="dh-paymentFool">
        <p>总金额：<b>￥{{price.salePrice}}</b></p>
        <a @click="submit">确认支付</a>
      </div>

    </div>
    <div class="eu-paymentSuccessPage" v-else>
      <div class="eu-paymentSuccessBox">
        <p>好友已为您支付</p>
        <span>智配VIP {{userInfo.title}}：<b>￥{{userInfo.price}}</b></span>
        <span class="eu-seeCatalog" v-show="jumptype!=1&& jumptype!=2"><a @click="toHistory">看目录</a></span>
      </div>
    </div>
    <shareFriends v-if="shareFriendsNo3" v-on:shareFriendsHide="onShareFriendsNo3_hide" v-bind:shareFlag="3" v-bind:shareData="shareDataNo3"
                  v-on:callbackshore="onShareFriendsNo3_callbackshore" v-bind:showfriends="true"></shareFriends>
    <!--关于智配插播广告的情况说明 弹层-->
    <div class="eu-adExplainPop" v-if="adExplainPop">
      <div class="eu-adExplainBox">
        <dl>
          <dt></dt>
          <dd>
            <span>尊敬的智配Store用户：</span>
            <p>智配Store作为一款汽配数据查询工具，发布一年多来，深受用户好评和认可，用户量急剧飙升，查询次数也突破惊人的年度超亿次，远远超过预期。智配store维护运营成本也随之飙升（包括不限于服务器，流量费用等各类IT运维，App及产品开发等人员费用），而这些成本并没有由厂商客户来承担。长期持续下去，必然对智配的服务质量和稳定性产生影响。</p>
            <p>为向用户提供持续高质量的服务体验，在让用户全免费体验1年多后，智配Store决定从2019年1月9日起，开始引入第三方，即广告主来承担部分成本。对于广告无容忍度的用户，也可以付费成为VIP会员免广告。</p>
            <p>期待得到大家的理解和支持，让我们一起做得更好！</p>
          </dd>
        </dl>
        <a @click="adExplainPop=false"></a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  import {
    Toast
  } from "mint-ui";
  var resourceUrl = process.env.apiDomain;
  import shareFriends from '../../components/shareFriends'
  export default {
    name: "internantionPayment",
    mixins: [commonMixin],
    components: {
      shareFriends
    },
    mounted() {
      this.setTitle('付费详情');
      if(this.jumptype==1 || this.jumptype==2){
        this.nativeLsitenBack('native_CloseWebview');
      }else {
        this.nativeLsitenBack();
      }
      
      this.GetCjmlVinQuerySalePrice();
      console.log(this.backurl);
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

    },
    data() {
      return {
        list: [],
        shareFriendsNo3:false,
        shareDataNo3:{
          title:'帮我付款才是真友谊',
          desc:'你的一小笔开支，是我们关系的一大步，为我付款吧~',
          href: window.location.protocol + "//" + window.location.host + "/friendPayment.html"
        },
        adExplainPop:false,
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
            calssIconName:'el-weixinAlipayIcon',
            childText:'（升级到最新版本才能使用）',
            childShow:false
          }
        ],
        type:1, //默认支付类型支付包
        jumptype:this.getQueryString("jumptype"),
        payType: true,
        brandId: this.getQueryString("brandId"),
        backurl: this.getQueryString("backurl"),
        jumpUrl:this.getQueryString("jumpUrl"),
        issuccess:false,
        key:'', //订单key
        timer:null
      }
    },
    computed: {
      price: function () {
        var obj = null;
        for (var i = 0; i < this.list.length; i++) {
          if (this.list[i].selected == true) {
            obj = this.list[i]
          }
        }
        if(obj==null){
          obj = {title:''};
        }
        return obj
      }
    },
    methods: {
      onShareFriendsNo3_callbackshore(){
        var _this = this;
        _this.timer = setInterval(function(){
          _this.GetCjmlReplacePay()
        },1000)

      },
      //获取订单状态
      GetCjmlReplacePay(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Auto/GetCjmlReplacePay',
          dataType: "JSON",
          beforeSend:function(){},
          complete:function(){},
          data:{
            key: _this.key,
          },
          success:function(str){
            if(str.Header.ErrorCode ==0){
              if(str.Body.state==1){
                _this.issuccess = true;
                clearInterval(_this.timer)
                _this.userInfo=str.Body;
              }
            }else {
              Toast(data.Header.Message);
            }
          }
        })
      },
      //分享huidiao
      onShareFriendsNo3_hide(){
        this.shareFriendsNo3 = false;
      },
      //分享好友
      shareFriend(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Auto/AddCjmlReplacePay',
          dataType: "JSON",
          data:{
            set: _this.price.set,
          },
          success:function(str){
            if(str.Header.ErrorCode==0){
              _this.shareDataNo3.href=window.location.protocol + "//" + window.location.host + "/friendpay.html?agentticket="+str.Body.agentTicket + '&cachekey=' + str.Body.key;
              // _this.shareDataNo3.href = 'https://c1.zhipeicloud.com/appActivities/zhipei20190116/friendpay.html?cf=1&agentticket='+str.Body.agentTicket + '&cachekey=' + str.Body.key;
              _this.shareFriendsNo3 = true;
              _this.key = str.Body.key;
            }else {
              Toast(Toast(data.Header.Message));
            }
          }
        })

      },
      toHistory(){
        window.history.back()
      },
      select(data, index) {
        for (var i = 0; i < this.list.length; i++) {
          this.list[i].selected = false
        }
        for (var i = 0; i < this.list.length; i++) {
          if (this.list[i].price == data.price) {
            this.list[i].selected = true;
          }
        }
      },
      //提交支付
      submit() {
        // if (this.payType == false) {
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
          url: resourceUrl + '/Auto/SubmitCjmlVinQueryPurchase',
          dataType: "JSON",
          data: {
            set: _this.price.set,
            payType: _this.type,
          },
          success: function (data) {

            if (data.Header.ErrorCode == 0) {
              _this.transferPayment(data.Body)
            } else {
              Toast(data.Header.Message)
            }
          }
        })
      },
      GetCjmlVinQuerySalePrice() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Auto/GetCjmlVinQuerySalePrice',
          dataType: "JSON",
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              // _this.brandName = data.Body.brandName;
              _this.list = data.Body.salePrice;
            } else {
              Toast(data.Header.Message)
            }
          }
        })
      },
      //选择支付方式
      selectPayType(data) {
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
      },
      //计数接口
      count(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeeCatalogLog",
          dataType: "JSON",
          data: {
            sourceType: 2,
            bid: data
          },
          success: function () {

          }
        })
      },
      //调用支付宝接口
      transferPayment(data) {
        var _self = this;
        var data = {
          // "orderId": data.orderId,
          "payType": _self.type, //1支付宝，2微信，3银联
          "credential": data.credential,
        };
        if(_self.type==2){
          data.credential = JSON.parse(data.credential)
        }
        if (_self.androidOrios() == 1) {
          data = JSON.stringify(data);
        };
        _self.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_Pay', data, function (response) {

            var response = response;

            if (_self.androidOrios() == 1) {
              //安卓需要转实体
              response = JSON.parse(response);
            };
            // alert(response)
            // alert(JSON.parse(response))
            // alert(JSON.parse(response).payResult)
            if(_self.type ==2){
              if(_self.androidOrios() == 2){
                response = JSON.parse(response);
              }
            }
            if (response.payResult == 1) {
              if(_self.jumptype==1 || _self.jumptype==2){
                _self.setupWebViewJavascriptBridge(function (bridge) {
                  bridge.callHandler('native_CloseWebview', '', function (response) {});
                });
              }else {
                if(_self.jumpUrl){
                   _self.count(_self.brandId)
                  //  window.location.href = window.location.protocol + _self.jumpUrl;
                  _self.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_CloseWebview', '', function (response) {});
                  });
                 
                  _self.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler(
                      "native_JumpUrl", {
                        url: window.location.protocol + _self.jumpUrl
                      },
                      function (response) {}
                    );
                  });
             
                }else {
                  window.history.back(-1);
                }
              }
              
             /* _self.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('native_CloseWebview', '', function (response) {});
              });

              if (_self.backurl) {
                _self.setupWebViewJavascriptBridge(function (bridge) {
                  bridge.callHandler(
                    "native_JumpUrl", {
                      url: _self.backurl
                    },
                    function (response) {}
                  );
                });
              }*/

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
