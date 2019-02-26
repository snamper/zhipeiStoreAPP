<template>
  <div class="ec-jurisdictionPop" v-if="isShow">
    <div class="eo-currentMileagePopBox">
      <dl>
        <dt>
          <p>当前里程：</p>
          <span>
            <!--<input type="" name="" placeholder="如：1.73" v-model="Mileage">-->
            <span>
              {{current}}
              <i v-if="current.length==0">如：1.73</i>
            </span>
          </span>
          <p>万公里</p>
        </dt>
        <!-- 计算器的展示框 -->
        <dd class="eo-calculatorBox">
          <div class="eo-inputButtonBox">
            <span @click="press">7</span>
            <span @click="press">8</span>
            <span @click="press">9</span>
            <span @click="press">4</span>
            <span @click="press">5</span>
            <span @click="press">6</span>
            <span @click="press">1</span>
            <span @click="press">2</span>
            <span @click="press">3</span>
            <span @click="press">0</span>
            <span @click="press">.</span>
            <span class="eo-deleteButton" @click="press">删除</span>
          </div>
        </dd>
        <!-- 保存按钮 -->
        <dd class="eo-currentMileageBotton">
          <a @click="submit">保存</a>
        </dd>
      </dl>
      <a @click="hide()">×</a>
    </div>
  </div>
</template>

<script>
  import {
    Toast
  } from "mint-ui";
  export default {
    name: "digitalInpu",
    data() {
      return {
        isShow: false,
        current: '',
        obj: {}
      }
    },
    methods: {
      press(event) {
        var me = this;
        var key = event.target.textContent;

        if (key != "删除") {
          if (me.current.length < 10) {
            me.current += key;
          }
        } else if (key === '删除') {
          me.current = me.current.substring(0, me.current.length - 1);
        }

      },
      show() {
        this.isShow = true;
      },
      hide() {
        this.isShow = false;
      },
      setValue(data, obj) {
        if (data == "0" || data == '暂无') {
          this.current = '';
        } else {
          this.current = data;
        }
        this.obj = obj
      },
      submit() {
        var me = this;
        try {
          me.current = eval(me.current).toFixed(2);
          if (me.current == undefined) {
            me.current = '';
          }
        } catch (err) {
          Toast('请输入正常里程');
          return;
        }
        if (this.current >= 1000) {
          this.current = (this.current / 10000).toFixed(2);
        }
        this.$emit('submitDigital', this.current, this.obj)
      }
    }
  }

</script>

<style scoped>

</style>
