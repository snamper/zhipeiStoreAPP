<template>
    <div class="offerChoiceShop">
		<headers title="增加报价汽配店" offerStatus="2" :vinCode="vinCode"></headers>
		<!-- 一键询价 新增汽配店顶部筛选 -->

		<div class="cb-activityRemind" v-show="activeIshide" @click="toActivity()" style="margin-top: 1.2rem;">
			<p>向带标识</p>
			<span></span>
			<p>的供货商调货，即可得机油！</p>
		</div>
		<div class="bo-offerShopTop" :style="{marginTop: top}">

			<div class="bo-offerShopRange" v-show="false">
				<p>汽配店范围</p>
				<span>
					<a  v-for="(item,index) in rangeData"  v-show="item.isShow" :class="item.isSelect?'bo-selected':''"
					:id="item.distance" @click="getShopInfo(item.distance,index)" v-model="item.distance"  >
					{{item.distanceName}}</a>
				</span>
			</div>
      <div class="bo-offerShopRange" >
        <!-- 默认样式 -->
        <div class="cs-offerShopSearch" v-show="isSearch">
          <input type="text" name="" placeholder="请输入汽配店名称进行搜索" v-model="searchValue">
          <a >取消</a>
          <a  class="cs-offerShopSearchButton" @click="searchMeath"></a>
        </div>
        <!-- 输入时样式 -->
        <div class="cs-offerShopSearch cs-offerShopSearchInput" v-show="!isSearch">
          <input type="text" name="" placeholder="请输入汽配店名称进行搜索" v-model="searchValue">
          <a @click="NoSearch">取消</a>
          <a class="cs-offerShopSearchButton" @click="searchMeath"></a>
        </div>
      </div>

		</div>

		<!-- 一件询价 报价表格 -->
		<div class="bo-offerTableBox">
			<div class="bo-offerTableTop">
				<ul>
					<li class="bo-offerNumber">编号</li>
					<li class="bo-offerShop">店名</li>
					<li class="bo-offerName">姓名</li>
					<li class="bo-offerChoice">请选择</li>
				</ul>
			</div>
			<div class="bo-offerTable">

				<table cellpadding="0" cellspacing="0" border="0" v-if="getShopData!=''">
					<tr v-for="(item,index) in getShopData">
						<td class="bo-offerNumber">{{index+1}}</td>

						<td class="bo-offerShop" :class="{chRecommendShopBox:item.isPartner==true}">
							<span class="ch-shopLogoBox" v-show="item.isPartner==true">
								<img :src="item.logo" v-show="item.logo != ''">
                <img src="../../assets/images/pic_noShop.png" v-show="item.logo == ''" >
							</span >
							<span class="ch-shopNameBox ch-shopEngineOil">
								<p>{{item.cloudShopName}}</p>

								<span class="bu-label" v-if="item.IsUseShop==1"></span>

									<!--<span class="bu-label"></span>-->
								<!--<span class="cb-engineOilRed" v-show="item.isPlatformActivity==1"></span>-->
								<a class="cd-activityBox" v-show="item.activity!=null" @click="showAcivity(item.activity)">
									<p><span>活动</span>{{item.activity!=null?item.activity.activityTitle:''}}</p>
								</a>
							</span>


						</td>

						<td class="bo-offerName">{{item.contacts}}</td>
						<td class="bo-offerChoice">
							<a :class="item.selectedShop?'bo-selected':''" @click="goOffer?radioButton(item,index):checkSelect(item)"></a>
							<div class="bs-offerRemindPop" v-if="index==0 &&isRemindShow">
								<div class="bs-offerRemindMain">
									<p class="bu-remindText">请选择您的供货商</p>
								</div>
								<a @click="CheckPopupCount('offerRemindClose')" class="bs-offerRemindClose"></a>
							</div>
						</td>
					</tr>

				</table>

			</div>
		</div>

		<!-- 一键询价 范围内查询无结果 -->
		<div class="bo-offerShopEmpty"  v-if="getShopData==''&&isRangeEmpty" >
			此范围内未找到匹配的汽配店<br>换个条件试试
		</div>

		<!-- 一键询价 报价底部操作按钮 -->
		<div class="bo-offerShopNewFool" v-if="getShopData!=''">
			<a v-if="goOffer" @click="isSelectCount>0&&isFirstClick?saveShopOffer():''" class="bu-offerShopButton" :class="isSelectCount>0&&isFirstClick?'':'bo-disable'" >确定</a>
			<a v-if="goOffer" @click="isInvitation=true" class="bu-offerShopHelp"></a>

			<a v-if="!goOffer" @click="isSelectCount>0&&isFirstClick?saveShopOffer():''" class="bd-chooseCategoryFool" :class="isSelectCount>0&&isFirstClick?'':'bo-disable'" >确定</a>
		</div>

		<!-- 邀请供货商的弹层 -->
		<div class="bs-shopConfirmPop" v-if="isInvitation">
			<div class="bs-shopConfirmPopBox">
				<p>找不到我的供货商怎么办？</p>
				<span>
					<a @click="isInvitation=false" class="bs-leftButton">取消</a>
					<a @click="invitationShop()">邀请供货商</a>
				</span>
			</div>
		</div>

		<!-- 供货商加载中的效果 -->
		<div class="bu-loading" v-if="isLoadingShow"></div>

		<!-- 分享APP -->
		<shareFriends v-if="isSharePop" v-on:shareFriendsHide="shareFriendsHide" v-bind:shareFlag="1" ></shareFriends>

		<!--活动详情-->
		<activitiesInfo ref="activitiesInfo"></activitiesInfo>
    </div>
</template>

<script>
import offerRouter from "../../router/vinSearchResult.js";
import activitiesInfo from "../../components/activitiesInfo"
// import router from "../../router/offerChoice.js";
import { commonMixin } from "../../config/base/commonMixin.js";
import { Toast } from "mint-ui";
import headers from "../../components/headers.vue";
import shareFriends from "../../components/shareFriends.vue";
var resourceUrl = process.env.apiDomain;
export default {
  name: "offerChoiceShop",
  mixins: [commonMixin],
  components: {
    headers: headers,
    shareFriends,
    activitiesInfo
  },
  data() {
    return {
      //汽配店范围参数
      activeIshide: false,
      rangeData: [
        {
          distance: "30",
          distanceName: "30公里以内",
          isSelect: true,
          isShow: true
        },
        {
          distance: "50",
          distanceName: "50公里以内",
          isSelect: false,
          isShow: true
        },
        {
          distance: "60",
          distanceName: "智配门店",
          isSelect: false,
          isShow: false
        }
      ],
      selectShops: [], //用户选中的范围
      vinChoiceSelectShops: [], //用户选中的店铺信息，
      rangeDistance: 0,
      isSelectCount: 0,
      //店铺信息
      getShopData: {
      },
      isAgainOrder: false, //是否已下单
      isFirstClick: true,
      goOffer: this.$route.params.goOffer == 1 ? true : false, //1,第一次下单，2，增加常用门店
      followShop: [],
      //接口参数
      selectCategorys: localStorage.getItem("CategoryList")
        ? JSON.parse(localStorage.getItem("CategoryList"))
        : this.$route.params.goOffer == 2
          ? this.$route.params.selectCategorys
          : [],
      addShopCategoys:
        this.$route.params.goOffer == 2
          ? this.$route.params.selectCategorys
          : [], //添加供货商后记住所选配件参数
      choosedParams: localStorage.getItem("CJML_APP_choosedParams")
        ? JSON.parse(localStorage.getItem("CJML_APP_choosedParams"))
        : "",
      mobile: this.$route.params.mobile, //this.getQueryString('m'),
      vinCode: this.$route.params.vinCode
        ? this.$route.params.vinCode
        : this.getQueryString("v"), //this.getQueryString('v'),
      shopOrderId: 0,

      isInvitation: false, //邀请供货商的弹层是否展示
      isSharePop: false, //分享朋友圈是否展示
      isLoadingShow: true, //加载框是否展示
      isRangeEmpty: false, //范围内是否有数据
      isRemindShow: true, //选中店铺提示层是否显示
      choiceSelectShops: localStorage.getItem("vinChoiceSelectShops")
        ? JSON.parse(localStorage.getItem("vinChoiceSelectShops"))
        : [],
      top: "0rem",
      activityIsHide:false, //活动详情默认隐
      activityInfo:{},
      searchValue:'', //搜索值
      isSearch:true
    };
  },
  created() {
    var _this = this;
    _this.setTitle("找货快速报价");
    // if(_this.$route.params.goOffer==2){
    // 	localStorage.setItem("CategoryListOld", _this.$route.params.selectCategorys);
    // }
    _this.searchCloudShopList();
    //请选择熟悉的汽配店报价 的弹出层次数
    var offerClosecount = parseInt(
      _this.getPopupCount("offerRemindClose_" + _this.mobile)
    );
    //关注店铺
    // _this.GetShopbyuid();
    if (offerClosecount > 2) {
      _this.isRemindShow = false;
    }
  },
  mounted() {
    var _this = this;
    _this.getinfo();
    if (sessionStorage.getItem("defaultShop")) {
      _this.defaultSelected();
    }
  },
  methods: {
    init() {
      this.selectCategorys = [];
      localStorage.removeItem("vinChoiceSelectShops"); //清除勾选的常用店铺信息
      localStorage.removeItem("CategoryListOld"); //选择配件
      localStorage.removeItem("audioResult"); //清除已经缓存下的录音
      localStorage.removeItem("CJML_APP_choosedParams"); //清除缓存——产品参数
      localStorage.removeItem("CategoryList");
      localStorage.removeItem("CJML_APP_selectShops"); //清除——勾选的常用店铺Id
      // localStorage.removeItem('CJML_APP_vinSelfSelectShops');//清除缓存——新增的供货商
      localStorage.removeItem("CJML_APP_pageNum"); //清除缓存——用户是否点击查看更多
      localStorage.removeItem("CJML_APP_CategoryPageNum"); //清除缓存——用户是否点击查看更多
    },
    getinfo() {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/Special/IsUserActivity",
        dataType: "JSON",
        success: function(data) {

          _this.activeIshide = data.Body;
          if (data.Body) {
			_this.top = "0rem"
          } else {
            _this.top = '1.2rem'
          }
        }
      });
    },
      showAcivity(data){
          var _this = this;
          _this.$refs.activitiesInfo.show();
          _this.$refs.activitiesInfo.setValue(data);
          // _this.activityIsHide = true;
          // _this.activityInfo = data;
	  },
    toActivity() {
      var base =
        window.location.protocol +
        "//" +
        window.location.host +
        "/activity.html?cf=1";
                // window.location.href = base;

                this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {url:base}, function (response) {

                    })
                })
    },
    // 获取分享传递的数据
    shareFriendsHide(data) {
      var _this = this;
      _this.isSharePop = data;
    },
    //邀请厂商=分享微信朋友圈
    invitationShop() {
      var _this = this;
      _this.isInvitation = false;
      _this.isSharePop = true;
    },

    // 切换分类之后默认选中
    defaultSelected() {
      var _this = this;
      if (sessionStorage.getItem("defaultShop")) {
        $(_this.$refs.ranges)
          .find("li")
          .eq(sessionStorage.getItem("defaultShop"))
          .addClass("bo-selected")
          .siblings()
          .removeClass("bo-selected");
      }
    },
    //选择汽配店范围
    getShopInfo(postValue, index) {
      var _this = this;
      _this.isLoadingShow = true;
      _this.getShopData = [];
      _this.selectShops = [];
      _this.vinChoiceSelectShops = [];
      _this.isSelectCount = 0;
      $(event.currentTarget)
        .addClass("bo-selected")
        .siblings()
        .removeClass("bo-selected");
      _this.rangeDistance = postValue;

      sessionStorage.setItem("defaultShop", index);
      if (postValue <= 50) {
        _this.searchCloudShopList();
      } else {
        // _this.GetShopbyuid();
      }
    },
    //勾选店铺
    checkSelect(oneItem) {
      var _this = this;
      oneItem.selectedShop = !oneItem.selectedShop;
      if (oneItem.selectedShop) {
        _this.selectShops.push(oneItem.cloudShopID);
        _this.vinChoiceSelectShops.push(oneItem);
      } else {
        var index = _this.selectShops.indexOf(oneItem.cloudShopID);
        _this.selectShops.splice(index, 1);
        var ind = _this.vinChoiceSelectShops.indexOf(oneItem);
        _this.vinChoiceSelectShops.splice(index, 1);
      }
      _this.isSelectCount = _this.selectShops.length;
      localStorage.setItem(
        "vinChoiceSelectShops",
        JSON.stringify(_this.vinChoiceSelectShops)
      );
    },
    radioButton(oneItem, index) {
      var _this = this;
      //  alert(222)
      oneItem.selectedShop = !oneItem.selectedShop;
      if (oneItem.selectedShop) {
        _this.getShopData.forEach(function(item) {
          if (item.cloudShopID == oneItem.cloudShopID) {
            item.selectedShop = oneItem.selectedShop;
          } else {
            item.selectedShop = false;
          }
        });
        _this.selectShops = [oneItem.cloudShopID];
        _this.vinChoiceSelectShops = [{ oneItem }];
      } else {
        this.getShopData.forEach(function(item) {
          item.selectedShop = false;
        });
        _this.selectShops = [];
        _this.vinChoiceSelectShops = [];
      }

      _this.isSelectCount = _this.selectShops.length;
      localStorage.setItem(
        "vinChoiceSelectShops",
        JSON.stringify(_this.vinChoiceSelectShops)
      );
    },
    //获取范围内店铺信息
    searchCloudShopList() {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/Order/SearchCloudShopList",
        dataType: "JSON",
        data: {
          // CategoryIds: _this.selectCategorys, //分类ID列表
          VinCode: _this.vinCode, // Vin码
          // userParam: _this.choosedParams != "" ? _this.choosedParams : null, // 用户选择的参数
          // SearchRange: _this.rangeDistance > 0 ? _this.rangeDistance : 30 // 搜索范围
        },
        beforeSend: function() {},
        success: function(data) {
          _this.isFirstClick = true; //初始化确认按钮，让其只在第一次点击有效
          _this.isLoadingShow = false;
          if (data.Body) {
            if (data.Body.shopList != "") {
              //是否常用店铺，并把常用店铺存到已选择的店铺列表中
              if (_this.choiceSelectShops != "") {
                data.Body.shopList.forEach(function(oneItem) {
                  _this.choiceSelectShops.forEach(function(item) {
                    if (item.cloudShopID == oneItem.cloudShopID) {
                      oneItem.selectedShop = true;
                      _this.selectShops.push(oneItem.cloudShopID);
                      _this.vinChoiceSelectShops.push(oneItem);
                    }
                  });
                });
              } else {
                data.Body.shopList.forEach(function(oneItem, index) {
                  oneItem.selectedShop = false;
                });
              }

              _this.getShopData = data.Body.shopList;
              _this.isSelectCount = _this.selectShops.length;
            } else {
              _this.isRangeEmpty = true;
            }
          } else {
            _this.isRangeEmpty = true;
          }
        }
      });
    },
    //确认发送询价
    saveShopOffer() {
      var _this = this;
      _this.isFirstClick = false;
      //goOffer  1：第一次下单，直接下单，正向流程；2：添加更多供货商
      if (_this.$route.params.goOffer == 2) {
          //localStorage.setItem("vinChoiceSelectShops", JSON.stringify(_this.vinChoiceSelectShops));
         //localStorage.removeItem('CJML_APP_vinSelfSelectShops');
        offerRouter.push({
          // name: 'offerInquiry',
          name: "offerInquiryNew",
          params: {
            pushShop: 1,
            vinCode: _this.vinCode
          }
        });
      } else {
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/SubmitOrderByShopId",
          dataType: "JSON",
          data: {
            CategoryIds: _this.selectCategorys, //分类ID列表
            VinCode: _this.vinCode,
            CloudShopIds: _this.selectShops,
            userParam: _this.choosedParams != "" ? _this.choosedParams : null,
            userAudio: localStorage.getItem("audioResult")
              ? localStorage.getItem("audioResult")
              : ""
          },
          beforeSend: function() {},
          success: function(data) {
            if (data.Body) {
              _this.shopOrderId = data.Body.shopOrderId;
              //清除缓存
              _this.init();

              //路由跳转到成功页面
              offerRouter.push({
                name: "offerResultShop",
                params: {
                  shopOrderId: _this.shopOrderId,
                  vinCode: _this.vinCode
                }
              });
            } else {
              Toast({
                message: data.Header.Message,
                position: "center",
                duration: 1500
              });
              _this.isFirstClick = true;
            }
          }
        });
      }
    },
    //set弹出层次数
    CheckPopupCount(key) {
      var _this = this;
      if (key == "offerRemindClose") {
        _this.isRemindShow = false;
      }
      _this.SetPopupCount(key + "_" + _this.mobile);
    },
    GetShopbyuid() {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/Order/getusershop",
        dataType: "JSON",
        data: {},
        beforeSend: function() {},
        success: function(data) {
          if (data.Body) {
            _this.isLoadingShow = false;
            _this.followShop = data.Body.userShop;
            if (data.Body.userShop.length > 0) {
              _this.rangeData[2].isShow = true;

              console.log(_this.getShopData);
              _this.getShopData = [];
              _this.followShop.forEach(function(md) {
                _this.getShopData.push({
                  IsBrand: 1,
                  IsUseShop: 0,
                  cloudShopID: md.shopId,
                  cloudShopName: md.shopName,
                  contacts: md.contacts,
                  distance: 0,
                  isPlatformActivity: 0,
                  isSelected: 0,
                  mobile: md.mobile,
                  selectedShop: false
                });
              });
              console.log(_this.getShopData);
            } else {
              _this.rangeData[2].isShow = false;
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
    //搜索店铺
    searchMeath(){
      var _this = this;
      if(_this.searchValue ==''){
        Toast('请输入用户名或汽配店名称');
        return;
      }
      _this.isSearch = false;

      _this.ajax({
        method: "POST",
        url: resourceUrl + '/Order/SearchCloudShopList',
        dataType: "JSON",
        data:{
          vinCode:_this.vinCode,
          key:_this.searchValue
        },
        success: function (data) {
          _this.isFirstClick = true; //初始化确认按钮，让其只在第一次点击有效
          _this.isLoadingShow = false;
          if (data.Body) {
            if (data.Body.shopList.length>0) {
              //是否常用店铺，并把常用店铺存到已选择的店铺列表中
              if (_this.choiceSelectShops != "") {
                data.Body.shopList.forEach(function(oneItem) {
                  _this.choiceSelectShops.forEach(function(item) {
                    if (item.cloudShopID == oneItem.cloudShopID) {
                      oneItem.selectedShop = true;
                      _this.selectShops.push(oneItem.cloudShopID);
                      _this.vinChoiceSelectShops.push(oneItem);
                    }
                  });
                });
              } else {
                data.Body.shopList.forEach(function(oneItem, index) {
                  oneItem.selectedShop = false;
                });
              }

              _this.getShopData = data.Body.shopList;
              _this.isSelectCount = _this.selectShops.length;
            } else {
              _this.isRangeEmpty = true;
              _this.getShopData = data.Body.shopList;

            }
          } else {
            _this.isRangeEmpty = true;
          }
        }
      })
    },
    //取消搜索店铺
    NoSearch(){
      var _this = this;
      _this.isSearch = true;
      _this.searchValue = '';
      _this.searchCloudShopList();
    }
  }
};
</script>

<style>
@import url("../../assets/css/app.css");
@import url("../../assets/css/offerChoice.css");
@import url("../../assets/css/offerstyle0702.css");

.bw-Top {
  overflow: hidden;
  height: 100%;
}
.cb-activityRemind {
  width: 100%;
  height: 1.28rem;
  padding: 0 0.32rem;
  background: #fff0d8 url(../../assets/images/arrow_yellow.png) no-repeat
    9.48rem center;
  background-size: 0.2rem;
  border-bottom: 1px solid #edd5a9;
  float: left;
  clear: left;
  /*margin-top: 1.2rem;*/
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
.bo-offerTable table td.bo-offerShop a.cd-activityBox p {
	background: url(../../assets/images/arrow_gray_down.png) no-repeat center right;
	background-size: 0.4rem 0.25rem;
}
.cb-activityRemind span {
  width: 0.64rem;
  height: 0.64rem;
  margin-top: 0.32rem;
  background: url(../../assets/images/icon_engineOilOranger.png) no-repeat
    center center;
  background-size: 0.36rem;
  display: block;
  float: left;
  clear: none;
}
.cb-engineOilRed {
  width: 0.56rem;
  height: 0.56rem;
  background: url(../../assets/images/icon_engineOilRed.png) no-repeat center
    center;
  background-size: 0.32rem;
  display: inline-block;
  vertical-align: middle;
  clear: none;
}
.bo-offerTable table td.bo-offerShop a.cd-activityBox {
	width: 100%;
}
.bo-offerShop .ch-shopNameBox p{
  display: inline-block;
  float: left;
  clear: none;
}
</style>
