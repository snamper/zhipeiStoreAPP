<template>
  <div class="selectBrand">
    <div class="pageMain bn-pageMain" style="padding:0;padding-bottom:1.28rem;">
      <div class="bn-screenBox">请选择要查询的目录品牌</div>
      <div class="bn-brandBox" ref="mainRightBox" :style="{top:topClass}">

        <div class="bn-brandLine" ref="brandBox" v-for="(item,index) in cjmlBrandList.b">
          <p ref="pl" v-bind:id="item.letter">{{item.letter}}</p>
          <ul>
            <li v-for="(ite,ind) in item.brandList" ref='allLi' v-on:click="selectedBrands(ite)" :id="ite.cids">
              <span class="bn-brandPic"><img :src="ite.brandLogo"></span>
              <p class="bn-brandName">
                <span>{{ite.brandName}}<b>{{ite.brandModelName}}</b></span>
              </p>
              <span class="bn-brandFrame" :class="[ite.isSelect==1?'bn-selected':'']" ref="bodyNav"></span>
            </li>
          </ul>
        </div>
      </div>

      <div class="navLetter">
        <a v-for="(item,index) in cjmlBrandList.z" v-on:click="gotoIndex($event,index)">{{item}}</a>
      </div>

    </div>

    <div class="foolButtonOne">
      <a @click="submit()" class="foolButton">确定</a>
      <a @click="inviteDialog_displaying = true" class="doubtButton"></a>
    </div>

    <!-- 点击邀请的弹层 -->
    <div class="brandPop" v-if="inviteDialog_displaying">
      <ul>
        <li>没有我代理的品牌怎么办？<br>放弃他？不放弃！我要他加进来！</li>
        <li class="brandButton">
          <a @click="shareBrandShop()">邀请品牌厂商</a>
        </li>
        <a @click="inviteDialog_displaying=false">×</a>
      </ul>
    </div>


    <!-- 分享弹层 -->
    <shareFriends v-if="shareFriends_displaying" v-on:shareFriendsHide="onShareFriends_hide" v-bind:shareFlag="2" v-bind:shareData="userId"></shareFriends>

  </div>
</template>

<script>
  import {
    commonMixin
  } from "../config/base/commonMixin.js";
  import shareFriends from "../components/shareFriends.vue";
  import {
    MessageBox
  } from 'mint-ui';
  import {
    Toast
  } from "mint-ui";

  var resourceUrl = process.env.apiDomain;
  var nowOffset = 0;
  export default {
    name: "bindBrandSelector",
    mixins: [commonMixin],
    props: ['top'],
    components: {
      shareFriends,
    },
    data() {
      return {
        cjmlBrandList: [], //品牌列表
        inviteDialog_displaying: false, //邀请弹层展示中
        shareFriends_displaying: false, //分享弹层展示中
        querystring_type: this.getQueryString("type"), //启动类型 1:vin码结果页启动 2:关注目录页启动
        querystring_vin: this.getQueryString("v"), //vin码
        topClass: '1.04rem',
      };
    },
    created() {
      var _this = this;
      _this.setTitle("选择品牌");
      _this.getCJMLBrandList();
    },
    mounted() {
      this.topClass = this.$props.top;
    },
    methods: {
      //获取 品牌列表
      getCJMLBrandList() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/GetCJMLBrandList",
          dataType: "JSON",
          async: false,
          success: function (data) {
            if (data.Body) {
              _this.cjmlBrandList = data.Body;
            }
          }
        });
      },
      //点击定位
      gotoIndex(el, index) {
        var _this = this;
        if (index == 0) {
          $(_this.$refs.mainRightBox).animate({
              scrollTop: 0
            },
            500,
            function () {}
          );
        } else {
          _this.handlePosi(el);
        }
      },
      //处理定位的问题
      handlePosi(el) {
        var _this = this;
        var me = $(_this.$refs.pl).eq($(el.currentTarget).index());

        var nowTopoffset = me.offset().top;
        var bodyoffset = $(_this.$refs.mainRightBox).offset().top;
        var realSite = $(_this.$refs.mainRightBox).scrollTop();
        if (realSite != nowOffset) {
          nowOffset += realSite - nowOffset;
        }
        nowOffset += nowTopoffset - bodyoffset;
        $(_this.$refs.mainRightBox).animate({
            scrollTop: nowOffset
          },
          500,
          function () {}
        );
      },

      //点击选择普通品牌
      selectedBrands(data) {
        var _this = this;
        if (data.isFollowed == 1 && data.isSelect == 1) {
          // 既有关联的取消选择
          MessageBox.confirm('', {
            title: '',
            message: '确认取消关注当前智能产品目录？',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(action => {
            data.isSelect = 0;
          });
        } else {
          if (data.isSelect == 0) {
            data.isSelect = 1;
            _this.checkSelectBrandNum();
          } else {
            data.isSelect = 0;
          }
        }
      },

      // 取得所有用户选择的品牌
      getAllSelectedBrands() {
        var result = [];
        this.cjmlBrandList.b.forEach(oneGroup => {
          oneGroup.brandList.forEach(oneBrand => {
            if (oneBrand.isSelect == 1) result.push(oneBrand.brandId);
          });
        });
        return result;
      },

      // 取得用户选择的新品牌
      getAllNewBrands() {
        var result = [];
        this.cjmlBrandList.b.forEach(oneGroup => {
          oneGroup.brandList.forEach(oneBrand => {
            if (oneBrand.isFollowed == 0 && oneBrand.isSelect == 1) result.push(oneBrand.brandId);
          });
        });
        return result;
      },

      //确认保存
      submit() {
        var allNewBrands = this.getAllNewBrands();

        if (allNewBrands.length == 0) {
          //没有新增的, 则提示
          Toast("您还未选择新品牌");
        } else if (allNewBrands.length > 5) {
          //新增超过5个的, 则处理终止
          Toast('一次只能关联5个新品牌目录哦');
        } else {
          //新增不超过5个的, 则抛出submit事件
          this.$emit('submit', {
            newBrands: allNewBrands
          });
        }
      },


      //验证选择品牌数量
      checkSelectBrandNum() {
        var allNewBrands = this.getAllNewBrands();
        if (allNewBrands.length > 5) {
          Toast('一次只能关联5个新品牌目录哦');
        }
      },

      // 分享弹层Hide事件
      onShareFriends_hide() {
        this.shareFriends_displaying = false;
      },

      // 邀请品牌厂商
      shareBrandShop() {
        this.shareFriends_displaying = true;
        this.inviteDialog_displaying = false;
      },


    }
  };

</script>

<style scoped>
  @import url("../assets/css/app.css");
  @import url("../assets/css/selectBrand.css");

  .bj-toastBoxNumber {
    width: 7.6rem;
    height: 1.84rem;
    margin: -0.92rem 0 0 -3.8rem;
    background: rgba(0, 0, 0, 0.78);
    border-radius: 0.32rem;
    font-size: 0.4rem;
    line-height: 0.68rem;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 40;
  }

  .pageMain {
    width: 100%;
    height: 100%;
    padding: 1.16rem 0 1.28rem !important;
    position: relative;
    overflow: hidden;
    float: left;
    clear: left;
  }

  .bn-brandLine li p.bn-brandName {
    width: auto;
    max-width: 6.6rem;
    height: auto;
    min-height: 1.28rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;

  }

  .bn-brandLine li p.bn-brandName>span {
    width: 100%;
    height: auto;
    word-break: break-all;
    line-height: .64rem;
    float: left;
    clear: left;
  }

  .bn-brandLine li p.bn-brandName>span {
    width: 100%;
    height: auto;
    word-break: break-all;
    float: left;
    clear: left;
  }

  .bn-brandLine li p.bn-brandName>span b {
    font-weight: normal;
    color: #999;
  }

</style>
