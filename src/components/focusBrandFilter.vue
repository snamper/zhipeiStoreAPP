<template>
  <div>
    <!-- 选择品牌-方式 -->
    <div class="fc-brandChoiceMode">
      <div class="fc-brandChoiceModeTitle" v-if="title.length>0">
        <span>{{title}}</span>
      </div>
    </div>
    <div class="fc-brandChoiceModeChild">
      <!-- 品类筛选 -->
      <div :class="{'fc-selected':tab_category.selected}" v-show="tab_category.isShow">
        <p class="fc-screenModeChild" @click="on_tabCategory_click">
          <b>{{tab_category.text}}</b>
        </p>
        <div class="fc-screenChildBox" v-show="valid_categoryGroups_show">
          <div class="fc-screenChildName">
            <p>品类</p>
          </div>
          <div class="fc-screenChildMain">
            <div class="fc-screenChildMainBox">
              <dl>
                <dd>
                  <a v-for="(oneGroup,index) in valid_categoryGroups" href="javascript:;" :class="{'fc-selected':oneGroup.selected}" @click="pickCategoryGroup(oneGroup)">{{oneGroup.categoryGroupName}}</a>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <!-- 国际品牌筛选 -->
      <div :class="{'fc-selected':tab_famous.selected}" v-show="tab_famous.isShow">
        <p @click="on_tabFamous_click">
          <b>{{tab_famous.text}}</b>
        </p>
      </div>
      <!-- 周边在售筛选 -->
      <div :class="{'fc-selected':tab_around.selected}" v-show="tab_around.isShow">
        <p @click="on_tabAround_click">
          <b>{{tab_around.text}}</b>
        </p>
      </div>
      <!-- 首字母筛选 -->
      <div :class="{'fc-selected':tab_alphabet.selected}" v-show="tab_alphabet.isShow">
        <p class="fc-screenModeChild" @click="on_tabAlphabet_click">
          <b>{{tab_alphabet.text}}</b>
        </p>
        <div class="fc-screenChildBox fc-letterScreenChildBox" v-show="valid_alphabet_show">
          <div class="fc-screenChildName">
            <p>首字母</p>
          </div>
          <div class="fc-screenChildMain" :style="{'left':style_alphabet_left}">
            <div class=" fc-screenChildMainBox fc-letterBox">
              <a v-for="(oneAlphabet,index) in valid_alphabet" href="javascript:;" :class="{'fc-selected':oneAlphabet==tab_alphabet.alphabet}" @click="pickAlphabet(oneAlphabet)">{{oneAlphabet
                == '' ? '全部': oneAlphabet}}</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 已添加筛选 -->
      <div :class="{'fc-selected':tab_focused.selected}" v-show="tab_focused.isShow">
        <p @click="on_tabFocused_click">
          <b>{{tab_focused.text}}</b>
        </p>
      </div>

      <!-- 子品类筛选 -->
      <div class="fc-categorySubBox" v-show="valid_categorys_show">
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
        mode: 0, //0: 无固化 1:固化品类 2:固化国际品牌 3:固化周边 4:固化首字母 5:固化已添加

        C_MODE_CATEGORY: 1,
        C_MODE_FAMOUS: 2,
        C_MODE_AROUND: 3,
        C_MODE_ALPHABET: 4,
        C_MODE_FOCUSED: 5,

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
        tab_focused: { //TAB_已添加
          text: "已添加",
          selected: false,
          isShow: true,
        },

        title: '', //标题

        base_category_group: [],

        valid_categoryGroups_show: false,
        valid_categorys_show: false,
        valid_categoryGroups: [], //可选品类组
        valid_categorys: [], //可选品类

        valid_alphabet_show: false,
        valid_alphabet: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
          'Y', 'Z'
        ], //可选首字母

        style_alphabet_left: "-6.04rem",

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
        this.mode = input.mode || 0;
        this.initBaseCategroyGroup().then(function () {
          switch (Number(_this.mode)) {
            case _this.C_MODE_CATEGORY:
              var findResult = _this.base_category_group.find(function (o) {
                return o.categoryGroupId == input.mode_categoryGroup || 0
              });
              var text = findResult ? findResult.categoryGroupName : "未知";
              _this.title = text;

              _this.tab_category.selected = true;
              _this.tab_category.isShow = false;
              _this.tab_category.categoryGroupId = input.mode_categoryGroup || 0;
              _this.tab_category.text = text;
              _this.launchValidCategorys(_this.tab_category.categoryGroupId);
              _this.style_alphabet_left = "-4.06rem";
              break;

            case _this.C_MODE_FAMOUS:
              _this.title = "国际品牌";
              _this.tab_famous.selected = true;
              _this.tab_famous.isShow = false;
              _this.style_alphabet_left = "-4.06rem";
              break;

            case _this.C_MODE_AROUND:
              _this.title = "周边在售";
              _this.tab_around.selected = true;
              _this.tab_around.isShow = false;
              _this.style_alphabet_left = "-4.06rem";
              break;

            case _this.C_MODE_ALPHABET:
              _this.title = "首字母 " + input.mode_alphabet || '';
              _this.tab_alphabet.selected = true;
              _this.tab_alphabet.isShow = false;
              _this.tab_alphabet.text = "　" + (input.mode_alphabet || '') + "　";
              _this.tab_alphabet.alphabet = input.mode_alphabet || '';
              break;

            case _this.C_MODE_FOCUSED:
              _this.title = "已添加";
              _this.tab_focused.selected = true;
              _this.tab_focused.isShow = false;
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
        if (this.tab_focused.selected) result.filterType.push(this.C_MODE_FOCUSED);
        result.categoryGroupId = this.tab_category.categoryGroupId;
        result.categoryId = this.tab_category.categoryId;
        result.alphabet = this.tab_alphabet.alphabet;
        return result;
      },

      on_tabCategory_click() {
        if (this.mode == this.C_MODE_CATEGORY) return;
        this.valid_alphabet_show = false;
        this.launchValidCategoryGroups();
      },
      on_tabFamous_click() {
        if (this.mode == this.C_MODE_FAMOUS) return;
        this.tab_famous.selected = !this.tab_famous.selected;
        this.valid_alphabet_show = false;
        this.$emit("confirm", this.buildResult());
      },
      on_tabAround_click() {
        if (this.mode == this.C_MODE_AROUND) return;
        this.tab_around.selected = !this.tab_around.selected;
        this.valid_alphabet_show = false;
        this.$emit("confirm", this.buildResult());
      },
      on_tabAlphabet_click() {
        if (this.mode == this.C_MODE_ALPHABET) return;
        this.valid_alphabet_show = true;
      },
      on_tabFocused_click() {
        if (this.mode == this.C_MODE_FOCUSED) return;
        this.tab_focused.selected = !this.tab_focused.selected;
        this.valid_alphabet_show = false;
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
        this.valid_categoryGroups_show = true;
        this.valid_categorys_show = false;
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
            if (res.Body.length > 1) {
              res.Body.forEach(o => {
                viewModel.push({
                  categoryId: o.categoryId,
                  categoryName: o.categoryName,
                  selected: _this.tab_category.categoryId == o.categoryId
                })
              });
              _this.valid_categorys = viewModel;
              _this.valid_categoryGroups_show = false;
              _this.valid_categorys_show = true;
            } else {
              //只有1个品类, 则不用展示了
              _this.valid_categorys = viewModel;
              _this.valid_categoryGroups_show = false;
              _this.valid_categorys_show = false;
            }
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
        this.valid_categoryGroups_show = false;
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
          this.tab_alphabet.text = "　" + alphabet + "　";
          this.tab_alphabet.selected = true;
          this.tab_alphabet.alphabet = alphabet;
        }
        this.valid_alphabet_show = false;
        this.$emit("confirm", this.buildResult());
      },
    },
  };

</script>


<style scoped>
  选择品牌的方式部分的样式 .fc-brandChoiceMode {
    width: 100%;
    float: left;
    clear: left;
  }

  .fc-brandChoiceModeTitle {
    width: 92%;
    margin: 0 4%;
    border-bottom: 1px solid #ececec;
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
    padding: .32rem 0 .32rem .4rem;
    float: left;
    clear: left;
    background: #fff;
  }

  .fc-brandChoiceModeChild>div {
    width: 1.6rem;
    height: .64rem;
    background: #f8f8f8;
    border: 1px solid #f8f8f8;
    border-radius: .08rem;
    margin-right: .28rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: none;
  }

  .fc-brandChoiceModeChild>div>p {
    width: auto;
    font-size: .32rem;
    line-height: .56rem;
    text-align: center;
    color: #343434;
    float: left;
    clear: none;
  }

  .fc-brandChoiceModeChild>div>p>b {
    width: auto;
    max-width: 1.6rem;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    clear: left;
  }

  .fc-brandChoiceModeChild>div>p.fc-screenModeChild {
    background: url(../assets/images/arrow_screen.png) no-repeat right center;
    background-size: auto .08rem;
    padding: 0 .28rem 0 0;
  }

  .fc-brandChoiceModeChild>div.fc-selected {
    background: #FFFAFA url(../assets/images/close_rd.png) no-repeat right bottom;
    background-size: .32rem;
    border: 1px solid #F51F1F;
  }

  .fc-brandChoiceModeChild>div.fc-selected>p.fc-screenModeChild {
    width: auto;
    padding-left: 0;
    background: url(../assets/images/arrow_screenRed.png) no-repeat right center;
  }

  .fc-brandChoiceModeChild>div.fc-selected>p.fc-screenModeChild>b {
    max-width: 1rem;
  }

  .fc-brandChoiceModeChild>div.fc-selected>p {
    color: #F51F1F;
  }

  .fc-screenChildBox {
    width: 100%;
    position: absolute;
    left: -1px;
    top: -1px;
    z-index: 3;
  }

  .fc-screenChildName {
    width: 1.6rem;
    height: .98rem;
    background: #fff;
    border-top: 1px solid #d8d8d8;
    border-left: 1px solid #d8d8d8;
    border-right: 1px solid #d8d8d8;
    border-radius: .08rem .08rem 0 0;
    padding: .08rem 0 .4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 24;
  }

  .fc-screenChildName>p {
    width: auto;
    background: url(../assets/images/arrow_screen.png) no-repeat right center;
    background-size: auto .08rem;
    padding: 0 .28rem 0 0;
    font-size: .32rem;
    line-height: .56rem;
    text-align: center;
    color: #343434;
    float: left;
    clear: none;
  }

  .fc-screenChildName>p>b {
    width: auto;
    max-width: 1rem;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    clear: left;
  }

  .fc-screenChildMain {
    width: 10rem;
    background: #fff;
    border-top: 1px solid #d8d8d8;
    border-bottom: 1px solid #d8d8d8;
    position: absolute;
    left: -.4rem;
    top: 0.96rem;
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
    margin-top: .32rem;
    border-top: 1px solid #eee;
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
