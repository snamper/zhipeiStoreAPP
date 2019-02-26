<template>
	    <!-- 完善个人信息弹层 -->
        <div class="bo-shopMainSupplementPop" v-if="isShow">
          <div class="bo-shopMainSupplement">
            <div class="bo-shopSupplementTop">
              <p>请完善身份信息，找周边汽配店更精准！</p>
              <!-- <a href="">×</a> -->
            </div>
            <div class="bo-shopSupplementCenter">
              <ul>
                <li class="bo-shopAddress">
                  <span>公司/门店：</span>
                  <input type="" maxlength="15" name="" placeholder="输入您公司/门店的名称，15个字以内（必填）" v-model="companyName">
                </li>
                <li class="bo-shopAddress">
                  <span>姓名：</span>
                  <input type="" name="" placeholder="请输入您的姓名(必填)" v-model="realName">
                </li>
                <li class="bo-shopAddress">
                  <span>收货地址：</span>
                  <textarea class="bo-shopAddressInput" v-model="userAddress"></textarea>
                </li>
              </ul>
            </div>
            <div class="bo-shopSupplementFool">
              <!-- 初始状态a标签中增加样式：ao-disable -->
              <a v-on:click="(companyName&&realName&&userAddress)?SaveUserInfo():''" :class="(companyName&&realName&&userAddress)?'':'bo-disable'">保存</a>
            </div>
          </div>
        </div>
</template>

<script>
import { commonMixin } from "../config/base/commonMixin.js";
import { Toast } from "mint-ui";

var resourceUrl = process.env.apiDomain;
export default {
  name: "perfectInformation",
  mixins: [commonMixin],

  data() {
    return {
      userAddress: "",
      realName: "",
      companyName: "",
      userRule: "",
      isShow: false
    };
  },
  created() {
    this.getuserInfo();
  },
  methods: {
    hide() {
      this.isShow = false;
    },
    show(){
      this.isShow = true;
    },
    getuserInfo() {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/usercenter/getuser",
        dataType: "JSON",
        success: function(data) {
          if (data.Header.ErrorCode == 0 ) {
            _this.companyName = data.Body.companyName;
            _this.userRule = data.Body.userRule;
            _this.realName = data.Body.realName;

            //_this.getuserInfoData = data.Body;
            _this.userAddress = data.Body.companyAddress
              ? data.Body.companyAddress
              : data.Body.lastLoginAddress
                ? data.Body.lastLoginAddress.Address
                : "";
          }
        }
      });
    },
    //完善信息接口
    SaveUserInfo() {
      var _this = this;
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/Common/PerfectIdentityInfo",
        dataType: "JSON",
        data: {
          CloudShopName: _this.companyName,
          UserRule: _this.userRule,
          Contacts: _this.realName,
          ShopAddress: _this.userAddress
        },
        success: function(data) {
          if (data.Header.ErrorCode == 0) {
            _this.$emit("CallBack");
          } else {
            Toast({
              message: data.Header.Message,
              position: "center",
              duration: 2000
            });
          }
        }
      });
    }
  }
};
</script>


<style>
@import url("../assets/css/perfectInformation.css");
</style>
