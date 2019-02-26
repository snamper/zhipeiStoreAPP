<template>
  <div id="maintainRecordReader">
    <div class="ec-carMaintainPage">
      <!-- 爱车保养顶部 -->
      <div class="ec-carMaintainTop">
        <!-- 修理厂信息 -->
        <div class="ec-shopBox" v-if="depotInfo">
          <dl>
            <dt>
              <p>{{depotInfo.depotName}}</p>
              <a v-if="currentEnvironment=='ios-alipay-mini' || currentEnvironment=='android-alipay-mini'" v-on:click="aliPayCallPhone"></a>
              <a v-else :href="buildDepotMobile()"></a>
            </dt>
            <dd>{{depotInfo.depotAddress}}</dd>
          </dl>
        </div>
        <!-- 车型信息 -->
        <div class="ec-carInfoBox" v-if="vinInfo">
          <dl>
            <dt>
              <img :src="vinInfo.autoBrandLogo">
            </dt>
            <dd>
              <p>{{vinInfo.autoBrandName}} {{vinInfo.autoModelName}}</p>
              <span>
                <b>{{vinCode}}</b>
                <b class="eq-licensePlate">{{carNo}}</b>
              </span>
              <div class="eq-timeBox">
                <span class="eq-vehicleInspection" v-show="insuranceDate">保险到期日：<b>{{insuranceDate}}</b></span>
                <span v-show="carTiem">验车日：<b>{{carTiem}}</b></span>
              </div>
            </dd>
          </dl>
          <span v-if="maintainScore.validScore>0" class="ec-integralExhibition">积分：{{maintainScore.validScore}}（可抵{{maintainScore.validScore/100}}元钱），来本店消费可直接抵用</span>
          <!--<span v-show="index<15">加载中...</span>-->
        </div>
      </div>

      <!-- 保养周期组件 -->
      <autoMaintenance ref="autoMaintenance"></autoMaintenance>
      <!-- 新增保养记录 -->
      <!--<maintainRecordCreator ref="maintainRecordCreator" v-on:savemaintainRecordenent="savemaintainRecordenent" v-bind:vinCode="vinCode"></maintainRecordCreator>-->
      <!-- 保养记录组件 -->
      <maintainRecordList ref="maintainRecordList" v-bind:modalType="1" v-on:getMaintainScore="getMaintainScore"></maintainRecordList>

      <!--二维码-->
      <!--<div class="ec-modularBox" v-show="isWaitPay" v-if="waitPay">-->

      <div class="ec-modularBox" v-show="isWaitPay" v-if="false">
        <!-- 保养记录 -->
        <div class="ec-maintainRecord">
          <!-- 支付情况 -->
          <div class="en-paymentBox">
            <dl>
              <dt>
                <p>{{waitPay.payableAmountText}}</p>
                <span>{{waitPay.viewAmountText}}</span>
              </dt>
              <dd>
                <span>
                  <!--qrCodeImg-->
                  <!--https://tse1.mm.bing.net/th?id=OIP.VMEYyTVLJYWFyr5it2EzywHaHa&pid=Api&w=1024&h=1024&rs=1&p=0-->
                  <img :src="qrCodeImg" @touchstart="onTouchStart()" @touchend="onTouchEnd()" @touchcancel="onTouchCancel()" @touchmove="onTouchMove()">
                  <b v-show="ResetqrCodeImg">请联系商家<br>重新扫码</b>
                </span>
                <p v-if="waitPay.sendScore>0">本次消费支付后可得{{waitPay.sendScore}}积分，请长按二维码支付</p>
                <p v-else>请长按二维码支付</p>
                <a v-if="currentEnvironment=='alipay'">微信支付可收藏本保养记录, 建议用微信扫码支付</a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="ec-guideButton" v-if="currentEnvironment=='ios-alipay-mini' || currentEnvironment=='android-alipay-mini' || currentEnvironment=='wechat'" v-show="isWaitPay">
        <a href="javascript:;" v-on:click="favoriteGuideLoaded = true;">保存下次再看</a>
      </div>

      <!-- 底部说明文案 -->
      <div class="ec-integralExplain">注:积分可抵用范围解释权最终归本店所有</div>
    </div>

    <!-- 引导收藏 -->
    <div class="ec-guideBox" v-if="favoriteGuideLoaded && isWaitPay">
      <div v-if="currentEnvironment=='alipay'" class="ec-guideMainBox-ios">
        <a href="javascript:;" v-on:click="favoriteGuideLoaded = false;"></a>
      </div>
      <div v-if="currentEnvironment=='android-alipay-mini'" class="ec-guideMainBox-android">
        <a href="javascript:;" v-on:click="favoriteGuideLoaded = false;"></a>
      </div>
      <div v-if="currentEnvironment=='wechat'" class="ec-guideMainBox-wechat">
        <a href="javascript:;" v-on:click="favoriteGuideLoaded = false;"></a>
      </div>
      <!--<div class="ec-guideMainBox-wechat">-->
        <!--<a href="javascript:;" v-on:click="favoriteGuideLoaded = false;"></a>-->
      <!--</div>-->
    </div>

  </div>

</template>

<script>
  import {
    Toast
  } from 'mint-ui';
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  import maintainRecordList from '../../components/maintainRecordList';
  import autoMaintenance from '../../components/autoMaintenance';
  // import maintainRecordCreator from '../../components/maintainRecordCreator'
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainRecordReader",
    mixins: [commonMixin],
    components: {
      maintainRecordList,
      autoMaintenance,
      // maintainRecordCreator
    },
    created() {},
    mounted() {
      this.init();
    },
    data() {
      return {
        vinCode: this.getQueryString('vin'),
        depotKeeperId: this.getQueryString('rdk'),
        cachekey: this.getQueryString('cachekey'),
        depotInfo: null,
        vinInfo: null,
        favoriteGuideLoaded: true, //引导层默认每次都弹起
        maintainScore: {}, //保养积分
        isWaitPay: false,
        waitPay: {},
        qrCodeImg: '',
        longTouch_timeoutInstance: 0, //长按超时器
        longTouch_signal: 0, //长按信号
        ResetqrCodeImg: false,
        currentEnvironment: 'unknown', //当前运行环境 'wechat':微信 'alipay':支付宝 'ios-alipay-mini':微信端支付宝小程序 'android-alipay-mini':安卓端支付宝小程序
        timer: null,
        insuranceDate:'',
        carTiem:''
        // noRecordList:false //没有保养记录但要支付
      }
    },
    methods: {

      //取得当前运行环境
      getCurrentEnvironment() {
        if (this.isInAlipayMiniProgram()) {
          if (this.isInIos())
            return 'ios-alipay-mini';
          else
            return 'android-alipay-mini';
        } else {
          if (this.isWechat()) return 'wechat';
          if (this.isAliPay) return 'alipay';
          return 'unknown';
        }
      },

      onTouchStart() {
        var _this = this;
        _this.longTouch_signal = 0;
        this.longTouch_timeoutInstance = setTimeout(function () {
          _this.longTouch_signal = 1;
        }, 200); //这里设置定时器，定义长按200毫秒触发长按事件
      },
      onTouchEnd() {
        clearTimeout(this.longTouch_timeoutInstance); //清除定时器
        if (this.longTouch_timeoutInstance != 0 && this.longTouch_signal == 1) {
          this.MaintainRecordPaySuccess();

        }
      },
      //手释放，如果在timeout毫秒内就释放，则取消长按事件，此时可以执行处理
      onTouchCancel() {
        // 处理和onTouchEnd一样的事情
        clearTimeout(this.longTouch_timeoutInstance); //清除定时器
        if (this.longTouch_timeoutInstance != 0 && this.longTouch_signal == 1) {
          this.MaintainRecordPaySuccess();

        }
      },

      //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
      onTouchMove() {
        if (this.longTouch_signal == 1) return;
        clearTimeout(this.longTouch_timeoutInstance);
        this.longTouch_timeoutInstance = 0;
        this.longTouch_signal = 0;
      },

      //支付成功
      MaintainRecordPaySuccess() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/MaintainRecordPaySuccess",
          dataType: "JSON",
          data: {
            cacheKey: _this.cachekey
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.getMaintainScore(); //重新绑定积分
            } else {
              Toast(str.Header.Message);
            }
          }
        })
      },
      QueryReceiptAmountBill() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/QueryReceiptAmountBill",
          dataType: "JSON",
          beforeSend: function () {

          },
          complete: function () {

          },
          data: {
            SaveKey: _this.cachekey
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              if (str.Body.ReceiptStatus == -1) {
                _this.ResetqrCodeImg = true;
              }
            } else {
              Toast(str.Header.Message);
            }
          }
        })
      },
      //取得是否有待支付的保养记录
      GetWaitPayInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetWaitPayInfo",
          dataType: "JSON",
          data: {
            cacheKey: _this.cachekey
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              _this.isWaitPay = str.Body.isWaitPay;
              //测试代码
              // _this.waitPay = str.Body.waitPay;
              // // if (_this.isInAlipayMiniProgram()) {
              // //   _this.isWaitPay = false;
              // // } else
              // if (_this.isAliPay()) {
              //   _this.qrCodeImg = _this.waitPay.alipayImg
              //   if (!_this.qrCodeImg) {
              //     _this.isWaitPay = false;
              //   }
              // } else if (_this.isWechat()) {
              //   _this.qrCodeImg = _this.waitPay.weChatImg;
              //   if (!_this.qrCodeImg) {
              //     _this.isWaitPay = false;
              //   }
              // } else {
              //   _this.isWaitPay = false;
              // }
              // if (_this.qrCodeImg) {
              //   var count = 0
              //   _this.timer = setInterval(function () {
              //     count++;
              //     if (count < 60) {
              //       _this.QueryReceiptAmountBill();
              //     } else {
              //       clearInterval(_this.timer)
              //     }
              //
              //   }, 10000)
              //
              // }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      // ReceiptAmountBill(){
      //   var _this = this;
      //   var count = 0
      //   _this.timer = setInterval(function () {
      //     count++;
      //     if (count < 60) {
      //       _this.QueryReceiptAmountBill();
      //     } else {
      //       clearInterval(_this.timer)
      //     }
      //
      //   }, 10000)
      // },
      // //提交保养记录
      // savemaintainRecordenent(imgList, audioList) {

      //   //   this.$refs.perfectInformation.show();
      //   // } else {

      //   this.CreateMaintainRecord(imgList, audioList);


      // },
      // //新增保养记录
      // CreateMaintainRecord(imgList, audioList) {
      //   var _this = this;
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/MaintainRecord/CreateMaintainRecord",
      //     dataType: "JSON",
      //     data: {
      //       vinCode: _this.vinCode,
      //       images: imgList,
      //       voiceMessages: audioList
      //     },
      //     success: function (str) {
      //       if (str.Header.ErrorCode == 0) {

      //         Toast('创建成功');
      //         _this.$refs.maintainRecordCreator.clearData();
      //         _this.getMaintainRecordList();

      //       } else {
      //         Toast(str.Header.Message)
      //       }
      //     }
      //   })
      // },
      init() {
        var _this = this;
        this.currentEnvironment = this.getCurrentEnvironment();
        this.getDepotInfo();
        this.getVinInfo();
        this.getMaintainRecordList();
        this.getMaintainScore();
        this.GetWaitPayInfo()
        this.GetVehicleRemark();
        var _this = this;


        //启动保养周期组件
        _this.$refs.autoMaintenance.vinCode = _this.vinCode;
        _this.$refs.autoMaintenance.Start();

        //第一次启动收藏引导
        if (this.currentEnvironment == 'ios-alipay-mini' || this.currentEnvironment == 'android-alipay-mini' || this.currentEnvironment == 'wechat') {
          if (this.behaviorRecorder.getBehavior(this.behaviorRecorder.behaviorIndex.favoriteGuided) == 0) {
            if(this.isAliPay){
              this.favoriteGuideLoaded = false;
            }else{
              this.favoriteGuideLoaded = true;
            }

            this.behaviorRecorder.setBehavior(this.behaviorRecorder.behaviorIndex.favoriteGuided, 1);
          }
        }

        // _this.ajax({
        //   method: "POST",
        //   url: resourceUrl + "/common/GetAgentTicket",
        //   data: {
        //     agentId: _this.depotKeeperId
        //   },
        //   async: false, //这里要同步形式请求, 确保取得agentticket之后再处理其他页面请求
        //   dataType: "JSON",
        //   success: function (data) {
        //     if (data.Body) {
        //       if (res.Header.ErrorCode != 0) {
        //         Toast(res.Header.Message);
        //         return;
        //       }
        //       _this.updateQueryStringParameter(jumpUrl, "agentticket", "error")
        //     }
        //   }
        // });


      },
      //获取车辆备注信息
      GetVehicleRemark(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetVehicleRemark",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success:function(str) {
            if (str.Header.ErrorCode ==0) {
              if(str.Body){
                _this.carNo = str.Body.carNo;
                if(str.Body.checkCarDate){
                  _this.carTiem = str.Body.checkCarDate;
                }
                if(str.Body.insuranceDate){
                  _this.insuranceDate = str.Body.insuranceDate;
                }

              }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //取得保养积分
      getMaintainScore() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetMaintainScore",
          dataType: "JSON",
          data: {
            vinCode: this.vinCode
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              return;
            }
            _this.maintainScore = res.Body;

          }
        });
      },
      getDepotInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/RepairDepot/GetRepairDepotInfo",
          data: {
            repairDepotKeeperId: _this.depotKeeperId
          },
          dataType: "JSON",
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }

            _this.depotInfo = res.Body;
            _this.resetPaddingTop();
          }
        });
      },

      resetPaddingTop() {
        setTimeout(() => {
          var height = $(".ec-carMaintainTop").height();
          $(".ec-carMaintainPage").css("padding-top", height + height * 0.05)
        }, 100);
      },

      getVinInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/auto/GetAutoInfoByVin",
          data: {
            vinCode: _this.vinCode
          },
          dataType: "JSON",
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }

            _this.vinInfo = res.Body;
            _this.resetPaddingTop();
          }
        });
      },

      buildDepotMobile() {
        return "tel:" + this.depotInfo.mobile;
      },

      //获取保养记录列表
      getMaintainRecordList() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetMaintainRecordList",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            cacheKey: _this.cachekey
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }
            if (res.Body.length > 0) {
              for (var i = 0; i < res.Body.length; i++) {
                if (res.Body[i].voiceMessages.length > 0) {
                  for (var j = 0; j < res.Body[i].voiceMessages.length; j++) {
                    res.Body[i].voiceMessages[j].selected = false;
                  }
                }
              }
            }else {
              // _this.noRecordList = true;
            }
            //启动保养记录组件
            _this.$refs.maintainRecordList.setValue(res.Body);
          }
        });
      },

      isInIos() {
        var _this = this;
        var u = navigator.userAgent;
        // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        return isiOS;
      },


      isInAlipayMiniProgram() {
        var _this = this;
        var result = false;

        try {
          // 判断是否运行在小程序环境里
          my.getEnv(function (res) {
            result = res.miniprogram;
          });
        } catch (e) {}

        return result;
      },

      aliPayCallPhone() {
        var _this = this;
        try {
          // 判断是否运行在小程序环境里
          my.getEnv(function (res) {
            if (res.miniprogram) {
              my.postMessage({
                action: "callPhone",
                phone: _this.depotInfo.mobile,
              });
            }
          });
        } catch (e) {}
      },


      // //启动支付宝小程序
      // launchAlipayMiniProgram() {
      //   var _this = this;
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/MaintainRecord/GetAlipayMiniProgramLink",
      //     dataType: "JSON",
      //     data: {
      //       vinCode: _this.vinCode,
      //       repairDepotKeeperId: _this.depotKeeperId,
      //     },
      //     success: function (res) {
      //       if (res.Header.ErrorCode != 0) {
      //         Toast(res.Header.Message);
      //         return;
      //       }

      //       window.location.href = res.Body;
      //     }
      //   })
      // },


    }
  }

</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/maintainRecordReader.css");
  @import url("../../assets/css/autoMaintenance.css");
  @import url("../../assets/css/maintainRecordList.css");

</style>
