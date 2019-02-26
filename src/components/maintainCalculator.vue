<template>
  <div class="ec-maskBox">
    <div class="ec-calculator">
      <p class="ec-receivableGguideBox"></p>
      <button class="toggle-button" style="display: none;">
        <p v-if="changeMode">Show Advanced Mode &nbsp; &nbsp; &#9864;</p>
        <p v-else>Show Basic Mode &nbsp; &nbsp; &#9862;</p>
      </button>
      <a @click="close">×</a>
      <div class="textBox">总金额
        <a @click="modifyQRcode">修改收款码</a>
      </div>
      <div class="ec-results">
        <span>
          <b class="ec-calculatedAmount ec-placeholder" v-if="current.length==0">先用1元试试</b>
          <b class="ec-calculatedAmount" v-if="current.length>0">{{current}}</b>
          <b class="ec-integralDeduction">{{isUseScore ? "-" + validScore / 100 : ""}}</b>
        </span>
        <a @click="submit()">确认</a>
      </div>
      <div class="ec-usingIntegralBox">
        <p>积分：<b>{{buildScoreText()}}</b></p>
        <span v-if="validScore>0" :class="[isUseScore?'ec-selected':'ec-prohibit']" v-on:click="switchUseScore">使用积分</span>
        <div class="ec-openIntegralPop" v-if="showScoreHelpTip">
          <span></span>
          <p>扫码收款后，<b>车主手机里自动生成积分</b>，下次到店消费时可抵用，<b>提高</b>客户再次到您店消费<b>回店率</b>。
            <a href="javascript:;" v-on:click="showScoreHelpTip = false;">关闭</a>
          </p>
        </div>
      </div>
      <div class="mode" v-if="changeMode">
        <button class="button buttonEliminate" @click="press">删除</button>
        <button class="button buttonEliminate" @click="press">清空</button>
        <button class="button" @click="press">÷</button>
        <button class="button" @click="press">7</button>
        <button class="button" @click="press">8</button>
        <button class="button" @click="press">9</button>
        <button class="button" @click="press">×</button>
        <button class="button" @click="press">4</button>
        <button class="button" @click="press($event)">5</button>
        <button class="button" @click="press">6</button>
        <!-- <button class="button" @click="press">(</button> -->
        <!-- <button class="button" @click="press">)</button> -->
        <button class="button" @click="press">-</button>
        <button class="button" @click="press">1</button>
        <button class="button" @click="press">2</button>
        <button class="button" @click="press">3</button>
        <button class="button" @click="press">+</button>
        <!-- <button class="button" @click="press">x ²</button> -->
        <!-- <button class="button" @click="press">±</button> -->
        <button class="button" @click="press">0</button>
        <button class="button" @click="press">.</button>
        <!-- <button class="button" @click="press">%</button> -->
        <button class="button equal-sign" @click="press">=</button>
      </div>
      <div class="mode" v-else>
        <button class="button" @click="press">&#60;=</button>
        <button class="button" @click="press">C</button>
        <button class="button" @click="press">sin</button>
        <button class="button" @click="press">cos</button>
        <button class="button" @click="press">tan</button>
        <button class="button" @click="press">x^</button>

        <button class="button" @click="press">log</button>
        <button class="button" @click="press">ln</button>
        <button class="button" @click="press">e</button>
        <button class="button" @click="press">∘</button>
        <button class="button" @click="press">rad</button>
        <button class="button" @click="press">√</button>
        <button class="button" @click="press">7</button>
        <button class="button" @click="press">8 </button>
        <button class="button" @click="press">9</button>
        <button class="button" @click="press">/</button>
        <button class="button" @click="press">x ²</button>
        <button class="button" @click="press">x !</button>
        <button class="button" @click="press">4</button>
        <button class="button" @click="press">5</button>
        <button class="button" @click="press">6</button>
        <button class="button" @click="press">*</button>
        <button class="button" @click="press">(</button>
        <button class="button" @click="press">)</button>
        <button class="button" @click="press">1</button>
        <button class="button" @click="press">2</button>
        <button class="button" @click="press">3</button>
        <button class="button" @click="press">-</button>
        <button class="button" @click="press">%</button>
        <button class="button" @click="press">±</button>
        <button class="button" @click="press">0</button>
        <button class="button" @click="press">.</button>
        <button class="button" @click="press">&#x003C0;</button>
        <button class="button" @click="press">+</button>
        <button class="button equal-sign" @click="press">=</button>
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
    name: "maintainCalculator",
    mixins: [commonMixin],
    props: ['vinCode'],
    data() {
      return {
        current: '',
        changeMode: true,
        validScore: 0, //有效积分
        showScoreHelpTip: false, //展示积分帮助提示
        showScoreOpenSuccessToast: false, //展示积分开启提示
        isUseScore: false, //是否使用积分
      }
    },
    created() {
      var _this = this;
      //取得保养积分
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/MaintainRecord/GetMaintainScore",
        dataType: "JSON",
        data: {
          vinCode: this.vinCode
        },
        success: function (res) {
          if (res.Header.ErrorCode != 0) {
            Toast(res.Header.Message);
            return;
          }
          _this.validScore = res.Body.validScore;

          var currentCount = _this.behaviorRecorder.getBehavior(_this.behaviorRecorder.behaviorIndex.scoreOpenGuideCount);
          if (currentCount < 3) {
            //只提供3次提醒 两秒后开启提示
            setTimeout(() => {
              _this.showScoreHelpTip = true;
              //行为次数加1
              _this.behaviorRecorder.setBehavior(_this.behaviorRecorder.behaviorIndex.scoreOpenGuideCount, currentCount + 1);
            }, 2000);
          }
        }
      });
    },
    mounted() {},
    methods: {
      press: function press(event) {
        var me = this;
        var key = event.target.textContent;

        if (key != '=' && key != '清空' && key != '×' && key != '÷' && key != '√' && key != "x ²" && key != "%" && key != "删除" && key != "±" && key !=
          "sin" && key != "cos" && key != "tan" && key != "log" && key != "ln" && key != "x^" && key != "x !" && key != "π" && key != "e" && key !=
          "rad" && key != "∘") {
          me.current += key;
        } else if (key === '=') {

          if (me.current.indexOf('^') > -1) {
            var base = me.current.slice(0, me.current.indexOf('^'));
            var exponent = me.current.slice(me.current.indexOf('^') + 1);
            me.current = eval('Math.pow(' + base + ',' + exponent + ')');
          } else {
            if (me.current.indexOf('×') > -1) {
              me.current = me.current.split('×');
              me.current = me.current.join('*');
            }
            if (me.current.indexOf('÷') > -1) {
              me.current = me.current.split('÷');
              me.current = me.current.join('/');
            }
            try {
              me.current = eval(me.current).toFixed(2);
              if (me.current == undefined) {
                me.current = '';
              }
            } catch (err) {
              Toast('请输入正常金额');
            }
          }
        } else if (key === '清空') {

          me.current = '';
        } else if (key === '×') {

          me.current += '×';
        } else if (key === '÷') {

          me.current += '÷';
        } else if (key === '+') {

          me.current += '+';
        } else if (key === '-') {

          me.current += '-';
        } else if (key === '±') {

          if (me.current.charAt(0) === '-') {
            me.current = me.current.slice(1);
          } else {
            me.current = '-' + me.current;
          }
        } else if (key === '删除') {

          me.current = me.current.substring(0, me.current.length - 1);
        } else if (key === '%') {

          me.current = me.current / 100;
        } else if (key === 'π') {

          me.current = me.current * Math.PI;
        } else if (key === 'x ²') {

          me.current = eval(me.current * me.current);
        } else if (key === '√') {

          me.current = Math.sqrt(me.current);
        } else if (key === 'sin') {

          me.current = Math.sin(me.current);
        } else if (key === 'cos') {

          me.current = Math.cos(me.current);
        } else if (key === 'tan') {

          me.current = Math.tan(me.current);
        } else if (key === 'log') {

          me.current = Math.log10(me.current);
        } else if (key === 'ln') {

          me.current = Math.log(me.current);
        } else if (key === 'x^') {

          me.current += '^';
        } else if (key === 'x !') {

          var number = 1;
          if (me.current === 0) {
            me.current = '1';
          } else if (me.current < 0) {
            me.current = NaN;
          } else {
            var _number = 1;
            for (var i = me.current; i > 0; i--) {
              _number *= i;
            }
            me.current = _number;
          }
        } else if (key === 'e') {

          me.current = Math.exp(me.current);
        } else if (key === 'rad') {

          me.current = me.current * (Math.PI / 180);
        } else if (key === '∘') {

          me.current = me.current * (180 / Math.PI);
        }
      },
      // changeModeEvent: function changeModeEvent() {
      //   var me = this;
      //   me.changeMode = !me.changeMode;
      // },
      modifyQRcode(){
        this.$emit('modifyQRcodes',this.current)
      },
      close() {
        this.current = '';
        this.$emit('close');
      },
      submit() {
        var _this = this;


        var doSubmit = function () {

          //返回值
          var output = {
            totalAmount: 0.00, //总金额, 确保返回的是包含小数点后两位的数字
            payableAmount: 0.00, //待支付金额, 确保返回的是包含小数点后两位的数字
            spendScore: 0, //使用积分
          }

          output.totalAmount = eval(_this.current).toFixed(2); //总金额

          if (_this.isUseScore) {
            //使用积分
            var scoreAmout = _this.validScore / 100; //可用积分金额
            console.log(scoreAmout);
            if (output.totalAmount >= scoreAmout) {
              //总金额 大于等于 可用积分金额
              output.payableAmount = Number(output.totalAmount - scoreAmout).toFixed(2);
              output.spendScore = _this.validScore;
            } else {
              //总金额 大于等于 可用积分金额
              output.payableAmount = Number(0).toFixed(2);
              output.spendScore = output.totalAmount * 100;
            }
          } else {
            //不使用积分
            output.payableAmount = output.totalAmount;
            output.spendScore = 0;
          }

          //抛出事件
          console.log(output);
          _this.$emit('submit', output);
        }


        //执行提交,触发事件
        if (typeof _this.current == 'number') {
          doSubmit();
        } else {
          if (_this.current.trim() == '') {
            Toast('请输入金额');
            return;
          }
          if (_this.current.indexOf('×') > -1) {
            _this.current = _this.current.split('×');
            _this.current = _this.current.join('*');
          }
          if (_this.current.indexOf('÷') > -1) {
            _this.current = _this.current.split('÷');
            _this.current = _this.current.join('/');
          }
          try {
            doSubmit();
          } catch (err) {
            Toast('请输入正常金额');
            return;
          }
        }


      },

      //构造积分文案
      buildScoreText() {
        return this.validScore + "（可抵" + this.validScore / 100 + "元）";
      },

      //切换使用积分
      switchUseScore() {
        this.isUseScore = !this.isUseScore;
      },
      setValue(data){
        this.current = data;
      }

    }
  }

</script>

<style scoped>
  @import url("../assets/css/maintainCalculator.css");

</style>
