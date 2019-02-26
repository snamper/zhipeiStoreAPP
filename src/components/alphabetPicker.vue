<template>
  <div class="fc-popBox">
    <div class="fc-popMainBox fc-letterListBox">
      <a href="javascript:;" @click="close">×</a>
      <div class="fc-letterListMain">
        <dl>
          <dt>按首字母查找</dt>
          <dd>
            <a v-for="(item,index) in C_FULL" href="javascript:;" @click="select(item)" :class="{'fc-selected':item==alphabet}">{{item}}</a>
          </dd>
        </dl>
      </div>
      <div class="fc-popButton">
        <a href="javascript:;" class="fc-cancelButton" @click="close">取消</a>
        <a href="javascript:;" @click="submit">确认</a>
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
    name: "alphabetPicker", //字母选择器
    mixins: [commonMixin],
    components: {},
    props: ['input'],
    data() {
      return {
        C_FULL: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        alphabet: '', //字母
      };
    },
    created() {
      var _this = this;
      this.alphabet = this.input.alphabet;
    },
    mounted() {
      var _this = this;
    },
    destroyed: function () {
      var _this = this;
    },
    methods: {
      close() {
        this.$emit("cancel");
      },
      select(value) {
        this.alphabet = value;
      },
      submit() {
        if (this.alphabet.length == 0) {
          Toast('请选择字母');
          return;
        }
        this.$emit("confirm", {
          alphabet: this.alphabet
        });
      },
    },
  };

</script>


<style scoped>
  /*我希望收录的品牌弹层的样式*/
  .fc-popBox {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.68);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 300;
  }

  .fc-popMainBox {
    background: #fff;
    border-radius: .32rem;
    position: fixed;
    left: 50%;
    top: 50%;
  }

  .fc-popMainBox>a {
    width: 1rem;
    height: 1rem;
    font-size: .64rem;
    line-height: .8rem;
    text-align: center;
    color: #e74c3c;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 4;
  }


  .fc-popButton {
    width: 100%;
    height: auto;
    padding: .32rem 0;
    border-top: 1px solid #eee;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .fc-popButton>a {
    width: 100%;
    height: auto;
    font-size: .4rem;
    line-height: .64rem;
    text-align: center;
    color: #4A90E2;
    float: left;
    clear: none;
  }


  .fc-letterListBox {
    width: 8.4rem;
    height: 10.4rem;
    margin: -5.2rem 0 0 -4.2rem;
  }

  .fc-letterListMain {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .fc-letterListMain>dl {
    width: auto;
    padding: .64rem 0 0 .24rem;
    float: left;
    clear: none;
  }

  .fc-letterListMain>dl>dt {
    width: 100%;
    margin-bottom: .4rem;
    font-size: .64rem;
    line-height: .96rem;
    text-align: center;
    color: #666;
    float: left;
    clear: left;
  }

  .fc-letterListMain>dl>dd {
    width: 100%;
    float: left;
    clear: left;
  }

  .fc-letterListMain>dl>dd>a {
    width: 1rem;
    height: 1rem;
    margin: .16rem;
    background: #fafafa;
    font-size: .36rem;
    line-height: .92rem;
    text-align: center;
    color: #282828;
    float: left;
    clear: none;
  }

  .fc-letterListMain>dl>dd>a.fc-selected {
    background: #fffafa;
    border: 1px solid #f51f1f;
    color: #f51f1f;
  }

  .fc-letterListBox .fc-popButton>a {
    width: 50%;
  }

  .fc-letterListBox .fc-popButton>a.fc-cancelButton {
    border-right: 1px solid #e8e8e8;
    color: #999;
  }

</style>
