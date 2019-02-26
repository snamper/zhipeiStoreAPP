<template>
  <div class="maintainPayDialog">
    <!--上传收款码-->
    <div class="en-uploadPaymentCodePop" v-if="showMode==showMode_setting.UploadQrCode || showMode==showMode_setting.UploadQrCode_backward">
      <div class="en-uploadPaymentCodeBox" style="min-height: 14rem">
        <div class="en-uploadPaymentCodeMain" style="padding: .4rem">
          <p>添加收款二维码后即可进行收款</p>
          <span>请添加您的微信和支付宝收款码
            <a @click="toAddReceiptCode">如何添加收款码</a>
          </span>
          <!-- 上传收款码 -->
          <div class="en-uploadPaymentCode">
            <ul>
              <li>
                <p>支付宝收款码</p>
                <span @click="upWeixinImg(aliPayImg)">
                  <b class="en-uploadPaymentCodeNew">添加</b>
                </span>
                <span v-show="aliPayImg.length>0" v-for="(item,index) in aliPayImg" :key="index" @click="showCarImg(aliPayImg,$event,index,0)">
                  <img :src="item.imageUrl">
                </span>
                <span v-show="aliPayImg.length==0">
                  <img src="../assets/images/pic_example01.png">
                </span>
              </li>
              <li>
                <p>微信收款码</p>
                <span @click="upWeixinImg(weixinImg)">
                  <b class="en-uploadPaymentCodeNew">添加</b>
                </span>
                <span v-show="weixinImg.length>0" v-for="(item,index) in weixinImg" :key="index" @click="showCarImg(weixinImg,$event,index,0)">
                  <img :src="item.imageUrl">
                </span>
                <span v-show="weixinImg.length==0">
                  <img src="../assets/images/pic_example02.png">
                </span>
              </li>
            </ul>
          </div>
          <!-- 按钮 -->
          <div class="en-uploadPaymentCodeButton">
            <a @click="upoadToCode(weixinImg,aliPayImg)">完成</a>
          </div>
        </div>
        <a v-if="showMode==showMode_setting.UploadQrCode" @click="quit">×</a>
        <a v-if="showMode==showMode_setting.UploadQrCode_backward" @click="showMode = showMode_setting.SetAmount">×</a>
      </div>
    </div>


    <!-- 提示收款 -->
    <div class="ec-jurisdictionPop" v-if="showMode==showMode_setting.PayNotice">
      <div class="ec-authorizationPopBox">
        <div class="ec-integralOpenBox">
          <dl>
            <dt>保养记录已保存成功</dt>
            <dd class="em-successfullySaveText">扫码支付，保养记录车主也知道</dd>
            <dd class="em-successfullySaveButton">
              <a @click="payNoticeConfirm">立即收款({{payNotice_countdown_count}})</a>
            </dd>
          </dl>
        </div>
        <a @click="quit">×</a>
      </div>
    </div>



    <!-- 保养总价格 -->
    <maintainCalculator ref="maintainCalculator" v-bind:vinCode="input.vinCode" v-show="showMode==showMode_setting.SetAmount" v-on:close="on_maintainCalculator_close"
      v-on:submit="on_maintainCalculator_submit" v-on:modifyQRcodes="modifyQRcodes"></maintainCalculator>

    <!-- 支付宝支付 -->
    <div class="ec-jurisdictionPop" v-if="showMode==showMode_setting.AliPay">
      <div class="ec-paymentPopBox">
        <dl>
          <dt>微信或支付宝支付</dt>
          <dd class="ec-paymentMoney">
            <p>待收款：<b>￥{{payableAmount}}</b></p>
            <span>{{viewAmount}}</span>
          </dd>
          <dd class="ec-paymentCode">
            <img v-bind:src="linkUrl">
            <div v-show="codeInvalid" class="ec-codeInvalid">二维码已失效</div>
          </dd>
          <dd>扫码支付，保养记录也知道</dd>
        </dl>
        <a @click="quit">×</a>
      </div>
    </div>

    <!-- 支付宝授权 -->
    <div class="ec-jurisdictionPop" v-if="showMode==showMode_setting.AliAuth">
      <div class="ec-authorizationPopBox">
        <div class="ec-authorizationMain">
          <p>设置支付宝收款账号后才能进行收款</p>
          <div class="ec-authorizationMainBox">
            <ul>
              <li>如何设置收款账号：</li>
              <li>支付宝授权并同意智配平台协议之后才可进行收款</li>
            </ul>
          </div>

          <div class="ec-agreementBox">
            <span :class="{'ec-selected':authStatue}" @click="swatchAuthStatue()">同意</span>
            <a @click="openAgreement()">《智配平台服务协议》</a>
          </div>
          <div class="ec-authorizationButton">
            <a v-if="authStatue" @click="GetAliOAuthKey()">立即授权</a>
            <a v-else class="ec-disable">立即授权</a>
          </div>
        </div>
        <a @click="quit">×</a>
      </div>
    </div>

    <!-- 赠送积分 倍数赠送-->
    <div class="ec-jurisdictionPop" v-if="showMode==showMode_setting.SendScore">
      <div class="ec-authorizationPopBox ec-sendPointsPopBox">
        <div class="ec-receivablesSuccessMain">
          <dl>
            <dt class="eo-waitBox">
              <p>本次待收款：</p>
              <span>￥{{payableAmount}}</span>
            </dt>
            <dd class="eo-totalBox">{{viewAmount}}</dd>
            <dd style="display: inline-block;">
              <div class="ec-sendPointsBox">
                <ul>
                  <li class="ec-sendPointsNumber">
                    <p>
                      <b>本次消费赠送积分：</b>
                      <a @click="showMode=showMode_setting.customSendScore;sendScore='';sendScoreIndex=-1;sendScoreAmount=0">自定义赠送</a>
                    </p>
                    <span>
                      <b>送</b>
                      <b class="ec-integralNumber">{{sendScoreIndex>=0?sendScore:""}}</b>
                      <b>积分（可抵{{sendScoreAmount}}元）</b>
                    </span>
                  </li>
                  <li class="ec-sendPointsMultiple">
                    <p>选择赠送积分的倍数：</p>
                    <span>
                      <b v-for="(oneTimes,index) in sendScoreTimesSetting" :class="setSelectedState(index,oneTimes)" v-on:click="pickSendScoreTimes(index,oneTimes)">{{oneTimes.scoreNum}}</b>
                    </span>
                  </li>
                  <li class="ec-sendPointsButton">
                    <a href="javascript:;" v-on:click="submitSendScore">立即收款</a>
                  </li>
                </ul>
              </div>
            </dd>
          </dl>
        </div>
        <a @click="quit">×</a>
      </div>
    </div>

    <!--自定义积分赠送-->
    <div class="ec-jurisdictionPop" v-if="showMode == showMode_setting.customSendScore">
      <div class="ec-authorizationPopBox ec-sendPointsPopBox">
        <div class="ec-receivablesSuccessMain">
          <dl>
            <dt class="eo-waitBox">
              <p>本次待收款：</p>
              <span>￥{{payableAmount}}</span>
            </dt>
            <dd class="eo-totalBox">{{viewAmount}}</dd>
            <!-- <dd class="ec-totalPriceExplain">总金额：￥110.00，积分抵￥10.00</dd> -->
            <dd style="display: none;"><a href="">完善本次保养记录</a></dd>
            <dd style="display: inline-block;">
              <div class="ec-sendPointsBox">
                <ul>
                  <li class="ec-sendPointsNumber">
                    <p><b>本次消费赠送积分：</b><a @click="showMode=showMode_setting.SendScore;sendScore='';sendScoreAmount=0">倍数赠送</a></p>
                    <span>
                      <b>送</b>
                      <span class="ec-customInput">{{sendScore}}
                        <b v-if="sendScore==''">0 <i v-show="maxScore>0">-{{maxScore}}</i></b>
                      </span>
                      <b>积分（可抵{{sendScoreAmount}}元）</b>
                    </span>
                  </li>
                  <li class="es-customKeyboard">
                    <span @click="press">7</span>
                    <span @click="press">8</span>
                    <span @click="press">9</span>
                    <span @click="press">4</span>
                    <span @click="press">5</span>
                    <span @click="press">6</span>
                    <span @click="press">1</span>
                    <span @click="press">2</span>
                    <span @click="press">3</span>
                    <span class="es-zeroButton" @click="press">0</span>
                    <span @click="press">删除</span>
                  </li>
                  <li class="ec-sendPointsButton">
                    <a v-on:click="submitSendScore">立即收款</a>
                  </li>
                </ul>
              </div>
            </dd>
          </dl>
        </div>
        <a @click="quit">×</a>
      </div>
    </div>

    <!-- 收款成功 -->
    <div class="ec-jurisdictionPop" v-if="showMode==showMode_setting.PayResult">
      <div class="ec-authorizationPopBox ec-sendPointsPopBox">
        <div class="ec-receivablesSuccessMain">
          <dl>
            <dt>
              <p>请确认收款金额：</p>
              <span>￥{{payableAmount}}</span>
            </dt>
          </dl>
        </div>
        <a @click="finished">×</a>
      </div>
    </div>

    <!-- 更新APP -->
    <div class="ec-jurisdictionPop" v-if="showMode==showMode_setting.Update">
      <div class="ec-upgradeBox">
        <div class="ec-upgradeMain">
          <ul>
            <li class="ec-upgradeBanner">
              <img src="../assets/images/pic_upgrade1.png">
              <img src="../assets/images/pic_upgrade2.png">
            </li>
            <li class="ec-upgradeText">请至应用市场升级“智配APP”为最新版本，升级后即刻在线收款</li>
            <li class="ec-upgradeButton">
              <a @click="quit">知道了</a>
            </li>
          </ul>
        </div>
        <a @click="quit">×</a>
      </div>
    </div>
    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>
  import {
    commonMixin
  } from "../config/base/commonMixin.js";
  import {
    Toast
  } from "mint-ui";
  import photowipe from '../components/photoswipe';
  import maintainCalculator from './maintainCalculator'
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainPayDialog", //保养收款对话框
    mixins: [commonMixin],
    components: {
      maintainCalculator,
      photowipe
    },
    props: ['input'],
    data() {
      return {
        codeInvalid: false,
        authStatue: false,
        showMode: 0, //展示模式
        showMode_setting: { //展示模式枚举设置
          Empty: 0, //空
          SetAmount: 1, //设置金额，
          AliPay: 2, //支付宝支付，
          AliAuth: 3, //支付宝授权，
          PayResult: 4, //支付结果
          Update: 5, //升级
          PayNotice: 6, //收款提示
          UploadQrCode: 7, //上传二维码
          UploadQrCode_backward: 8, //上传二维码
          SendScore: 9, //赠送积分
          customSendScore:10  //自定义送积分
        },
        totalAmount: 0, //总金额
        payableAmount: 0, //付款金额
        spendScore: 0, //使用积分
        linkUrl: "", //二维码地址
        saveKey: "", //轮询Key
        viewAmount: "", //保养记录金额展示文案
        intervalInstance: function () {}, //轮询实例
        sendScoreTimesSetting: [0, 1, 5, 10, 20, 30, 40, 50, 60, 100], //赠送积分倍数设置
        sendScore: '', //赠送积分
        sendScoreAmount: 0, //赠送积分等价金额
        sendScoreIndex: -1, //赠送积分索引
        payNotice_countdown_count: 0, //支付提示的倒计时数
        maxslideImg: [], //需要查看图片的数组
        options: {
          getThumbBoundsFn(index) {
            var thumbnail = document.querySelectorAll('.action_carimg')[0];
            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            var rect = thumbnail.getBoundingClientRect();
            var ret = {
              x: rect.left + rect.width / 2,
              y: rect.top + pageYScroll + rect.height / 2,
              w: 0
            };
            return ret;
          }
        },
        aliPayImg: [],
        weixinImg: [],
        isQrCodeCompleted: false, //是否支付二维码已上传
        maxScore:0

      };
    },

    created() {
      var _this = this;
      _this.LoadComplete(function () {
        _this.nativeLsitenBack("native_CloseWebview");
      });

      _this.IsOnlineIncome();

      if (_this.input.maintainRecordId > 0) {
        _this.showMode = _this.showMode_setting.PayNotice;
        _this.payNotice_countdown_count = 3; //倒计时3秒
        _this.doPayNoticeCountdown();
      } else {
        _this.showMode = _this.showMode_setting.SetAmount;
      }

      // if (_this.getCookie('CJML.APP.Intellip.DevelopMode') == "1") {
      //   //调试用代码
      //   // _this.input.maintainRecordId = 123;
      //   // _this.showMode = _this.showMode_setting.PayNotice;
      //   // _this.payNotice_countdown_count = 3;  //倒计时3秒
      //   // _this.doPayNoticeCountdown();

      //   _this.showMode = _this.showMode_setting.SetAmount;

      //   _this.totalAmount = 5.4;
      //   _this.payableAmount = 4.9;
      //   _this.spendScore = 100;
      //   _this.pickSendScoreTimes(1);
      // }

    },
    methods: {
      press(event){
        var me = this;
        var key = event.target.textContent;
        if (key != "删除") {
          if(me.sendScore.length<5){
            me.sendScoreIndex = -1;
            me.sendScore += key;
            var baseScore = Math.trunc(Number(me.payableAmount));
            me.sendScoreAmount = (me.sendScore / 100).toFixed(2);
          }

        } else if (key === '删除') {
          me.sendScore = me.sendScore.toString()
          me.sendScore = me.sendScore.substring(0, me.sendScore.length - 1);
          me.sendScoreAmount = (me.sendScore / 100).toFixed(2);
        }

      },
      //跳转到如何添加收款码
      toAddReceiptCode(){
        var _this = this;
        var url = window.location.protocol + "//" + window.location.hostname + "/shoph5/addReceiptCode.html?cf=1"
        _this.setupWebViewJavascriptBridge(function (bridge) {bridge.callHandler("native_JumpUrl", {url: url}, function (response) {});
        });
      },
      //判断是否已晚上收款设置
      IsOnlineIncome() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/RepairDepot/IsOnlineIncome",
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.isQrCodeCompleted = str.Body;
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      modifyQRcodes(current) {
        this.current = current;
        this.GetRepairDepotOnlineIncome()
      },
      GetRepairDepotOnlineIncome() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/RepairDepot/GetRepairDepotOnlineIncome",
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              if (str.Body) {
                if (str.Body.alipayImg) {
                  _this.aliPayImg = [{
                    imageUrl: str.Body.alipayImg
                  }]

                }
                if (str.Body.weChatImg) {
                  _this.weixinImg = [{
                    imageUrl: str.Body.weChatImg
                  }]
                }

              }
              _this.showMode = _this.showMode_setting.UploadQrCode_backward;
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      upoadToCode(wx, al) {
        if (wx.length == 0) {
          Toast('请添加微信收款码');
          return;
        }
        if (al.length == 0) {
          Toast('请添加支付宝收款码');
          return;
        }
        this.SubmitRepairDepotOnlineIncome(wx, al)
      },
      //提交上传二维码
      SubmitRepairDepotOnlineIncome(wx, al) {
        var data = {}
        if (al.length > 0) {
          data.alipayImg = al[0].imageUrl
        }
        if (wx.length > 0) {
          data.weChatImg = wx[0].imageUrl
        }
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/RepairDepot/SubmitRepairDepotOnlineIncome",
          dataType: "JSON",
          data: data,
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              Toast('添加成功')
              if (_this.showMode == _this.showMode_setting.UploadQrCode_backward) {
                _this.showMode = _this.showMode_setting.SetAmount;
                _this.$refs.maintainCalculator.setValue(_this.current);
              } else {
                //验证保养收款价格
                _this.CheckReceiptAmountBill();
              }

            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },

      //上传图片
      upWeixinImg(list) {
        event.stopPropagation();
        var _this = this;
        _this.getUploadImage('Album', 1, function (data, tp) {
          if (tp == 0) { //0表示低版本
            if (tp == 0) { //0表示低版本
              if (data.url == '') {
                return;
              }
              var obj = {
                imageUrl: data.url,
              }
              var ishave = false; //默认没有当前里程
              if (list.length == 0) {
                list.push(obj);
                ishave = true;
              } else {
                for (var i = 0; i < list.length; i++) {
                  list[i].imageUrl = data.url;
                }
                ishave = true;
              }
            }
            if (ishave == false) {
              list.push(obj);
            }
          } else {
            if (_this.androidOrios() == 2) {
              if (data.url == '') {
                return;
              }
              var obj = {
                imageUrl: data,
              }
              var ishave = false; //默认没有当前里程
              if (list.length == 0) {
                list.push(obj);
                ishave = true;

              } else {
                for (var i = 0; i < list.length; i++) {
                  list[i].imageUrl = data;
                  ishave = true;
                }
              }
              if (ishave == false) {
                list.push(obj);
              }

            } else {
              var data = JSON.parse(data)
              if (data[0] == '') {
                return;
              }
              var obj = {
                imageUrl: data[0],
              }
              var ishave = false; //默认没有当前里程
              if (list.length == 0) {
                list.push(obj);
                ishave = true;
              } else {
                for (var i = 0; i < list.length; i++) {
                  list[i].imageUrl = data[0];
                  ishave = true;
                }
              }
              if (ishave == false) {
                list.push(obj);
              }
            }
          }
        })
      },
      //显示大图
      showCarImg(images, el, index, isImage) {
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(event.currentTarget).addClass("action_carimg");
        var _self = this;
        var imgInfo = images;
        // _self.maxslideImg = [];
        _self.maxslideImg.splice(0);

        $.each(imgInfo, function (i, item) {
          _self.maxslideImg.push({
            src: item.imageUrl
          });
        });
        this.$refs.photowipe.show(index, false, isImage);
      },
      openAgreement() {
        var baseUrl =
          window.location.protocol +
          "//" +
          window.location.hostname +
          "/agreement.html?cf=1";

        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_JumpUrl", {
            url: baseUrl
          }, function (
            response
          ) {});
        });
      },
      //收款完成
      finished() {
        clearInterval(this.intervalInstance);
        var output = {
          maintainRecordId: this.input.maintainRecordId
        };
        this.$emit("finished", output);
      },
      //中途退出
      quit() {
        clearInterval(this.intervalInstance);
        var output = {
          maintainRecordId: this.input.maintainRecordId
        };
        this.$emit("quit", output);
      },

      swatchAuthStatue() {
        this.authStatue = !this.authStatue;
      },

      on_maintainCalculator_close() {
        this.quit();
      },

      on_maintainCalculator_submit(model) {
        var _this = this;
        _this.totalAmount = model.totalAmount;
        _this.payableAmount = model.payableAmount;
        _this.spendScore = model.spendScore;
        if (!_this.isQrCodeCompleted) {
          _this.showMode = _this.showMode_setting.UploadQrCode;
        } else {
          //验证保养收款价格
          _this.CheckReceiptAmountBill();
        }
      },

      //验证保养收款价格
      CheckReceiptAmountBill() {
        var _this = this;
        if (_this.totalAmount == "" || _this.totalAmount <= 0) {
          Toast("请先输入保养总金额！");
          return;
        }

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/CheckReceiptAmountBill",
          dataType: "JSON",
          data: {
            receiptAmount: _this.payableAmount, //收款金额
            spendScore: _this.spendScore, //支出积分
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }
            _this.viewAmount = res.Body.ViewAmount;
            if (_this.payableAmount > 0) {
              _this.GetScoreMultiple(function(data){
                _this.sendScoreTimesSetting = data.Body.scoreMultiple;
                _this.maxScore = data.Body.maxScore;
                _this.showMode = _this.showMode_setting.SendScore;
              })

            } else {
              //无需支付场合, 直接调用SetReceiptAmountBill走后续流程
              _this.SetReceiptAmountBill();
            }

          }
        });
      },

      GetScoreMultiple(callBack){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetScoreMultiple",
          dataType: "JSON",
          data: {
            receiptAmount: _this.payableAmount, //收款金额
            vinCode: _this.input.vinCode, //VIN码
          },
          success:function(res){
            if(res.Header.ErrorCode ==0){
              callBack(res)
            }else {
              Toast(res.Header.Message)
            }
          }
        })
      },
      //设置收款价格
      SetReceiptAmountBill() {
        var _this = this;
        if (_this.totalAmount == "" || _this.totalAmount <= 0) {
          Toast("请先输入保养总金额！");
          return;
        }

        if (_this.totalAmount > 10000) {
          Toast("最大金额为10000元");
          return;
        }

        if (_this.totalAmount < 1) {
          Toast("最小金额为1元");
          return;
        }

        if (_this.input.vinCode == "") {
          Toast("交易异常!");
          return;
        }

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/SetReceiptAmountBill",
          dataType: "JSON",
          data: {
            receiptAmount: _this.payableAmount, //收款金额
            spendScore: _this.spendScore, //支出积分
            vinCode: _this.input.vinCode, //VIN码
            maintainRecordId: _this.input.maintainRecordId, //保养记录ID
            sendScore: _this.sendScore, //赠送积分
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }

            if (res.Body.PayStep == 1) {
              //等待支付
              _this.showMode = _this.showMode_setting.AliPay;
              _this.linkUrl = res.Body.LinkUrl;
              _this.saveKey = res.Body.SaveKey;
              _this.viewAmount = res.Body.ViewAmount;

              _this.intervalInstance = setInterval(() => {
                _this.QueryReceiptAmountBill();
              }, 2000);
            } else if (res.Body.PayStep == 2) {
              //支付完成
              _this.showMode = _this.showMode_setting.PayResult;
              _this.input.maintainRecordId = res.Body.MaintainRecordId;
              _this.viewAmount = res.Body.ViewAmount;
              _this.pickSendScoreTimes(1);
            } else {
              Toast("未识别的指令");
              return;
            }

          }
        });
      },

      QueryReceiptAmountBill() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/QueryReceiptAmountBill",
          dataType: "JSON",
          beforeSend: function () {},
          complete: function () {},
          data: {
            saveKey: _this.saveKey //轮询KEY
          },
          success: function (res) {
            if (res.Header.ErrorCode == 0) {
              switch (res.Body.ReceiptStatus) {
                case 0:
                case 10:
                  //付款中
                  break;
                case -1:
                  //缓存失效
                  clearInterval(_this.intervalInstance);
                  _this.codeInvalid = true;
                  break;
                case 100:
                  //付款成功
                  clearInterval(_this.intervalInstance);
                  _this.showMode = _this.showMode_setting.PayResult;
                  _this.input.maintainRecordId = res.Body.MaintainRecordId;
                  _this.pickSendScoreTimes(1);
                  break;
                default:
                  clearInterval(_this.intervalInstance);
                  _this.codeInvalid = true;
                  break;
              }
            } else {
              Toast(res.Header.Message);
              clearInterval(_this.intervalInstance);
              _this.showMode = _this.showMode_setting.Empty;
            }
          }
        });
      },
      GetAliOAuthKey() {
        var _this = this;

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetAliOAuthKey",
          dataType: "JSON",
          data: {},
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.GetPayAuthorization(str.Body.aliOAuthKey);
            } else {
              Toast(str.Header.Message);
              _this.showMode = _this.showMode_setting.Empty;
            }
          }
        });
      },

      GetPayAuthorization(credential) {
        var _this = this;
        this.setupWebViewJavascriptBridge(function (bridge) {
          var data = {
            credential: credential,
            orderId: ""
          };
          bridge.callHandler("native_PayAuthorization", data, function (response) {
            _this.CheckAliUserInfo(response);
          });
        });
      },

      CheckAliUserInfo(retJson) {
        var _this = this;

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/CheckAliUserInfo",
          dataType: "JSON",
          data: {
            retJson: retJson
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              if (str.Body == 1) {
                _this.showMode = _this.showMode_setting.SetAmount;
              }
            } else {
              Toast(str.Header.Message);
              _this.showMode = _this.showMode_setting.Empty;
            }
          }
        });
      },
      //设置选中状态
      setSelectedState(index,data){
        if(data.isEnable == true){
          if(index == this.sendScoreIndex){
            return 'ec-selected'
          }
        }else {
          return 'ec-enable'

        }
      },
      //选择赠送积分倍数
      pickSendScoreTimes(index,data) {
        if(data){
          if(data.isEnable == true){
            this.sendScoreIndex = index;
            var baseScore = Math.trunc(Number(this.payableAmount));
            if (index >= 0 && index < this.sendScoreTimesSetting.length) {
              this.sendScore = baseScore * this.sendScoreTimesSetting[index].scoreNum;
              this.sendScoreAmount = (this.sendScore / 100).toFixed(2);
            } else {
              Toast("不正确的选项");
            }
          }else {
            Toast('赠送积分超额，请选择其他倍数')
            return;
          }
        }else {
          this.sendScoreIndex = index;
          var baseScore = Math.trunc(Number(this.payableAmount));
          if (index >= 0 && index < this.sendScoreTimesSetting.length) {
            this.sendScore = baseScore * this.sendScoreTimesSetting[index].scoreNum;
            this.sendScoreAmount = (this.sendScore / 100).toFixed(2);
          } else {
            Toast("不正确的选项");
          }
        }


      },

      //确认赠送积分
      submitSendScore() {
        var _this = this;
        // if (_this.sendScoreIndex < 0) {
        //   Toast("请选择送几倍积分");
        //   return;
        // }
        try {
          _this.sendScore = eval(_this.sendScore).toFixed(0);
          _this.SetReceiptAmountBill();
        } catch (err) {
        //   Toast('请输入正常积分');
          if(_this.sendScore==''){
            _this.SetReceiptAmountBill();
          }else {
            Toast('请输入正常积分');
            return;
          }
        //   return;
        }
        //设置收款价格


      },

      //支付开始倒计时
      doPayNoticeCountdown() {
        var _this = this;

        if (_this.showMode != _this.showMode_setting.PayNotice) {
          return;
        }

        if (_this.payNotice_countdown_count <= 0) {
          _this.payNoticeConfirm();
        }

        setTimeout(() => {
          _this.payNotice_countdown_count--;
          _this.doPayNoticeCountdown();
        }, 1000);

      },

      payNoticeConfirm() {
        this.showMode = this.showMode_setting.SetAmount;
      }

    },
    destroyed: function () {
      clearInterval(this.intervalInstance);
    }
  };

</script>


<style>
  @import url("../assets/css/scavengingresultstyle.css");

</style>
