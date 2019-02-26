<template>
	<div class="orderHistory" v-show="initFlag">
		<!--<headers title="VIN码下单记录" ></headers>-->
		<div class="pageMain" style="padding-top: 0">
		<div class="aa-historyCar">
			<ul v-if="vinInfoData">
				<li class="aa-historyCarName">
					<p>{{vinInfoData.autoInfo}}</p>
					<input type="submit" name="" value="再下一单" v-on:click="goShopChoose()">
				</li>
				<li class="aa-historyVin">{{vinInfoData.vinCode}}</li>
				<li class="aa-historyRemarks" v-if="false">
					<span>备注：{{vinInfoData.carUser}} {{vinInfoData.carMobile}} {{vinInfoData.carNo}} {{vinInfoData.carMemo}}</span>
					<a>详情</a>
				</li>
			</ul>
		</div>

		<div class="aa-orderLineMain" v-if="!(orderData=='')">

			<div class="aa-orderLineOne" v-for="(item,index) in orderData">
				<span class="aa-orderTime">{{item.createTime}}</span>
				<ul>
					<li class="aa-orderTop">
						<span class="aa-orderShop">{{item.shopName}}</span>
						<span class="aa-orderNumber">订单编号：{{item.orderCode}}</span>
					</li>
					<li class="aa-orderCommodity" v-on:click="goOrderDetails(item.url)">
						<p v-for="(ite,ind) in item.wares" v-if="ind<2">{{ite}}</p>
						<span class="aa-numberCommodity">共{{item.wareCount}}个</span>
					</li>
					<li class="aa-orderPrice">
						参考总价：{{item.payaAmount}}
					</li>
				</ul>
			</div>

		</div>

		<!--无订单时的展示-->
		<div class="errorPage" v-if="orderData==''">

			<div class="error_noOrder">
				<p>当前VIN码无下单记录</p>
			</div>


		</div>

 	</div>

	</div>
</template>

<script>
	import headers from '../../components/headers.vue';
	import { commonMixin } from '../../config/base/commonMixin.js';
	var resourceUrl=process.env.apiDomain;
	export default{
		name: 'orderHistory',
		mixins: [commonMixin],
		components:{
			headers:headers
		},
		data(){
			return{
				vinInfoData:{},
				orderData:[],
				initFlag:false,
				jumpType:this.getQueryString('type')?this.getQueryString('type'):0,
			}
		},
		created(){
			var _this=this;
			_this.isInit();
			_this.setTitle('VIN码下单记录');
			_this.getvinorderhistory();
		},
		mounted(){
			var _this=this;

      _this.nativeLsitenBack("native_CloseWebview");
		},
		methods:{
			//获取Vin码 历史订单
			getvinorderhistory()
			{
				var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/usercenter/getvinorderhistory",
					dataType:"JSON",
					data:{
						"vinCode":_this.getQueryString('vin'),
					},
					success:function(data){
					_this.vinInfoData=data.Body.vinInfo;
					_this.orderData=data.Body.order;
					_this.initFlag=true;
					}
				});
			},
			//点击跳转到订单详情页
			goOrderDetails(url)
			{
				var _this=this;
				window.location.href=url+"&cf=1";
			},
			//点击跳转到选择门店页面
			goShopChoose()
			{
				var _this=this;
				window.location.href="vinSearchResult.html?appType=2&cf=1&v="+_this.getQueryString('vin')+'&backurl='+encodeURIComponent(window.location.href);
			}
		}
	}
</script>

<style>
@import url("../../assets/css/app.css");
@import url("../../assets/css/orderHistory/orderHistory.css");
</style>
