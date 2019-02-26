<template>
	<div class="moreShop">
		<div class="maskBox" v-on:click="hideTool()"></div>
		<div class="aa-carAdaptationBox aa-shopPop">
			<div class="aa-carPopHead">
				<p>更多智能门店</p>
				<a v-on:click="hideTool()">×</a>
			</div>
			<div class="aa-chooseBox">

				<ul class="aa-shopChoose aa-shopLink">

					<li v-for="(item,index) in shopbyuidData" v-on:click="goShopIndex(item.domain)">
						<span class="aa-shopPic"><img v-if="item.logo" :src="item.logo"/><img v-if="!item.logo" src="../assets/images/pic_noShop.png"/></span>
						<div class="aa-shopInfo an-redPacketIconBox" style="padding-right: .72rem">
							<p class="aa-shopName" v-if="item.shopName">{{item.shopName}}</p>
							<span class="aa-shopMain" v-if="item.business">{{item.business}}</span>
							<span class="an-redPacketIcon" v-on:click="goShopIndex(item.domain)" v-if="item.countRetPacket>0">
								<b></b>
								<span class="an-redPacketNumber">{{item.countRetPacket}}</span>
							</span>
						</div>
					</li>
				</ul>

			</div>
		</div>
		<!--点击查看详情-->
		<SeeDetails v-if="showDetails" v-on:hideDetails="getHideDetails" v-bind:parentData="parentData"></SeeDetails>
	</div>
</template>

<script>
	import seeDetails from './seeDetails.vue';
	import { commonMixin } from '../config/base/commonMixin.js';
	export default {
		name: 'moreShop',
		mixins: [commonMixin],
		props: ['getshopbyuidData'],
		components: {
			SeeDetails: seeDetails
		},
		data() {
			return {
				shopbyuidData: this.$props.getshopbyuidData,
				business: "",
				showDetails: false,
				parentData: {},
			}
		},
		created() {
			var _this = this;
			_this.resolveShopbyuidData();
		},
		methods: {
			resolveShopbyuidData() {
				var _this = this;
				$.each(_this.shopbyuidData, function(index, item) {
					if(index % 2 != 0) {
						item.showFlag = false;
					}

				})
			},
			//点击隐藏碳层
			hideTool() {
				var _this = this;
				_this.$emit("toParentHideFlag", false);
			},
			//点击跳转到门店首页
			goShopIndex(domain) {
				var _this = this;
				localStorage.clear('userkey');
				_this.setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('native_JumpUrl', {
						url: domain + "&backurl=native_CloseWebview"
					}, function(response) {});
				});
				//window.location.href = domain + '?appType=2';
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

		}
	}
</script>

<style>
	@import url("../assets/css/app.css");
</style>