<template>
  <div class="AutoMaintenance">
    <!--以下是门店主营业务的弹层-->
    <div class="ec-replaceCycleBox">
      <div class="ec-modularTitle">配件更换周期</div>
      <div class="ec-maintainSchedule" :class="{'ec-openBox':openBox}">
        <ul>
          <li v-for="(item,index) in data" :key="index">
            <p v-if='openBox &&  item.isMExplainDetail==true'><a @click="showCarImg(item)">{{item.mProjectName}}</a></p>
            <p v-else>{{item.mProjectName}}</p>
            <span>{{item.maintenanceText}}</span>
          </li>
        </ul>
      </div>
      <div class="ec-modularFool">
        <a @click="expand()" v-show="data.length>3" :class="{'ec-takeUp':openBox}"><span>{{openBoxText}}</span></a>
      </div>
    </div>
    <!--现象诊断-->
    <div class="eq-diagnosisPop" v-show="showdiagnosisPop">
      <div class="eq-diagnosisPopBox">
        <div class="eq-diagnosisHead">
          <ul>
            <li>
              <span></span>
              <p>{{mProjectName}}</p>
              <span></span>
            </li>
          </ul>
        </div>
        <a @click="showdiagnosisPop = false">×</a>
        <div class="eq-diagnosisMain" v-html="mProjectDetail">
        </div>
      </div>
    </div>
    <!--查看Logo图片-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>

    <shareFriends v-if="shareFriends" v-on:shareFriendsHide="onShareFriends_hide" v-bind:shareFlag="3" v-bind:shareData="shareData"
      v-on:callbackshore="callback" v-bind:isShow="false"></shareFriends>


    <!--分享查看付费查看弹层-->
    <jurisdictionPop ref="jurisdictionPop" v-on:weixinshare="weixinshare" v-on:weinxinmayment="weinxinmayment"></jurisdictionPop>
  </div>
</template>

<script>
  import {
    commonMixin
  } from "../config/base/commonMixin.js";
  import photowipe from "./photoswipe";
  import jurisdictionPop from "./jurisdictionPop";
  import shareFriends from "./shareFriends.vue";
  import {
    Toast
  } from "mint-ui";

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "AutoMaintenance",
    mixins: [commonMixin],
    components: {
      photowipe: photowipe,
      jurisdictionPop,
      shareFriends
    },
    data() {
      return {
        searchType: 1, //分享类型  1正常查看2普通分享3付费分享
        shareData: {}, //分享内容
        shareFriends: false, //控制分享弹层显示隐藏
        shareText: "", //分享弹层的头部文字
        vinCode: "",
        openBox: false,
        openBoxText: "查看更多",
        data: [],
        maxslideImg: [],
        mProjectName:'',
        mProjectDetail:'',
        showdiagnosisPop:false,
        options: {
          getThumbBoundsFn(index) {
            var thumbnail = document.querySelectorAll(".action_carimg")[0];
            var pageYScroll =
              window.pageYOffset || document.documentElement.scrollTop;
            var rect = thumbnail.getBoundingClientRect();
            var ret = {
              x: rect.left + rect.width / 2,
              y: rect.top + pageYScroll + rect.height / 2,
              w: 0
            };
            return ret;
          }
        }
      };
    },
    created() {},
    methods: {
      GetAutoMaintenanceDetail(data){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetAutoMaintenanceDetail",
          dataType: "JSON",
          data:{
            mProjectID:data.mProjectID
          },
          success:function(str){
            if(str.Header.ErrorCode ==0){
              _this.showdiagnosisPop = true;
              _this.mProjectName = str.Body.mProjectName;
              _this.mProjectDetail = str.Body.mProjectDetail;
            }else{
              Toast(str.Header.Message)
            }
          }
        })
      },
      onShareFriends_hide() {
        this.shareFriends = false;
      },
      //分享回调函数
      callback() {
        this.VinShare();
      },
      //付费
      weinxinmayment(data) {
        var _this = this;
        var baseUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          "/selectShop.html?cf=1&v=" +
          _this.vinCode +
          "#/payment";

        window.location.href = baseUrl;

        // _this.setupWebViewJavascriptBridge(function (bridge) {
        //   bridge.callHandler('native_JumpUrl', {url: baseUrl}, function (response) {})
        // })
      },
      VinShare() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/VinShare",
          dataType: "JSON",
          data: {
            VinCode: _this.vinCode
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.expand();
            } else {
              Toast(str.Header.Message);
            }
          }
        });
      },
      Start() {
        var _this = this;
        _this.GetAutoMaintenanceList();
      },

      //展开
      expand() {
        var _this = this;

        if (_this.vinCode == "") {
          Toast("vin码为空!");
          return;
        }

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/IsVinSearchPower",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode //订单ID
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.searchType = str.Body.searchType;
              _this.shareData = str.Body.share;
              _this.shareText = str.Body.shareText;

              switch (str.Body.searchType) {
                case 1:
                  //正常查看
                  _this.openBox = !_this.openBox;
                  _this.openBoxText = _this.openBox ? "收起" : "查看更多";
                  if (_this.openBox) _this.ViewAutoMaintenanceInfo(); //记录查看保养周期表
                  break;
                case 2:
                  //普通分享
                  _this.$refs.jurisdictionPop.show();
                  _this.$refs.jurisdictionPop.setValue(
                    str.Body.share,
                    true,
                    str.Body.shareText
                  );

                  break;
                case 3:
                  //付费分享
                  _this.$refs.jurisdictionPop.show();
                  _this.$refs.jurisdictionPop.setValue(
                    str.Body.share,
                    false,
                    str.Body.shareText
                  );

                  break;
                case 4:
                  //单纯提示
                  Toast("请联系修理厂开通权限,才可查看周期表");
                  break;
                case 5:
                  //需完善身份
                  _this.$parent.$refs.perfectInformation.show()
                  break;
              }
            } else {
              Toast(str.Header.Message);
            }
          }
        });
      },
      //分享APP
      weixinshare(data) {
        var _this = this;
        _this.$refs.jurisdictionPop.hide();
        _this.shareFriends = true;
      },

      GetAutoMaintenanceList() {
        var _this = this;

        if (_this.vinCode == "") {
          Toast("vin码为空!");
          return;
        }

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetAutoMaintenanceList",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode //订单ID
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.data = str.Body;
            } else {
              Toast(str.Header.Message);
            }
          }
        });
      },
      showCarImg(data) {
        var _this = this;
        _this.GetAutoMaintenanceDetail(data);
        // _this.setupWebViewJavascriptBridge(function (bridge) {bridge.callHandler("native_JumpUrl", {url: url}, function (response) {});
        // });

        // event.stopPropagation();
        // $(".action_carimg").removeClass("action_carimg");
        // $(event.currentTarget).addClass("action_carimg");
        //
        // this.ViewAutoMaintenanceDetail();    //记录查看保养周期详情
        //
        // var _self = this;
        // var imgInfo = images;
        // _self.maxslideImg.splice(0);
        // $.each(imgInfo, function (i, item) {
        //   _self.maxslideImg.push({
        //     src: item
        //   });
        // });
        //
        // this.$refs.photowipe.show(index, false, isImage);
      },


      //查看保养周期表
      ViewAutoMaintenanceInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/ViewAutoMaintenanceInfo",
          data: {
            vinCode: this.vinCode
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },

      //查看保养周期详情
      ViewAutoMaintenanceDetail() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/ViewAutoMaintenanceDetail",
          data: {
            vinCode: this.vinCode
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },

    }
  };

</script>


<style>
  @import url("../assets/css/autoMaintenance.css");
  @import url("../assets/css/diagnosisstyle.css");
</style>
