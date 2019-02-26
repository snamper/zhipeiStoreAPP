<template>
  <div id="maintainRecordReader">
    <div class="ec-carMaintainPage" style="padding: 0">
      <!-- 爱车保养顶部 -->
      <div class="ec-carMaintainTop ec-carMaintainTop-relative">
        <!-- 修理厂信息 -->
        <div class="ec-shopBox" v-if="depotInfo">
          <dl>
            <dt>
              <p>{{depotInfo.depotName}}</p>
              <a v-on:click="aliPayCallPhone"></a>
              <!-- <a v-if="isInAlipayMiniProgram()" v-on:click="aliPayCallPhone"></a> -->
              <!-- <a v-else :href="buildDepotMobile()"></a> -->
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
              <p>{{vinInfo.autoBrandName}} {{vinInfo.autoModelName}} {{vinInfo.autoModelSubName}}</p>
              <span>
                <b>{{vinCode}}</b>
              </span>
            </dd>
          </dl>
          <span v-if="maintainScore.validScore>0" class="ec-integralExhibition">积分：{{maintainScore.validScore}}（可抵{{maintainScore.validScore/100}}元钱），下次来本店消费可直接抵用</span>
          <!--<span v-show="index<15">加载中...</span>-->
        </div>
      </div>

      <!-- 保养周期组件 -->
      <autoMaintenance ref="autoMaintenance" style="padding: 0 .4rem;"></autoMaintenance>
      <!-- 新增保养记录 -->
      <!--<maintainRecordCreator ref="maintainRecordCreator" v-on:savemaintainRecordenent="savemaintainRecordenent" v-bind:vinCode="vinCode"></maintainRecordCreator>-->
      <!-- 保养记录组件 -->
      <maintainRecordList ref="maintainRecordList" style="padding: 0 .4rem;"></maintainRecordList>

      <!-- 底部按钮 -->
      <div class="ec-guideButton">
        <a href="javascript:;" v-on:click="favoriteGuideLoaded = true;">保存下次再看</a>
      </div>

      <!-- 底部说明文案 -->
      <div class="ec-integralExplain">注:积分可抵用范围解释权最终归本店所有</div>
    </div>
    <!-- 引导收藏 -->
    <div class="ec-guideBox" v-if="favoriteGuideLoaded">
      <div class="ec-guideMainBox2">
        <a href="javascript:;" v-on:click="favoriteGuideLoaded = false;"></a>
      </div>
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
  import maintainRecordList from '../../components/maintainRecordList2';
  import autoMaintenance from '../../components/autoMaintenance';
  // import maintainRecordCreator from '../../components/maintainRecordCreator2'
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainRecordReader2",
    mixins: [commonMixin],
    components: {
      maintainRecordList,
      autoMaintenance,
      // maintainRecordCreator
    },
    created() { },
    mounted() {
      this.init();
    },
    data() {
      return {
        vinCode: this.getQueryString('vin'),
        depotKeeperId: this.getQueryString('rdk'),
        depotInfo: null,
        vinInfo: null,
        favoriteGuideLoaded: false,
        maintainScore: {}, //保养积分
        interval_count: 0,
        interval_instance: null
      }
    },
    methods: {
      //提交保养记录
      savemaintainRecordenent(imgList, audioList) {

        //   this.$refs.perfectInformation.show();
        // } else {

        this.CreateMaintainRecord(imgList, audioList);


      },
      //新增保养记录
      CreateMaintainRecord(imgList, audioList) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/CreateMaintainRecord",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            images: imgList,
            voiceMessages: audioList
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              Toast('创建成功');
              _this.$refs.maintainRecordCreator.clearData();
              _this.getMaintainRecordList();

            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      init() {
        var _this = this;
        this.getDepotInfo();
        this.getVinInfo();
        this.getMaintainRecordList();
        this.getMaintainScore();
        var _this = this;
        _this.interval_instance = setInterval(function () {
          if (_this.interval_count < 15) {
            _this.getMaintainScore()
            _this.interval_count++
          } else {
            clearInterval(_this.time)
          }
        }, 1000)

        //启动保养周期组件
        _this.$refs.autoMaintenance.vinCode = _this.vinCode;
        _this.$refs.autoMaintenance.Start();

        //第一次启动收藏引导
        if (this.behaviorRecorder.getBehavior(this.behaviorRecorder.behaviorIndex.favoriteGuided) == 0) {
          this.favoriteGuideLoaded = true;
          this.behaviorRecorder.setBehavior(this.behaviorRecorder.behaviorIndex.favoriteGuided, 1);
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

      //取得保养积分
      getMaintainScore() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetMaintainScore",
          dataType: "JSON",
          beforeSend: function () {

          },
          complete: function () {

          },
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
            // _this.resetPaddingTop();
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
            // _this.resetPaddingTop();
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
            vinCode: _this.vinCode
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }
            if (res.Body.length > 0) {
              for (var i = 0; i < res.Body.length; i++) {
                res.Body[i].isDisable = true;
                res.Body[i].text = '';
                if (res.Body[i].voiceMessages.length > 0) {
                  for (var j = 0; j < res.Body[i].voiceMessages.length; j++) {
                    res.Body[i].voiceMessages[j].selected = false;
                  }
                }
              }
            }

            var myMaintainRecordList = res.Body;

            try {
              // 判断是否运行在小程序环境里
              my.getEnv(function (res) {
                if (res.miniprogram) {
                  my.getStorage({
                    key: 'ycf_carOwner_remark',
                    success: function (res) {
                      let remarksInformation = res.data || [];
                      for (var i = 0; i < remarksInformation.length; i++) {
                        for (var j = 0; j < myMaintainRecordList.length; j++) {
                          if (remarksInformation[i].maintainRecordId == myMaintainRecordList[j].maintainRecordId) {
                            myMaintainRecordList[j].text = remarksInformation[i].text;
                          }
                        }
                      }

                      //启动保养记录组件
                      _this.$refs.maintainRecordList.setValue(myMaintainRecordList);
                    },
                    fail: function (res) {
                      my.alert({ content: res.errorMessage });
                    }
                  });

                }
              });
            } catch (e) {
            }

            // let remarksInformation = [{ maintainRecordId: 453, text: "dsaf" }, { maintainRecordId: 445, text: "abcdefg" }];
            // for (var i = 0; i < remarksInformation.length; i++) {
            //   for (var j = 0; j < res.Body.length; j++) {
            //     if (remarksInformation[i].maintainRecordId == res.Body[j].maintainRecordId) {
            //       res.Body[j].text = remarksInformation[i].text;
            //     }
            //   }
            // }

            // _this.$refs.maintainRecordList.setValue(res.Body);

          }
        });
      },

      isInAlipayMiniProgram() {
        var _this = this;
        var result = false;
        try {
          // 判断是否运行在小程序环境里
          my.getEnv(function (res) {
            result = res.miniprogram;
          });
        } catch (e) {
        }

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
        } catch (e) {
        }
      }
    }
  }

</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/maintainRecordReader.css");
  @import url("../../assets/css/autoMaintenance.css");
  @import url("../../assets/css/maintainRecordList.css");
</style>