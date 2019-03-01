<template>
  <div>
    <!-- 选择品牌-方式 -->
    <div class="fc-brandChoiceModeChild">
      <!-- 筛选方式 -->
      <div class="fc-screenConditionBox">
        <!-- 品类 -->
        <div :class="{'fc-selected':tab_category.selected, 'fc-openBox':show_valid_categorys_or_groups==1 && valid_categoryGroups.length>1}" :style="{'width':style_tab_width}"
          v-show="tab_category.isShow" @click="on_tabCategory_click">
          <p class="fc-screenModeChild">
            <b>{{tab_category.text}}</b>
          </p>
        </div>
        <!-- 国际品牌 -->
        <div :class="{'fc-selected':tab_famous.selected}" :style="{'width':style_tab_width}" v-show="tab_famous.isShow" @click="on_tabFamous_click">
          <p>
            <b>{{tab_famous.text}}</b>
          </p>
        </div>
        <!-- 周边在售 -->
        <div :class="{'fc-selected':tab_around.selected}" :style="{'width':style_tab_width}" v-show="tab_around.isShow" @click="on_tabAround_click">
          <p>
            <b>{{tab_around.text}}</b>
          </p>
        </div>
        <!-- 首字母 -->
        <div :class="{'fc-selected':tab_alphabet.selected, 'fc-openBox':show_valid_alphabet}" :style="{'width':style_tab_width}" v-show="tab_alphabet.isShow"
          @click="on_tabAlphabet_click">
          <p class="fc-screenModeChild">
            <b>{{tab_alphabet.text}}</b>
          </p>
        </div>
        <!-- 新增品牌 -->
        <div :class="{'fc-selected':tab_newbrand.selected}" :style="{'width':style_tab_width}" v-show="tab_newbrand.isShow" @click="on_tabNewBrand_click">
          <p>
            <b>{{tab_newbrand.text}}</b>
          </p>
        </div>
      </div>

      <!-- 品类组可选内容 -->
      <div class="fc-screenChildMain" v-show="show_valid_categorys_or_groups==1 && valid_categoryGroups.length>1">
        <div class="fc-screenChildMainBox">
          <dl>
            <dd>
              <a v-for="(oneGroup,index) in valid_categoryGroups" href="javascript:;" :class="{'fc-selected':oneGroup.selected}" @click="pickCategoryGroup(oneGroup)">{{oneGroup.categoryGroupName}}</a>
            </dd>
          </dl>
        </div>
      </div>

      <!-- 首字母可选内容 -->
      <div class="fc-screenChildMain" v-show="show_valid_alphabet">
        <div class="fc-screenChildMainBox fc-letterBox">
          <a v-for="(oneAlphabet,index) in valid_alphabet" href="javascript:;" :class="{'fc-selected':oneAlphabet==tab_alphabet.alphabet}" @click="pickAlphabet(oneAlphabet)">{{oneAlphabet
            == '' ? '全部': oneAlphabet}}</a>
        </div>
      </div>

      <!-- 品类可选内容 -->
      <div class="fc-categorySubBox" v-show="show_valid_categorys_or_groups==2 && valid_categorys.length>2">
        <ul>
          <li v-for="(oneCategory,index) in valid_categorys" :class="{'fc-selected':oneCategory.categoryId==tab_category.categoryId}" @click="pickCategory(oneCategory)">{{oneCategory.categoryName}}</li>
        </ul>
      </div>
    </div>
  </div>

  </div>

</template>

<script>
  import {
    commonMixin
  } from "../config/base/commonMixin.js";
  import {
    Toast
  } from "mint-ui";
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "focusBrandFilter", //关注品牌筛选器
    mixins: [commonMixin],
    components: {},
    props: [],
    data() {
      return {
        mode: 0, //0: 无固化 1:固化品类 2:固化国际品牌 3:固化周边 4:固化首字母 5:固化新增品牌

        C_MODE_CATEGORY: 1,
        C_MODE_FAMOUS: 2,
        C_MODE_AROUND: 3,
        C_MODE_ALPHABET: 4,
        C_MODE_NEWBRAND: 5,

        tab_category: { //TAB_品类
          text: "品类",
          selected: false,
          isShow: true,
          categoryGroupId: 0,
          categoryId: 0,
        },
        tab_famous: { //TAB_国际品牌
          text: "国际品牌",
          selected: false,
          isShow: true,
        },
        tab_around: { //TAB_周边在售
          text: "周边在售",
          selected: false,
          isShow: true,
        },
        tab_alphabet: { //TAB_首字母
          text: "首字母",
          selected: false,
          alphabet: '',
          isShow: true,
        },
        tab_newbrand: { //TAB_新增品牌
          text: "新增品牌",
          selected: false,
          isShow: true,
        },

        base_category_group: [],

        show_valid_categorys_or_groups: 0, //0:品类/品类组都不展示 1:展示品类组 2:展示品类
        show_valid_alphabet: false,

        valid_categoryGroups: [], //可选品类组
        valid_categorys: [], //可选品类

        valid_alphabet: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
          'Y', 'Z'
        ], //可选首字母

        style_tab_width: "1.6rem",

      };
    },
    created() {
      var _this = this;
    },
    mounted() {
      var _this = this;
    },
    destroyed: function () {
      var _this = this;
    },
    methods: {
      active(input) {
        var _this = this;
        this.mode = Number(input.mode || 0);
        if (this.mode > 0) this.style_tab_width = "2.1rem";

        this.initBaseCategroyGroup().then(function () {
          switch (_this.mode) {
            case _this.C_MODE_CATEGORY:
              var findResult = _this.base_category_group.find(function (o) {
                return o.categoryGroupId == input.mode_categoryGroup || 0
              });
              var text = findResult ? findResult.categoryGroupName : "未知";
              _this.setTitle(text);

              _this.tab_category.selected = true;
              _this.tab_category.isShow = false;
              _this.tab_category.categoryGroupId = input.mode_categoryGroup || 0;
              _this.tab_category.text = text;
              _this.launchValidCategorys(_this.tab_category.categoryGroupId);
              break;

            case _this.C_MODE_FAMOUS:
              _this.setTitle("国际品牌");
              _this.tab_famous.selected = true;
              _this.tab_famous.isShow = false;
              break;

            case _this.C_MODE_AROUND:
              _this.setTitle("周边在售");
              _this.tab_around.selected = true;
              _this.tab_around.isShow = false;
              break;

            case _this.C_MODE_ALPHABET:
              _this.setTitle("首字母 " + input.mode_alphabet || '');
              _this.title = "首字母 " + input.mode_alphabet || '';
              _this.tab_alphabet.selected = true;
              _this.tab_alphabet.isShow = false;
              _this.tab_alphabet.text = input.mode_alphabet || '';
              _this.tab_alphabet.alphabet = input.mode_alphabet || '';
              break;

            case _this.C_MODE_NEWBRAND:
              _this.setTitle("新增品牌");
              _this.tab_newbrand.selected = true;
              _this.tab_newbrand.isShow = false;
              break;

            default:
              break;
          }
          _this.$emit("confirm", _this.buildResult());
        });
      },

      initBaseCategroyGroup() {
        var _this = this;
        var myPromise = new Promise(function (resolve, reject) {
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/Common/GetAllCatetoryGroup",
            dataType: "JSON",
            data: {},
            beforeSend: function () {},
            complete: function () {},
            success: function (res) {
              if (res.Header.ErrorCode != 0) {
                Toast(res.Header.Message)
                return;
              }
              _this.base_category_group = res.Body;
              resolve();
            }
          });
        });
        return myPromise;
      },

      //外部取得当前结果
      getResult() {
        return this.buildResult();
      },

      //构造返回值
      buildResult() {
        var result = {
          filterType: [],
          categoryGroupId: 0,
          categoryId: 0,
          alphabet: '',
        }

        if (this.tab_category.selected) result.filterType.push(this.C_MODE_CATEGORY);
        if (this.tab_famous.selected) result.filterType.push(this.C_MODE_FAMOUS);
        if (this.tab_around.selected) result.filterType.push(this.C_MODE_AROUND);
        if (this.tab_alphabet.selected) result.filterType.push(this.C_MODE_ALPHABET);
        if (this.tab_newbrand.selected) result.filterType.push(this.C_MODE_NEWBRAND);
        result.categoryGroupId = this.tab_category.categoryGroupId;
        result.categoryId = this.tab_category.categoryId;
        result.alphabet = this.tab_alphabet.alphabet;
        return result;
      },

      //重置二级可选区域
      resetSubFilter() {
        this.show_valid_alphabet = false;
        this.show_valid_categorys_or_groups = 2;
      },
      on_tabCategory_click() {
        if (this.mode == this.C_MODE_CATEGORY) return;
        if (this.show_valid_categorys_or_groups == 1) {
          this.show_valid_categorys_or_groups = 2;
          return;
        }
        this.resetSubFilter();
        this.launchValidCategoryGroups();
      },
      on_tabFamous_click() {
        if (this.mode == this.C_MODE_FAMOUS) return;
        this.resetSubFilter();
        this.tab_famous.selected = !this.tab_famous.selected;
        this.$emit("confirm", this.buildResult());
      },
      on_tabAround_click() {
        if (this.mode == this.C_MODE_AROUND) return;
        this.resetSubFilter();
        this.tab_around.selected = !this.tab_around.selected;
        this.$emit("confirm", this.buildResult());
      },
      on_tabAlphabet_click() {
        if (this.mode == this.C_MODE_ALPHABET) return;
        if (this.show_valid_alphabet) {
          this.show_valid_alphabet = false;
          return;
        }
        this.resetSubFilter();
        this.show_valid_alphabet = true;
      },
      on_tabNewBrand_click() {
        if (this.mode == this.C_MODE_NEWBRAND) return;
        this.resetSubFilter();
        this.tab_newbrand.selected = !this.tab_newbrand.selected;
        this.$emit("confirm", this.buildResult());
      },

      launchValidCategoryGroups() {
        var _this = this;
        var viewModel = [{
          categoryGroupId: 0,
          categoryGroupName: "全部",
          selected: this.tab_category.categoryGroupId == 0
        }];
        this.base_category_group.forEach(o => {
          viewModel.push({
            categoryGroupId: o.categoryGroupId,
            categoryGroupName: o.categoryGroupName,
            selected: _this.tab_category.categoryGroupId == o.categoryGroupId
          })
        });
        this.valid_categoryGroups = viewModel;
        this.show_valid_categorys_or_groups = 1;
      },

      launchValidCategorys(categoryGroupId) {
        var _this = this;
        this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/GetAllCatetoryByGroup",
          dataType: "JSON",
          data: {
            categoryGroupId: categoryGroupId,
          },
          beforeSend: function () {},
          complete: function () {},
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message)
              return;
            }
            var viewModel = [{
              categoryId: 0,
              categoryName: "全部",
              selected: _this.tab_category.categoryId == 0
            }];
            res.Body.forEach(o => {
              viewModel.push({
                categoryId: o.categoryId,
                categoryName: o.categoryName,
                selected: _this.tab_category.categoryId == o.categoryId
              })
            });
            _this.valid_categorys = viewModel;
            _this.show_valid_categorys_or_groups = 2;
          }
        });
      },

      pickCategoryGroup(oneCategoryGroup) {
        var _this = this;
        this.valid_categoryGroups.forEach(o => {
          o.selected = o.categoryGroupId == oneCategoryGroup.categoryGroupId;
        });
        this.tab_category.selected = oneCategoryGroup.categoryGroupId != 0;
        this.tab_category.text = oneCategoryGroup.categoryGroupId == 0 ? "品类" : oneCategoryGroup.categoryGroupName;
        this.tab_category.categoryGroupId = oneCategoryGroup.categoryGroupId;
        this.tab_category.categoryId = 0;
        this.$emit("confirm", this.buildResult());
        this.show_valid_categorys_or_groups = 2;
        this.valid_categorys = [];
        if (oneCategoryGroup.categoryGroupId > 0) {
          this.launchValidCategorys(oneCategoryGroup.categoryGroupId);
        }
      },

      pickCategory(oneCategory) {
        var _this = this;
        this.valid_categorys.forEach(o => {
          o.selected = o.categoryId == oneCategory.categoryId;
        });
        this.tab_category.categoryId = oneCategory.categoryId;
        this.$emit("confirm", this.buildResult());
      },

      pickAlphabet(alphabet) {
        if (alphabet == '') {
          this.tab_alphabet.text = "首字母";
          this.tab_alphabet.selected = false;
          this.tab_alphabet.alphabet = '';
        } else {
          this.tab_alphabet.text = alphabet;
          this.tab_alphabet.selected = true;
          this.tab_alphabet.alphabet = alphabet;
        }
        this.show_valid_alphabet = false;
        this.$emit("confirm", this.buildResult());
      },
    },
  };

</script>


<style scoped>
  .fc-brandChoiceMode {
    width: 100%;
    float: left;
    clear: left;
  }

  .fc-brandChoiceModeTitle {
    width: 92%;
    margin: 0 4%;
    /* border-bottom: 1px solid #ececec; */
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .fc-brandChoiceModeTitle>span {
    width: auto;
    font-size: .44rem;
    line-height: 1.04rem;
    text-align: center;
    color: #282828;
    float: left;
    clear: none;
  }

  .fc-brandChoiceModeChild {
    width: 100%;
    padding: .32rem 0 0 .4rem;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    position: relative;
    float: left;
    clear: left;
    background: #fff;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox {
    width: 100%;
    position: relative;
    z-index: 6;
    float: left;
    clear: left;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div {
    width: 1.6rem;
    height: .64rem;
    background: #f8f8f8;
    border: 1px solid #f8f8f8;
    border-radius: .08rem;
    margin-right: .28rem;
    margin-bottom: .32rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: none;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div>p {
    width: auto;
    font-size: .32rem;
    line-height: .56rem;
    text-align: center;
    color: #343434;
    float: left;
    clear: none;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div>p>b {
    width: auto;
    max-width: 1.6rem;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    clear: left;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div>p.fc-screenModeChild {
    background: url(../assets/images/arrow_screen.png) no-repeat right center;
    background-size: auto .08rem;
    padding: 0 .28rem 0 0;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div.fc-selected {
    background: #FFFAFA url(../assets/images/close_rd.png) no-repeat right bottom;
    background-size: .32rem;
    border: 1px solid #F51F1F;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div.fc-selected>p.fc-screenModeChild {
    width: auto;
    padding-left: 0;
    background: url(../assets/images/arrow_screenRed.png) no-repeat right center;
    background-size: auto .08rem;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div.fc-selected>p.fc-screenModeChild>b {
    max-width: 1rem;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div.fc-selected>p {
    color: #F51F1F;
  }

  .fc-brandChoiceModeChild>div.fc-screenConditionBox>div.fc-openBox {
    height: .96rem;
    background: #fff;
    padding-bottom: .32rem;
    margin-bottom: 0;
    border: 1px solid #999;
    border-bottom: 1px solid #fff;
    border-radius: .08rem .08rem 0 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: none;
  }

  .fc-screenChildMain {
    width: 10rem;
    background: #fff;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    position: absolute;
    left: 0;
    top: 1.24rem;
    z-index: 2;
  }

  .fc-screenChildMainBox {
    width: 100%;
    height: auto;
    max-height: 8.84rem;
    overflow-x: hidden;
    overflow-y: auto;
    float: left;
    clear: left;
  }

  .fc-screenChildMainBox>dl {
    width: 96%;
    float: left;
    clear: left;
  }

  .fc-screenChildMainBox>dl>dt {
    width: 100%;
    padding-left: .4rem;
    margin-top: .4rem;
    font-size: .32rem;
    line-height: .4rem;
    text-align: left;
    color: #999;
    float: left;
    clear: left;
  }

  .fc-screenChildMainBox>dl>dd {
    width: 100%;
    padding: 0 0 .4rem .08rem;
    float: left;
    clear: left;
  }

  .fc-screenChildMainBox>dl>dd>a {
    width: 2.08rem;
    min-width: 1.28rem;
    height: .64rem;
    background: #f8f8f8;
    border: 1px solid #f8f8f8;
    border-radius: .08rem;
    margin: .28rem 0 0 .28rem;
    font-size: .32rem;
    line-height: .6rem;
    text-align: center;
    color: #282828;
    float: left;
    clear: none;
  }

  .fc-screenChildMainBox>dl>dd>a.fc-selected {
    background: #fffafa;
    border: 1px solid #f51f1f;
    color: #f51f1f;
  }

  .fc-screenChildButton {
    width: 100%;
    height: auto;
    padding: .32rem 0;
    border-top: 1px solid #eee;
    float: left;
    clear: left;
  }

  .fc-screenChildButton>a {
    width: 50%;
    height: auto;
    font-size: .4rem;
    line-height: .64rem;
    text-align: center;
    color: #4A90E2;
    float: left;
    clear: none;
  }

  .fc-screenChildButton>a.fc-cancelButton {
    border-right: 1px solid #e8e8e8;
    color: #999;
  }

  .fc-mackBox {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.68);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
  }

  .fc-letterScreenChildBox>.fc-screenChildMain {
    left: -6.04rem;
  }

  .fc-letterBox {
    padding: .4rem 0 0 .4rem;
  }

  .fc-letterBox>a {
    width: 1rem;
    height: 1rem;
    margin: 0 .32rem .32rem 0;
    background: #fafafa;
    font-size: .36rem;
    line-height: .92rem;
    text-align: center;
    color: #282828;
    float: left;
    clear: none;
  }

  .fc-letterBox>a.fc-selected {
    background: #fffafa;
    border: 1px solid #f51f1f;
    color: #f51f1f;
  }

  .fc-brandChoiceModeChild>div.fc-categorySubBox {
    width: 95.8333%;
    height: auto;
    background: #fff;
    border: 0;
    border-top: 1px solid #e8e8e8;
    border-radius: 0;
    margin-bottom: 0.28rem;
    display: block;
    float: left;
    clear: left;
  }

  .fc-brandChoiceModeChild>div.fc-categorySubBox>ul {
    width: 104.3333%;
    float: left;
    clear: left;
  }

  .fc-brandChoiceModeChild>div.fc-categorySubBox>ul>li {
    width: auto;
    min-width: 1.28rem;
    height: .64rem;
    background: #f8f8f8;
    border: 1px solid #f8f8f8;
    border-radius: .08rem;
    margin: .28rem .28rem 0 0;
    padding: 0 .24rem;
    font-size: .32rem;
    line-height: .6rem;
    text-align: center;
    color: #282828;
    float: left;
    clear: none;
  }

  .fc-brandChoiceModeChild>div.fc-categorySubBox>ul>li.fc-selected {
    background: #fffafa;
    border: 1px solid #f51f1f;
    color: #f51f1f;
  }

  #focusBrandFilter .postionclass {
    position: fixed;
    z-index: 10;
  }

</style>
