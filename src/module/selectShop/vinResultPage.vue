<template>
  <div class="vinResultPage" v-show="initFlag">
    <!--<headers title="VIN码结果"></headers>-->
    <!--车型品牌信息-->
    <div class="aa-carBox " :class="{'aa-carDetailsBox':!isShowView}" v-on:click="seeVinDetail()" style="margin-top:0;position: fixed;
    z-index: 8;">
      <div class="aa-carPic">
        <img :src="autoBrandLogo">
      </div>
      <div class="aa-carMain aa-carResult">
        <p>{{autoBrandName}} {{autoModelName}}</p>
        <span>{{vinCode}}</span>
        <span class="ab-ShowView">{{isShowView?'车型详情':'收起'}}</span>
        <!--<span class="ab-ShowView" v-else></span>-->
      </div>
      <carStateInfo ref="carStateInfo" style="top:1.78rem"></carStateInfo>
      
    </div>
    <div style="padding-top:1.9rem">      <!--<HelloWorld msg="李小龙"/>-->
      <!-- 扫码结果通栏广告-->
      <bannerAdvert ref="bannerAdvert" styleMode="style_No3"></bannerAdvert>

    
        <div class="fc-newIncludedBrands" style="margin-bottom:0;margin: 0rem .4rem 0 .4rem;
      width: 92%;" v-show="newBrandText">
            <span>{{newBrandText}}</span>
            <a @click="tonextPage">查看详情</a>
          </div>
        <internationalBrand
          ref="internationalBrand"
          v-bind:userType="userRule"
          v-bind:vinCode="vin"
          v-on:showMoreVendor="showMoreVendor"
          v-on:goCjmlPage="goCjmlPage"
        ></internationalBrand>

         <!--更多门店的展示-->
        <MoreShop v-if="moreShopFlag" v-on:toParentHideFlag="getToParentHideFlag" v-bind:getshopbyuidData="getshopbyuidData"></MoreShop>
        <!--更多厂商目录的展示-->
        <MoreVendor v-if="moreVendorFlag" v-on:toParentVenFlag="getToParentVenFlag" v-bind:allBrandLogos="allBrandLogos"></MoreVendor>
        <!--点击查看详情-->
        <SeeDetails v-if="showDetails" v-on:hideDetails="getHideDetails" v-bind:parentData="parentData"></SeeDetails>
        <!--查看图片的组件-->
        <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
        <!-- 分享APP -->
        <shareFriends v-if="sharePop" v-on:shareFriendsHide="shareFriendsHide" v-bind:shareFlag="2" v-bind:shareData="userId"></shareFriends>

        <!-- 分享APP提醒弹层 -->
        <shareVenPop v-if="isShareVen" v-on:shareVenHide="shareVenHide" :shareInfo="shareData"></shareVenPop>

        <!-- 分享APP -->
        <shareFriends v-if="shareFriends_instance" v-on:shareFriendsHide="onShareFriends_hide" v-bind:shareFlag="3" v-bind:shareData="shareFriends_data"
          v-on:callbackshore="onShareFriends_callbackshore" v-bind:isShow="false"></shareFriends>

        <!--扫码结果浮层广告-->
        <floatingAdvert ref="floatingAdvert"></floatingAdvert>
        <!--排队坦层-->
        <customlayer ref="customlayer" v-on:Submit="Submit" v-on:tostep="tostep" v-on:hide="hide"></customlayer>

        <!--国际品牌-->
        <!--<div class="dg-international" style="padding-bottom: 1.2rem">-->
          <!--<p>国际品牌</p>-->
          <!--<span>-->
          <!--<a v-for="(item,index) in listguoji" :key="item.brandId" @click="goCjmlPage(item.brandUrl,item.dataType,item.brandName,item)">{{item.brandName}}</a>-->
          <!--</span>-->

        <!--</div>-->

        <div class="dc-replaceGuestOrder" v-show="canValetOrder">
          <!--<a @click="toCustomerManagement">代客下单</a>-->
          <a @click="sendVinTOPC">发送Vin码到PC端</a>
          <!--<a class="di-moreCatalog" v-on:click="sendVinTOPC">发送Vin码到PC端</a>-->
          <!-- <a class="di-moreCatalog" v-show="getBrandsCountData.isShow&&userRule!=3&&userRule!=2" @click="shareVenApp(getBrandsCountData.todayFollowcount)">更多智能产品目录</a>-->
        </div>
    </div>

    
 

   
    
    <!--非认证下的状态-->
    <!--<div class="dc-replaceGuestOrder" v-show="!canValetOrder&&getBrandsCountData.isShow&&userRule!=3&&userRule!=2">-->
    <!--<a v-on:click="shareVenApp(getBrandsCountData.todayFollowcount)">更多智能产品目录</a>-->
    <!--</div>-->
    <!-- 申请持续免费使用弹层 -->
    <div class="dh-pop dh-continuedFree" v-if="applyShow">
      <div class="dh-popBox">
        <div class="dh-popMain">
          <dl>
            <dt>申请成功</dt>
            <dd>客服人员会尽快联系您，请保持电话畅通！</dd>
            <dd class="dh-continuedFreeExplain" v-show="false">
              <p>免费使用国际品牌数据方式的说明：</p>
              <span>智配store已从数据查询软件升级为以数据为基础的配件销售系统，除了可以实现车架号自动匹配产品型号外，还可以基于扫码数据自动匹配进行订单处理、库存管理、客户管理、统计分析等功能。</span>
            </dd>
          </dl>
        </div>
        <a style="display: block;" @click="applyShow = false"></a>
      </div>
    </div>

    <div class="dh-pop dh-obtainOpportunity" v-if="notice">
      <div class="dh-popBox">
        <div class="dh-popMain">
          <dl>
            <dd>
              <p>满足以下条件即可获得免费查看机会：</p>
              <span>3天内完成1笔真实有效订单即可获得3天免费查看国际品牌机会；</span>
              <span>有效订单指：有报价且确认发货完成的订单。</span>
            </dd>
          </dl>
        </div>
        <a style="display: block;" @click="notice=false"></a>
      </div>
    </div>

    <!-- 支付成功弹层 -->
    <div class="dh-pop" v-if="paySuccess">
      <div class="dh-popBox">
        <div class="dh-paymentSuccess">
          <dl>
            <dt>支付成功</dt>
            <dd>可查看{{title}}国际品牌目录</dd>
            <dd class="dh-button">
              <a @click="paySuccess = false">完成</a>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <!-- 国际品牌查询弹层 有免费天数 -->
    <dhPop ref="dhPop" v-on:payInfo="payInfo" v-on:applyInfo="applyInfo" v-on:goIt="Submit"></dhPop>
    <dhPopstop ref="dhPopstop" v-on:payInfo="payInfo" v-on:applyInfo="applyInfo"></dhPopstop>
    <!--完善信息-->
    <perfectInformation ref="perfectInformation" v-on:CallBack="CallBack"></perfectInformation>
  </div>


</template>

<script>
  import router from "../../router/selectShop.js";

  //同步组建
  import shareVenPop from '../../components/shareVenPop.vue';
  import moreShop from '../../components/moreShop.vue';
  import seeDetails from '../../components/seeDetails.vue';
  import headers from '../../components/headers.vue';
  import photowipe from '../../components/photoswipe.vue';

  import shareFriends from '../../components/shareFriends.vue';
  import floatingAdvert from "../../components/floatingAdvert";
  import bannerAdvert from "../../components/bannerAdvert";
  import customlayer from "../../components/customlayer";
  //异步加载组建
  const dhPop = r => require.ensure([], () => r(require('../../components/dhPop')));
  const dhPopstop = r => require.ensure([], () => r(require('../../components/dhPopstop')));
  const moreVendor = r => require.ensure([], () => r(require('../../components/moreVendor.vue')));
  import internationalBrand from '../../components/internationalBrand'
  import carStateInfo from "../../components/carStateInfo";
  import perfectInformation from '../../components/perfectInformation'
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  import {
    Toast
  } from "mint-ui";
  import {
    MessageBox
  } from 'mint-ui';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: 'vinResultPage',
    mixins: [commonMixin],
    components: {
      shareVenPop: shareVenPop,
      MoreShop: moreShop,
      MoreVendor: moreVendor,
      SeeDetails: seeDetails,
      headers: headers,
      photowipe: photowipe,
      shareFriends,
      floatingAdvert,
      bannerAdvert,
      customlayer,
      dhPop,
      dhPopstop,
      internationalBrand,
      carStateInfo,
      perfectInformation
    },
    data() {
      return {
        carDetailPower:true,
        initFlag: false,
        allBrandLogos: [],
        vinJYData: [],
        carImage: [],
        carInfos: [],
        brandId: "",
        vin: this.getQueryString("v"),
        urls: window.location.href,
        showBrandId: false,
        noDatashow: false,
        autoBrandLogo: "",
        vinCode: "",
        autoBrandName: "",
        autoModelName: "",
        autoModelSubName: "",
        brandIdData: [],
        getshopbyuidData: ['1'],
        moreShopFlag: false,
        moreVendorFlag: false,
        showDetails: false,
        vCloak: false,
        parentData: {},
        isShowAddShop: 0,
        sharePop: false,
        userId: 0,
        userRule: 0,
        isShareVen: false,
        getBrandsCountData: [], //关联产品目录信息、次数
        tostToplimit: false,
        shareData: [],
        isPerfectInfo: false,
        //选择品牌
        isOfferPrompt: true,
        // isRedRuleShow: false,
        isPlaceOrder: true,
        isHaveRedPack: false,
        redTitle: "",
        promptCount: 0, //页面刷新次数
        mobile: 0,
        vinQueryPower:true,
        // 下面两个是看图需要的参数
        maxslideImg: [],
        isShowView: true,
        options: {
          getThumbBoundsFn(index) {
            var thumbnail = document.querySelectorAll('.action_carimg')[0];
            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            var rect = thumbnail.getBoundingClientRect();
            //console.log(rect);
            var ret = {
              x: rect.left + rect.width / 2,
              y: rect.top + pageYScroll + rect.height / 2,
              w: 0
            };
            return ret;
          }
        },
        timeOut: null,
        shopId: '',
        canValetOrder: false,
        listguoji: [],
        applyShow: false,
        // remainDays:0,
        ishide: true,
        notice: false,
        // access:'',
        paySuccess: false, //支付成功弹层
        title: '一周',
        shareFriends_instance: false,
        shareFriends_data: null,
        ModalHelper:null,
        newBrandText:'', //智能新收录文案
        SeeVinDetailLogIndex:0 //第一次展开车型详情

      }
    },
    methods: {
      tonextPage(){
        this.$refs.internationalBrand.brandChoice(3);
      },
      //完善信息回调
      CallBack(){
        window.location.reload()
      },
      IsShowVinCarDetail(){
        var _this= this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/IsShowVinCarDetail",
          dataType: "JSON",
          success:function(str){
            if(str.Header.ErrorCode==0){
              _this.carDetailPower = str.Body;
            }else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //初始化用户身份
      initUser() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/getuser",
          dataType: "JSON",
          success: function (data) {
            if (data.Body) {
              // debugger;
              _this.userId = data.Body.appUserId;
              _this.userRule = data.Body.userRule;
              _this.mobile = data.Body.mobile;
              if (data.Body.realName != '' && data.Body.companyName != '' && data.Body.companyAddress != '') {

                _this.isPerfectInfo = true;
              }
            }
          }
        });
      },
      //获取当前登录用户    今日关联(产品目录)次数
      getBrandsCount() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/GetBrandsCount",
          dataType: "JSON",
          success: function (data) {
            if (data.Body !== null) {
              // debugger;
              _this.getBrandsCountData = data.Body;
            }
          }
        });
      },
      //用户是否能有 (1、询单入口；2、是否有询单红包)
      getIsUserCanSubmitOrder() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/IsUserCanSubmitOrder",
          dataType: "JSON",
          success: function (data) {
            if (data.Body) {
              _this.isPlaceOrder = data.Body.isPlaceOrder == 1 ? true : false; // 是否可以有。一件询单的按钮。
              _this.isHaveRedPack = data.Body.isHaveRedPack == 1 ? true : false; // 是否有。下单 红包
              _this.redTitle = data.Body.redTitle;
              // _this.getCount();
            }
          }
        });
      },
      getCount() {
        var _this = this;
        // 当前浏览器是否支持localStorage
        console.log("初始化手机号:" + _this.mobile)
        if (localStorage) {
          // localStorage.removeItem('CJML_APP_PlaceOrder_Count');
          let localPlace = localStorage.getItem("CJML_APP_PlaceOrder_Count");
          console.log("初始化缓存:" + localPlace)

          if (localPlace) {
            let placeList = localPlace.split('_');
            let currentMobile = placeList[0];
            _this.promptCount = parseInt(placeList[1]);
            if (currentMobile == _this.mobile) {
              if (_this.promptCount > 4) {
                _this.isOfferPrompt = false;
              } else {
                localStorage.setItem("CJML_APP_PlaceOrder_Count", _this.mobile + "_" + (_this.promptCount + 1));
              }
            } else {
              localStorage.setItem("CJML_APP_PlaceOrder_Count", _this.mobile + "_" + (_this.promptCount + 1));
            }
            console.log("count:" + localPlace)
          } else {
            localStorage.setItem("CJML_APP_PlaceOrder_Count", _this.mobile + "_" + 0);
          }
        }
      },
      //获取精友参数
      getVinParamByVin() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Auto/GetJYAutoByVin',
          dataType: "JSON",
          data: {
            vinCode: _this.vin,
          },
          success: function (data) {

            _this.vinJYData = data.Body[0].AutoParamList;
            _this.carImage = data.Body[0].VinAutoBase.autoModelImages;
          }
        });
      },

      //跳转超级目录
      GotoCjmlVinPage() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/GotoCjmlVinPage",
          data: {
            vinCode: this.vin
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },

      //前往超级目录
      goCjmlPage(brandUrl, type, brandName, datas) {
        var _this = this;
        var goUrl = window.location.href;
        if (window.location.href.indexOf('/selectShop') != -1) {
          goUrl = window.location.href.split('/selectShop')[0];
        };
        var url = goUrl + '/cjml/h5/#!/vin?cf=1&v=' + _this.vin + '&appType=2&td=' + brandUrl + '&bn=' + encodeURIComponent(brandName);

        _this.GotoCjmlVinPage(); //记录跳转超级目录

        setTimeout(function () {
          _this.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('native_JumpUrl', {
              url: url
            }, function (response) {});
          });
        }, 50);
        // _this.$refs.customlayer.show();

        /*_this.ajax({
          method: "POST",
          url: resourceUrl + '/DistributorTask/NeedWaitTask',
          dataType: "JSON",
          data: {
            brandId: datas.brandId,
          },
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              if (data.Body.mode == 'redirect') {
                //计数
                _this.count(datas.brandId)
                var goUrl = window.location.href;
                if (window.location.href.indexOf('/selectShop') != -1) {
                  goUrl = window.location.href.split('/selectShop')[0];
                }
                ;
                var url = goUrl + '/cjml/h5/#!/vin?cf=1&v=' + _this.vin + '&appType=' + type + '&td=' + brandUrl + '&bn=' + encodeURIComponent(brandName);

                setTimeout(function () {

                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: url
                    }, function (response) {
                    });
                  });
                }, 50);
              } else if (data.Body.mode == 'wait') {

                _this.$refs.customlayer.show(brandUrl, type, brandName, datas.brandId);

                if (data.Body.privilegeCount > 0 && data.Body.canDoTask == true) {
                  _this.$refs.customlayer.setValue(data.Body.privilegeCount)

                } else if (data.Body.privilegeCount <= 0 && data.Body.canDoTask == true) {
                  _this.$refs.customlayer.butHide()
                  _this.$refs.customlayer.setValue(data.Body.privilegeCount)

                } else if (data.Body.privilegeCount > 0 && data.Body.canDoTask == false) {

                  _this.$refs.customlayer.enable = false;
                  _this.$refs.customlayer.setValue(data.Body.privilegeCount);
                } else {
                  _this.$refs.customlayer.butHide();
                  _this.$refs.customlayer.status = false;
                  _this.$refs.customlayer.enable = false;
                }

                var Time = data.Body.waitTime;
                _this.timeOut = setTimeout(function () {
                  _this.$refs.customlayer.hide();
                  //计数
                  _this.count(datas.brandId)
                  var goUrl = window.location.href;
                  if (window.location.href.indexOf('/selectShop') != -1) {
                    goUrl = window.location.href.split('/selectShop')[0];
                  }
                  ;
                  var url = goUrl + '/cjml/h5/#!/vin?cf=1&v=' + _this.vin + '&appType=' + type + '&td=' + brandUrl + '&bn=' + encodeURIComponent(brandName);

                  setTimeout(function () {
                    _this.setupWebViewJavascriptBridge(function (bridge) {
                      bridge.callHandler('native_JumpUrl', {
                        url: url
                      }, function (response) {
                      });
                    });
                  }, 50);

                }, Time * 1000)
              } else if (data.Body.mode == 'wait_purchase') {
                // data.Body.remainDays =1;
                // if(data.Body.remainDays>0){
                //   _this.$refs.dhPop.setBottomShow();
                //   _this.$refs.dhPop.show(brandUrl, type, brandName,datas.brandId,data.Body.access);
                //   _this.$refs.dhPop.setCount(data.Body.remainDays);
                // }else {
                _this.$refs.dhPopstop.show(brandUrl, type, brandName, datas.brandId, data.Body.landing_url);
                // _this.$refs.dhPopstop.setCount(data.Body.remainDays);

                _this.$refs.dhPop.setBottomHide();
                // }

              } else {
                Toast('异常状态');
              }
            } else {
              Toast(data.Heade.Message);
            }
            ;
          }
        })*/

      },


      Submit(brandUrl, type, brandName, brandId) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/DistributorTask/UsePrivilege',
          dataType: "JSON",
          success: function () {}
        })

        clearTimeout(_this.timeOut);
        _this.$refs.customlayer.hide();
        _this.$refs.dhPop.hide();
        _this.$refs.dhPopstop.hide();
        //计数
        _this.count(brandId)
        var goUrl = window.location.href;
        if (window.location.href.indexOf('/selectShop') != -1) {
          goUrl = window.location.href.split('/selectShop')[0];
        };
        var url = goUrl + '/cjml/h5/#!/vin?cf=1&v=' + _this.vin + '&appType=2&td=' + brandUrl + '&bn=' + encodeURIComponent(brandName);

        setTimeout(function () {
          _this.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('native_JumpUrl', {
              url: url
            }, function (response) {});
          });
        }, 50);

      },
      //计数
      count(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeeVinDetailLog",
          dataType: "JSON",
          data: {
            vinCode: _this.vin,
            sourceType: 1,
            bid: data
          },
          success: function () {

          }
        })
      },
      tostep() {
        var _this = this;
        clearTimeout(_this.timeOut);
        _this.$refs.customlayer.hide();
        var baseUrl = window.location.protocol + '//' + window.location.host + "/step.html?backurl=native_CloseWebview";

        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {
            url: baseUrl
          }, function (response) {

          })
        })

      },
      hide() {
        var _this = this;
        clearTimeout(_this.timeOut);
      },
     /* getDatas(postUrl, postData) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: postUrl,
          dataType: "JSON",
          data: postData,
          async: false,
          success: function (data) {
            if (data.Body == "" && _this.brandIdData != null) {

              _this.showBrandId = true;
              _this.ishide = false
            } else {
              _this.allBrandLogos = data.Body;
              _this.$refs.internationalBrand.setBrandLogovalue(_this.allBrandLogos);

            }
          }
        });
      },*/
      //获取国际品牌
      GetCjmlVinQueryPowerDetail() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/GetCjmlVinQueryPowerDetail",
          beforeSend: function () {},
          complete: function () {},
          dataType: "JSON",
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              // data.Body.vinQueryPower=false;
               _this.newBrandText = data.Body.newBrandText
              _this.vinQueryPower = data.Body.vinQueryPower
              _this.$refs.internationalBrand.setValue(data.Body);
            } else {
              Toast(data.Header.Message)
            }
          }
        })
      },
      getVinData(postUrl, postData) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: postUrl,
          dataType: "JSON",
          data: postData,
          async: false,
          success: function (data) {
            _this.brandIdData = data.Body
            if (data.Body == null && _this.allBrandLogos == "") {
              _this.vinCode = _this.vin;
              _this.noDatashow = true;
              _this.showBrandId = false;
            } else {

              _this.autoBrandLogo = data.Body.autoBrandLogo;
              _this.vinCode = data.Body.vinCode;
              _this.autoBrandName = data.Body.autoBrandName;
              _this.autoModelName = data.Body.autoModelName;
              _this.autoModelSubName = data.Body.autoModelSubName;
              setTimeout(function () {
                _this.vCloak = true;
              }, 500)
            }
          }
        });
      },
      //获得用户关注的门店
      getshopbyuid() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/usercenter/getusershopfororder",
          data: {
            "vinCode": this.getQueryString('v')
          },
          dataType: "JSON",
          success: function (data) {

            _this.getshopbyuidData = data.Body.userShop;
            _this.isShowAddShop = data.Body.isShowAddShop;
          }
        });
      },
      //点击展示更多门店
      showMoreShop() {
        var _this = this;
        _this.moreShopFlag = true;
      },
      //获取从子组件传递过来的值
      getToParentHideFlag(data) {
        var _this = this;
        _this.moreShopFlag = data;
      },
      //获取从子组件传递过来的值
      getToParentVenFlag(data) {
        var _this = this;
        _this.moreVendorFlag = data;
      },
      //点击展示更多厂商目录
      showMoreVendor(data) {
        var _this = this;
        _this.allBrandLogos = data;
        _this.moreVendorFlag = true;
      },
      //点击查看详情
      viewDetails(event, shopName, business) {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        _this.showDetails = true;
        _this.parentData.shopName = shopName;
        _this.parentData.business = business;
      },
      //获取组件是否隐藏的值
      getHideDetails(data) {
        var _this = this;
        _this.showDetails = data;
      },
      //点击查看车型详细信息
      seeVinDetail() {
        window.scrollTo(0, 0);
        event.stopPropagation();
        /*Toast('请至品牌目录结果页查看车型详情');
        return;*/
        var _this= this;
        _this.$refs.carStateInfo.setValue(_this.vinJYData);
        if(_this.carDetailPower){
          if(_this.isShowView==true){
            //打开分享弹层  需要先判断厂商有没有查看配件权限；
            // _this.sharePop = true;
            _this.$refs.carStateInfo.show();
            _this.isShowView=false;
            if(_this.SeeVinDetailLogIndex<1){
              _this.SeeVinDetailLogCount();
            }
           
            // _this.ModalHelper.afterOpen();
          }else {
            _this.isShowView=true
            _this.$refs.carStateInfo.hide();
            _this.SeeVinDetailLogIndex++
            // _this.ModalHelper.beforeClose();
          }
          // $('#selectShop').toggleClass("bw-carInfoBox")
        }else {
          var baseUrl = window.location.protocol + "//" + window.location.host + "/internantionPayment.html?cf=1";
          window.location.href=baseUrl;
          clearInterval(_this.$refs.internationalBrand.timer)

        }

      },
      SeeVinDetailLogCount(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeeVinDetailLog",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
          },
          success: function () {

          }
        })
      },
      //点击查看图片
      showCarImg: function (images, el) {
        //阻止事件冒泡
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(el.currentTarget).addClass("action_carimg");
        var _self = this;
        var imgInfo = images;
        _self.slideImg = imgInfo;
        _self.maxslideImg.splice(0);
        $.each(imgInfo, function (i, item) {
          _self.maxslideImg.push({
            src: item
          });
        });
        this.$refs.photowipe.show(0);
      },
      // 获取分享传递的数据
      shareFriendsHide(data) {
        var _this = this;
        _this.sharePop = data;
      },
      /*shareVenApp(count) {

        var _this = this;
        var url = window.location.protocol + "//" + window.location.host + "/selectBrand.html?v=" + _this.vin + '&selectBrand=1&cf=1&type=1&backurl=' +
          encodeURIComponent(window.location.href);

        if (_this.androidOrios() > 0) {
          _this.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('native_JumpUrl', {
              url: url
            }, function (response) {});
          });
          return;
        } else {
          window.location.href = url;
        }


      },*/
      // 获取分享传递的数据
      shareVenHide(data) {
        var _this = this;
        _this.isShareVen = data;
        _this.isShareVen = false;
      },
      goJumpPage(type, flag) {
        var _this = this;
        var url = window.location.protocol + "//" + window.location.host;
        switch (flag) {
          case 2:
            url += "/vendorsConcer.html?edit=1&type=2&cf=1&v=" + _this.vinCode;
            break; //智能产品目录页——编辑状态
          case 3:
            url += "/shopConcer.html?edit=1&type=2&v=" + _this.vinCode + '&backurl=native_CloseWebview';
            break; //智能门店页——编辑状态
          case 4:
            //历史订单
            url += "/orderHistory.html?type=2&vin=" + _this.vinCode + '&r=' + Math.random() + '&backurl=native_CloseWebview';
            break;
          default:
            break;
        }
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {
            url: url
          }, function (response) {});
        });
      },
      //转到待客下单页
      // toCustomerManagement(){
      //
      //   var baseUrl = window.location.protocol + "//" + window.location.host + "/manageh5/guestsUserList.html?shopid="+ this.shopId +"&backurl="+encodeURIComponent(window.location.href) +"&v=" + this.vin + "&cf=1&math=" + Math.random();
      //
      //   this.setupWebViewJavascriptBridge(function (bridge) {
      //     bridge.callHandler('native_JumpUrl', {
      //       url: baseUrl
      //     }, function (response) {
      //
      //     })
      //   })
      // },
      //发送Vin码到PC
      sendVinTOPC() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SendVinCodeToPc",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              Toast('发送成功，请确保PC后台为登录状态');
            }
          }
        })
      },
      GetSelfShopInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetSelfShopInfo",
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              _this.shopId = str.Body.cloudShopId
              _this.canValetOrder = str.Body.canValetOrder;

            }

          }
        })
      },
      //付费详情
      payInfo() {
        this.$refs.dhPop.hide();
        this.$refs.dhPopstop.hide();
        router.push({
          name: 'payment',
          // query:{
          //   backurl:'sdfasdfdsf'
          // }
        })
      },
      //申请免费使用
      applyInfo(access) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/common/ContactSalesman',
          dataType: "JSON",
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              // Toast('申请成功')
              _this.$refs.dhPop.hide();
              _this.$refs.dhPopstop.hide();
              _this.applyShow = true;
            } else {
              Toast(data.Header.Message)
            }
          }
        })
      },

      onShareFriends_hide() {
        this.shareFriends_instance = false;
      },
      //分享回调函数
      onShareFriends_callbackshore() {
        var _this = this;

        //记录分享
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/VinShare",
          dataType: "JSON",
          data: {
            VinCode: _this.vin,
          },
          success: function (str) {
            //do nothing
          }
        })
      },

    },
    created() {
      var _this = this;
      localStorage.removeItem('audioResult'); //清除本地录音缓存

      _this.initUser();
      //获取用户关注的门店
      _this.getshopbyuid();
      //获取当前登录用户    今日关联(产品目录)次数
      _this.getBrandsCount();
      //用户是否能有 (1、询单入口；2、是否有询单红包)
      _this.getIsUserCanSubmitOrder();
      //获取精友参数
      _this.getVinParamByVin();
      // _this.isInit();
      _this.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('native_SetTitle', "扫码结果", function (response) {});
      });
      localStorage.setItem("selectHtml", window.location.href);
      // 安卓系统禁止长按菜单 start
      document.oncontextmenu = function (e) {
        var target = $(e.path[0]);
        if (!(target.is("input") || target.is("textarea"))) {
          e.preventDefault();
        }
      };
      // 安卓系统禁止长按菜单 end

    },
    mounted() {
      var _this = this;
      _this.getVinData(resourceUrl + "/auto/getautoinfobyvin", {
        "vinCode": _this.vin
      });
     /* _this.getDatas(resourceUrl + "/usercenter/getbrandsbyuid", {
        "dataType": 2, //全部关联品牌 0  常用品牌 2
      });*/
      setTimeout(function () {
        _this.initFlag = true;
      }, 500)

      // _this.listenBackEvent("native_CloseWebview");

      _this.GetSelfShopInfo();
      _this.ModalHelper = this.SlidingPen(); //执行滑动穿透的方法;

      // _this.getfamousbrands();
      //查询用户VIN码查询免广告权限,还可以返回国际品牌
      _this.LoadComplete(function(){
         _this.nativeLsitenBack('native_CloseWebview');
        _this.GetCjmlVinQueryPowerDetail();
        _this.IsShowVinCarDetail();
      })

      // setInterval(function(){
      //   _this.getfamousbrands();
      // },3000)
      _this.IsShowVinCarDetail();
     /* if (_this.$route.params.type == 1) {
        _this.paySuccess = true;
        _this.title = _this.$route.params.title;

        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_BackBtn', '', function (response) {

            _this.setupWebViewJavascriptBridge(function (bridge) {
              bridge.callHandler('native_CloseWebview', '', function (response) {});
            });
          });
        });
      } else {
        _this.paySuccess = false;
        _this.nativeLsitenBack("native_CloseWebview");
      }*/

    },

  }

</script>
<style>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/shopChoose/shopChoose.css");
  @import url("../../assets/css/aboutUs/aboutUs.css");
  @import url("../../assets/css/shopChoose/internationalstyle.css");
  @import url("../../assets/css/shopChoose/paymentstyle.css");
  @import url("../../assets/css/bannerAdvert.css");

  .bj-toastBoxNumber {
    width: 7.6rem;
    height: 1.84rem;
    margin: -.92rem 0 0 -3.8rem;
    background: rgba(0, 0, 0, 0.78);
    border-radius: .32rem;
    font-size: .4rem;
    line-height: .68rem;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 40;
  }

  .aa-chooseBox ul.cc-brandChoose li div.cd-brandBox span {
    width: 100%;
    height: 1.84rem;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .aa-chooseBox ul.aa-brandChoose li.bj-chooseNew {
    width: 100%;
    height: 3rem;
    padding: 0;
    border-top: 1px solid #dce6ef;
    border-bottom: 1px solid #dce6ef;
    margin-top: -1px;
  }

  .aa-chooseBox ul.aa-brandChoose li.bj-chooseNew a {
    width: 100%;
    height: auto;
    padding-top: 0rem;
    display: block;
    float: left;
    clear: left;
  }

  .aa-chooseBox ul.aa-brandChoose li.bj-chooseNew a p {
    width: 100%;
    height: .48rem;
    margin-top: .2rem;
    font-size: .32rem;
    line-height: .48rem;
    text-align: center;
    color: #666;
    float: left;
    clear: left;
  }

  .aa-chooseBox ul.aa-brandChoose li.bj-chooseNew a.bo-chooseNewRed span {
    /*background: url(../images/icon_plusRed.png) no-repeat center center;*/
    background-size: .64rem;
  }

  .dc-replaceGuestOrder {
    width: 100%;
    height: auto;
    background: #fff;
    border-top: 1px solid #d8d8d8;
    padding: .2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 4;
  }

  .dc-replaceGuestOrder a {
    width: auto;
    height: auto;
    padding: 0 .68rem;
    background: #e74c3c;
    border-radius: .44rem;
    font-size: .44rem;
    line-height: .86rem;
    text-align: center;
    color: #fff;
    float: left;
    clear: left;
  }

  /*!*0912 调整*!*/
  .aa-chooseBox ul.aa-brandChoose li.bj-chooseNew {
    width: 25%;
    height: 3rem;
    border: none;
    border-bottom: 1px solid #dce6ef;

  }

  .aa-chooseBox ul.aa-brandChoose li.bj-chooseNew a span {
    background-image: url(../../assets/images/icon_plusRed.png);
  }

  .aa-chooseBox ul.aa-brandChoose li.bj-chooseNew a p {
    height: auto;
  }

  #selectShop {
    height: 100%;
    overflow: scroll;
    display: -webkit-box;
    box-orient: vertical;
    -webkit-box-orient: vertical;
  }
  .bw-carInfoBox {
    overflow: hidden !important;
  }
  /* ios系统禁止长按菜单 start*/
  body {
    -webkit-touch-callout: none;
    /*系统默认菜单被禁用*/
    -webkit-user-select: none;
    /*webkit浏览器*/
    -khtml-user-select: none;
    /*早期浏览器*/
    -moz-user-select: none;
    /*火狐浏览器*/
    -ms-user-select: none;
    /*IE浏览器*/
    user-select: none;
    /*用户是否能够选中文本*/
  }
  /* ios系统禁止长按菜单 end*/


</style>
