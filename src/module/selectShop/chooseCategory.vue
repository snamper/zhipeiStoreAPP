<template>
  <div class="chooseCategory">
    <!-- 选品类相关效果 -->
    <div class="bo-chooseCategory">
      <a v-for="(item,index) in getCategorysList" v-bind:class="buildElementClass(item)" v-model="item.isSelected"
         v-on:click="selectAdd(item)">{{item.smallName}}</a>

    </div>

    <!-- 选品类底部按钮 -->
    <div class="bo-chooseCategoryFool">
      <a v-on:click="AddMulu()">确定</a>
    </div>

    <!-- 完善个人信息弹层 -->
    <div class="bo-shopMainSupplementPop" style="display: none;">
      <div class="bo-shopMainSupplement">
        <div class="bo-shopSupplementTop">
          <p>请完善身份信息，更快为您服务</p>
          <a href="">×</a>
        </div>
        <div class="bo-shopSupplementCenter">
          <ul>
            <li class="bo-shopAddress">
              <span>公司/门店：</span>
              <input type="" name="" placeholder="输入您公司/门店的名称，15个字以内（必填）">
            </li>
            <li class="bo-shopAddress">
              <span>姓名：</span>
              <input type="" name="" placeholder="请输入您的姓名(必填)">
            </li>
            <li class="bo-shopAddress">
              <span>收货地址：</span>
              <textarea class="bo-shopAddressInput">上海市嘉定区安亭镇墨玉南路1033号</textarea>
            </li>
          </ul>
        </div>
        <div class="bo-shopSupplementFool">
          <!-- 初始状态a标签中增加样式：ao-disable -->
          <a href="" class="bo-disable">保存</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import router from "../../router/selectShop.js";
  import {commonMixin} from '../../config/base/commonMixin.js';

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "chooseCategory",
    mixins: [commonMixin],
    components: {},
    data() {
      return {
        getCategorysList: [
          {categoryId: 42, categoryName: "前刹车片", smallName: "前片", isSelected: false},
          {categoryId: 208, categoryName: "后刹车片", smallName: "后片", isSelected: false},
          {categoryId: 98, categoryName: "机油滤清器", smallName: "机油滤", isSelected: false},
          {categoryId: 101, categoryName: "空气滤清器", smallName: "空气滤", isSelected: false},
          {categoryId: 270, categoryName: "刹车片感应线", smallName: "感应线", isSelected: false},
          {categoryId: 44, categoryName: "火花塞", smallName: "火花塞", isSelected: false},
          {categoryId: 100, categoryName: "空调滤清器", smallName: "空调滤", isSelected: false},
          {categoryId: 99, categoryName: "燃油滤清器", smallName: "燃油滤", isSelected: false},
          {categoryId: 43, categoryName: "前刹车盘", smallName: "前盘", isSelected: false},
          {categoryId: 209, categoryName: "后刹车盘", smallName: "后盘", isSelected: false},
          {categoryId: 427, categoryName: "正时皮带套装", smallName: "正时套装", isSelected: false},
          {categoryId: 573, categoryName: "正时皮带", smallName: "正时皮带", isSelected: false},
          {categoryId: 223, categoryName: "电瓶", smallName: "电瓶", isSelected: false},
          {categoryId: 52, categoryName: "点火线圈", smallName: "点火线圈", isSelected: false},
          {categoryId: 449, categoryName: "变速箱油", smallName: "变速箱油", isSelected: false},
          {categoryId: 426, categoryName: "变速箱滤网", smallName: "变速箱滤网", isSelected: false},
          {categoryId: 215, categoryName: "雨刮片", smallName: "雨刮", isSelected: false},
          {categoryId: 50, categoryName: "高压分缸点火线", smallName: "分缸线", isSelected: false},
          {categoryId: 453, categoryName: "驻车制动蹄片", smallName: "手刹片", isSelected: false},
          {categoryId: 275, categoryName: "发动机外部皮带", smallName: "发动机皮带", isSelected: false},

        ],
        selectCategorys: [],
        isSelectCount: 0,
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      buildElementClass(oneItem) {
        if (oneItem.isSelected) return "bo-selected";
        return "";
      },
      selectAdd(oneItem) {
        var _this = this;
        oneItem.isSelected = !oneItem.isSelected;
        if (oneItem.isSelected) {
          _this.selectCategorys.push(oneItem.categoryId);
        }
        else {
          var index = _this.selectCategorys.indexOf(oneItem.categoryId)
          _this.selectCategorys.splice(index, 1);
        }
      },
      AddMulu() {
        var _this = this;
        _this.isSelectCount = _this.selectCategorys.length;
        if (_this.isSelectCount == 1) {
          _this.setFollowCategorys(_this.selectCategorys)
        }
        else if (_this.isSelectCount > 1) {

        }
      },
      //选择报价的品牌
      setFollowCategorys(categoryId) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/FollowOneBrand",
          dataType: "JSON",
          data: {
            "categoryId": categoryId
          },
          success: function (data) {
            Toast({
              message: '关注成功！ ',
              position: 'center',
              duration: 2000
            });
            //关闭当前页，跳转回Vin码扫码页
            setTimeout(function () {
              _this.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('native_CloseWebview', '', function (response) {
                });
              });
            }, 1000);
          }
        });
      },

    }
  }
</script>

<style>
  @import url("../../assets/css/app.css");
  /*@import url("../../assets/css/choosecategorystyle.css");*/
</style>
