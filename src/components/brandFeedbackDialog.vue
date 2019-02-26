<template>
  <div class="fc-popBox">
    <div class="fc-popMainBox fc-hopeIncludedBox">
      <a href="javascript:;" @click="close">×</a>
      <div class="fc-hopeIncludedForm">
        <ul>
          <li>
            <p>您希望收录的品牌名称：</p>
            <span>
              <input type="" name="" v-model="brandName">
            </span>
          </li>
          <li>
            <p>联系人：</p>
            <span>
              <input type="" name="" v-model="brandContact">
            </span>
          </li>
          <li>
            <p>联系方式：</p>
            <span>
              <input type="" name="" v-model="brandTelephone">
            </span>
          </li>
        </ul>
      </div>
      <div class="fc-popButton">
        <a href="javascript:;" @click="submit">确认提交</a>
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
    name: "brandFeedbackDialog", //品牌反馈对话框
    mixins: [commonMixin],
    components: {},
    props: ['input'],
    data() {
      return {
        brandName: '', //品牌
        brandContact: '', //品牌联系人
        brandTelephone: '', //品牌联系方式
        submitting: false //提交中, 防止重复提交
      };
    },
    created() {
      var _this = this;
      this.brandName = this.input.brandName;
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
      submit() {
        var _this = this;

        if (this.submitting) return;

        if (this.brandName.trim().length <= 0) {
          Toast('请输入希望收录的品牌名称');
          return;
        }

        var feedbackContent = '我希望收录品牌 "' + this.brandName + '"';
        if (this.brandContact.length > 0) feedbackContent += ', 联系人是 ' + this.brandContact;
        if (this.brandTelephone.length > 0) feedbackContent += ', 联系方式是 ' + this.brandTelephone;

        this.submitting = true;
        this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/Feedback",
          dataType: "JSON",
          data: {
            feedType: 4, //建议及其他
            FeedContent: feedbackContent,
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message)
              return;
            }
            Toast('反馈成功，我们会尽快为您查找！');
            _this.submitting = false;
            setTimeout(function () {
              _this.$emit("commit");
            }, 2000)
          }
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

  .fc-hopeIncludedBox {
    width: 8.4rem;
    height: 9rem;
    margin: -4.5rem 0 0 -4.2rem;
  }

  .fc-hopeIncludedForm {
    width: 80%;
    margin: 0 10%;
    float: left;
    clear: left;
  }

  .fc-hopeIncludedForm>ul {
    width: 100%;
    padding-top: .48rem;
    float: left;
    clear: left;
  }

  .fc-hopeIncludedForm>ul>li {
    width: 100%;
    padding: .2rem;
    float: left;
    clear: left;
  }

  .fc-hopeIncludedForm>ul>li>p {
    width: 100%;
    margin-bottom: .2rem;
    font-size: .36rem;
    line-height: .64rem;
    text-align: left;
    color: #999;
    float: left;
    clear: left;
  }

  .fc-hopeIncludedForm>ul>li>span {
    width: 100%;
    height: 1.04rem;
    border: 1px solid #e8e8e8;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .fc-hopeIncludedForm>ul>li>span>input {
    width: 96%;
    height: .64rem;
    border: 0;
    font-size: .4rem;
    line-height: .64rem;
    text-align: left;
    color: #282828;
    float: left;
    clear: none;
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

</style>
