<template>
    <!-- 选择店铺 -->
    <div class="vinChoiceShop">
        <!-- 选供货商 -->
        <div class="bw-storeChoice"  v-if="getShopData!=''">
            <span></span>
            <div class="bw-storeChoiceLine" v-for="(item,index) in getShopData" v-show="pageNum==1?index<5:index>=index">
                <dl>
                    <dd>
                        <p>{{item.cloudShopName}}</p>
                        <span :class="item.selectedShop?'bw-selected':''" @click="checkSelect(item)"></span>
                    </dd>
                </dl>
            </div>
            <!-- 查看更多 -->
            <a @click="searchMore()" v-if="pageNum==1?getShopData.length>5:false">
                <b class="bw-moreButton">查看更多…</b>
            </a>
            <!-- 添加更多供货商 -->
            <a @click="goAddShop()"  herf="#categoryChoice" v-if="pageNum==1?getShopData.length<=5:true">
                <b class="bw-newButton">添加更多供货商</b>
            </a>
        </div>
     </div>
</template>

<script>
    import router from "../router/vinSearchResult.js";
    import { Toast } from 'mint-ui';
    import { commonMixin } from '../config/base/commonMixin.js';
	var resourceUrl = process.env.apiDomain;
	export default {
        props: ["vinCode","mobile","selectCategorys"],
        name:"vinChoiceShop",
		mixins: [commonMixin],
		components: {
		},
		data() {
			return {
                getShopData:[],
                selectShops:[],
                isSelectCount:0,
                pageNum:1,
                pushShops:localStorage.getItem("vinChoiceSelectShops")?JSON.parse(localStorage.getItem('vinChoiceSelectShops')):[],
                vinChoiceSelectShops:localStorage.getItem("CJML_APP_vinSelfSelectShops")?JSON.parse(localStorage.getItem('CJML_APP_vinSelfSelectShops')):[],
                isSearchMore:localStorage.getItem("CJML_APP_pageNum")?true:false,
			}
		},
		created() {
            var _this = this;
            console.log(localStorage.getItem("vinChoiceSelectShops"))
            if(_this.pushShops!=""){
                _this.pushShops.forEach(function(oneItem,index){
                    _this.getShopData.push(oneItem);
                    _this.selectShops.push(oneItem.cloudShopID);//选中的店铺
                    _this.vinChoiceSelectShops.push(oneItem);
                });
            }
            if(_this.isSearchMore){
                _this.pageNum=2;
            }
            _this.getUseCloudShopList();
            
		},
		mounted() {
            var _this = this;

		},
		methods: {
            getUseCloudShopList(){
                var _this=this;
				_this.ajax({
					method:"POST",
					url:resourceUrl+"/Order/GetUseCloudShopList",
					dataType:"JSON",
					success:function(data){
						if(data.Body!=''){
                             data.Body.forEach(function(oneItem,index){
                                 oneItem.selectedShop=false;
                                 if(_this.vinChoiceSelectShops!=""){
                                    _this.vinChoiceSelectShops.forEach(function(item,index){
                                        if(item.cloudShopID==oneItem.cloudShopID){
                                            oneItem.selectedShop=true;
                                            _this.selectShops.push(oneItem.cloudShopID);
                                        }
                                    });
                                }
                                _this.getShopData.push(oneItem);
                            });
                            _this.selectCout();
                            _this.$emit('choiceShopHide', true);
                        }
                        else{
                            _this.$emit('choiceShopHide', false);
                        }
                        
					}
				});
            },
            //选择店铺进行下单
            checkSelect(oneItem){
                var _this=this;
                oneItem.selectedShop = !oneItem.selectedShop;
                if(oneItem.selectedShop)
                {
                    _this.selectShops.push(oneItem.cloudShopID);
                    _this.vinChoiceSelectShops.push(oneItem);
                }
                else{
                    var index = _this.selectShops.indexOf(oneItem.cloudShopID)
                    _this.selectShops.splice(index, 1);
                    var ind = _this.vinChoiceSelectShops.indexOf(oneItem)
					_this.vinChoiceSelectShops.splice(index, 1);
                }
                _this.selectCout();
            },
            selectCout(){
                var _this= this;
                _this.isSelectCount=_this.selectShops.length;
                _this.$emit("selectShopCout", _this.isSelectCount);
                localStorage.setItem("CJML_APP_selectShops", JSON.stringify(_this.selectShops));
                localStorage.setItem("CJML_APP_vinSelfSelectShops", JSON.stringify(_this.vinChoiceSelectShops));
            },
            //查看更多
            searchMore(){
                var _this = this;
                _this.pageNum=2;
                localStorage.setItem("CJML_APP_pageNum", _this.pageNum);
            },
            //添加更多供货商
            goAddShop(){
                var _this = this;
                console.log(_this.$props.selectCategorys)
                if(_this.$props.selectCategorys!=''){

                    router.push({
						name: 'offerChoiceShop',
						params:{
							goOffer:2,
							vinCode:_this.$props.vinCode,
                            mobile:_this.$props.mobile,
                            selectCategorys:_this.$props.selectCategorys
						}
					});
                }else{
                    // $(_this.$parent.topCategory).animate({
					// 	scrollTop: 0
					// }, 500, function() {});
                    Toast({
                            message: "请选择配件",
                            position: 'center',
                            duration: 1500
                        });
                }
                

            },

        },
	}
</script>

<style>
    @import url("../assets/css/app.css");
    @import url("../assets/css/vinSearchResult.css");
</style>