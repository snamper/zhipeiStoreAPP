<template>
  <div class="perfectInfo">
    <div class="headBox" style="display: none;">
      <a href="" class="returnLink">返回</a>
      <p>选择品牌</p>
    </div>

    <div class="bf-perfectInfoBox bq-perfectInfoBox">
      <ul>
        <li class="bf-perfectInfoTitle" style="display: none;">
          <p>完善个人信息后即刻获得</p>
          <span>上百家品牌目录供您查询</span>
        </li>
        <li>
          <span class="bm-identity">当前身份类型：</span>
          <p>{{UserRule[userRule]}}</p>

          <a href="JavaScript:;" class="bq-applyButton" v-show="auditStatus==-1" v-on:click="isUserRuleDialogDisplaying=!isUserRuleDialogDisplaying">申请修改</a>
          <!-- 申请修改审核中 -->
          <span class="bq-perfectInfoAudit" v-show="auditStatus==0">修改申请审核中</span>
          <!-- 申请修改未通过 -->
          <span class="bq-perfectInfoFail" v-show="auditStatus==-10">修改申请未通过</span>
          <!-- 身份修改成功 -->
          <span class="bq-perfectInfoSuccess" v-show="auditStatus==5">身份修改成功</span>

        </li>
        <li>
          <span>公司/门店：</span>
          <input type="" name="" maxlength="15" v-on:input="inputFunc" v-model="companyName" placeholder="请输入公司/门店名称(必填)">
        </li>
        <li>
          <span>姓名：</span>
          <input type="" maxlength="10" v-on:input="inputFunc" v-model="realName" name="" placeholder="请输入姓名(必填)">
        </li>
        <li>
          <span>电话：</span>
          <span>{{mobile}}</span>
        </li>
        <li>
          <span>地址：</span>
          <textarea v-model="companyAddress" v-on:input="inputFunc" maxlength="500"></textarea>
        </li>
        <li class="bm-perfectInfoHint" v-show="isShowErrorReason">未通过原因：{{errorMsg}}</li>
        <li class="bm-perfectInfoButton" v-if="submitDisable">
          <!-- 信息未填写完成使用样式：bm-disable(此为禁用样式) -->
          <a href="javascript:;" @click="PerfectIdentityInfo()">提交</a>


        </li>
      </ul>

    </div>

    <!-- 身份修改弹层 -->
    <div class="bq-perfectInfoModifyPop" v-show="isUserRuleDialogDisplaying">
      <div class="bq-perfectInfoModifyBox">
        <div class="bq-perfectInfoModifyTitle">
          <p>身份修改申请</p>
          <a href="JavaScript:;" v-on:click="isUserRuleDialogDisplaying=!isUserRuleDialogDisplaying">×</a>
        </div>
        <div class="bq-perfectInfoModifyMain">
          <ul>
            <li class="bq-perfectInfoModify">
              <span>身份修改为：</span>
              <a v-for="(val, key, index) in UserRule" :class="[key==userRule?'bq-disable':'']" v-on:click="selcetItem($event,key)">{{val}}</a>
            </li>
            <li>
              <span>修改原因：</span>
              <textarea placeholder="请输入您的修改原因，请勿乱填，否则申请不予通过。" maxlength="255" v-model="reason"></textarea>
            </li>
          </ul>
        </div>
        <div class="bq-perfectInfoModifyFool">
          <!-- 初始状态a标签中增加样式：bq-disable -->
          <a href="JavaScript:;" v-if="saveDisable&&reason.length>0" @click="AlterUserRule()">保存</a>
          <a href="JavaScript:;" class="bq-disable" v-else>保存</a>
        </div>
      </div>
    </div>

    <!-- 身份信息修改审核中提醒 -->
    <div class="bq-perfectInfoAuditToast" style="display: none;">提交成功，审核中…</div>

  </div>
</template>

<script>
  import headers from "../../components/headers.vue";
  import {
    commonMixin
  } from "../../config/base/commonMixin.js";
  import {
    Toast
  } from "mint-ui";
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "perfectInfo",
    mixins: [commonMixin],
    components: {
      headers: headers
    },
    data() {
      return {
        companyName: "",
        realName: "",
        companyAddress: "",
        mobile: "",
        userRule: 1,
        newUserRule: 1,
        UserRule: {
          "1": "经销商",
          "2": "修理厂",
          "3": "厂商"
        },
        isShowErrorReason: false,
        errorMsg: "",
        AuditStatus: {
          "-1": "申请修改",
          "0": "修改申请审核中",
          "5": "修改申请审核通过",
          "-10": "修改申请审核未通过"
        },
        auditStatus: 1,
        isUserRuleDialogDisplaying: false,
        reason: "",
        saveDisable: false,
        submitDisable: false,
      };
    },
    created() {
      var _this = this;
      _this.isInit();
      _this.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("native_SetTitle", "完善信息", function (response) {});
      });
      _this.getuserInfo();
      _this.GetUserRuleAuditResult();
    },
    methods: {
      getuserInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/usercenter/getuser",
          dataType: "JSON",
          success: function (data) {
            _this.companyName = data.Body.companyName;
            _this.realName = data.Body.realName;
            _this.companyAddress = data.Body.companyAddress != "" ?
              data.Body.companyAddress :
              data.Body.lastLoginAddress ?
              data.Body.lastLoginAddress.Address :
              ""
            _this.userRule = data.Body.userRule;
            _this.mobile = data.Body.mobile;
            if (data.Body.AuditStatus == -10) {
              _this.isShowErrorReason = true;
              _this.errorMsg = data.Body.AuditText;
            }
          }
        });
      },
      PerfectIdentityInfo() {
        var _this = this;
        _this.ajax({
          data: {
            CloudShopName: _this.companyName,
            UserRule: _this.userRule,
            Contacts: _this.realName,
            ShopAddress: _this.companyAddress
          },
          method: "POST",
          url: resourceUrl + "/Common/PerfectIdentityInfo",
          dataType: "JSON",
          success: function (data) {
            if (data.Header.ErrorCode == 0 && data.Body == true) {
              _this.isShowErrorReason = false;
              Toast({
                message: "信息修改成功",
                position: "center",
                duration: 2000
              });
            } else {
              _this.isShowErrorReason = true;
              _this.errorMsg = data.Header.Message;
            }
          }
        });
      },
      AlterUserRule() {
        var _this = this;
        _this.ajax({
          data: {
            NewUserRule: _this.newUserRule,
            Reason: _this.reason
          },
          method: "POST",
          url: resourceUrl + "/Common/AlterUserRule",
          dataType: "JSON",
          success: function (data) {
            if (data.Header.ErrorCode != 0) {
              Toast({
                message: data.Header.Message,
                position: "center",
                duration: 2000
              });
              return;
            }
            Toast({
              message: "提交成功，审核中…",
              position: "center",
              duration: 2000
            });
            _this.GetUserRuleAuditResult();
            _this.isUserRuleDialogDisplaying = !_this.isUserRuleDialogDisplaying;
          }
        });
      },
      GetUserRuleAuditResult() {
        var _this = this;
        _this.ajax({
          data: {},
          method: "POST",
          url: resourceUrl + "/Common/GetUserRuleAuditResult",
          dataType: "JSON",
          success: function (data) {
            _this.auditStatus = data.Body.auditStatus;
            if (data.Body.auditStatus == -10) {
              _this.isShowErrorReason = true;
              _this.errorMsg = data.Body.auditFailReason;
            } else {
              _this.isShowErrorReason = false;
            }
          }
        });
      },
      selcetItem(e, key) {
        var _this = this;
        if (!$(e.currentTarget).hasClass("bq-disable")) {
          $(e.currentTarget)
            .addClass("bq-selected")
            .siblings()
            .removeClass("bq-selected");
          _this.newUserRule = key;
          _this.saveDisable = true;
        }
      },
      inputFunc() {
        var _this = this;
        _this.submitDisable = true;
      }
    }
  };

</script>

<style>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/perfectInfo/perfectInfo.css");

</style>
