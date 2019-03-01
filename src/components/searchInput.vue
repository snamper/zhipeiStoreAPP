<template>
			<!-- 选择品牌-搜索 -->
            <div>
                <div class="fc-brandChoiceSeach">
                    <div class="fc-brandChoiceSeachLeft" :class="{'fd-brandChoiceSeachLeftTrigger':defaultShow}">
                        <span></span>
                        <input type="text" name="" placeholder="请输入品牌名称搜索" v-model="searchvalue"  @focus="focus">
                        <a  v-show="searchvalue" @click="clear" class="fc-emptyButton"></a>
                    </div>
                    <div class="fc-brandChoiceSeachRight" v-show="defaultShow">
                        <a @click="goback">取消</a>
                    </div>
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
    watch:{
        'searchvalue':function(newVal){
            if(newVal==''){
                return;
            }
            this.changesearch(newVal)
        }
    },
    data(){
        return {
            searchvalue:'',
            searchList:[],
            defaultShow:false
        }
    },
    computed:{
        
    },
    methods:{
        clear(){
            var _this = this;
            _this.searchvalue ='';
            this.defaultShow = false;
            _this.$emit('searchDat',_this.searchvalue,0)
        },
        focus(){
            this.defaultShow = true;
            this.$emit('focus','_this.searchvalue')
        },
        goback(){
            var _this = this;
            _this.searchvalue ='';
            this.defaultShow = false;
             _this.$emit('searchDat',_this.searchvalue,0)
        },
        changesearch(val){
             this.$emit('searchDat',val,1)
        }
        // audioinfo(){
        //     var _this = this;
        //     this.setupWebViewJavascriptBridge(function (bridge) {
        //     //url 语音文案说明图片地址
        //     var url = "https://c1.zhipeicloud.com/voiceexample/vioce_brand.png"
        //     bridge.callHandler('native_VoiceRecognizer', url, function (response) {
        //         // if(_this.supplementExplain.length<300){
        //         //     _this.supplementExplain = _this.supplementExplain + response +',';
        //         //     if(_this.supplementExplain.length>300){
        //         //         _this.supplementExplain = _this.supplementExplain.substring(0,300)
        //         //     }
        //         // }else {
        //         //     return;
        //         // }
        //         _this.searchvalue = response;
        //          _this.$emit('searchDat',_this.searchvalue,1)
        //         });
        //     });
        // }
    },
    created(){

    },
    mounted(){
        //  this.$emit('searchDat',_this.searchvalue)
    }
}
</script>
<style scoped>
    .fc-brandChoiceSeach {
	width: 100%;
	background: #d53533;
	padding: 0 .4rem .32rem;
	float: left;
	clear: left;
}
.fc-brandChoiceSeachLeft {
	width: 100%;
	height: .8rem;
	padding: .12rem 0;
	background: #fff;
	border-radius: .4rem;
	overflow: hidden;
	float: left;
	clear: left;
}
.fc-brandChoiceSeachLeft>span {
	width: .8rem;
	height: .56rem;
	background: url(../assets/images/brand_icon/icon_magnifier.png) no-repeat center center;
	background-size: .36rem;
	border-radius: .4rem;
	float: left;
	clear: none;
}
.fc-brandChoiceSeachLeft>input {
	width: 5.16rem;
	height: .56rem;
	border: 0;
	font-size: .4rem;
	line-height: .56rem;
	text-align: left;
	color: #282828;
	float: left;
	clear: none;
}
.fc-brandChoiceSeachLeft>input::-webkit-input-placeholder {
	font-size: .36rem;
    color: #ccc;
}
.fc-brandChoiceSeachLeft>a {
	width: auto;
	height: .56rem;
	float: right;
	clear: none;
}
.fc-brandChoiceSeachLeft>a.fc-emptyButton {
	width: .8rem;
	background: url(../assets/images/brand_icon/icon_empty.png) no-repeat center center;
	background-size: .48rem;
}
.fc-brandChoiceSeachLeft>a.fc-searchButton {
	width: auto;
	padding: 0 .16rem;
	margin-right: .2rem;
	font-size: .36rem;
	line-height: .56rem;
	text-align: center;
	color: #e74c3c;
}

.fc-brandChoiceSeachRight {
	width: .8rem;
	height: .8rem;
	float: right;
	clear: none;
}
.fc-brandChoiceSeachRight>a {
	width: .8rem;
	height: .8rem;
	font-size: .36rem;
    line-height: .8rem;
	text-align: center;
	color: #fff;
	float: left;
	clear: none;
}
.fd-brandChoiceSeachLeftTrigger {
	width: 8rem;
}
</style>    