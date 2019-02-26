<template>
    <div class="offerInquiry" :class="(allBrandLogos!=''||getshopbyuidData!='')&&isShowView?'bw-Top':''">
        <!-- :style="(allBrandLogos!=''||getshopbyuidData!='')?" -->
        <headers title="询价调货"></headers>
        <div class="pageMain">
            <div class="bw-orderBox">
                <!-- 车型信息相关 -->
                <div class="bw-carInfoBox">
                    <div class="bw-carBox" v-on:click="seeCarParams()">
                        <ul>
                            <li class="bw-carPic"><img :src="autoBrandLogo"></li>
                            <li class="bw-carMain">
                                <p>{{autoBrandName}} {{autoModelName}} {{autoModelSubName}}</p>
                                <span>{{vinCode}}</span>
                                <a v-if="isShowView">收起</a>
                                <a v-if="!isShowView">展开</a>
                            </li>
                        </ul>
                    </div>
                    <div class="bw-carInfo" style="top: 3.00rem;" v-if="isShowView" >
                        <ul>
                            <li v-for="(item,index) in vinJYData" v-if="item.ParamValue">
                                <span>{{item.ParamName}}</span>
                                <p>{{item.ParamValue}}</p>
                            </li>

                        </ul>
                    </div>
                </div>
                <vinChooseCategory v-if="isPlaceOrder"  v-on:vinChooseShopHide="vinChooseShopHide" ></vinChooseCategory>
            </div>


            <!--查看智能厂商目录-->
            <div class="aa-chooseBox" v-show="allBrandLogos!=''">
                <p>查看厂商智能产品目录
                    <a v-on:click="showMoreVendor()" v-show="getshopbyuidData!=''&&allBrandLogos!=''&&allBrandLogos.length>8">更多</a>
                </p>
                <ul class="aa-brandChoose">
                    <li v-for="(item,index) in allBrandLogos" @click="selected(item.brandUrl,item.dataType,item.brandName)" v-show="index<8||getshopbyuidData==''">
                        <img :src="item.brandLogo">
                    </li>
                    <li class="bj-chooseNew" style="display: none;">
                        <a v-on:click="shareVenApp(getBrandsCountData.todayFollowcount)" class="bo-chooseNewRed">
                            <span></span>
                            <p>查询更多智能产品目录</p>
                        </a>
                    </li>
                </ul>
            </div>
            <!--到那家智能门店调货 v-show="getshopbyuidData!=''" -->
            <div class="aa-chooseBox" v-show="false">
                <p>直接向汽配店下单
                    <a v-on:click="showMoreShop()" v-show="getshopbyuidData!=''&&allBrandLogos!=''&&getshopbyuidData && getshopbyuidData.length>4">更多</a>
                </p>
                <ul class="aa-shopChoose aa-shopLink">
                    <li v-for="(item,index) in getshopbyuidData" v-on:click="goShopIndex(item.domain)" v-show="index<4||allBrandLogos==''">
                        <span class="aa-shopPic"><img v-if="item.logo" :src="item.logo"/><img v-if="!item.logo" src="../../assets/images/pic_noShop.png"/></span>
                        <div class="aa-shopInfo an-redPacketIconBox" style="padding-right: .72rem">
                            <p class="aa-shopName" v-if="item.shopName">{{item.shopName}}</p>
                            <span class="aa-shopMain" v-if="item.business">{{item.business}}
                                <a @click="viewDetails($even,item.shopName,item.business)" v-if="item.business&&item.business.length>8">详情</a>
                            </span>
                            <span class="an-redPacketIcon"  v-if="item.countRetPacket>0">
                                <b></b>
                                <span class="an-redPacketNumber">{{item.countRetPacket}}</span>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>

            <!--无品牌时的展示-->
            <div class="noConcerFactory" v-show="!isPlaceOrder&&getshopbyuidData==''&&allBrandLogos==''">
                <div class="noConcerImg">
                    <span></span>
                </div>
                <div class="noConcerText">
                    <span>您未关联任何一个品牌厂商智能目录<br />无法适配扫码结果</span>
                </div>
                <div class="noConcerGoUrl">
                    <fieldset>
                        <legend>如何关联品牌厂商智能目录？</legend>
                        <div class="showProgess">
                            <p>第一步：进入品牌厂商微信公众号</p>
                            <p>第二步：点击底部菜单"产品目录/产品查询"进入智能目录页面 </p>
                            <p>第三步：点击右上角<b></b>图标，用手机号进行注册</p>
                            <p>第四步：返回扫码APP"智配Store"进行操作</p>
                        </div>
                    </fieldset>
                </div>

            </div>

        </div>

        <!--更多门店的展示-->
		<MoreShop v-if="moreShopFlag" v-on:toParentHideFlag="getToParentHideFlag" v-bind:getshopbyuidData="getshopbyuidData"></MoreShop>
		<!--更多厂商目录的展示-->
		<MoreVendor v-if="moreVendorFlag" v-on:toParentVenFlag="getToParentVenFlag" v-bind:allBrandLogos="allBrandLogos"></MoreVendor>
		<!--点击查看详情-->
		<SeeDetails v-if="showDetails" v-on:hideDetails="getHideDetails" v-bind:parentData="parentData"></SeeDetails>

    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
	import { commonMixin } from '../../config/base/commonMixin.js';
    import headers from '../../components/headers.vue';
    import moreShop from '../../components/moreShop.vue';
	import moreVendor from '../../components/moreVendor.vue';
    import seeDetails from '../../components/seeDetails.vue';
    import vinChooseCategory from '../../components/vinChooseCategory.vue';
	var resourceUrl = process.env.apiDomain;
	export default {
        name:"offerInquiry",
		mixins: [commonMixin],
		components: {
            headers: headers,
            MoreShop: moreShop,
			MoreVendor: moreVendor,
            SeeDetails: seeDetails,
            vinChooseCategory:vinChooseCategory,
		},
		data() {
			return {
                //车型信息
                autoBrandLogo: "",
				autoBrandName: "",
				autoModelName: "",
                autoModelSubName: "",
                vinCode: "",
                // isShowView: true,
                isShowView: false,
                vin: this.getQueryString("v"),
                showBrandId: false,//无品牌时
                noDatashow: false,//无数据时
                vinJYData: [],
                carImage: [],

                allBrandLogos: [],
                getshopbyuidData: ['1'],
                isShowAddShop: 0,
                moreShopFlag:false,//更多门店的展示
                moreVendorFlag: false,//更多厂商目录的展示
                showDetails: false,//点击查看详情
                parentData: {},
                isPlaceOrder:false,
                isFirstShow:false,

			}
		},
		created() {
            var _this = this;
            _this.init();
            //用户是否能有 (1、询单入口；2、是否有询单红包)
            _this.getIsUserCanSubmitOrder();
            //获取用户关注的门店
            _this.getshopbyuid();
             //获取精友参数
            _this.getVinParamByVin();
            _this.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('native_SetTitle', "询价调货", function(response) {
				});
			});
		},
		mounted() {
            var _this = this;
			_this.getVinData(resourceUrl + "/auto/getautoinfobyvin", {
				"vinCode": _this.vin
			});
			_this.getDatas(resourceUrl + "/usercenter/getbrandsbyuid", {
				"dataType": 2,
        "source":1
			});
			setTimeout(function() {
				_this.initFlag = true;
			}, 500)

			_this.listenBackEvent("native_CloseWebview");

		},
		methods: {
            //初始化，清除缓存
            init(){
                if(!this.$route.params.pushShop){
                    localStorage.removeItem('vinChoiceSelectShops');//清除勾选的常用店铺信息
                    localStorage.removeItem('CategoryListOld');//选择配件
                    localStorage.removeItem('audioResult');//清除已经缓存下的录音
                    localStorage.removeItem('CJML_APP_choosedParams');//清除缓存——产品参数
                    localStorage.removeItem('CategoryList');
                    localStorage.removeItem('CJML_APP_selectShops');//清除——勾选的常用店铺Id
                    localStorage.removeItem('CJML_APP_vinSelfSelectShops');//清除缓存——新增的供货商
                    localStorage.removeItem('CJML_APP_pageNum');//清除缓存——用户是否点击查看更多
                }
            },
            vinChooseShopHide(data){
                var _this = this;
                _this.isFirstShow=data;
                if(!_this.isFirstShow&&_this.isPlaceOrder){
                    _this.isShowView=true;
                    setTimeout(function(){
                        _this.isShowView=false;
                    },2000);
                }
                else{
                    _this.isShowView=false;
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
					success: function(data) {
                        if(data.Body!=''){
                            _this.vinJYData = data.Body[0].AutoParamList;
                            _this.carImage = data.Body[0].VinAutoBase.autoModelImages;
                        }
					}
				});
			},
			getDatas(postUrl, postData) {
				var _this = this;
				_this.ajax({
					method: "POST",
					url: postUrl,
					dataType: "JSON",
					data: postData,
					async: false,
					success: function(data) {
						if(data.Body == "" && _this.brandIdData != null) {
							_this.showBrandId = true;
						} else {
							_this.allBrandLogos = data.Body;
						}
					}
				});
            },
            getVinData(postUrl, postData) {
				var _this = this;
				_this.ajax({
					method: "POST",
					url: postUrl,
					dataType: "JSON",
					data: postData,
					async: false,
					success: function(data) {
						_this.brandIdData = data.Body
						if(data.Body == null && _this.allBrandLogos == "") {
							_this.vinCode = _this.vin;
							_this.noDatashow = true;
							_this.showBrandId = false;
						} else {
							_this.autoBrandLogo = data.Body.autoBrandLogo;
							_this.vinCode = data.Body.vinCode;
							_this.autoBrandName = data.Body.autoBrandName;
							_this.autoModelName = data.Body.autoModelName;
							_this.autoModelSubName = data.Body.autoModelSubName;
							setTimeout(function() {
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
					success: function(data) {
                        if(data.Body){
                            _this.getshopbyuidData = data.Body.userShop;
                            _this.isShowAddShop = data.Body.isShowAddShop;
                        }
					}
				});
			},
            //用户是否能有 (1、询单入口；2、是否有询单红包)
			getIsUserCanSubmitOrder(){
				var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/Order/IsUserCanSubmitOrder",
					dataType:"JSON",
					success:function(data){
						if(data.Body){
							_this.isPlaceOrder=data.Body.isPlaceOrder==1?true:false;// 是否可以有。一件询单的按钮。
                            if(!_this.isPlaceOrder){
                                _this.isShowView=false;
                            }
                            else{
                                _this.isShowView=true;
                            }
						}
					}
				});
            },

            selected(brandUrl, type, brandName) {
				var _this = this;
				var url = window.location.protocol + '//' + window.location.hostname + '/cjml/h5/#!/vin?cf=1&v=' + this.vin + '&appType=' + type + '&td=' + brandUrl + '&bn=' + encodeURIComponent(brandName);
                setTimeout(function() {
					_this.setupWebViewJavascriptBridge(function(bridge) {
						bridge.callHandler('native_JumpUrl', {
							url: url
						}, function(response) {});
					});
				}, 50);
            },

            shareVenApp(count){
				var _this = this;
				window.location.href="selectBrand.html?v="+_this.vin+'&selectBrand=1&type=1&cf=1&backurl='+encodeURIComponent(window.location.href);
				return;

			},

            //点击查看车型详细信息
			seeCarParams() {
				//阻止事件冒泡
				event.stopPropagation();
				var _this = this;
				_this.isShowView = !_this.isShowView;
				$(event.currentTarget).toggleClass('bw-carInfoBox');
			},



            //点击展示更多门店
			showMoreShop() {
				var _this = this;
				_this.moreShopFlag = true;
			},
            //更多门店---获取从子组件传递过来的值
			getToParentHideFlag(data) {
				var _this = this;
				_this.moreShopFlag = data;
            },
            //点击跳转到门店首页
			goShopIndex(domain) {
                var _this = this;
				localStorage.clear('userkey');
				_this.setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('native_JumpUrl', {
						url: domain
					}, function(response) {});
				});
			},

            //点击展示更多厂商目录
			showMoreVendor() {
				var _this = this;
				_this.moreVendorFlag = true;
			},
            //更多厂商目录---获取从子组件传递过来的值
			getToParentVenFlag(data) {
				var _this = this;
				_this.moreVendorFlag = data;
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
            //查看详情---获取组件是否隐藏的值
			getHideDetails(data) {
				var _this = this;
				_this.showDetails = data;
			},




		},
	}
</script>

<style>
	@import url("../../assets/css/app.css");
	@import url("../../assets/css/shopChoose/shopChoose.css");
	@import url("../../assets/css/aboutUs/aboutUs.css");
    @import url("../../assets/css/vinSearchResult.css");
    .bw-Top{
        overflow: hidden;
        height: 100%;
    }
</style>
