<template>
	<div class="shareVenPop" >
		<!-- 分享APP提醒弹层 -->
		<div class="bj-catalogSharePop"  v-if="isVenPop">
			<div class="bj-catalogShareBox">
				<div class="bj-catalogShareText">
					<p>分享APP到朋友圈</p>
					<span>即可获得所选品牌目录查询权限</span>
				</div>
				<a href="javascript:;" v-on:click="shareApp()">立即分享</a>
			</div>
		</div>
		<!-- 分享APP -->
		<shareFriends v-if="sharePop" v-on:shareFriendsHide="shareFriendsHide" v-on:callback="callback" :shareFlag="1" :shareInfo="shareInfo" :isShow="1" ></shareFriends>
	</div>
</template>
<script>
import { commonMixin } from "../config/base/commonMixin.js";
import shareFriends from "./shareFriends.vue";
var resourceUrl = process.env.apiDomain;
export default {
  props: ["shareInfo"],
  name: "shareVenPop",
  mixins: [commonMixin],
  components: {
    shareFriends
  },
  data() {
    return {
      sharePop: false,
      isVenPop: true
    };
  },
  created() {
	var _this = this;

  },
  mounted() {},
  methods: {
    // 点击分享App
    shareApp() {
      var _this = this;
      _this.isVenPop = false;
      _this.sharePop = true;
      //
      _this.$emit("isShareVen", false);
    },
    // 获取分享传递的数据
    shareFriendsHide(data) {
      var _this = this;
      _this.sharePop = data;
    },
    callback() {
		var _this = this;
      _this.$emit("callback");
    }
  }
};
</script>
<style>
@import url("../assets/css/commonPop.css");
</style>
