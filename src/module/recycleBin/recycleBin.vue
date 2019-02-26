<template>
    <div class="pageMain ca-pageMain">
        <!--<headers title="最近删除"></headers>-->
        <div class="aa-chooseBox">
            <p>可对已取消关注的目录进行恢复</p>
            <ul class="aa-followCatalog">
                <li v-for="itme in list" @click="recovery(itme)">
                    <span class="aa-shopPic"><img :src="itme.brandLogo" ></span>
                    <p class="aa-shopName">

                        <span>{{itme.brandName}}

                            <b>{{itme.brandModelName}}</b>
                        </span>
                    </p>
                    <a class="cg-recoveryButton">恢复</a>
                </li>
            </ul>
        </div>
        <!--无数据的情况-->
        <div class="aa-nodataBox" v-show="list.length<1">
            <span class="aa-noDataPic"></span>
        </div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
    import { commonMixin } from '../../config/base/commonMixin.js';
    // import headers from '../../components/headers.vue';
    var resourceUrl=process.env.apiDomain;
    export default {
        name: "recycleBin",
        mixins: [commonMixin],
        components: {
            // headers,
        },
        data(){
            return {
                list:[]
            }
        },
        created(){

            var _this=this;
            _this.setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('native_SetTitle', "最近删除", function(response) {
                });
            });
        },
        mounted(){
            // this.listenBackEvent();
            this.getdeletedbrandsbyuid();
        },
        methods:{
            //hui
            getdeletedbrandsbyuid(){
                var _this = this;
                _this.ajax({
                    method: "POST",
                    url: resourceUrl + "/usercenter/getdeletedbrandsbyuid",
                    dataType: "JSON",
                    success: function(data) {
                        if(data.Body){
                            _this.list = data.Body;
                        }

                    }
                });

            },
            recovery(data){

                this.recoveryDeletedBrand(data);
            },
            //回复回收站
            recoveryDeletedBrand(data){
                var _this = this;
                _this.ajax({
                    method: "POST",
                    url: resourceUrl + "/usercenter/recoveryDeletedBrand",
                    dataType: "JSON",
                    data:{
                        brandId:data.brandId
                    },
                    success: function(data) {
                        if(data.Body==1){
                            Toast('重新关注成功')
                        }
                        //获取回收站列表
                        _this.getdeletedbrandsbyuid();

                    }
                });
            }
        }

    }
</script>

<style scoped>
    @import url("../../assets/css/app.css");
    @import url("../../assets/css/mystyle.css");
    @import url("../../assets/css/onekeyinquiriesstyle0705.css");
    .aa-followCatalog li p.aa-shopName>span b {
        font-weight: normal;
        color: #999;
    }
    .pageMain {
        padding-top: 0;
    }
    .aa-nodataBox {
        width: 100%;
        padding: 3rem;
        float: left;
        clear: left;
    }
    .aa-noDataPic {
        width: 100%;
        height: 3.6rem;
        background: url(../../assets/images/icon_noData.png) no-repeat center center;
        background-size: 2.8rem;
        display: block;
        float: left;
        clear: left;
    }
    span {
        width: auto;
        max-width: 6.4rem;
        height: auto;
        font-size: .36rem;
        line-height: .5rem;
        word-break: break-all;
        float: left;
        clear: left;
    }
</style>
