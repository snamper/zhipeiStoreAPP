<template>
    
			<!-- 选择品牌-搜索 -->
			<div class="fc-brandChoiceSeach">
				<div class="fc-brandChoiceSeachLeft">
					<span></span>
					<input type="text" name="" placeholder="请输入品牌名称搜索" v-model="searchvalue">
                    <a  class="fc-searchButton" @click="search">搜索</a>
					<a v-show="searchvalue" class="fc-emptyButton" @click="clear"></a>
				</div>
				<div class="fc-brandChoiceSeachRight">
					<a @click="audioinfo"></a>
				</div>
			</div>
			
		
</template>
<script>
var resourceUrl = process.env.apiDomain;
import {
    commonMixin
  } from "../config/base/commonMixin.js";
  import {
    Toast
  } from "mint-ui";
export default {
    name:'searchInput',
    mixins: [commonMixin],
    props:{

    },
    components:{

    },
    data(){
        return {
            searchvalue:'',
            searchList:[],
        }
    },
    computed:{

    },
    methods:{
        search(){
             var _this = this;
             _this.$emit('searchDat',_this.searchvalue)
           
        },
        clear(){
            var _this = this;
            _this.searchvalue ='';
            _this.$emit('searchDat',_this.searchvalue)
        },
        audioinfo(){
            var _this = this;
            this.setupWebViewJavascriptBridge(function (bridge) {
            //url 语音文案说明图片地址
            var url = "https://c1.zhipeicloud.com/voiceexample/vioce_brand.png"
            bridge.callHandler('native_VoiceRecognizer', url, function (response) {
                // if(_this.supplementExplain.length<300){
                //     _this.supplementExplain = _this.supplementExplain + response +',';
                //     if(_this.supplementExplain.length>300){
                //         _this.supplementExplain = _this.supplementExplain.substring(0,300)
                //     }
                // }else {
                //     return;
                // }
                _this.searchvalue = response;
                 _this.$emit('searchDat',_this.searchvalue)
                });
            });
        }
    },
    created(){

    },
    mounted(){
        //  this.$emit('searchDat',_this.searchvalue)
    }
}
</script>
<style scoped>

</style>