<template>
	<div class="replaceCycleBox">
		<!--以下是门店主营业务的弹层-->
		<div class="ec-replaceCycleBox">
            <div class="ec-modularTitle">配件更换周期</div>
            <div class="ec-maintainSchedule" :class="{'ec-openBox':openBox}" >
                <ul>
                    <li v-for="(item,index) in data" :key="index">
                        <p v-if="openBox"><a @click="showCarImg([item.mExplainImage],$event,0,0)">{{item.mProjectName}}</a></p>
						<p v-else>{{item.mProjectName}}</p>
                        <span>{{item.maintenanceText}}</span>
                    </li>                  
                </ul>
            </div>
            <div class="ec-modularFool">              
                <a @click="open()" v-show="data.length>3" class="ec-takeUp"><span>{{openBoxText}}</span></a>
            </div>
        </div>

		<!--查看Logo图片-->
   		<photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>

		   <!--分享查看付费查看弹层-->
    <jurisdictionPop ref="jurisdictionPop" v-on:weixinshare="weixinshare" v-on:weinxinmayment="weinxinmayment"></jurisdictionPop>
	</div>
</template>

<script>
import { commonMixin } from "../config/base/commonMixin.js";
import photowipe from "./photoswipe";
import jurisdictionPop from "./jurisdictionPop";
import { Toast } from "mint-ui";

var resourceUrl = process.env.apiDomain;
export default {
  name: "replaceCycleBox",
  mixins: [commonMixin],
  components: {
    photowipe: photowipe,
    jurisdictionPop
  },
  data() {
    return {
      vinCode: "",
      openBox: false,
      openBoxText: "查看更多",
      data: [],
      maxslideImg: [],
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
  methods: {
    //点击隐藏查看碳层
    open() {
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
        success: function(str) {
          if (str.Header.ErrorCode == 0) {
            switch (str.Body.searchType) {
              case 1:
                _this.GetAutoMaintenanceList();
                _this.openBox = !_this.openBox;
                _this.openBoxText = _this.openBox ? "收起" : "查看更多";
                break;
              case 2:
                _this.$refs.jurisdictionPop.show();
                _this.$refs.jurisdictionPop.setValue(
                  str.Body.shareData,
                  true,
                  str.Body.shareText
                );

                break;
              case 3:
                _this.$refs.jurisdictionPop.show();
                _this.$refs.jurisdictionPop.setValue(
                  str.Body.shareData,
                  false,
                  str.Body.shareText
                );

                break;
              case 4:
                Toast("请联系修理厂开通权限,才可查看周期表");
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
        success: function(str) {
          if (str.Header.ErrorCode == 0) {
            _this.data = str.Body;
          } else {
            Toast(str.Header.Message);
          }
        }
      });
    },
    showCarImg(images, el, index, isImage) {
      event.stopPropagation();
      $(".action_carimg").removeClass("action_carimg");
      $(event.currentTarget).addClass("action_carimg");

      var _self = this;
      var imgInfo = images;
      _self.maxslideImg.splice(0);
      $.each(imgInfo, function(i, item) {
        _self.maxslideImg.push({
          src: item
        });
      });

      this.$refs.photowipe.show(index, false, isImage);
    }
  }
};
</script>
