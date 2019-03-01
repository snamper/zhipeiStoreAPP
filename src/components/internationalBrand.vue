<template>
  <div class="ec-modularBox fd-mofularBox">
    <!--v-if="userBrands.length>0"-->

    <div class="ec-modularTitle">
      <p>智能产品目录</p>
      <span class="fe-renewBox" v-if="ExpireText">
					<b>{{ExpireText}}</b>
					<a @click="goPay">续费</a>
				</span>
      <div class="ec-modularTitleRight">
        <a @click="goJumpPage(userType,2)">管理</a>
      </div>
    </div>
     <div class="fd-addtoGuideBox" v-show="initAddBrandGuidance()">
            <div class="fd-addtoGuideMack"></div>
            <div class="fd-addtoGuide">
              <dl>
                <dt>
                  <p>国际品牌和更多配件目录</p>
                  <span>在这里添加关注</span>
                </dt>
                <dd>
                  <a @click="nowmath">知道了</a>
                </dd>
              </dl>
            </div>
          </div>
    <div style="height: 100%;width: 100%" v-show="!iswait">
      <div class="es-brandCatalogue" v-show="!needShowAdvert">
        <div class="es-followBrandBox">
          <ul>
            <li v-for="(item,index) in userBrands" @click="selected(item)" v-show="(is_brand_folded && index<brand_max) || !is_brand_folded" :class="{'fc-brandBig':item.isFamousBrand==1}">
              <span class="es-brandCataloguePic">
                <img v-show="item.brandLogo" :src="item.brandLogo" alt="">
                <img v-show="item.brandLogo==''" src="../assets/images/vendorsConcer/storeLogo.png" alt="">
              </span>
              <p class="es-brandCatalogueName">{{item.viewBrandName}}</p>
              <span class="fd-labelBox" :style="{'display':item.isZhiPeiVipPay==0?'none':'block'}">VIP</span>
            </li>


            <li v-if="userType !=3" @click="brandChoice(1)">
              <span class="es-brandCataloguePic">
                <b class="fc-newsBig"></b>
              </span>
              <p class="es-brandCatalogueName">添加品牌</p>
              <!-- <span class="fd-gestureBox" v-if="addBrandGuidance && userType !=2"></span> -->
            </li>
            <li @click="brandChoice(2)">
              <span class="es-brandCataloguePic">
                <b class="fc-newsBig"></b>
              </span>
              <p class="es-brandCatalogueName">国际品牌</p>
              <!-- <span class="fd-gestureBox" v-if="addBrandGuidance && userType !=2"></span> -->
            </li>
          </ul>
         

        </div>

      </div>
      <div class="fd-moreButton" v-show="userBrands.length>brand_max" @click="switchMoreVendor">
        <a><b :class="{'fd-retractButton':!is_brand_folded}">{{is_brand_folded?'更多品牌':'收起'}}</b></a>
      </div>

      <div class="fc-nearbyBrandBox" v-if="!needShowAdvert" v-show="sideSales.length>0">
        <div class="fc-nearbyBrandTitle">
          <dl>
            <dt>附近在售品牌</dt>
            <dd>
              <a class="fc-changeLink" @click="changeorder">换一批</a>
              <a @click="brandChoice(1)">看全部</a>
            </dd>
          </dl>
        </div>
        <div class="es-followBrandBox">
          <ul>
            <li v-for="(item,index) in sideSales" :key="index">
              <span class="es-brandCataloguePic">
                <b class="fc-brandBig" v-if="item.isFamousBrand==1">{{item.viewBrandName.substring(0,1)}}</b>
                <img :src="item.brandLogo" alt="" v-else>
              </span>
              <p class="es-brandCatalogueName">{{item.viewBrandName}}</p>
              <span class="fc-buttonAdd">
                <a @click="addOrder(item)" :class="{'selected':item.dataType==2}">{{item.dataType==1?"添加":"已添加"}}</a>
              </span>
              <span class="fc-newsLabel">News</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="et-adPosition" v-show="needShowAdvert">
        <mt-swipe :auto="oneAdvertShowTime" :speed="100" :show-indicators="false" style="height: 100%;" ref="mtSwipe" v-on:change="changeSwiper"
          @touchmove="ontouchmove">
          <mt-swipe-item v-for="(item,index) in advertList" :key="index">
            <span>
              <img :src="item.imgUrl" style="width: 100%;height: auto" @click.stop="tojumpUrl(item)">
            </span>
          </mt-swipe-item>
        </mt-swipe>
        <div class="et-closeAdBox" @click.stop="goPay">
          <span v-show="isShowAdvertLeftTime">
            {{advertLeftTime}}S
          </span>
          <a>会员免广告</a>
          <!--<span>会员免广告 (S)</span>-->
        </div>
      </div>

    </div>
    <div style="height: 100%;width: 100%" v-show="iswait">
      <!-- 人数过多时加载效果 -->
      <div class="fa-lineUpTips">
        <dl v-if="!waitmask">
          <dt>{{waitText}}</dt>
          <dd>
            <span><a @click.stop="goPay">成为VIP会员</a></span>
          </dd>
          <dd>
            <p><a @click.stop="goPay">走VIP会员通道，无需等待 >></a></p>
          </dd>
        </dl>
        <dl class="fa-lineUpFail" v-else>
          <dt>等待时间过长，请返回重试</dt>
          <dd>
            <p><a @click.stop="goPay">走VIP会员通道，无需等待 >></a></p>
          </dd>
        </dl>
      </div>
    </div>
    <div class="fc-advertisementBox" v-if="GetManyAdvertBySpace.length>0">
      <div class="fc-advertisementTitle">
        <p>新品招商</p>
      </div>
      <div class="fc-advertisementMain">
        <ul>
          <li v-for="(item,index) in GetManyAdvertBySpace" :key="index" @click="landingPage(item)">
            <img :src="item.advertFile">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  var resourceUrl = process.env.apiDomain;
  import {
    Swipe,
    SwipeItem
  } from 'mint-ui';
  import {
    commonMixin
  } from "../config/base/commonMixin.js";
  import {
    Toast
  } from "mint-ui";
  export default {
    name: "internationalBrand",
    mixins: [commonMixin],
    props: ['vinCode', 'userType'], //userType 2修理厂,1经销商3、厂商
    components: {
      'mt-swipe': Swipe,
      'mt-swipe-item': SwipeItem,
    },
    computed: {},
    watch: {

    },
    mounted() {
      this.resetBrandMax();
      this.GetManyAdvertBySpacemeth();
      if (this.behaviorRecorder.getBehavior(this.behaviorRecorder.behaviorIndex.addBrandGuidance) == 0) {
        this.addBrandGuidance = true;
      } else {
        this.addBrandGuidance = false;
      }
    },
    data() {
      return {
        famousBrands: [], //国际品牌列表
        userBrands: [], //用户关注的品牌列表
        advertList: [], //广告列表
        sideSales: [], //附近在售
        needShowAdvert: false, //是否需要展示广告
        // canFreeLoadFamousBrand: true, //能否免费查看国际品牌
        isShowAdvertLeftTime: false, //是否展示广告剩余时间
        advertLeftTime: 0, //广告剩余时间
        oneAdvertShowTime: 5000, //广告每帧展示时间
        timer: null,
        waitText: '查询人数过多，请耐心等待…', //等待文字
        iswait: false, //是否需要等待
        lateTime: 0, //排队等待的时间
        isViewBrand: true, //排队等待后 true 为成 false 为加载失败
        waitmask: false, //显示后面的等待弹层
        GetManyAdvertBySpace: [],
        sideSalesone: [],
        index: 0,
        vinQueryPower: false, //是否是vip
        brand_max: 10, //品牌可容纳最大值
        addBrandGuidance: false,
        is_brand_folded: true, //品牌是否已折叠,
        ExpireText:'' //显示vip查询剩余天数，默认不显示
      }
    },
    methods: {
      //初始化显示引导弹层
      // addBrandGuidance && userType !=2
      initAddBrandGuidance(){
      
        if(this.addBrandGuidance==true && (this.userType==1 || this.userType==3)){
          return true;
        }else {
          return false;
        }
      },
      //重新设置品牌可容纳最大值
      resetBrandMax() {
        switch (this.userType) {
          case 1:
          case 2:
          default:
            this.brand_max = 10;
            break;
          case 3:
            this.brand_max = 11;
            break;
        }
      },

      //重新激活用户类型
      reactiveUserType(userrule) {
        this.userType = userrule;
        this.resetBrandMax();
      },
      nowmath() {
        this.addBrandGuidance = false;
        this.behaviorRecorder.setBehavior(this.behaviorRecorder.behaviorIndex.addBrandGuidance, 1);
      },
      landingPage(data) {
        window.location.href = data.landingPage;
      },
      //获取广告
      GetManyAdvertBySpacemeth() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Ad/GetBusinessAdvert",
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.GetManyAdvertBySpace = str.Body;
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      changeSwiper(index) {
        var arr = this.advertList;
        for (var i = 0; i < this.advertList.length; i++) {
          // debugger;
          if (i == index) {
            this.$refs.mtSwipe.auto = this.advertList[i].showTime;
            this.$refs.mtSwipe.clearTimer();
            this.$refs.mtSwipe.initTimer();
          }
        }
        // debugger;
      },
      tojumpUrl(data) {
        var url = data.jumpUrl
        if (url.indexOf('http') != -1) {
          window.location.href = data.jumpUrl;
        }
      },
      resultstyle() {
        if (!this.isShowAdvertLeftTime) {
          return 'none'
        }
      },
      shareVenApp() {
        var _this = this;
        _this.GetUser(function (isPerfectInfo) {
          if (isPerfectInfo == 1) {
            var url = window.location.protocol + "//" + window.location.host + "/selectBrand.html?v=" + _this.vinCode +
              '&selectBrand=1&cf=1&type=1&backurl=' +
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
          } else {
            _this.$parent.$refs.perfectInformation.show();
          }

        })

      },
      changeorder() {
        this.index++
        if (this.index > 2) {
          this.index = 0
        }
        this.sideSales = this.sideSalesone[this.index];
      },
      GetUser(callBack) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetUser",
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              callBack(str.Body.isPerfectInfo);
            }
          }
        })
      },
      addOrder(data) {
        if (data.dataType == 1) {
          var arr = []
          arr[0] = data.brandId
          var _this = this;
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/Common/FollowOneBrand",
            data: {
              brandId: arr
            },
            dataType: "JSON",
            success: function (str) {
              if (str.Header.ErrorCode == 0) {
                Toast('添加成功');
                _this.userBrands.unshift(data);
                data.dataType = 2
                // _this.$parent.GetCjmlVinQueryPowerDetail();
              }
            }
          })
        }

      },
      //点击展示更多厂商目录
      switchMoreVendor() {
        this.is_brand_folded = !this.is_brand_folded;
      },
      //前往超级目录
      goCjmlPage(brandUrl, type, brandName, datas) {
        this.$emit('goCjmlPage', brandUrl, type, brandName, datas)
      },
      setValue(data) {
        var _this = this;
        this.sideSales = data.sideSales || [];
        _this.sideSalesone = []

        if (this.sideSales.length > 0) {
          var arr1 = [];
          var arr2 = [];
          var arr3 = [];
          for (var i = 0; i < this.sideSales.length; i++) {
            if (i >= 0 && i <= 3) {
              arr1.push(this.sideSales[i])
            } else if (i > 3 && i <= 7) {
              arr2.push(this.sideSales[i])
            } else {
              arr3.push(this.sideSales[i])
            }
          }

          if (arr1.length > 0) {
            _this.sideSalesone.push(arr1)
          }
          if (arr2.length > 0) {
            _this.sideSalesone.push(arr2)
          }
          if (arr3.length > 0) {
            _this.sideSalesone.push(arr3)
          }
        }

        if (_this.sideSalesone.length > 0) {
          this.sideSales = _this.sideSalesone[this.index]
        } else {
          this.sideSales = []
        }

        this.userBrands = data.userBrands || [];
        this.famousBrands = data.famousBrands || [];
        this.advertList = data.vinQueryAdvert.advertList;
        this.lateTime = data.lateTime;
        this.isViewBrand = data.isViewBrand;
        this.vinQueryPower = data.vinQueryPower;
        this.ExpireText = data.ExpireText;

        //设置第一个广告时长为swipe间隔时间
        if (this.advertList.length > 0) {
          this.oneAdvertShowTime = this.advertList[0].showTime;
        }

        this.needShowAdvert = (!data.vinQueryPower) && this.advertList.length > 0;
        // this.canFreeLoadFamousBrand = data.vinQueryPower;

        this.advertLeftTime = function () {
          var result = 0;
          const ANIMATION_SPEED = 300;
          _this.advertList.forEach(oneAdvert => {
            result += oneAdvert.showTime;
          });
          //总时间要加上swipe间隔动画时间 
          result = parseInt((result + parseInt((_this.advertList.length - 1) * ANIMATION_SPEED)) / 1000);
          return result;
        }();

        if (this.needShowAdvert) {
          //最后10秒才展示倒计时
          _this.isShowAdvertLeftTime = false;
          clearInterval(_this.timer)
          _this.timer = setInterval(function () {
            if (_this.advertLeftTime > 1) {
              _this.advertLeftTime--;
              if (_this.advertLeftTime < 11) {
                _this.isShowAdvertLeftTime = true;
              }
            } else {
              _this.needShowAdvert = false;
              clearInterval(_this.timer);
              _this.isShowAdvertLeftTime = false;
              if (_this.lateTime > 0) {
                _this.iswait = true;
                setTimeout(() => {
                  if (_this.isViewBrand) {
                    _this.iswait = false;
                  } else {
                    _this.waitmask = true;
                    // _this.waitText = '目前查询人数过多，请重新扫码'
                  }
                }, _this.lateTime);
              }

            }
          }, 1000)
        }

      },
      selected(data) {
        this.IsSeeFamousBrandPower(data);
      },
      /* setBrandLogovalue(data){
         // this.userBrands = data;
       },*/
      goJumpPage(userType, flag) {
        var _this = this;
        // debugger;
        var url = window.location.protocol + "//" + window.location.host;
        var type;
        if (userType == 2) {
          type = 1
        } else if (userType == 1) {
          type = 2
        } else {
          type = 3
        }
        switch (flag) {
          case 2:
            url += "/vendorsConcer.html?edit=1&type=" + type + "&cf=1&v=" + _this.vinCode + "&m=" + Math.random();
            break; //智能产品目录页——编辑状态
          default:
            break;
        }
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_JumpUrl", {
            url: url
          }, function (
            response
          ) {});
        });
      },
      //跳转超级目录
      GotoCjmlVinPage() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/GotoCjmlVinPage",
          data: {
            vinCode: this.vinCode
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },
      ontouchmove() {

      },
      IsSeeFamousBrandPower(data) {
        var _this = this;
        var url = window.location.protocol + "//" + window.location.hostname + "/cjml/h5/#!/vin?cf=1&v=" + _this.vinCode + "&appType=2&td=" + data.brandUrl +
          "&bn=" + encodeURIComponent(data.brandName);
        if (data.isZhiPeiVipPay == 1 && _this.vinQueryPower == false) {
          _this.goPay()

        } else {
          _this.count(data.brandId)
          _this.GotoCjmlVinPage(); //记录跳转超级目录
          setTimeout(function () {
            _this.setupWebViewJavascriptBridge(function (bridge) {
              bridge.callHandler("native_JumpUrl", {
                url: url
              }, function (response) {});
            });
          }, 50);
        }
      },

      //付费
      goPay() {
        var _this = this;
        // var baseUrl = window.location.protocol + "//" + window.location.host + "/internantionPayment.html?cf=1&backurl=" +encodeURIComponent(window.location.href);
        var baseUrl = window.location.protocol + "//" + window.location.host + "/internantionPayment.html?cf=1";
        window.location.href = baseUrl;
        _this.needShowAdvert = !this.needShowAdvert
        _this.needShowAdvert = !this.needShowAdvert
        _this.iswait = false;
        _this.waitmask = false;
        _this.isShowAdvertLeftTime = false;
        clearInterval(this.timer)
      },
      brandChoice(type) {
        var _this = this;

        if (type == 1) {
          //添加品牌
          if (this.userType == 2) {
            //修理厂则前往关注品牌页
            this.setupWebViewJavascriptBridge(function (bridge) {
              bridge.callHandler('native_JumpUrl', {
                url: window.location.protocol + "//" + window.location.host + "/vendorsConcer.html?cf=1"
              }, function (response) {})
            })
          } else {
            //经销商/厂商则前往品牌筛选页
            var baseUrl = window.location.protocol + "//" + window.location.host + "/brandChoice.html";
            window.location.href = baseUrl;
          }
        }else if(type==3){
          var baseUrl = window.location.protocol + "//" + window.location.host + "/brandChoice.html#/info?mode=5";
          window.location.href = baseUrl;
        } else {
          //国际品牌
          var baseUrl = window.location.protocol + "//" + window.location.host + "/brandChoice.html#/info?mode=2";
          window.location.href = baseUrl;
        }
        _this.needShowAdvert = !this.needShowAdvert
        _this.needShowAdvert = !this.needShowAdvert
        _this.iswait = false;
        _this.waitmask = false;
        _this.isShowAdvertLeftTime = false;
        clearInterval(this.timer)
      },
      count(brandId) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeeCatalogLog",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            sourceType: 1,
            bid: brandId
          },
          success: function () {

          }
        })
      },
    }
  }

</script>

<style scoped>
  @import url("../assets/css/internationalBrand.css");

  /*1225 调整*/
  .ec-international li {
    position: relative;
  }

  .ec-international li span.er-labelPaid {
    width: .96rem;
    height: .96rem;
    background: url(../assets/images/label_paid.png) no-repeat center center;
    background-size: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
  }

  .ec-international li span.er-remainingTime {
    width: 100%;
    height: auto;
    font-size: .28rem;
    line-height: .64rem;
    text-align: center;
    color: #e74c3c;
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
  }

  .es-followBrandBox ul li>span.fc-buttonAdd>a.selected {
    background: #eee;
    color: #999;
  }

</style>
