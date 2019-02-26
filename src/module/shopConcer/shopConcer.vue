<template>
	<div class="shopConcer" v-show="initFlag">
		<headers title="关注的智能门店"></headers>
		<div class="pageMain pageMargin" style="padding-bottom: 1.28rem;">
			<div class="aa-chooseBox">
				<p v-if="!(getshopbyuidDataUse==''&&getshopbyuidDataNoUse=='')">常用门店将优先展示在前列
					<a v-on:click="isEdit=true;" v-if="!isEdit&&jumpType==0">编辑</a>
					<a v-on:click="isEdit=false;" v-if="isEdit&&jumpType==0">完成</a>
				</p>
				<ul class="aa-followShop " :class="isEdit?'by-followShop':''" v-if="getshopbyuidDataUse!=''">
					<li v-for="(item,index) in getshopbyuidDataUse">
						<span v-if="isEdit" class="by-choiceBox" v-bind:class="buildElementClass(item)"  v-on:click="checkSelect($event,item)"></span>
						<span class="af-shopPic"><img v-if="item.logo" :src="item.logo"/><img v-if="!item.logo" src="../../assets/images/pic_noShop.png"/></span>
						<div class="an-redPacketIconBox" style="padding-right: .72rem">
							<p class="aa-shopName" v-on:click="goShopIndex(item.domain,item.business)">{{item.shopName}}</p>
							<span class="aa-shopMain" v-on:click="goShopIndex(item.domain)" v-show="item.business!=''">{{item.business}}</span>
							<span class="an-redPacketIcon" v-on:click="goShopIndex(item.domain)" v-if="item.countRetPacket>0">
								<b></b>
								<span class="an-redPacketNumber">{{item.countRetPacket}}</span>
							</span>
						</div>
						<span class="aa-inactiveBox aa-commonBox" v-on:click="setOftenUse(item.shopId,item.isUse)">常用</span>
					</li>
					<!--<li class="af-shopNew" v-if="(getshopbyuidDataNoUse=='')&&(isShowAddShop==1)" @click="goNearBystore()">
						<a>
							<span></span>
							<p>附近的店</p>
						</a>
					</li>-->
				</ul>
				<ul class="aa-followShop " :class="isEdit?'by-followShop':''" v-if="getshopbyuidDataNoUse!=''">
					<li v-for="(item,index) in getshopbyuidDataNoUse">
						<span v-if="isEdit" class="by-choiceBox" v-bind:class="buildElementClass(item)"  v-on:click="checkSelect($event,item)"></span>
						<span class="af-shopPic"><img v-if="item.logo" :src="item.logo"/><img v-if="!item.logo" src="../../assets/images/pic_noShop.png"/></span>
						<div class="an-redPacketIconBox" style="padding-right: .72rem">
							<p class="aa-shopName" v-on:click="goShopIndex(item.domain,item.business)">{{item.shopName}}</p>
							<span class="aa-shopMain" v-on:click="goShopIndex(item.domain)" v-show="item.business!=''">{{item.business}}</span>
							<span class="an-redPacketIcon" v-if="item.countRetPacket>0">
								<b></b>
								<span class="an-redPacketNumber">{{item.countRetPacket}}</span>
							</span>
						</div>
						<span class="aa-inactiveBox" v-on:click="setOftenUse(item.shopId,item.isUse)">常用</span>
					</li>
					<!--<li class="af-shopNew" @click="goNearBystore()"  v-if="isShowAddShop==1">
						<a>
							<span></span>
							<p>附近的店</p>
						</a>
					</li>-->
				</ul>
			</div>

		</div>

		<!--关联更多门店的按钮-->
		<!--<div class="foolButtonOne" v-if="!(getshopbyuidDataUse==''&&getshopbyuidDataNoUse=='')">
			<a v-on:click="showHowConcer()" class="leftButton">关联更多门店</a>
		</div>-->

		<!--立即分享APP-->
		<!-- <div class="foolButtonOne shareApp" v-if="!(getshopbyuidDataUse==''&&getshopbyuidDataNoUse=='')">
			<a v-on:click="shareApp()" class="leftButton">立即分享APP</a>
		</div> -->

		<!--邀请开店按钮-->
		<div class="foolButtonOne shareApp" v-show="!isEdit">
			<a @click="invitingShop()" class="leftButton">邀请开店</a>
		</div>

		<!-- 编辑删除时候的底部状态 -->
		<div class="foolButtonOne" v-show="isEdit&&(getshopbyuidDataUse!=''||getshopbyuidDataNoUse!='')">
			<a v-on:click="isDeleteConcer()" class="leftButton">删除</a>
		</div>

		<div class="aa-followShopNodata" v-if="getshopbyuidDataUse==''&&getshopbyuidDataNoUse==''">
			<ul>
				<li class="aa-followShopNodataPic">您还未关注任何门店，赶紧邀请<br/>朋友来开店吧</li>
				<!--<li class="aa-followShopNodataTitle">如何关联经销商门店？</li>
				<li class="aa-followShopNodataText">
					<span>1.</span>
					<p>请直接联系经销商店主，将您添加为其客户，添加成功之后，您就可以自动关联该经销商门店；</p>
				</li>
				<li class="aa-followShopNodataText">
					<span>2.</span>
					<p>添加成功之后，直接在"关注的智能门店"查看。</p>
				</li>-->

			</ul>
		</div>

		<div class="by-confirmPop" v-show="isDeleteShow">
			<div class="by-confirmPopBox">
				<p>确认删除当前门店？</p>
				<span>
					<a v-on:click="isDeleteShow=false;" class="by-leftButton">取消</a>
					<a v-on:click="deleteConcer()">确认</a>
				</span>
			</div>
		</div>

		<SeeDetails v-if="showDetails" v-on:hideDetails="getHideDetails" v-bind:parentData="parentData"></SeeDetails>
		<!--如何关联更多智能产品目录-->
		<HowConcer v-if="concerVendorFlag" v-on:toParentHowConcer="getToParentHowConcer" howFlag="1"></HowConcer>
		<!-- 分享APP -->
		<shareFriends v-if="sharePop" v-on:shareFriendsHide="shareFriendsHide" v-bind:shareFlag="2" v-bind:shareData="userId"></shareFriends>
	</div>
</template>

<script>
	import { Toast } from 'mint-ui';
	import { MessageBox } from 'mint-ui';
	// import router from "../../router/offerResult.js";
	import seeDetails from '../../components/seeDetails.vue';
	import howConcer from '../../components/howConcer.vue';
	import headers from '../../components/headers.vue';
	import shareFriends from '../../components/shareFriends.vue';
	import { commonMixin } from '../../config/base/commonMixin.js';
	var resourceUrl = process.env.apiDomain;
	export default {
		name: 'shopConcer',
		mixins: [commonMixin],
		components: {
			SeeDetails: seeDetails,
			HowConcer: howConcer,
			headers: headers,
			shareFriends,
		},
		data() {
			return {
				initFlag: false,
				getshopbyuidDataUse: ['1'],
				getshopbyuidDataNoUse: ['2'],
				showDetails: false,
				parentData: {},
				concerVendorFlag: false,
				sharePop: false,
				isShowAddShop: 0,
				userId:0,
				isEdit:this.getQueryString('edit')?true:false,
				selectShops:[],
				selectShopCout:0,
				isDeleteShow:false,
				jumpType:this.getQueryString('type')?this.getQueryString('type'):0,
			}
		},
		created() {
			var _this = this;
			_this.getshopbyuid();
			_this.isInit();
		},
		mounted() {
			var _this = this;
			this.listenBackEvent("native_CloseWebview");
		},
		methods: {
			//获取关注的门店
			getshopbyuid() {
				var _this = this;
				_this.ajax({
					method: "POST",
					url: resourceUrl + "/usercenter/getshopbyuid",
					dataType: "JSON",
					success: function(data) {
						if(data.Body.userShop.length>0){
							data.Body.userShop.forEach(function(oItem,index){
								oItem.selected=false;
							});
						}
						_this.getIsUseData(data.Body.userShop);
						setTimeout(function() {
							_this.initFlag = true;
						}, 500);
						_this.isShowAddShop = data.Body.isShowAddShop;
					}
				});
			},
			//处理常用和不常用的数据
			getIsUseData(data) {
				var _this = this;
				_this.getshopbyuidDataUse = [];
				_this.getshopbyuidDataNoUse = [];
				$.each(data, function(index, item) {
					if(item.isUse == 1) {
						_this.getshopbyuidDataUse.push(item);
					} else {
						_this.getshopbyuidDataNoUse.push(item);
					}
				});
			},
			//设置常用门店
			relationshop(shopIds, isUse) {
				var _this = this;
				_this.ajax({
					method: "POST",
					url: resourceUrl + "/usercenter/relationshop",
					dataType: "JSON",
					data: {
						"shopId": shopIds,
					},
					success: function(data) {
						if(isUse == 0) {
							var instance = Toast('关联成功');
							setTimeout(() => {
								instance.close();
							}, 500);
						}
						_this.getshopbyuid();
					}
				});
			},
			//点击设置常用或不常用
			setOftenUse(shopIds, isUse) {
				var _this = this;
				if(isUse == 0) {
					_this.relationshop(shopIds, isUse);
				} else {
					MessageBox.confirm('', {
						message: '取消常用标记后，将不便查找该门店<br/>确定取消常用标记吗？',
						confirmButtonText: '是',
						cancelButtonText: '否'
					}).then(action => {
						if(action == 'confirm') {
							_this.relationshop(shopIds, isUse);
						}
					}).catch(err => {
						if(err == 'cancel') {}
					});
				}

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
			//点击跳转到门店首页
			goShopIndex(domain) {
				var _this = this;
				domain = domain.replace(/#\//g, "");
				// window.location.href = domain+"&backurl="+encodeURIComponent(window.location.href);
				if(_this.getQueryString('active')==1){
					window.location.href = domain
				}else{
					_this.setupWebViewJavascriptBridge(function(bridge) {
						bridge.callHandler('native_JumpUrl', {
							url: domain
						}, function(response) {});
					});
				}


			},
			//点击弹出如何关联的文案
			showHowConcer() {
				var _this = this;
				_this.concerVendorFlag = true;
			},
			//
			getToParentHowConcer(data) {
				var _this = this;
				_this.concerVendorFlag = data;
			},
			// 点击分享App
			shareApp() {
				var _this = this;
				_this.sharePop = true;
			},
			// 获取分享传递的数据
			shareFriendsHide(data) {
				var _this = this;
				_this.sharePop = data;
			},
			// 点击到附近的店
			goNearBystore() {
				var _this = this;
				window.location.href = "nearBystore.html?backurl=" + encodeURIComponent(window.location.href);

			},
			//点击邀请开店
			invitingShop(){
				var _self=this;
				_self.sharePop=true;
				_self.ajax({
					method: "POST",
					url: resourceUrl + "/UserCenter/getuser",
					dataType: "JSON",
					success: function(data) {
						_self.userId=data.Body.appUserId;
					}
				});
			},
			//选择要删除的目录
			checkSelect(event,item){
				//阻止事件冒泡
				event.stopPropagation();
				var _this = this;
				item.selected = !item.selected;
                if(item.selected)
                {
                    _this.selectShops.push(item.shopId);
                }
                else{
                    var index = _this.selectShops.indexOf(item.shopId)
                    _this.selectShops.splice(index, 1);
                }
				_this.selectShopCout=_this.selectShops.length;
				console.log(_this.selectShops)
			},
			buildElementClass(item){
                if (item.selected) return "bw-selected";
                return "";
			},
			isDeleteConcer(){
				var _this = this;
				if(_this.selectShopCout>0){
					_this.isDeleteShow=true;
				}
				else{
					Toast("请选择要删除的智能门店");
				}
			},

			//确认删除目录
			deleteConcer(){
				var _this = this;
				_this.isDeleteShow=false;
				console.log(_this.selectShops)
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/usercenter/deleteUserShop",
					dataType:"JSON",
					data:{
						"shopId":_this.selectShops,
					},
					success:function(data){
						if(data.Body==1){
							var url =  window.location.protocol+"//"+window.location.host;
							//刷新列表
							switch(_this.jumpType){
								case 0:
									_this.getshopbyuid();
									_this.isEdit=false;
									break;
								case '1':
									//跳回修理厂询价下单页offerInquiryNew.vue，并刷新常用智能目录列表
									url += "/vinSearchResult.html?v="+_this.getQueryString('v')+'&manageBack=1';
									_this.setupWebViewJavascriptBridge(function(bridge) {
										bridge.callHandler('native_JumpUrl', {url:url}, function(response) {
										});
									});
									break;
								case '2':
									//跳回厂商或经销商Vin码结果页，并刷新常用智能目录列表
									url += "/selectShop.html?v="+_this.getQueryString('v')+'&cf=1&manageBack=1&r='+Math.random();
									_this.setupWebViewJavascriptBridge(function(bridge) {
										bridge.callHandler('native_JumpUrl', {url:url}, function(response) {
										});
									});
									break;
								default:
									break;
							}

						}else{
							Toast(data.Header.Message);
						}
					}
				});
			},
		}

	}
</script>

<style>
	@import url("../../assets/css/app.css");
	@import url("../../assets/css/vendorsConcer/vendorsConcer.css");
	@import url("../../assets/css/deleteOperation.css");
</style>
