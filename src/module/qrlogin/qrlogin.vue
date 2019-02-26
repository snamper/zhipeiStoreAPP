<template>
	<div>
        <!--下面这个是单个门店登录的时候
        <div class="aa-scanCodeBox" v-show="isOenShop">

            <div class="aa-scanCodeIcon">智配Store电脑端登录成功</div>
            <div class="aa-scanCodeButton">
                <a href="javascript:void(0);" class="aa-buttonRed">确认登录电脑端</a>
                <a href="javascript:void(0);">取消登录</a>
            </div>

        </div>-->
		<headers title="智配Store扫码登录"></headers>
        <!--下面这个是多个门店登录的时候-->
        <div class="aa-scanCodeShopBox" v-show="ispageview">

            <div class="aa-scanCodeIcon">{{title}}</div>
            <div class="aa-scanCodeButton" v-show="isview" >
                <a href="javascript:void(0);" v-if="getmyshopsData!=''" v-for="(item,index) in getmyshopsData" 
				 class="aa-buttonRed" v-bind:data-id="item.shopId" v-on:click="ShopLogin(item.shopId)">
				   {{shopsCount>1?item.shopName:"确认登录电脑端"}}   
				 </a>
                <a href="javascript:void(0);" v-on:click="cancel()">取消登录</a>
            </div>

        </div>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui';
	import { commonMixin } from '../../config/base/commonMixin.js';
	import { Toast } from 'mint-ui';
	import headers from '../../components/headers.vue';
	var resourceUrl = process.env.apiDomain;
	export default{
		name: 'qrlogin',
		mixins: [commonMixin],
		components:{
			headers:headers
		},
		data(){
			return{
				shopsCount:0,
				title:"",
				getmyshopsData:[],
				ispageview:false,
				isview:false,
			}
		},
		created(){	
			var _this=this;
			if(_this.androidOrios()>0)
			{
			  _this.title="智配Store扫码登录";
			  _this.ispageview=true;
			  _this.getmyshops();
			 
			}
		},
		beforeMount(){
			var _this=this;
			_this.isInit();
		},
		mounted(){
			this.listenBackEvent("native_CloseWebview");
		},		
		methods:{
			//扫描成功，更改缓存状态
			updatestatus()
			{
				var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/usercenter/updatekeystatus",
					dataType:"JSON",
					data:{
						"k":getQueryString['k']
					},
					success:function(data){	
						setTimeout(function() {
							Indicator.close();
						}, 100);
						 if(data.Header.ErrorCode>0)
						 {
							Toast({
								message: data.Header.Message,
								position: 'center',
								duration: 2000
							});
						 }
					}
				});	
			},
			//获取用户自己的门店
			getmyshops()
			{
				var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/usercenter/getmyshops",
					dataType:"JSON",
					success:function(data){	
						setTimeout(function() {
							Indicator.close();
						}, 100);
						_this.getmyshopsData=data.Body.userShop;
						_this.shopsCount=data.Body.shopCount;
						if(_this.shopsCount>0)
							{
								_this.isview=true;
								_this.updatestatus();
								_this.title="智配Store扫码成功";
							}
					}
				});	
			},

			// 确认登录
			ShopLogin(id)
			{
				var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/usercenter/shoplogin",
					dataType:"JSON",
					data:{
						"k":_this.getQueryString('k'),
						"id":id
					},
					success:function(data){	
						setTimeout(function() {
							Indicator.close();
						}, 100);
						 if(data.Header.ErrorCode>0)
						 {
							Toast({
							message: data.Header.Message,
							position: 'center',
							duration: 2000
							});
						 }
						 else
						 {
							_this.setupWebViewJavascriptBridge(function(bridge) {
								 bridge.callHandler('native_GoHome', '', function (response) {
              					  });
							});
						 }
					}
				});	
			},
				// 取消登录
			cancel()
			{
				var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/usercenter/shopcancel",
					dataType:"JSON",
					data:{
						"k":_this.getQueryString('k'),
					},
					success:function(data){	
						setTimeout(function() {
							Indicator.close();
						}, 100);
						 if(data.Header.ErrorCode>0)
						 {
							Toast({
							message: data.Header.Message,
							position: 'center',
							duration: 2000
							});
						 }
						 else
						 {
							_this.setupWebViewJavascriptBridge(function(bridge) {
								 bridge.callHandler('native_GoHome', '', function (response) {
              					  });
							});
						 }
					}
				});	
			}
		}	
	}
</script>

<style>
@import url("../../assets/css/app.css");
@import url("../../assets/css/qrlogin/qrlogin.css");
</style>