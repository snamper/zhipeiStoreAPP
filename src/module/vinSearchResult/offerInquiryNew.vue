<template>
  <div class="offerInquiry">
    <div class="pageMain" style="padding-top: 0">
      <div class="bw-orderBox">
        <!-- 完善个人信息弹层 -->
        <div class="bo-shopMainSupplementPop" v-if="isPerfectShow">
          <div class="bo-shopMainSupplement">
            <div class="bo-shopSupplementTop">
              <p>请完善身份信息，找周边汽配店更精准！</p>
            </div>
            <div class="bo-shopSupplementCenter">
              <ul>
                <li class="bo-shopAddress">
                  <span>公司/门店：</span>
                  <input type="" maxlength="15" name="" placeholder="输入您公司/门店的名称，15个字以内（必填）" v-model="getuserInfoData.companyName">
                </li>
                <li class="bo-shopAddress">
                  <span>姓名：</span>
                  <input type="" name="" placeholder="请输入您的姓名(必填)" v-model="getuserInfoData.realName">
                </li>
                <li class="bo-shopAddress">
                  <span>收货地址：</span>
                  <textarea class="bo-shopAddressInput" v-model="userAddress">上海市嘉定区安亭镇墨玉南路1033号</textarea>
                </li>
              </ul>
            </div>
            <div class="bo-shopSupplementFool">
              <!-- 初始状态a标签中增加样式：ao-disable -->
              <a v-on:click="(getuserInfoData.companyName&&getuserInfoData.realName&&userAddress)?SaveUserInfo():''" :class="(getuserInfoData.companyName&&getuserInfoData.realName&&userAddress)?'':'bo-disable'">保存</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--新版vin码结果页-->
    <div class="ec-scavengingResultPage">
      <!-- 扫码结果 车型信息 -->
      <div class="ec-scavengingResultTopBox">
        <!-- 车型信息 -->
        <div class="ec-carInfoBox" v-on:click="seeVinDetail()">
          <dl>
            <dt>
              <img :src="autoBrandLogo">
            </dt>
            <dd>
              <p>{{autoBrandName}} {{autoModelName}}</p>
              <span>
                <b>{{vinCode}}</b>
                <a v-if="isShowView">收起</a>
                <a v-if="!isShowView">车型详情</a>
              </span>
            </dd>
          </dl>
          <carStateInfo ref="carStateInfo" style="top:1.8rem;"></carStateInfo>
        </div>
        <!-- 4S店价格和紧急调货 -->

        <div class="ec-shoppingBox">
          <!-- 初始状态 -->
          <div class="ec-initialBox" v-if="defautTal">
            <a v-for="(item,index) in tabLists" :key="index" :class="{'ec-rightBorder':item.type==0}" @click="showTab(item)" v-if="index==0"><b>{{item.name}}</b></a>
            <a v-for="(item,index) in tabLists" :key="index" :class="{'ec-rightBorder':item.type==0}" @click="showTab(item)" v-if="index==1">{{item.name}}</a>
          </div>

          <!-- 调货状态 -->
          <transition name="toTop" class="toTop">
            <div class="ec-shoppingMain" :class="{'ec-urgentShop':isCurrent_EmergencyMode}" v-if="!defautTal" style="overflow:hidden;">
              <!-- 顶部切换状态 -->
              <div class="ec-shoppingMainTab">
                <div class="ec-tabBox">
                  <a v-for="(item,index) in tabLists" :key="index" :class="{'ec-selected':item.selected}" @click="switchTab(item)">{{item.name}}</a>
                </div>
              </div>
              <!-- 顶部提醒 -->
              <!--<div class="ec-paymentRemind"></div>-->
              <!-- 品类筛选 -->
              <div class="ec-categoryBox" v-if="getCategorysList.length>0">
                <ul>
                  <li v-for="(item,index) in getCategorysList" :key="index" :class="buildElementClass(item)" v-model="item.isSelected" v-on:click="selectAdd(item)">
                    <p>{{item.smallName}}</p>
                    <span v-if="item.viewType===1">{{item.viewText}}</span>
                    <span v-else-if="item.viewType===2"><a>{{item.viewText}}</a></span>
                    <span v-else><a>{{item.viewText}}</a></span>
                  </li>
                </ul>
              </div>

              <!-- 扫码结果通栏广告-->
              <bannerAdvert ref="bannerAdvert" styleMode="style_No2"></bannerAdvert>

              <!-- 门店筛选 -->
              <div class="ec-shopBox">
                <!-- 单个门店 -->
                <div class="ec-shopOneBox" v-for="(oneShop,index) in getShopData" :key="index">
                  <dl :id="oneShop.cloudShopID">
                    <dt @click.stop="oneShop.isJump ? toinfoPrice(oneShop) : ''">
                      <img :src="oneShop.logo" v-show="oneShop.logo != ''">
                      <img src="../../assets/images/pic_noShop.png" v-show="oneShop.logo == ''">
                    </dt>
                    <dd class="ec-shopName" @click.stop="oneShop.isJump ? toinfoPrice(oneShop) : ''">{{oneShop.cloudShopName}}
                    </dd>

                    <template v-if="oneShop.promotionTags.length>0 && oneShop.activity == null">
                      <!-- 只有促销标签 -->
                      <dd class="ec-activityTagBox">
                        <span v-for="(oneTag,index) in oneShop.promotionTags">{{oneTag}}</span>
                      </dd>
                    </template>
                    <template v-else-if="oneShop.promotionTags.length==0 && oneShop.activity != null">
                      <!-- 只有活动 -->
                      <dd class="ec-activity" @click.stop="showActivity(oneShop.activity, oneShop.promotionTags)">
                        <span>活动</span>
                        <p>{{oneShop.activity.activityTitle}}</p>
                      </dd>
                    </template>
                    <template v-else-if="oneShop.promotionTags.length>0 && oneShop.activity != null">
                      <!-- 又有活动, 又有促销标签 -->
                      <dd class="ec-activityTagBox ec-expandable" @click.stop="showActivity(oneShop.activity, oneShop.promotionTags)">
                        <span v-for="(oneTag,index) in oneShop.promotionTags">{{oneTag}}</span>
                      </dd>
                    </template>

                    <dd class="ec-button">
                      <a v-show="!isCurrent_EmergencyMode" @click="goChooseCategory(oneShop)">立即调货</a>
                      <a v-show="isCurrent_EmergencyMode" @click="emergency(oneShop)">紧急调货</a>
                      <a class="ec-buttonPrice" v-if="oneShop.viewPriceType==0 || oneShop.viewPriceType==1" @click="goSeePricePop(oneShop)" :class="{'cc-seePriceDisable':oneShop.viewPriceType==0}">查看价格</a>
                    </dd>
                  </dl>
                </div>

                <!-- 活动相关通栏按钮 -->
                <div class="ec-invitingButton" v-if="activityBannerButton != null">
                  <a href="javascript:;" @click="landingActivity">
                    <b>{{activityBannerButton.buttonName}}</b>
                  </a>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 扫码结果通栏广告-->
      <bannerAdvert ref="bannerAdvert" v-if="defautTal" styleMode="style_No1"></bannerAdvert>
      <!-- 保养记录 -->
      <div class="ec-modularBox" v-if="!isFirstMainRecord">
        <div class="ec-modularTitle">
          <p>做保养记录(参照保养周期表)</p>
          <span>{{maintainRecordTotal}}</span>
        </div>
        <!-- 保养周期表 -->
        <div class="ec-maintainSchedule" v-if="MileageList.length>0">
          <ul>
            <li v-for="(item,index) in MileageList" :key="index" @click="tomaintainRecordPage">
              <p>{{item.mProjectName}}</p>
              <span>{{item.maintenanceText}}</span>
            </li>
          </ul>
        </div>

        <div class="ec-maintainRecord">
          <span style="padding-right: .4rem;">{{businessLicense.createTime}} <b>{{businessLicense.payableAmount}}</b></span>
          <!-- 保养记录图片 -->
          <div class="ec-maintainRecordPic" v-if="businessLicense.images.length>0">
            <ul>
              <li v-for="(item,index) in businessLicense.images" :key="index">
                <span @click="showCarImgs(businessLicense.images,$event,index,0)">
                  <img :src="item.imageUrl">
                </span>
                <p>{{item.imageType==0?'当前里程':'保养现场'}}</p>
              </li>

            </ul>
          </div>
          <!-- 语音留言 -->
          <div class="ec-voiceBox" v-show="businessLicense.voiceMessages.length>0">
            <p>语音留言：</p>
            <div class="ec-voiceMain">
              <span v-for="(it,ind) in businessLicense.voiceMessages" :key="ind" @click.stop="pauseVoice(it,ind)">{{it.time}}"
                <a>×</a>
                <audio :id="'audioTag' + ind" :src="it.url" style="display: none;"></audio>
              </span>
            </div>
          </div>
        </div>

        <div class="ec-modularFool">
          <a class="ec-maintainRecordLeft"><span @click="tomaintainRecordPage">查看更多</span></a>
          <a class="ec-maintainRecordRight" @click="tomaintainRecordPage">立即新增</a>
        </div>
      </div>
      <!-- 新增保养记录 -->
      <maintainRecordCreator ref="maintainRecordCreator" v-on:savemaintainRecordenent="savemaintainRecordenent" v-bind:vinCode="vinCode" v-if="isFirstMainRecord && listData.length==0"
        v-bind:modalType="true"></maintainRecordCreator>
      <!--保养记录-->
      <maintainRecordList ref="maintainRecordList" v-on:savemaintainList="savemaintainList" v-on:deleteMaintainList="deleteMaintainList" v-show="isFirstMainRecord && listData.length>0"
        v-bind:modalType="0" v-bind:vinCode="vinCode"></maintainRecordList>
      <!-- 机油用量/配件参数 -->
      <div class="ec-modularBox">
        <div class="ec-modularTitle">
          <p>机油用量/配件参数</p>
        </div>
        <!-- 详细内容 -->
        <div class="ec-numberParameter">
          <div class="ec-categoryOneBox" v-for="(item,index) in PartsConfig" :key="index">
            <dl>
              <dt>{{item.categoryName}}</dt>
              <dd>
                <b v-for="(ite,ins) in item.paramDictionary" :key="ins">{{ite}}</b>
                <a v-show="item.isNeedParam" @click="Rescreenings(item)">{{item.viewText}}</a>
              </dd>
              <dd class="ec-picBox" v-show="item.images.length>0">
                <span v-for="(ites,inde) in item.images" :key="inde" @click="showCarImg(item.images,$event,inde,0)">
                  <img :src="ites">
                </span>
              </dd>
            </dl>
          </div>
        </div>
        <!-- 底部更多展示 -->
        <div class="ec-modularFool" @click="expandDosage()" v-if="needDosageExpand">
          <a><span :class="{closeCalss:isDosageExpanded}">{{isDosageExpanded?'收起':'查看更多用量/参数'}}</span></a>
        </div>
      </div>

      <!--完善信息-->
      <perfectInformation ref="perfectInformation" v-on:CallBack="CallBack"></perfectInformation>
      <!-- 查看厂商智能产品目录 -->
      <!-- <div class="ec-modularBox">
        &lt;!&ndash;v-if="allBrandLogos.length>0"&ndash;&gt;
        <div class="ec-modularTitle">
          <p>智能产品目录</p>
          <div class="ec-modularTitleRight">
            <a @click="goJumpPage('vendorsConcer',2)">管理</a>
          </div>
        </div>-->
      <!-- 国内厂商目录 -->
      <!-- <div class="es-followBrandBox" v-if="allBrandLogos.length>0">
          <ul>
            <li v-for="(item,index) in allBrandLogos" @click="goCjmlPage(item.brandUrl,item.dataType,item.brandName,item)" v-show="index<7">
              <span class="es-brandCataloguePic" v-show="item.isFamousBrand==0">
                <img :src="item.brandLogo">
              </span>
              <p class="es-brandCatalogueName">{{item.viewBrandName}}</p>
            </li>
            <li class="ec-newsBox" v-on:click="showMoreVendor()" v-show="allBrandLogos.length>7" style="border-bottom: none">
              <p style="text-align: center;padding-top: .5rem;">更多智能<br>产品目录</p>
            </li>

          </ul>
        </div>-->
        <!-- title -->
        <div class="fc-newIncludedBrands" v-if="newBrandText">
          <span>{{newBrandText}}</span>
          <a @click="tonextPage">查看详情</a>
        </div>
      <!-- 国际品牌目录 -->
      <internationalBrand ref="internationalBrand" v-bind:vinCode="vinCode" v-bind:userType="getuserInfoData.userRule" v-on:showMoreVendor="showMoreVendor"
        v-on:goCjmlPage="goCjmlPage" v-on:dependOnHostCallBack="dependOnHostCallBack">

      </internationalBrand>
      <!--</div>-->
    </div>
    <div class="ec-receivablesButton" style="top:8rem">
      <a @click="launchMaintainPayDialog(0)"></a>
    </div>
    <!--活动详情-->
    <activitiesInfo ref="activitiesInfo"></activitiesInfo>
    <!--更多厂商目录的展示-->
    <MoreVendor v-if="moreVendorFlag" v-on:toParentVenFlag="getToParentVenFlag" v-bind:allBrandLogos="allBrandLogos"></MoreVendor>
    <!--点击查看详情-->
    <seePricePop v-bind:tatoContdata="tatoContdata" v-bind:seePricePopList="seePricePopList" v-on:CallbackSubmitWares="CallbackSubmitWares"
      v-bind:selectShopsName="selectShopsName" v-on:cancelSeePrice="cancelSeePrice" v-if="isShowSeePricePop" ref="maskPrice" v-bind:shopid="selectShops"
      v-bind:seepriceState="seepriceState" v-bind:priceLevelNotice="priceLevelNotice"></seePricePop>
    <!--选择品牌参数-->
    <selectAutoParam ref="selectAutoParam" v-on:cancelChooseParam="cancelChooseParam" v-on:completeChooseParam="completeChooseParam"></selectAutoParam>
    <!--扫码结果浮层广告-->
    <floatingAdvert ref="floatingAdvert"></floatingAdvert>
    <!--pop坦层-->
    <div class="ct-pop" v-if="stopNo">
      <!-- 扫码结果页中点击国际目录 -->
      <div class="ct-popBox">
        <span class="ct-picTwo"></span>
        <a @click="stopNo =false"></a>
      </div>
    </div>
    <!--凑单弹层-->
    <div class="cf-numberEditPop" v-if="PieceTogether" @click="disable">
      <ul>
        <li class="cf-numberEdit" style="padding: 1.2rem 0 0;">
          <p>{{queryText}}</p>
        </li>
        <li class="cf-numberEditButton">
          <a class="cf-buttonLeft" @click="setFollowCategorys('force')">立即调货</a>
          <a @click="together">凑单</a>
        </li>
      </ul>
    </div>
    <!--<paymentPop ref="paymentPop" v-on:tonoPay="tonoPay" v-on:payType="payType"></paymentPop>-->
    <!--分享查看付费查看弹层-->
    <jurisdictionPop ref="jurisdictionPop" v-on:weixinshare="weixinshare" v-on:weinxinmayment="weinxinmayment"></jurisdictionPop>
    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
    <!--查看价格及车型参数-->
    <AccessoryParameters ref="AccessoryParameters" v-on:completeChooseParam="completeChooseParam"></AccessoryParameters>

    <!-- 分享APP -->
    <shareFriends v-if="shareFriendsNo3" v-on:shareFriendsHide="onShareFriendsNo3_hide" v-bind:shareFlag="3" v-bind:shareData="shareDataNo3"
      v-on:callbackshore="onShareFriendsNo3_callbackshore" v-bind:isShow="false"></shareFriends>

    <!-- 分享分期免息活动 -->
    <shareFriends v-if="shareFriendsNo5" v-on:shareFriendsHide="onShareFriendsNo5_hide" v-bind:shareFlag="5" v-bind:shareData="shareDataNo5"
      v-on:callbackshore="onShareFriendsNo5_callbackshore"></shareFriends>

    <maintainPayDialog v-if="maintainPayDialog_launched" v-bind:input="maintainPayDialog_input" v-on:finished="on_maintainPayDialog_finished"
      v-on:quit="on_maintainPayDialog_quit"></maintainPayDialog>

  </div>
</template>

<script>
  import {
    Indicator
  } from "mint-ui";
  import {
    Toast
  } from "mint-ui";
  import {
    commonMixin
  } from "../../config/base/commonMixin.js";
  import {
    MessageBox
  } from 'mint-ui';
  import router from "../../router/vinSearchResult.js";

  const moreVendor = r => require.ensure([], () => r(require('../../components/moreVendor.vue')));
  const bannerAdvert = r => require.ensure([], () => r(require('../../components/bannerAdvert')));
  // const paymentPop = r => require.ensure([], () => r(require('../../components/paymentPop')));
  import selectAutoParam from "../../components/selectAutoParam.vue";
  import seePricePop from "../../components/seePricePop.vue";
  import activitiesInfo from "../../components/activitiesInfo"
  import floatingAdvert from "../../components/floatingAdvert";
  import carStateInfo from "../../components/carStateInfo";
  import photowipe from '../../components/photoswipe.vue';
  import internationalBrand from '../../components/internationalBrand'
  import AccessoryParameters from '../../components/AccessoryParameters'
  import jurisdictionPop from '../../components/jurisdictionPop'
  import shareFriends from "../../components/shareFriends.vue";
  import maintainRecordCreator from '../../components/maintainRecordCreator'
  import maintainPayDialog from '../../components/maintainPayDialog'
  import maintainRecordList from '../../components/maintainRecordList'
  import perfectInformation from '../../components/perfectInformation'

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "offerInquiry",
    mixins: [commonMixin],
    components: {
      photowipe,
      internationalBrand,
      MoreVendor: moreVendor,
      selectAutoParam,
      seePricePop,
      activitiesInfo,
      floatingAdvert,
      bannerAdvert,
      // paymentPop,
      carStateInfo,
      AccessoryParameters,
      jurisdictionPop,
      shareFriends,
      maintainRecordCreator,
      maintainPayDialog,
      maintainRecordList,
      perfectInformation
    },
    data() {
      return {
        maintainPayDialog_launched: false, //保养收款弹层是否启动
        maintainPayDialog_input: {}, //保养收款弹层入参
        autoBrandLogo: "", //汽车logo
        autoBrandName: "", //汽车名称
        autoModelName: "", //用户名称
        autoModelSubName: "", //电话
        isShowView: false, //控制=编辑用户信息弹层显示隐藏的
        switchChooseCategory: true, //用于防止重复点击开关
        // switchSeePrice: true, //能否查看价格
        vinCode: this.getQueryString("v"),
        vinJYData: [], //车型详情信息
        seePricePopList: [],
        allBrandLogos: [],
        moreVendorFlag: false, //更多厂商目录的展示
        isShowSeePricePop: false,
        JumpType: 0,
        getCategorysList: [], //选择配件
        isPerfectShow: false, //显示完善信息
        isPerfect: true, //默认false
        userAddress: "",
        getuserInfoData: [],
        isSelectCount: 0,
        selectCategorys: [],
        vinselectCategorys: [],
        OptionAutoParamList: [], //需要选择的配件参数
        choosedParams: [],
        getShopData: [], //选择店铺
        selectShops: [],
        selectShopsName: "",
        // priceRemind: '', //
        isLOck: true, //默认立即掉或时可点的
        tatoContdata: {}, //选择商品的总价
        ModalHelper: null, //定义滑动穿透对象
        stopNo: false,
        PieceTogether: false, //控制凑单弹层显示
        queryText: '', //控制凑单弹层显示文案
        seepriceState: 1, // 1两个都显示 2 显示常规调货 3 显示紧急调货,
        promotionNotice: '', //价格等级提示
        // isCanViewPrice: 1, //查看价格是否至灰  1 否，0 是
        guestticket: this.getQueryString("guestticket"),
        tabLists: [{
            name: '4S店价格',
            selected: false,
            type: 0,
          },
          {
            name: '紧急调货',
            selected: false,
            type: 1
          }
        ],
        defautTal: true, //默认显示tab切换
        isCurrent_EmergencyMode: false, //当前是否紧急模式
        needDosageExpand: false, //用量区域是否需要展开
        isDosageExpanded: false, //用量区域是否展开中
        maxslideImg: [],
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
        businessLicense: {
          voiceMessages: [],
          images: []
        }, //保养记录
        global_userParam: [], // 选择的车型参数列表
        MileageList: [], //保养周期表
        PartsConfig: [], //机油配件参数
        Rescreening: [], //重现选择配件参数需要的参数
        searchType: 1, //权限类型  1正常查看 2普通分享 3付费分享 5完善身份（仅作用于查询接口）
        shareDataNo3: {}, //分享内容->分享APP
        shareDataNo5: {}, //分享内容->分享分期免息活动
        shareFriendsNo3: false, //控制分享弹层显示隐藏->分享APP
        shareFriendsNo5: false, //控制分享弹层显示隐藏->分享分期免息活动
        shareText: ' ', //分享弹层的头部文字
        maintainRecordTotal: '',
        activityBannerButton: {}, //活动相关通栏按钮
        isFirstGetList: true, // 第一次默认请求
        isFirstGetAutoCategoryByVin: true,
        isFirstMainRecord: false, //是否第一次着陆过保养记录页
        listData: [],
        vinQueryPower: true, //用户有无查看目录权限
        newBrandText:'' //智能新收录文案
      };
    },
    created() {
      var _this = this;
      _this.setTitle('扫码结果');
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
      // if(localStorage.getItem('payGuided')) {
      //   this.isFirstMainRecord = true;
      // }else {
      //   this.isFirstMainRecord = false;
      // }
      // if (this.behaviorRecorder.getBehavior(this.behaviorRecorder.behaviorIndex.payGuided) == 1) {
      //   this.isFirstMainRecord = true;
      // } else {
      //   this.isFirstMainRecord = false;
      // }
      var _this = this;
      _this.ModalHelper = _this.SlidingPen(); //执行滑动穿透的方法;
      //监听返回跳转
      if (_this.androidOrios() == 2) {
        _this.LoadComplete(function () {
          _this.setTitle('扫码结果');
          _this.nativeLsitenBack('native_CloseWebview');
        })
        //查询用户VIN码查询免广告权限,还可以返回国际品牌
        _this.GetCjmlVinQueryPowerDetail()
      } else {
        _this.nativeLsitenBack('native_CloseWebview');
        _this.LoadComplete(function () {
          _this.IsVinSearchPower();
          //查询用户VIN码查询免广告权限,还可以返回国际品牌
          _this.GetCjmlVinQueryPowerDetail();
          _this.setTitle('扫码结果');
        })

      }
      //获取用户信息
      _this.getuserInfo();
      //获取精友参数
      _this.getVinParamByVin();
      //获取参数列表
      _this.getVinData(resourceUrl + "/auto/getautoinfobyvin", {
        vinCode: _this.vinCode
      });
      //获取关联品牌
      // _this.getDatas(resourceUrl + "/usercenter/getbrandsbyuid", {
      //   dataType: 2, //全部关联品牌 0  常用品牌 2
      // });
      //判断用户是否有Vin码查询，的权限
      _this.IsVinSearchPower()
      //取得。车型4s价格。和车型分类
      // _this.getAutoCategoryByVin();
      //获取车型保养记录
      // _this.GetAutoMaintenance();
      //机油用量/配件参数
      _this.GetAutoPartsConfig(0);
      // //  获取店铺列表
      // _this.getUseCloudShopList();

      //获取单个保养记录
      _this.GetUserOrAutoMaintain();
      //获取保养记录列表
      _this.GetTodayMaintain();
    },

    methods: {
      savemaintainList(list) {
        this.UpdateMaintainRecord(list)
      },
      //更新保养记录
      UpdateMaintainRecord(list) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/UpdateMaintainRecord",
          dataType: "JSON",
          data: {
            maintainRecordId: list.maintainRecordId,
            images: list.images,
            voiceMessages: list.voiceMessages,
            mileage: list.mileage,
            projectNames: list.projectNames,
            remark: list.remark
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.GetTodayMaintain();
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      deleteMaintainList(list, index, deta) {
        var _this = this;
        MessageBox.confirm("删除后将无法查看车型保养记录<br/>确认删除?").then(action => {
          if (action == 'confirm') {
            _this.DeleteMaintainRecord(list, index, deta)
          }
        })
      },
      //删除保养记录
      DeleteMaintainRecord(list, index, deta) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/DeleteMaintainRecord",
          dataType: "JSON",
          data: {
            maintainRecordId: deta.maintainRecordId
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              // _this.GetMaintainRecordList();
              list.splice(index, 1);
              Toast('删除成功');
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      on_maintainPayDialog_quit(param) {
        var _this = this;
        this.maintainPayDialog_launched = false;

        if (param.maintainRecordId > 0) {
          //为了效果, 强刷2秒后取得保养列表
          Indicator.open({
            spinnerType: 'fading-circle'
          });

          setTimeout(function () {
            _this.tomaintainRecordPage();
          }, 2000);
        }
      },
      on_maintainPayDialog_finished() {
        var _this = this;
        this.maintainPayDialog_launched = false;

        //为了效果, 强刷2秒后取得保养列表
        Indicator.open({
          spinnerType: 'fading-circle'
        });
        setTimeout(function () {
          _this.tomaintainRecordPage();
        }, 2000);
      },
      savemaintainRecordenent(imgList, audioList, Mileage, displayText, supplementExplain) {
        var _this = this;
        if (!_this.isPerfect) {
          _this.isPerfectShow = true;
        } else {
          this.CreateMaintainRecord(imgList, audioList, Mileage, displayText, supplementExplain);
        }

      },
      CreateMaintainRecord(imgList, audioList, Mileage, displayText, supplementExplain) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/CreateMaintainRecord",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            images: imgList || [],
            voiceMessages: audioList || [],
            mileage: Mileage,
            projectNames: displayText,
            remark: supplementExplain
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              // Toast('创建成功');
              _this.$refs.maintainRecordCreator.clearData();
              if (str.Body.needPay == true) {
                //需要支付则发起收款
                _this.launchMaintainPayDialog(str.Body.maintainRecordId);
              } else {
                //不需支付则刷新列表
                _this.GetTodayMaintain();
              }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      GetTodayMaintain() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetTodayMaintain",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              if (str.Body.todayMaintain.length > 0) {
                for (var i = 0; i < str.Body.todayMaintain.length; i++) {
                  if (str.Body.todayMaintain[i].voiceMessages.length > 0) {
                    for (var j = 0; j < str.Body.todayMaintain[i].voiceMessages.length; j++) {
                      str.Body.todayMaintain[i].voiceMessages[j].selected = false;
                    }
                  }
                }
                // alert(JSON.stringify(str.Body))
                _this.$refs.maintainRecordList.setValue(str.Body.todayMaintain);
                _this.listData = str.Body.todayMaintain;
              }
              _this.isFirstMainRecord = str.Body.isMaintenance;
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //播放录音
      pauseVoice(data, index) {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        var audio = $("#audioTag" + index).get(0);
        var allTime = data.time;
        if (audio.paused) {
          audio.play();
          //播放倒计时
          var timer = setInterval(function () {
            if (data.time == 0) {
              clearInterval(timer);
              data.time = allTime;
              audio.paused();
            }
            data.time--;
          }, 1000);
        }
      },
      GetUserOrAutoMaintain() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetUserOrAutoMaintain",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              if (data.Body.userOrAuto == 1) {
                if (data.Body.maintainRecord == null) {
                  _this.businessLicense = {
                    voiceMessages: [],
                    images: []
                  };
                  _this.$forceUpdate()
                } else {
                  _this.businessLicense = data.Body.maintainRecord
                }

              } else {
                _this.MileageList = data.Body.autoMaintenance || [];
              }
              _this.maintainRecordTotal = data.Body.maintainRecordTotal;


              _this.$forceUpdate()

            } else {
              Toast(data.Header.Message)
            }
          }
        })
      },
      //获取国际品牌
      GetCjmlVinQueryPowerDetail() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/GetCjmlVinQueryPowerDetail",
          dataType: "JSON",
          beforeSend: function () {},
          complete: function () {},
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              // data.Body.vinQueryPower = false;
              // data.Body.vinQueryAdvert.advertTime=30;
              // debugger;
              _this.newBrandText = data.Body.newBrandText
              _this.vinQueryPower = data.Body.vinQueryPower;
              
             
              _this.$refs.internationalBrand.setValue(data.Body);
            } else {
              Toast(data.Header.Message)
            }
          }
        })
      },
      tonextPage(){
        this.$refs.internationalBrand.brandChoice(1);
      },
      //分享回调函数
      onShareFriendsNo3_callbackshore() {
        this.VinShare();
      },
      //分享回调函数
      onShareFriendsNo5_callbackshore() {},
      //分享VIN码
      VinShare() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/VinShare",
          dataType: "JSON",
          data: {
            VinCode: _this.vinCode,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              _this.IsVinSearchPower();
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      onShareFriendsNo3_hide() {
        this.shareFriendsNo3 = false;
      },
      onShareFriendsNo5_hide() {
        this.shareFriendsNo5 = false;
      },
      //付费
      weinxinmayment(data) {

        var _this = this;
        _this.$refs.jurisdictionPop.hide();
        var baseUrl = window.location.protocol + "//" + window.location.host + "/selectShop.html?cf=1&v=" + _this.vinCode + "#/payment"

        window.location.href = baseUrl;

        // _this.setupWebViewJavascriptBridge(function (bridge) {
        //   bridge.callHandler('native_JumpUrl', {url: baseUrl}, function (response) {})
        // })
      },
      tomaintainRecordPage() {
        Indicator.close();
        var _this = this;
        var baseUrl = window.location.protocol + "//" + window.location.host + "/maintainRecord.html?cf=1&v=" + _this.vinCode;
        window.location.href = baseUrl;
      },
      //分享APP
      weixinshare(data) {

        var _this = this;
        _this.$refs.jurisdictionPop.hide();
        _this.shareFriendsNo3 = true;
      },
      //判断用户是否有Vin码查询，的权限
      IsVinSearchPower() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/IsVinSearchPower",
          dataType: "JSON",
          data: {
            VinCode: _this.vinCode,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.searchType = str.Body.searchType;
              _this.shareDataNo3 = str.Body.share;
              _this.shareText = str.Body.shareText;

              if (str.Body.isNeedFillUserInfo == 0) { //0 不需要完善身份
                _this.isPerfect = true;
              } else {
                _this.isPerfect = false;
              }


              // _this.isPlaceOrder = str.Body.isPlaceOrder == 1 ? true : false; // 是否可以有。一件询单的按钮。
              // _this.isCanViewPrice = str.Body.isCanViewPrice;

            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //点击重新筛选
      Rescreenings(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetAutoParamListByVin",
          dataType: "JSON",
          data: {
            VinCode: _this.vinCode,
            CategoryIds: data.categoryId,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              if (str.Body) {
                _this.$refs.selectAutoParam.showPage();
                _this.$refs.selectAutoParam.setValue(str.Body, 3, {});
              }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },

      //活动着陆
      landingActivity() {
        if (this.activityBannerButton == null) return;
        this.shareFriendsNo5 = true;
        this.shareDataNo5.href = this.activityBannerButton.landingPage;
      },

      //取得活动相关通栏按钮
      getActivityBannerButton() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetActivityBannerButton",
          dataType: "JSON",
          success: function (res) {
            _this.activityBannerButton = res.Body;
          }
        });
      },
      //获取店铺列表
      getUseCloudShopList(callBack) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetUseCloudShopList",
          dataType: "JSON",
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              if (data.Body != "") {
                _this.isFirstGetList = false
                _this.selectShops = [];

                var shopList = data.Body.shopList;
                shopList.forEach(function (oneItem, index) {
                  oneItem.selectedShop = oneItem.isSelected == 1 ? true : false;
                  if (oneItem.selectedShop) {
                    _this.selectShops.push(oneItem.cloudShopID);
                    _this.selectShopsName = oneItem.cloudShopName;
                  }
                });
                for (var i = 0; i < shopList.length; i++) {
                  if (shopList[i].isPlatformActivity === 0) {
                    shopList[i].isPlatformActivity = false;
                  } else {
                    shopList[i].isPlatformActivity = true;
                  }
                  if (shopList[i].isSelected == 1 && shopList[i].isLock == true) {
                    _this.isLOck = !shopList[i].isLock
                  }
                }
                _this.getShopData = shopList;
                callBack();

              } else {
                _this.isLOck = true;
              }
            } else {
              Toast(data.Header.Message)
            }

          }
        });
      },
      //取消选择配件参数
      cancelChooseParam() {
        var _this = this;
        _this.$refs.selectAutoParam.hide()
        //关掉立即调货开关
        _this.switchChooseCategory = true;
      },
      //确定选择配件参数
      completeChooseParam(choosedParams, type, oneItem) {
        var _this = this;
        _this.$refs.selectAutoParam.hide();
        _this.$refs.AccessoryParameters.hide();
        if (type == 0) {
          if (_this.global_userParam.length == 0) {
            for (var i = 0; i < choosedParams.length; i++) {
              _this.global_userParam.push(choosedParams[i])
            }
          } else {
            var list = new Array();
            list = _this.global_userParam;
            list = JSON.stringify(list);
            list = JSON.parse(list);
            for (var i = 0; i < list.length; i++) {
              for (var j = 0; j < choosedParams.length; j++) {
                if (list[i].pTypeId == choosedParams[j].pTypeId) {

                  if (list[i].pValueId != choosedParams[j].pValueId) {
                    _this.global_userParam[i].pValueId = choosedParams[j].pValueId;
                  }

                } else {
                  _this.global_userParam.push(choosedParams[j])
                }
              }
            }

            // _this.global_userParam = list;
          }
          for (var i = 0; i < _this.global_userParam.length - 1; i++) {

            for (var j = i + 1; j < _this.global_userParam.length; j++) {
              if (_this.global_userParam[i].pTypeId == _this.global_userParam[j].pTypeId && _this.global_userParam[i].pValueId == _this.global_userParam[
                  j].pValueId) {
                _this.global_userParam.splice(j, 1);
                j--
              }
            }
          }
          oneItem.isSelected = !oneItem.isSelected;
          _this.selectCategorys.push(oneItem.categoryId);
          _this.vinselectCategorys.push(oneItem);
          _this.isSelectCount = _this.selectCategorys.length;
          _this.getAutoCategoryByVin();
        } else if (type == 1) {

          if (_this.global_userParam.length == 0) {
            for (var i = 0; i < choosedParams.length; i++) {
              _this.global_userParam.push(choosedParams[i])
            }
          } else {
            for (var i = 0; i < _this.global_userParam.length; i++) {
              for (var j = 0; j < choosedParams.length; j++) {
                if (this.global_userParam[i].pTypeId == choosedParams[j].pTypeId) {
                  if (this.global_userParam[i].pValueId != choosedParams[j].pValueId) {
                    this.global_userParam[i].pValueId = choosedParams[j].pValueId;
                  }
                } else {
                  _this.global_userParam.push(choosedParams[j])
                }
              }
            }

          }
          oneItem.isSelected = !oneItem.isSelected;
          _this.selectCategorys.push(oneItem.categoryId);
          _this.vinselectCategorys.push(oneItem);
          _this.isSelectCount = _this.selectCategorys.length;
          _this.checkBaseUserInfo();
        } else {
          _this.Rescreening = choosedParams;
          if (_this.isDosageExpanded == true) {
            _this.GetAutoPartsConfig(1);
          } else {
            _this.GetAutoPartsConfig(0);
          }
        }

      },
      //获取配件参数
      GetAutoParam(deta) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetCategoryParams",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            categoryId: deta.categoryId,
            // userParam:_this.global_userParam,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              if (str.Body) {
                _this.$refs.AccessoryParameters.show();
                _this.$refs.AccessoryParameters.setValue(str.Body, 0, deta);
              }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //选择配件
      selectAdd(oneItem) {
        var _this = this;
        if (!oneItem.isEnable) {
          return;
        }
        //如果需要选择配件参数切伟4s店价格
        // if(_this.isCurrent_EmergencyMode){
        //   oneItem.isSelected = !oneItem.isSelected;
        //
        //   if (oneItem.isSelected) {
        //     _this.selectCategorys.push(oneItem.categoryId);
        //     _this.vinselectCategorys.push(oneItem);
        //   } else {
        //     var index = _this.selectCategorys.indexOf(oneItem.categoryId);
        //     _this.selectCategorys.splice(index, 1);
        //     var ind = _this.vinselectCategorys.indexOf(oneItem);
        //     _this.vinselectCategorys.splice(index, 1);
        //   }
        //   _this.isSelectCount = _this.selectCategorys.length;
        // }
        // else {
        if (oneItem.isSelected) {
          // debugger;
          // _this.global_userParam
          oneItem.isSelected = !oneItem.isSelected;
          var index = _this.selectCategorys.indexOf(oneItem.categoryId);
          _this.selectCategorys.splice(index, 1);
          var ind = _this.vinselectCategorys.indexOf(oneItem);
          _this.vinselectCategorys.splice(index, 1);
          _this.isSelectCount = _this.selectCategorys.length;
        } else {
          // 选择参数
          if (oneItem.viewType == 2) {
            _this.GetAutoParam(oneItem)
            //14s价格
          } else if (oneItem.viewType == 1) {
            oneItem.isSelected = !oneItem.isSelected;

            if (oneItem.isSelected) {
              _this.selectCategorys.push(oneItem.categoryId);
              _this.vinselectCategorys.push(oneItem);
            } else {
              var index = _this.selectCategorys.indexOf(oneItem.categoryId);
              _this.selectCategorys.splice(index, 1);
              var ind = _this.vinselectCategorys.indexOf(oneItem);
              _this.vinselectCategorys.splice(index, 1);
            }
            _this.isSelectCount = _this.selectCategorys.length;
            // localStorage.setItem("CategoryListOld", JSON.stringify(_this.vinselectCategorys));
            //3查看配件价格
          } else {
            //查看价格
            if (_this.isCurrent_EmergencyMode == false) {
              _this.SeePartsFourPrice(oneItem)
            } else {
              oneItem.isSelected = !oneItem.isSelected;

              if (oneItem.isSelected) {
                _this.selectCategorys.push(oneItem.categoryId);
                _this.vinselectCategorys.push(oneItem);
              } else {
                var index = _this.selectCategorys.indexOf(oneItem.categoryId);
                _this.selectCategorys.splice(index, 1);
                var ind = _this.vinselectCategorys.indexOf(oneItem);
                _this.vinselectCategorys.splice(index, 1);
              }
              _this.isSelectCount = _this.selectCategorys.length;
            }

          }
        }

        // }

      },
      //查看配件价格
      SeePartsFourPrice(deta) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/SeePartsFourPrice",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            categoryId: deta.categoryId,
            // userParam:_this.global_userParam,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              if (str.Body) {
                _this.$refs.AccessoryParameters.show();
                _this.$refs.AccessoryParameters.setValue(str.Body, 1, deta);

              }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //根据VIN码获取当前车型的分类
      getAutoCategoryByVin() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetAutoCategoryByVin",
          dataType: "JSON",
          data: {
            VinCode: this.getQueryString("v"),
            userParam: _this.global_userParam,
            categoryIds: _this.selectCategorys
          },
          success: function (data) {

            if (data.Header.ErrorCode == 0) {
              _this.isFirstGetAutoCategoryByVin = false

              _this.getCategorysList = data.Body.autoCatetory;

            } else {
              Toast(data.Header.Message)
            }
          }
        });
      },
      //机油用量/配件参数
      GetAutoPartsConfig(type) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetAutoPartsConfig",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            userParam: _this.Rescreening,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              if (type == 0) {
                if (str.Body.length > 2) {
                  _this.PartsConfig = str.Body.splice(0, 2)
                  _this.needDosageExpand = true;
                } else {
                  _this.PartsConfig = str.Body;
                  if (_this.PartsConfig.length > 2) {
                    _this.needDosageExpand = true;
                  } else {
                    _this.needDosageExpand = false;
                  }

                }
              } else {
                _this.PartsConfig = str.Body;
              }

            } else {
              Toast(str.Header.Message);
            }
          }
        })
      },
      //显示大图
      showCarImg(images, el, index, isImage) {
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(event.currentTarget).addClass("action_carimg");
        var _self = this;
        var imgInfo = images;
        // _self.maxslideImg = [];
        _self.maxslideImg.splice(0);

        $.each(imgInfo, function (i, item) {
          _self.maxslideImg.push({
            src: item
          });
        });
        this.$refs.photowipe.show(index, false, isImage);
      },
      //显示大图
      showCarImgs(images, el, index, isImage) {
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(event.currentTarget).addClass("action_carimg");
        var _self = this;
        var imgInfo = images;
        // _self.maxslideImg = [];
        _self.maxslideImg.splice(0);

        $.each(imgInfo, function (i, item) {
          _self.maxslideImg.push({
            src: item.imageUrl
          });
        });
        this.$refs.photowipe.show(index, false, isImage);
      },
      //展开机油用量/配件参数
      expandDosage() {
        if (this.searchType == 1) {
          //正常查看
          if (this.isDosageExpanded == true) {
            this.GetAutoPartsConfig(0);
            this.isDosageExpanded = false;
          } else {
            this.GetAutoPartsConfig(1);
            this.isDosageExpanded = true;
            this.ViewAutoPartsConfig(); //记录查看机油用量/配件参数
          }
        } else if (this.searchType == 2) {
          //普通分享
          this.$refs.jurisdictionPop.show();
          this.$refs.jurisdictionPop.setValue(this.shareDataNo3, true, this.shareText);
        } else if (this.searchType == 3) {
          //付费分享
          this.$refs.jurisdictionPop.show();
          this.$refs.jurisdictionPop.setValue(this.shareDataNo3, false, this.shareText);
        } else if (this.searchType == 5) {
          //需完善身份
          this.isPerfect = false;
          if (!this.isPerfect) {
            this.isPerfectShow = true;
            return;
          }
        } else {
          Toast("未识别的操作类型");
        }

      },
      //顶部TAB切换
      switchTab(data) {
        if (this.searchType == 2) {
          //普通分享
          if (data.type == 0) {
            //4S店价格
            this.$refs.jurisdictionPop.show();
            this.$refs.jurisdictionPop.setValue(this.shareDataNo3, true, this.shareText);
          } else {
            //紧急调货
            for (var i = 0; i < this.tabLists.length; i++) {
              this.tabLists[i].selected = false
              if (data.type == this.tabLists[i].type) {
                this.tabLists[i].selected = true
              }
            }
            this.isCurrent_EmergencyMode = true;
            this.LaunchEmergency(); //记录启动紧急调货
          }

        } else if (this.searchType == 3) {
          //付费分享
          if (data.type == 0) {
            //4S店价格
            this.$refs.jurisdictionPop.show();
            this.$refs.jurisdictionPop.setValue(this.shareDataNo3, false, this.shareText);
          } else {
            //紧急调货
            for (var i = 0; i < this.tabLists.length; i++) {
              this.tabLists[i].selected = false
              if (data.type == this.tabLists[i].type) {
                this.tabLists[i].selected = true
              }
            }
            this.isCurrent_EmergencyMode = true;
            this.LaunchEmergency(); //记录启动紧急调货
          }
        } else {
          //正常查看 or 需完善身份
          if (data.type == 0) {
            //4S店价格
            for (var i = 0; i < this.tabLists.length; i++) {
              this.tabLists[i].selected = false
              if (data.type == this.tabLists[i].type) {
                this.tabLists[i].selected = true
              }
            }
            this.isCurrent_EmergencyMode = false;
            this.LaunchFourSPrice(); //记录启动4S店价格

          } else {
            //紧急调货
            if (this.getShopData.length == 0) {
              MessageBox.alert('请联系您的经销商，将您添加为门店客户，即可查看经销商报价和调货');
            } else {
              for (var i = 0; i < this.tabLists.length; i++) {
                this.tabLists[i].selected = false
                if (data.type == this.tabLists[i].type) {
                  this.tabLists[i].selected = true
                }
              }
              this.isCurrent_EmergencyMode = true;
              this.LaunchEmergency(); //记录启动紧急调货
            }

          }
        }
      },

      //启动4S店价格
      LaunchFourSPrice() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/LaunchFourSPrice",
          data: {
            vinCode: this.getQueryString("v"),
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },

      //启动紧急调货
      LaunchEmergency() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/LaunchEmergency",
          data: {
            vinCode: this.getQueryString("v"),
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },

      //查看机油用量/配件参数
      ViewAutoPartsConfig() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/ViewAutoPartsConfig",
          data: {
            vinCode: this.getQueryString("v"),
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },

      //显示切换
      showTab(data) {
        var _this = this
        if (this.isFirstGetList) {
          this.getUseCloudShopList(function () {

            if (_this.isFirstGetAutoCategoryByVin) {
              _this.getAutoCategoryByVin();
            }
            _this.getActivityBannerButton();
            if (_this.searchType == 1) {
              //正常查看
              if (data.type == 0) {
                //4S店价格
                for (var i = 0; i < _this.tabLists.length; i++) {
                  if (data.type == _this.tabLists[i].type) {
                    _this.tabLists[i].selected = true
                  }
                }
                _this.isCurrent_EmergencyMode = false;
                _this.LaunchFourSPrice(); //记录启动4S店价格
                _this.defautTal = false
              } else {

                if (_this.getShopData.length == 0) {
                  MessageBox.alert('请联系您的经销商，将您添加为门店客户，即可查看经销商报价和调货');
                } else {
                  for (var i = 0; i < _this.tabLists.length; i++) {
                    if (data.type == _this.tabLists[i].type) {
                      _this.tabLists[i].selected = true
                    }
                  }
                  _this.isCurrent_EmergencyMode = true;
                  _this.LaunchEmergency(); //记录启动紧急调货
                  _this.defautTal = false
                }

              }

            } else if (_this.searchType == 2) {
              //普通分享
              if (data.type == 0) {
                //4S店价格
                _this.$refs.jurisdictionPop.show();
                _this.$refs.jurisdictionPop.setValue(_this.shareDataNo3, true, _this.shareText);
              } else {
                //紧急调货
                for (var i = 0; i < _this.tabLists.length; i++) {
                  if (data.type == _this.tabLists[i].type) {
                    _this.tabLists[i].selected = true
                  }
                }
                _this.isCurrent_EmergencyMode = true;
                _this.LaunchEmergency(); //记录启动紧急调货
                _this.defautTal = false
              }

            } else if (_this.searchType == 3) {
              //付费分享
              if (data.type == 0) {
                //4S店价格
                _this.$refs.jurisdictionPop.show();
                _this.$refs.jurisdictionPop.setValue(_this.shareDataNo3, false, _this.shareText);
              } else {
                //紧急调货
                for (var i = 0; i < _this.tabLists.length; i++) {
                  if (data.type == _this.tabLists[i].type) {
                    _this.tabLists[i].selected = true
                  }
                }
                _this.isCurrent_EmergencyMode = true;
                _this.LaunchEmergency(); //记录启动紧急调货
                _this.defautTal = false
              }
            } else if (_this.searchType == 5) {
              //需完善身份
              _this.isPerfect = false;
              if (!_this.isPerfect) {
                _this.isPerfectShow = true;
                return;
              }
            } else {
              Toast("未识别的操作类型");
            }

          });
        } else {
          if (this.isFirstGetAutoCategoryByVin) {
            this.getAutoCategoryByVin();
          }
          this.getActivityBannerButton();

          if (this.searchType == 1) {
            //正常查看
            if (data.type == 0) {
              //4S店价格
              for (var i = 0; i < this.tabLists.length; i++) {
                if (data.type == this.tabLists[i].type) {
                  this.tabLists[i].selected = true
                }
              }
              this.isCurrent_EmergencyMode = false;
              this.LaunchFourSPrice(); //记录启动4S店价格
              this.defautTal = false
            } else {
              //紧急调货
              if (this.getShopData.length == 0) {
                MessageBox.alert('请联系您的经销商，将您添加为门店客户，即可查看经销商报价和调货');
              } else {
                for (var i = 0; i < this.tabLists.length; i++) {
                  if (data.type == this.tabLists[i].type) {
                    this.tabLists[i].selected = true
                  }
                }
                this.isCurrent_EmergencyMode = true;
                this.LaunchEmergency(); //记录启动紧急调货
                this.defautTal = false
              }

            }

          } else if (this.searchType == 2) {
            //普通分享
            if (data.type == 0) {
              //4S店价格
              this.$refs.jurisdictionPop.show();
              this.$refs.jurisdictionPop.setValue(this.shareDataNo3, true, this.shareText);
            } else {
              //紧急调货
              for (var i = 0; i < this.tabLists.length; i++) {
                if (data.type == this.tabLists[i].type) {
                  this.tabLists[i].selected = true
                }
              }
              this.isCurrent_EmergencyMode = true;
              this.LaunchEmergency(); //记录启动紧急调货
              this.defautTal = false
            }

          } else if (this.searchType == 3) {
            //付费分享
            if (data.type == 0) {
              //4S点价格
              this.$refs.jurisdictionPop.show();
              this.$refs.jurisdictionPop.setValue(this.shareDataNo3, false, this.shareText);
            } else {
              //紧急调货
              for (var i = 0; i < this.tabLists.length; i++) {
                if (data.type == this.tabLists[i].type) {
                  this.tabLists[i].selected = true
                }
              }
              this.isCurrent_EmergencyMode = true;
              this.LaunchEmergency(); //记录启动紧急调货
              this.defautTal = false
            }
          } else if (this.searchType == 5) {
            //需完善身份
            this.isPerfect = false;
            if (!this.isPerfect) { //完善信息
              this.isPerfectShow = true;
              return;
            }
          } else {
            Toast("未识别的操作类型");
          }
        }

      },
      //选择配件样式
      buildElementClass(oneItem) {
        if (oneItem.isSelected) return "ec-selected";
        if (!oneItem.isEnable) return 'ec-disable'
        return "";
      },
      //获取智能产品目录
      /*  getDatas(postUrl, postData) {
          var _this = this;
          _this.ajax({
            method: "POST",
            url: postUrl,
            dataType: "JSON",
            data: postData,
            async: false,
            success: function (str) {
              if (str.Header.ErrorCode == 0) {
                _this.allBrandLogos = str.Body;
                _this.$refs.internationalBrand.setBrandLogovalue(_this.allBrandLogos);

              } else {
                Toast(str.Header.Message)
              }

            }
          });
        },*/
      //获取vin 码详情
      getVinData(postUrl, postData) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: postUrl,
          dataType: "JSON",
          data: postData,
          async: false,
          success: function (data) {
            // _this.brandIdData = data.Body;
            if (data.Body) {
              _this.autoBrandLogo = data.Body.autoBrandLogo;
              _this.vinCode = data.Body.vinCode;
              _this.autoBrandName = data.Body.autoBrandName;
              _this.autoModelName = data.Body.autoModelName;
              _this.autoModelSubName = data.Body.autoModelSubName;
            }
          }
        });
      },
      //获取精友参数
      getVinParamByVin() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/GetJYAutoByVin",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success: function (data) {
            if (data.Body != "") {
              _this.vinJYData = data.Body[0].AutoParamList;
              // _this.carImage = data.Body[0].VinAutoBase.autoModelImages;
            }
          }
        });
      },
      //获取用户信息
      getuserInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/usercenter/getuser",
          dataType: "JSON",
          success: function (data) {
            if (data.Body != "") {
              _this.getuserInfoData = data.Body;
              _this.userAddress = data.Body.companyAddress ? data.Body.companyAddress : data.Body.lastLoginAddress ? data.Body.lastLoginAddress
                .Address : "";
            }
          }
        });
      },

      //前往超级目录
      goCjmlPage(brandUrl, type, brandName, datas) {
        var _this = this;
        _this.SeeVinDetailLog(datas.brandId); //系统计数
        var url = window.location.protocol + "//" + window.location.hostname + "/cjml/h5/#!/vin?cf=1&v=" + _this.vinCode + "&appType=" + type +
          "&td=" + brandUrl + "&bn=" + encodeURIComponent(brandName);

        _this.GotoCjmlVinPage(); //记录跳转超级目录

        setTimeout(function () {
          _this.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler(
              "native_JumpUrl", {
                url: url
              },
              function (response) {}
            );
          });
        }, 50);
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

      //计数接口
      SeeVinDetailLog(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeeVinDetailLog",
          dataType: "JSON",
          data: {
            vinCode: _this.getQueryString("v"),
            sourceType: 1,
            bid: data
          },
          success: function () {

          }
        })
      },
      //国际品牌回调函数
      dependOnHostCallBack() {
        var _this = this;
        if (_this.searchType == 2) {
          //普通分享
          _this.$refs.jurisdictionPop.show();
          _this.$refs.jurisdictionPop.setValue(_this.shareDataNo3, true, _this.shareText);
        } else if (_this.searchType == 3) {
          //付费分享
          _this.$refs.jurisdictionPop.show();
          _this.$refs.jurisdictionPop.setValue(_this.shareDataNo3, false, _this.shareText);
        } else if (_this.searchType == 5) {
          //需完善身份
          _this.isPerfect = false;
          if (!_this.isPerfect) {
            _this.isPerfectShow = true;
            return;
          }
        } else {
          Toast("未识别的操作类型");
        }
      },

      //查看VIN码详情
      ViewVinDetail() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/ViewVinDetail",
          data: {
            vinCode: this.getQueryString("v"),
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },

      //点击查看车型详细信息
      seeVinDetail() {
        //阻止事件冒泡
        window.scrollTo(0, 0);
        event.stopPropagation();

        var _this = this;
        _this.$refs.carStateInfo.setValue(_this.vinJYData);
        if (_this.searchType == 2) {
          //普通分享
          _this.$refs.jurisdictionPop.show();
          _this.$refs.jurisdictionPop.setValue(_this.shareDataNo3, true, _this.shareText);
        } else if (_this.searchType == 3) {
          //付费分享
          _this.$refs.jurisdictionPop.show();
          _this.$refs.jurisdictionPop.setValue(_this.shareDataNo3, false, _this.shareText);
        } else {
          if (_this.isShowView) {
            _this.isShowView = false;
            _this.$refs.carStateInfo.hide();
            _this.ModalHelper.beforeClose();
          } else {
            _this.isShowView = true;
            _this.$refs.carStateInfo.show();
            _this.ModalHelper.afterOpen();
            _this.ViewVinDetail();
          }
          $(event.currentTarget).toggleClass("bw-carInfoBox");
        }

      },
      //点击展示更多厂商目录
      showMoreVendor(data) {
        var _this = this;
        _this.allBrandLogos = data;
        _this.moreVendorFlag = true;
        _this.ModalHelper.afterOpen();
      },
      //更多厂商目录---获取从子组件传递过来的值
      getToParentVenFlag(data) {
        var _this = this;
        _this.moreVendorFlag = false;
        _this.ModalHelper.beforeClose();
      },
      //凑单弹层
      disable() {
        this.PieceTogether = false;
        this.switchChooseCategory = true;
      },
      //转到下单页
      toinfoPrice(data) {

        var _this = this;
        if (data.isLock == true) {
          return;
        }
        if (!_this.isPerfect) { //完善信息
          _this.isPerfectShow = true;
          return;
        }
        var CloudShopID = data.cloudShopID;
        var guestTicket = _this.getQueryString("guestticket") || "";
        var baseUrl = window.location.protocol + "//" + window.location.host + "/StockUpShop.html?backurl=native_CloseWebview&shopId=" + CloudShopID +
          "&cf=1&guestticket=" + guestTicket + "&math=" + Math.random();
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {
            url: baseUrl
          }, function (response) {

          })
        })
      },
      //显示活动详情
      showActivity(activity, tags) {
        var _this = this;
        _this.$refs.activitiesInfo.show();
        _this.$refs.activitiesInfo.setValue(activity, tags);
      },
      //这个接口现在还没用
      getShopActivity(shopId) {
        var _this = this;
        // _this.activeIshide = -1;
        _this.ajax({
          method: "POST",
          // url: resourceUrl + "/Special/IsUserActivity",
          url: resourceUrl + "/Activity/AppUserJoinActivity",
          data: {
            vinCode: this.getQueryString("v"),
            CloudShopID: shopId
          },
          dataType: "JSON",
          success: function (data) {
            if (data.Body != -1) {
              // _this.activeIshide = data.Body;
            }
          }
        });
      },
      //完善信息接口
      SaveUserInfo() {
        var _this = this;
        _this.isPerfectShow = false;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/PerfectIdentityInfo",
          dataType: "JSON",
          data: {
            CloudShopName: _this.getuserInfoData.companyName,
            UserRule: _this.getuserInfoData.userRule,
            Contacts: _this.getuserInfoData.realName,
            ShopAddress: _this.userAddress,
          },
          success: function (data) {

            if (data.Header.ErrorCode == 0 && data.Body == true) {
              _this.isPerfect = true; //已完善信息

              window.location.reload() //刷新当前页面
            } else {
              Toast({
                message: data.Header.Message,
                position: "center",
                duration: 2000
              });
            }
          }
        });
      },
      //查看价格的方法
      cancelSeePrice() {
        var _this = this;
        _this.isShowSeePricePop = false;
        //让立即调货可点击
        _this.switchChooseCategory = true;
        // _this.moreVendorFlag = false;
        _this.ModalHelper.beforeClose();
        $("body").css("overflow", "auto");
      },
      //获取配件参数回调
      GetAutoParamListByVin(callback) {
        var _this = this;
        let cids = this.getCategorysList
          .filter(item => {
            return item.isSelected;
          })
          .map(element => {
            return parseInt(element.categoryId, 10);
          });
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetAutoParamListByVin",
          beforeSend: function () {
            Indicator.open({
              spinnerType: 'fading-circle'
            });
          },
          dataType: "JSON",
          complete: function () {
            setTimeout(function () {
              Indicator.close();
            }, 1);
          },
          data: {
            VinCode: _this.vinCode,
            CategoryIds: cids,
            userParam: _this.global_userParam,
          },
          success: function (data) {

            if (callback) {
              callback(data);
            }
          }
        });
      },
      //查看价格详情
      GetShopWarePrice() {
        var _this = this;

        var mode = ''
        let cids = this.getCategorysList
          .filter(item => {
            return item.isSelected;
          })
          .map(element => {
            return parseInt(element.categoryId, 10);
          });
        if (_this.seepriceState == 2) {
          mode = "normal"
        } else if (_this.seepriceState == 3) {
          mode = "emergency"
        }
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/GetShopWarePrice",
          beforeSend: function () {
            Indicator.open({
              spinnerType: 'fading-circle'
            });
          },
          dataType: "JSON",
          complete: function () {
            setTimeout(function () {
              Indicator.close();
            }, 1000);
          },
          data: {
            VinCode: _this.vinCode,
            CategoryIds: cids,
            CloudShopIds: _this.selectShops,
            userParam: _this.global_userParam,
            mode: mode
          },
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              //让页面滚动到顶部
              window.scrollTo(0, 0);
              // _this.moreVendorFlag = true;
              _this.ModalHelper.afterOpen();
              _this.isShowSeePricePop = true;
              // _this.switchSeePrice = true;

              // _this.priceRemind = data.Body.notice;

              _this.priceLevelNotice = data.Body.priceLevelNotice || '';

              // _this.isShowView=true;
              _this.seePricePopList = data.Body.partsDetails;
              _this.tatoContdata = {
                totalPrice: data.Body.totalPrice,
                viewMemo: data.Body.viewMemo,
                viewPrice: data.Body.viewPrice,
                promotionNotice: data.Body.promotionNotice,
                isShowGeneralParts: data.Body.isShowGeneralParts,
                promotionNotice_prefix: data.Body.promotionNotice_prefix,
                promotionNotice_suffix: data.Body.promotionNotice_suffix
              };
            } else {
              Toast(data.Header.Message)
            }
          }
        });
      },
      //4s店调货
      goChooseCategory(dataInfo) {

        var _this = this;
        _this.seepriceState = 2;

        if (!_this.switchChooseCategory) {
          return;
        }

        _this.isFirstClick = false;
        //让立即调货不能点击
        _this.JumpType = 0;
        _this.selectShops = dataInfo.cloudShopID //设置选中的经销商


        if (_this.isSelectCount > 0) {
          _this.switchChooseCategory = false;

          _this.checkBaseUserInfo();
        } else {
          // 当没选择配件时，点击“确定”按钮，Toast 提示：请选择配件
          Toast({
            message: "请选择配件",
            position: "center",
            duration: 1500
          });

        }
      },
      //紧急调货
      emergency(dataInfo) {
        var _this = this;
        _this.seepriceState = 3;
        _this.isFirstClick = false;
        if (!_this.switchChooseCategory) {
          return;
        }
        _this.JumpType = 0;
        _this.selectShops = dataInfo.cloudShopID //设置选中的经销商

        if (_this.isSelectCount > 0) {
          //让立即调货不能点击
          _this.switchChooseCategory = false;
          _this.GetAutoParamListByVin(function (autoParam) {

            //是否要选择配件参数
            if (autoParam.Body && autoParam.Body.length > 0) {
              _this.OptionAutoParamList = autoParam.Body;
              _this.$refs.selectAutoParam.showPage();
              _this.$refs.selectAutoParam.setValue(autoParam.Body, 1, {});
            } else {
              //是否完善信息
              _this.checkBaseUserInfo();
            }
          });
        } else {
          // 当没选择配件时，点击“确定”按钮，Toast 提示：请选择配件
          Toast({
            message: "请选择配件",
            position: "center",
            duration: 1500
          });
        }
      },
      //查看价格
      goSeePricePop(oneShop) {
        var _this = this;
        debugger;
        // viewPriceType
        // 不展示 = -1,
        // 不可点击 = 0,
        // 可查看价格 = 1
        if (oneShop.viewPriceType == -1 || oneShop.viewPriceType == 0) return;

        _this.JumpType = 1;
        _this.selectShopsName = oneShop.cloudShopName;
        _this.isFirstClick = false;
        _this.seepriceState = 1;
        if (!_this.isPerfect) { //完善信息
          _this.isPerfectShow = true;
          return;
        }

        // if (!_this.switchSeePrice) { //完善信息
        //   return;
        // }
        // if (_this.isCanViewPrice == 0) {
        //   return;
        // }

        _this.selectShops = oneShop.cloudShopID

        if (_this.isSelectCount > 0) {
          _this.GetAutoParamListByVin(function (autoParam) {
            //是否要选择配件参数
            if (autoParam.Body && autoParam.Body.length > 0) {
              _this.OptionAutoParamList = autoParam.Body;
              _this.$refs.selectAutoParam.showPage();
              _this.$refs.selectAutoParam.setValue(autoParam.Body, 1, {});
            } else {
              //是否完善信息
              _this.checkBaseUserInfo();
            }
          });
        } else {
          Toast({
            message: "请选择配件",
            position: "center",
            duration: 1500
          });
          window.scrollTo(0, 0);
          return;
        }
      },
      //凑单跳转的查看价格
      together() {
        var _this = this;
        _this.PieceTogether = false;
        _this.GetShopWarePrice();

      },
      //是否完善信息
      checkBaseUserInfo() {
        var _this = this;
        if (!_this.isPerfect) {
          _this.isPerfectShow = true;
        } else {
          //用来判断能否查看价格的
          if (_this.JumpType > 0) {
            // _this.switchSeePrice = !_this.switchSeePrice;
            _this.GetShopWarePrice();
          } else {
            // _this.switchChooseCategory = !_this.switchChooseCategory;
            _this.setFollowCategorys('query');
          }
        }
      },
      //跳转至选择店铺页
      setFollowCategorys(value) {
        var _this = this;
        // 直接到选常用店铺页面
        var url = ''
        if (_this.seepriceState == 2) { //常规调货
          url = resourceUrl + "/Order/QuickSubmitVinNormalOrder";
        } else if (_this.seepriceState == 3) { //紧急调货
          url = resourceUrl + "/Order/QuickSubmitVinEmergencyOrder";
        }
        _this.ajax({
          method: "POST",
          url: url,
          dataType: "JSON",
          data: {
            CategoryIds: _this.selectCategorys, //分类ID列表
            VinCode: _this.vinCode,
            CloudShopIds: _this.selectShops,
            userParam: _this.global_userParam,
            userAudio: "",
            mode: value
          },
          success: function (data) {
            if (data.Body) {
              if (data.Body.result == 'queryFreeFreight_emergency' || data.Body.result == "queryFreeFreight_normal") {
                _this.PieceTogether = true;
                _this.queryText = data.Body.query_text
              } else {
                _this.shopOrderId = data.Body.shopOrderId;
                _this.switchChooseCategory = true;
                if (data.Body.result == 'repaircenter_success') {
                  // _this.init();
                  //路由跳转到成功页面
                  var baseUrl = window.location.protocol + "//" + window.location.host + "/shoph5/orderSuccess.html?or=3&cf=1&shopOrderId=" +
                    _this.shopOrderId
                  // window.location.href=baseUrl;
                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: baseUrl
                    }, function (response) {});
                  });

                  window.location.reload()
                  // router.push({
                  //   name: "offerResultShop",
                  //   params: {
                  //     shopOrderId: _this.shopOrderId,
                  //     vinCode: _this.vinCode
                  //   }
                  // });
                } else {
                  var baseUrl = window.location.protocol + "//" + window.location.host +
                    "/manageh5/orderDetails.html?shopOrderId=" + data.Body.shopOrderId + "&cf=1&backurl=native_CloseWebview&shopid=" + data.Body
                    .shopId + "&math=" + Math.random();

                  // window.location.href=baseUrl
                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: baseUrl
                    }, function (response) {

                    })
                  })

                  // window.location.reload()
                }
              }

            } else {
              Toast({
                message: data.Header.Message,
                position: "center",
                duration: 1500
              });
              _this.isFirstClick = true;
              _this.switchChooseCategory = true;

            }
          }
        });
      },
      CallBack() {
        window.location.reload()
      },
      CallbackSubmitWares(input, universalParts, value) {
        input = input.filter(function (item) {
          return typeof item != "undefined";
        });
        if (universalParts.length > 0) {
          for (var i = 0; i < universalParts.length; i++) {

            if (universalParts[i].wares.length > 0) {

              for (var j = 0; j < universalParts[i].wares.length; j++) {
                var obj = {};
                obj.wareKind = universalParts[i].wares[j].wareKind;
                obj.wareId = universalParts[i].wares[j].wareId;
                obj.wareCount = universalParts[i].wares[j].wareCount;
                input.push(obj);
              }

            }

          }
        }
        var url = ''
        if (value == 2) {
          url = resourceUrl + "/Order/SubmitVinNormalOrder";
        } else {
          url = resourceUrl + "/Order/SubmitVinEmergencyOrder";
        }
        var _this = this;
        _this.ajax({
          method: "POST",
          url: url,
          dataType: "JSON",
          data: {
            orderWareList: input,
            CategoryIds: _this.selectCategorys, //分类ID列表
            VinCode: _this.vinCode,
            CloudShopIds: _this.selectShops,
            userAudio: ""
          },
          beforeSend: function () {},
          success: function (data) {

            if (data.Body) {
              _this.shopOrderId = data.Body.shopOrderId;
              _this.ModalHelper.beforeClose();
              //路由跳转到成功页面
              if (data.Body.result == "repaircenter_success") {

                if (data.Body.needPay == 0) {
                  var baseUrl = window.location.protocol + "//" + window.location.host + "/shoph5/orderSuccess.html?or=3&cf=1&shopOrderId=" +
                    _this.shopOrderId

                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: baseUrl
                    }, function (response) {});
                  });

                  window.location.reload()
                  // _this.init();
                  // router.push({
                  //   name: "offerResultShop",
                  //   params: {
                  //     shopOrderId: _this.shopOrderId,
                  //     vinCode: _this.vinCode
                  //   }
                  // });
                } else {
                  // _this.GetCashier(data)
                }
              } else {
                if (data.Body.needPay == 0) {
                  _this.isShowSeePricePop = false;
                  var baseUrl = window.location.protocol + "//" + window.location.host +
                    "/manageh5/orderDetails.html?shopOrderId=" + data.Body.shopOrderId + "&cf=1&backurl=native_CloseWebview&shopid=" + data.Body
                    .shopId + "&math=" + Math.random();

                  // window.location.href=baseUrl
                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: baseUrl
                    }, function (response) {

                    })
                  })
                } else {
                  // _this.GetCashier(data);
                  // _this.$refs.paymentPop.show(data);
                }

              }

            } else {
              Toast({
                message: data.Header.Message,
                position: "center",
                duration: 1500
              });

            }
          }
        });
      },
      // GetCashier(data) {
      //   var _this = this;
      //
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/Order/GetCashier",
      //     dataType: "JSON",
      //     data: {
      //       ShopOrderId: data.Body.shopOrderId, //订单ID
      //       ShopID: data.Body.shopId //店铺ID
      //     },
      //     success: function (str) {
      //       if (str.Header.ErrorCode == 0) {
      //         _this.$refs.paymentPop.show(data);
      //         _this.$refs.paymentPop.setValue(str.Body);
      //       }
      //     }
      //   })
      // },
      //支付方式
      // tonoPay(data) {
      //   var _this = this;
      //   if (data.Body.result == "repaircenter_success") {
      //     router.push({
      //       name: "offerResultShop",
      //       params: {
      //         shopOrderId: _this.shopOrderId,
      //         vinCode: _this.vinCode
      //       }
      //     });
      //   } else {
      //     _this.isShowSeePricePop = false;
      //     var baseUrl = window.location.protocol + "//" + window.location.host +
      //       "/manageh5/orderItems.html?appType=2&orderItems=10&backurl=native_CloseWebview&shopid=" + data.Body.shopId + "&math=" + Math.random();
      //
      //     // window.location.href=baseUrl
      //     _this.setupWebViewJavascriptBridge(function (bridge) {
      //       bridge.callHandler('native_JumpUrl', {
      //         url: baseUrl
      //       }, function (response) {
      //
      //       })
      //     })
      //   }
      // },
      // payType(data, type) {
      //   var _this = this;
      //
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/Order/PayShopOrder",
      //     dataType: "JSON",
      //     data: {
      //       "ShopOrderId": data.Body.shopOrderId, //订单ID
      //       "ShopID": data.Body.shopId, //店铺ID
      //       "ChannelID": type.ChannelID, //支付渠道ID
      //     },
      //     success: function (str) {
      //       if (str.Header.ErrorCode == 0) {
      //         _this.setRedPacketPay(str.Body, data)
      //
      //       }
      //
      //     }
      //   })
      //
      // },
      //调用支付宝接口
      // setRedPacketPay(key, info) {
      //   var _this = this;
      //   var data = {
      //     "payType": 1, //1支付宝，2微信，3银联
      //     "credential": key,
      //   };
      //   if (_this.androidOrios() == 1) {
      //     data = JSON.stringify(data);
      //   };
      //   _this.setupWebViewJavascriptBridge(function (bridge) {
      //     bridge.callHandler('native_Pay', data, function (response) {
      //
      //       var response = response;
      //
      //       if (_this.androidOrios() == 1) {
      //         response = JSON.parse(response);
      //       };
      //       if (response.payResult == 1) {
      //
      //         _this.tonoPay(info)
      //       }
      //     })
      //   })
      // },
      //通过管理跳转到管住的目录页
      // goJumpPage(type, flag) {
      //   var _this = this;
      //   var url = window.location.protocol + "//" + window.location.host;
      //   switch (flag) {
      //     case 2:
      //       url += "/vendorsConcer.html?edit=1&type=1&cf=1&v=" + _this.vinCode;
      //       break; //智能产品目录页——编辑状态
      //     default:
      //       break;
      //   }
      //   _this.setupWebViewJavascriptBridge(function (bridge) {
      //     bridge.callHandler("native_JumpUrl", {
      //       url: url
      //     }, function (
      //       response
      //     ) {});
      //   });
      // },
      //启动扫码收款弹层
      launchMaintainPayDialog(maintainRecordId) {
        this.maintainPayDialog_input = {
          vinCode: this.vinCode, //VIN码
          maintainRecordId: maintainRecordId, //保养记录ID
        };
        this.maintainPayDialog_launched = true;

      },
    }
  };

</script>
<style>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/shopChoose/shopChoose.css");
  @import url("../../assets/css/aboutUs/aboutUs.css");
  @import url("../../assets/css/vinSearchResult.css");
  @import url("../../assets/css/choosecategorystyle.css");
  @import url("../../assets/css/deleteOperation.css");
  @import url("../../assets/css/onekeyinquiriesstyle0702.css");
  @import url("../../assets/css/onekeyinquiriesstyle0705.css");
  @import url("../../assets/css/popstyle.css");
  @import url("../../assets/css/paymentPop.css");
  @import url("../../assets/css/scavengingresultstyle.css");
  @import url("../../assets/css/bannerAdvert.css");

  .bw-Top {
    overflow: hidden;
    height: 100%;
  }

  .cb-activityRemind {
    width: 100%;
    height: 1.28rem;
    padding: 0 0.32rem;
    /*background: #fff0d8 url(../../assets/images/arrow_yellow.png) no-repeat*/
    /*9.48rem center;*/
    background-size: 0.2rem;
    border-bottom: 1px solid #edd5a9;
    float: left;
    clear: left;
    margin-top: 0;
  }

  .cb-activityRemind p {
    width: auto;
    height: 0.64rem;
    margin-top: 0.32rem;
    font-size: 0.4rem;
    line-height: 0.64rem;
    text-align: left;
    color: #f27a11;
    float: left;
    clear: none;
  }

  .cb-activityRemind span {
    width: 0.64rem;
    height: 0.64rem;
    margin-top: 0.32rem;
    background: url(../../assets/images/icon_engineOilOranger.png) no-repeat center center;
    background-size: 0.36rem;
    display: block;
    float: left;
    clear: none;
  }

  .bw-storeChoiceLine .cb-engineOilRed-activity {
    width: 0.6rem;
    height: 0.6rem;
    margin: 0;
    border: 0;
    border-radius: 0;
    background: url(../../assets/images/icon_engineOilRed.png) no-repeat center center;
    background-size: 0.32rem;
    display: inline-block;
    position: static;
    float: left;
    clear: none;
  }

  .modal-open {
    position: fixed;
    width: 100%;
  }

  .aa-chooseBox ul.aa-brandChoose li {
    height: 3rem;
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
    width: 25%;
    height: 3rem;
    padding: 0;
    /*border-top: 1px solid #dce6ef;*/
    /*border-bottom: 1px solid #dce6ef;*/
    /*margin-top: -1px;*/
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

  .bw-categoryChoice .activityed {
    /*border: 3px solid #333333;*/
    background-color: #afacac;
    /*color: #fff;*/
  }

  .bw-storeChoiceLine dd a.cd-activityBox {
    width: auto;
    background-size: .32rem;
    float: left;
    clear: left;
  }

  .bw-storeChoiceLine dd a.cd-activityBox p {
    width: auto;
    max-width: 7.6rem;
    padding-right: .48rem;
    background: url(../../assets/images/arrow_gray_down.png) no-repeat center right;
    background-size: 0.4rem auto;
    font-size: .32rem;
    line-height: .6rem;
    text-align: left;
    color: #f39c12;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    clear: left;
  }

  .bw-storeChoiceLine dd a.cd-activityBox p span {
    width: auto;
    height: .48rem;
    margin: .06rem .12rem 0 0;
    border: 0;
    background: #f39c12;
    padding: 0 .12rem;
    font-size: .32rem;
    line-height: .48rem;
    text-align: left;
    color: #fff;
    position: static;
    float: left;
    clear: none;
  }

  .bw-buttonBox .disableBtn {
    background: url("../../assets/images/button_offer_gray.png") no-repeat center center;
    background-size: 5.28rem;
  }

  .toastwidth {
    width: 200px;
  }

  .bw-buttonBox a.cc-seePrice {
    width: auto;
    padding-right: 0.42rem;
  }

  .cc-seePriceDisable {
    background: #e8e8e8 !important;
    color: #acacac !important;
    border-color: #e8e8e8 !important;
  }

  .bw-buttonBox a.bz-historical {
    width: auto;
    height: .8rem;
    margin: .26rem 0;
    border: 1px solid #d53533;
    border-radius: .4rem;
    font-size: .36rem;
    padding: 0 .32rem;
    color: #d53533;
  }

  /*.slide-fade-enter-active {*/
  /*transition: all 1s ease;*/
  /*}*/
  /*.slide-fade-leave-active {*/
  /*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
  /*}*/
  /*.slide-fade-enter, .slide-fade-leave-to {*/
  /*!*transform: translateY(0.5rem);*!*/
  /*opacity: 0;*/
  /*}*/

  @keyframes identifier {
    0% {
      /*transform: translateY(100%);*/
      height: 0rem;
    }

    50% {
      height: 10rem;
    }

    100% {
      /*transform: translateY(0%);*/
      height: auto;
    }
  }

  @keyframes against {
    from {
      transform: translateY(0%);
    }

    to {
      transform: translateY(100%);
    }
  }

  .toTop-enter-active {
    animation: identifier .4s ease-in-out;
  }

  .toTop-leave-active {
    animation: against .4s ease-in-out;
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
