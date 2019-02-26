<template>
	<!-- 选择配件 -->
    <div class="vinChooseCategory">
		<!-- 选品类 全展开 -->
        <div class="bw-categoryChoice">
            <span></span>
			<a ref="topCategory" v-show="!isChoiceShop?true:pageNum==1?index<11:index>=index" name="categoryChoice" v-for="(item,index) in getCategorysList" 
			v-bind:class="buildElementClass(item)" 
			v-model="item.isSelected" 
			v-on:click="selectAdd(item)">{{item.smallName}}</a>
			<a v-if="isChoiceShop&&pageNum==1" @click="pageNum=2;"  class="bw-more"></a>
        </div>

		<vinChoiceShop  v-on:choiceShopHide="choiceShopHide"
		  v-on:selectShopCout="getSelectShopCout" :selectCategorys="selectCategorys"
		  :vinCode="vinCode" :mobile="mobile"></vinChoiceShop>

        <!-- 语音留言 -->
        <div class="bw-voicemail">
            <p>语音留言：</p>
            <!-- 点击录音按钮 -->
            <span class="bw-voiceSwitch" @click="pinAuro()" v-if="!audioResult">点击录音</span>
            <!-- 已有录音 -->
            <span class="bw-voiceBox" @click="pauseVoice()" v-if="audioResult!=''">
				{{audioResult.time+'”'}}
				<a @click="clearAudio()">×</a>
			</span>
			<audio id="audioTag" :src="audioResult.url" style="display: none;"></audio>
        </div>

        <!-- 快速调货报价 -->
        <div class="bw-buttonBox" v-if="getRedData!=''">
			<a @click="goChooseCategory()">快速调货报价</a>
			<span v-if="getRedData.isHaveRedPack" @click="isRedRuleShow=true"><b>{{getRedData.redTitle}}</b></span>
		</div>

		<!-- 红包活动规则 -->
		<div class="bo-redPacketActivityPop" v-if="isRedRuleShow">
			<div class="bo-redPacketActivityBox">
				<ul>
					<li class="bo-redPacketTitle">修理厂端红包活动规则</li>
					<li class="bo-redPacketText">
						<p>1.</p>
						<span>下询单即可领取随机现金红包，直接到账；</span>
					</li>
					<li class="bo-redPacketText">
						<p>2.</p>
						<span>单个用户累积最多可领取50元现金红包；</span>
					</li>
					<li class="bo-redPacketText">
						<p>3.</p>
						<span>恶意刷单领红包的用户，将被取消活动参与资格；</span>
					</li>
					<li class="bo-redPacketText">
						<p>4.</p>
						<span>活动最终解释权归智配Store所有。</span>
					</li>
					
				</ul>
				<a @click="isRedRuleShow=false"></a>
			</div>
		</div>

		<!-- 完善个人信息弹层 -->
		<div class="bo-shopMainSupplementPop" v-if="isPerfectShow">
			<div class="bo-shopMainSupplement">
				<div class="bo-shopSupplementTop">
					<p>请完善身份信息，找周边汽配店更精准！</p>
					<!-- <a href="">×</a> -->
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
					<a v-on:click="(getuserInfoData.companyName&&getuserInfoData.realName&&userAddress)?SaveUserInfo():''" 
					:class="(getuserInfoData.companyName&&getuserInfoData.realName&&userAddress)?'':'bo-disable'">保存</a>
				</div>
			</div>
		</div>

		<selectAutoParam 
		v-bind:optionautoparamlist="OptionAutoParamList" 
		v-show="isshowoptionautoparamlist"
		v-on:cancelChooseParam="cancelChooseParam" 
		v-on:completeChooseParam="completeChooseParam"
		></selectAutoParam>


     </div>
</template>

<script>
	import router from "../router/vinSearchResult.js";
	import { Toast } from 'mint-ui';
	import { commonMixin } from '../config/base/commonMixin.js';
	import vinChoiceShop from './vinChoiceShop.vue';
	import selectAutoParam from './selectAutoParam.vue';
	var resourceUrl = process.env.apiDomain;
	export default {
		props: ["redData"],
        name:"vinChooseCategory",
		mixins: [commonMixin],
		components: {
			vinChoiceShop:vinChoiceShop,
			selectAutoParam,
		},
		data() {
			return {
				getCategorysList:[
  					 {categoryId: 98, categoryName: "机油滤清器", smallName: "机油滤", isSelected: false},
  					 {categoryId: 101, categoryName: "空气滤清器", smallName: "空气滤", isSelected: false},
					 {categoryId: 100, categoryName: "空调滤清器", smallName: "空调滤", isSelected: false},
 					 {categoryId: 99, categoryName: "燃油滤清器", smallName: "燃油滤", isSelected: false},
					 {categoryId: 42, categoryName: "前刹车片", smallName: "前片", isSelected: false},
  					 {categoryId: 208, categoryName: "后刹车片", smallName: "后片", isSelected: false},
					 {categoryId: 215, categoryName: "雨刮片", smallName: "雨刮", isSelected: false},
					 {categoryId: 44, categoryName: "火花塞", smallName: "火花塞", isSelected: false},
					 {categoryId: 43, categoryName: "前刹车盘", smallName: "前盘", isSelected: false},
 					 {categoryId: 209, categoryName: "后刹车盘", smallName: "后盘", isSelected: false},
					 {categoryId: 223, categoryName: "电瓶", smallName: "电瓶", isSelected: false},
					 {categoryId: 52, categoryName: "点火线圈", smallName: "点火线圈", isSelected: false},
					 {categoryId: 275, categoryName: "发动机外部皮带", smallName: "发动机皮带", isSelected: false},
					 {categoryId: 573, categoryName: "正时皮带", smallName: "正时皮带", isSelected: false},
					 {categoryId: 427, categoryName: "正时皮带套装", smallName: "正时套装", isSelected: false},
					 {categoryId: 449, categoryName: "变速箱油", smallName: "变速箱油", isSelected: false},
					 {categoryId: 426, categoryName: "变速箱滤网", smallName: "变速箱滤网", isSelected: false},
					 {categoryId: 50, categoryName: "高压分缸点火线", smallName: "分缸线", isSelected: false},
 					 {categoryId: 453, categoryName: "驻车制动蹄片", smallName: "手刹片", isSelected: false},
					 {categoryId: 270, categoryName: "刹车片感应线", smallName: "感应线", isSelected: false},
				],
				isRedRuleShow:false,
				audioResult:localStorage.getItem('audioResult')?JSON.parse(localStorage.getItem('audioResult')):'',
				selectCategorys:[],
				vinselectCategorys:localStorage.getItem('CategoryListOld')?JSON.parse(localStorage.getItem('CategoryListOld')):[],
				isSelectCount:0,
				getRedData:[],
				getShopData:[],
				pageNum:1,
				vinCode:this.getQueryString('v'),

				isPerfect:false,
				isPerfectShow:false,
				getuserInfoData:[],
				userAddress:"",
				mobile:"",
				//选参数页
				defaultCategoryIds:this.getQueryString('cids'),
				OptionAutoParamList:[],
				isshowoptionautoparamlist:false,
				choosedParams:[],

				selectShopCout:0,
				isChoiceShop:true,
				isVinChoiceShop:false,//是否有常用门店
				selectShops:localStorage.getItem('CJML_APP_selectShops')?JSON.parse(localStorage.getItem('CJML_APP_selectShops')):[],//选中的店铺
				confirmOffer:false,
				isFirstClick:true,
			}
		},
		created() {
			var _this=this;
			_this.getIsUserCanSubmitOrder();
			_this.getUseCloudShopList();
			_this.getuserInfo();
			
		},
		mounted() {
			let _this = this;
			if(_this.defaultCategoryIds && _this.defaultCategoryIds.length>0){
				let defaultCategoryIdList = _this.defaultCategoryIds.split(",");
				_this.getCategorysList.forEach(element => {
					if(defaultCategoryIdList.indexOf(String(element.categoryId))>-1)
					{
						_this.selectAdd(element);
					}
				});
			}

			if(_this.vinselectCategorys!=''){
				_this.getCategorysList.forEach(function(oneItem){
					_this.vinselectCategorys.forEach(function(item){
						if(item.categoryId==oneItem.categoryId){
							oneItem.isSelected=true;
							_this.selectCategorys.push(oneItem.categoryId);
						}
					});
				});
				_this.isSelectCount=_this.selectCategorys.length;
			}
			
		},
		methods: {
			choiceShopHide(data){
				var _this = this;
				_this.isChoiceShop=data;
				_this.isVinChoiceShop=data;
				_this.$emit('vinChooseShopHide', data);
			},
			getSelectShopCout(data){
				var _this =this;
				_this.selectShopCout=data;
			},

			//获取用户基本信息
			getuserInfo(){
				var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/usercenter/getuser",
					dataType:"JSON",
					success:function(data){
						if(data.Body!=''){
							_this.getuserInfoData=data.Body;
							_this.userAddress=data.Body.companyAddress?data.Body.companyAddress:data.Body.lastLoginAddress?data.Body.lastLoginAddress.Address:'';
							_this.mobile=data.Body.mobile;
							if(data.Body.companyName&&data.Body.companyAddress&&data.Body.realName&&data.Body.AuditStatus>=0)
							{
								_this.isPerfect=true;//已完善信息
								// _this.isPerfectShow=false,//不展示完善信息框
							}
							else{
								_this.isPerfect=false;//未完善信息
							}
						}
						
					}
				});
			},
			//选择配件样式
			buildElementClass(oneItem){
                if (oneItem.isSelected) return "bw-selected";
                return "";
			},
			selectAdd(oneItem){
				var _this=this;
                oneItem.isSelected = !oneItem.isSelected;
                if(oneItem.isSelected)
                {
					_this.selectCategorys.push(oneItem.categoryId);
					_this.vinselectCategorys.push(oneItem);
                }
                else{
                    var index = _this.selectCategorys.indexOf(oneItem.categoryId)
					_this.selectCategorys.splice(index, 1);
					var ind = _this.vinselectCategorys.indexOf(oneItem)
					_this.vinselectCategorys.splice(index, 1);
                }
				_this.isSelectCount=_this.selectCategorys.length;
				
				localStorage.setItem("CategoryListOld", JSON.stringify(_this.vinselectCategorys));
				
             },

			//点击录音
			pinAuro() {
				//阻止事件冒泡
				event.stopPropagation();
				var _this = this;
				_this.setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('native_VoiceRecord', '', function(response) {
						if(response.time>0){
							_this.audioResult=response;
							//存贮录音结果，便于页面其他操作进行时，不会被清除
							localStorage.setItem('audioResult',JSON.stringify(_this.audioResult));
						};
					});
				});
			},
			//点击清除录音
			clearAudio(){
				//阻止事件冒泡
				event.stopPropagation();			
				var _this=this;
				//清除在本页面的数据
				_this.audioResult="";
				//清除已经缓存下的录音
				localStorage.removeItem('audioResult');
			},
			//点击播放录音
			pauseVoice() {
				//阻止事件冒泡
				event.stopPropagation();
				var _this = this;
				var audio = $('#audioTag').get(0);
				var allTime=_this.audioResult.time;
				if(audio.paused) {
					audio.play();
					//播放倒计时
					var timer=setInterval(function(){
						if(_this.audioResult.time==0){
							clearInterval(timer);
							_this.audioResult.time=allTime;
							audio.paused();
						}
						_this.audioResult.time--;
					},1000)
				};
			},

			//选择配件参数
			cancelChooseParam(){
				var _this=this;
				_this.isshowoptionautoparamlist = false;
			},
			//是否要选择配件参数
			completeChooseParam(choosedParams){
				var _this=this;
				_this.choosedParams =choosedParams;
				localStorage.setItem("CJML_APP_choosedParams", JSON.stringify(_this.choosedParams));
				_this.isshowoptionautoparamlist=false;
				_this.checkBaseUserInfo();
			},
			GetAutoParamListByVin(callback){
				var _this=this;
				let cids = this.getCategorysList.filter((item)=>{return item.isSelected;}).map((element)=>{return parseInt(element.categoryId, 10);});
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/Order/GetAutoParamListByVin",
					dataType:"JSON",
					data: {
						VinCode: _this.vinCode,
						CategoryIds:cids,
                    },
					success:function(data){
						if(callback){
							callback(data);
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
                            _this.getRedData=data.Body;
						}
					}
				});
			},
			//是否有常用门店
			getUseCloudShopList(){
                var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/Order/GetUseCloudShopList",
					dataType:"JSON",
					success:function(data){
						if(data.Body){
                             data.Body.forEach(function(oneItem,index){
                                oneItem.selectedShop=data.Body[index].isSelected==1?true:false;
                            })
                            _this.getShopData=data.Body;
						}
					}
				});
			},
			


			//【快速调货报价】按钮
			goChooseCategory(){
				var _this = this;
				_this.isFirstClick=false;
				_this.selectShops=localStorage.getItem('CJML_APP_selectShops')?JSON.parse(localStorage.getItem('CJML_APP_selectShops')):[];
				if(_this.isSelectCount>0&&(_this.selectShopCout>0||!_this.isVinChoiceShop)){
					localStorage.setItem("CategoryList", JSON.stringify(_this.selectCategorys));
					_this.confirmOffer=true;
					_this.GetAutoParamListByVin(function(autoParam){
					//是否要选择配件参数
					if(autoParam.Body && autoParam.Body.length>0)
					{
						_this.OptionAutoParamList = autoParam.Body;
						_this.isshowoptionautoparamlist=true;
					}else{
						//是否完善信息
						_this.checkBaseUserInfo();
					}
					
				});
				}else{
					if(_this.isSelectCount==0){
						// 当没选择配件时，点击“确定”按钮，Toast 提示：请选择配件
						 Toast({
                                message: '请选择配件',
                                position: 'center',
                                duration: 1500
							});
					}else{
						// if(_this.isVinChoiceShop){
							// 当没选择门店时，Toast 提示：请选择汽配店
							Toast({
									message: '请选择汽配店',
									position: 'center',
									duration: 1500
								});
						// }
						
					}
				}

				
			},
			
			//是否完善信息
			checkBaseUserInfo(){
				var _this=this;
				if(!_this.isPerfect){
					_this.isPerfectShow=true;
				}
				else{
					_this.setFollowCategorys();
				}
			},
			 //完善信息接口
            SaveUserInfo(){
                var _this = this;
                _this.ajax({
                    method: "POST",
                    url: resourceUrl + "/Common/PerfectIdentityInfo",
                    dataType: "JSON",
                    data: {
                        CloudShopName: _this.getuserInfoData.companyName,
                        UserRule: _this.getuserInfoData.userRule,
                        Contacts: _this.getuserInfoData.realName,
                        ShopAddress: _this.userAddress
                    },
                    success: function(data) {
                        if (data.Header.ErrorCode == 0 && data.Body == true) {
							if(_this.selectShops!=''||_this.isVinChoiceShop){
								_this.setFollowCategorys();
							}else{
								router.push({
									name: 'offerChoiceShop',
									params:{
										goOffer:1,//第一次下单，正常流程
										vinCode:_this.vinCode,
										mobile:_this.mobile
									}
								});
							}
                           
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

			 //跳转至选择店铺页
			 setFollowCategorys(){
				 var _this = this;
				// 直接到选常用店铺页面
				console.log(_this.choosedParams)
				console.log(_this.selectShops)
				console.log(localStorage.getItem('CJML_APP_selectShops'))
				if(_this.confirmOffer){
					if(_this.selectShops!=''||_this.isVinChoiceShop){
						_this.ajax({
							method:"POST",
							url:resourceUrl+"/Order/SubmitOrderByShopId",
							dataType:"JSON",
							data:{
								"CategoryIds":_this.selectCategorys,//分类ID列表
								"VinCode":_this.vinCode,
								"CloudShopIds":_this.selectShops,
								"userParam":_this.choosedParams!=''?_this.choosedParams:null,
								"userAudio":localStorage.getItem('audioResult')?localStorage.getItem('audioResult'):"",
							},
							beforeSend:function(){},
							success:function(data){
								if(data.Body){
									_this.shopOrderId=data.Body.shopOrderId;
									localStorage.removeItem('audioResult');//清除已经缓存下的录音
									localStorage.removeItem('vinChoiceSelectShops');//清除已经缓存下的店铺信息
									localStorage.removeItem('selectShops');//清除缓存选中的店铺ID
									localStorage.removeItem('CJML_APP_choosedParams');//清除参数缓存
									//路由跳转到成功页面
									router.push({
										name: 'offerResultShop',
										params:{
											shopOrderId:_this.shopOrderId,
											vinCode:_this.vinCode,
										}
									});
								}
								else{
									Toast({
										message: data.Header.Message,
										position: 'center',
										duration: 1500
									});
									_this.isFirstClick=true;
								}
							}
						});
					}
					else{
						router.push({
							name: 'offerChoiceShop',
							params:{
								goOffer:1,//第一次下单，正常流程
								vinCode:_this.vinCode,
								mobile:_this.mobile
							}
						});
					}
					
				}else{
					router.push({
						name: 'offerChoiceShop',
						params:{
							goOffer:2,//增加汽配店
							vinCode:_this.vinCode,
							mobile:_this.mobile
						}
					});
				}
			 },
        },
	}
</script>

<style>
    @import url("../assets/css/app.css");
	@import url("../assets/css/vinSearchResult.css");
	@import url("../assets/css/choosecategorystyle.css");
</style>