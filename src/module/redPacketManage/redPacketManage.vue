<template>
	<div style="height: 100%;" v-show="initFlag">
		<headers title="红包管理"  :back="goPage?1:0" ></headers>
		<div class="ad-pageCenter" style="padding: 1.16rem 0 0;">
			<!--红包管理-已领完的红包状态-->
			<div class="an-redPacketManage" v-show="unfinished&&filterRedStauts==0">
				<div class="an-redPacketChange">
					<p>我的零钱</p>
					<span><b>￥</b>{{redAllData.totalAmount||'0.00'}}</span>
					<p class="an-redPacketRemind">零钱已自动提现到支付宝账号</p>
				</div>
				<div class="an-redPacketLine an-redPacketManageLine">
					<div class="an-redPacketLineTab">
						<a @click="filterRedStauts=1">已领取的红包</a>
						<a @click="filterRedStauts=0" class="an-selected">未领取的红包</a>
					</div>
					<div class="an-redPacketNo" v-if="unfinished==''">
						<span></span>
						<p>暂无未领取的红包</p>
					</div>
					<div class="an-redPacketOne" v-for="(item,index) in unfinished">
						<ul>
							<li class="an-redPacketManageLineLeft">
								<span class="an-redPacketName">{{item.cloudShopName}}</span>
								<span class="an-redPacketDate">订单编号：{{item.shopOrderCode}}</span>
							</li>
							<li class="an-redPacketManageLineRight">
								<a @click="getAuthorization(item.shopOrderId)">领</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<!--红包管理-已领完的红包状态-->
			<div class="an-redPacketManage" v-show="finished&&filterRedStauts==1">
				<div class="an-redPacketChange">
					<p>我的零钱</p>
					<span><b>￥</b>{{redAllData.totalAmount||'0.00'}}</span>
					<p class="an-redPacketRemind">零钱已自动提现到支付宝账号</p>
				</div>
				<div class="an-redPacketLine an-redPacketManageLine">
					<div class="an-redPacketLineTab">
						<a @click="filterRedStauts=1" class="an-selected">已领取的红包</a>
						<a @click="filterRedStauts=0">未领取的红包</a>
					</div>
					<div class="an-redPacketNo" v-if="finished==''">
						<span></span>
						<p>暂无已领取的红包</p>
					</div>

					<div class="an-redPacketOne" v-for="(item,index) in finished">
						<ul>
							<li>
								<span class="an-redPacketName">订单编号：{{item.shopOrderCode}}</span>
								<span class="an-redPacketTotal">{{item.amount}}</span>
							</li>
							<li>
								<span class="an-redPacketDate">{{item.cloudShopName}}</span>
								<span class="an-redPacketNumber">{{item.createTime}}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import headers from '../../components/headers.vue';
	import { commonMixin } from '../../config/base/commonMixin.js';
	var resourceUrl = process.env.apiDomain;
	export default {
		mixins: [commonMixin],
		components: {
			headers: headers,
		},
		data() {
			return {
				initFlag: true,
				filterRedStauts: 0,
				redAllData: {},
				unfinished: [],
				finished: [],
				goPage:this.getQueryString("goPage") == 1 ? true : false,//是否从其他页跳转而来
			}
		},
		created() {
			var _self = this;
			_self.getRedPacketList();
		},
		mounted() {
			var _self = this;
			_self.listenBackEvent();
		},
		methods: {
			//获取未领取和已领取的红包列表
			getRedPacketList() {
				var _self = this;
				_self.ajax({
					method: "POST",
					url: resourceUrl + "/UserCenter/getuserredpacket",
					dataType: "JSON",
					success: function(data) {
						_self.redAllData = data.Body;
						if(data.Body.unfinished) {
							_self.unfinished = data.Body.unfinished;
						};
						if(data.Body.finished) {
							_self.finished = data.Body.finished;
						}

						_self.initFlag = true;
					}
				});
			},
			//获取红包的拼争
			getAuthorization(shopOrderId) {
				var _self = this;
				_self.ajax({
					method: "POST",
					url: resourceUrl + '/UserCenter/GetUserAliUserID',
					dataType: "JSON",
					success: function(data) {
						_self.getRedPacket(shopOrderId, data.Body);
					}
				});
			},
			//领取红包
			getRedPacket(orderId, data) {
				var _self = this;
				var data = {
					"orderId": orderId,
					"mainTitle": data.mainTitle,
					"descText": data.descText,
					"isAuthorization": data.isAuthorization, //1 有凭证 0 无凭证
				};
				if(_self.androidOrios() == 1) {
					data = JSON.stringify(data);
				};
				_self.setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('native_RedPacket', data, function(response) {
						window.location.reload();
					})
				});
			},

		}
	}
</script>
<style>
	@import url("../../assets/css/app.css");
	@import url("../../assets/css/redPacketManage.css");
</style>