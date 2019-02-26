<template>
  <div class="ec-maintainRecordPage" style="padding-top: 2.56rem;">
    <!-- 扫码结果 车型信息 -->
    <div class="ec-scavengingResultTopBox" @click="hidePlate">
      <!-- 车型信息 -->
      <div class="ec-carInfoBox">
        <dl>
          <dt>
            <img :src="carinfoDate.autoBrandLogo">
          </dt>
          <dd>
            <p>{{carinfoDate.autoBrandName}} {{carinfoDate.autoModelName}}</p>
            <span v-on:click="seeVinDetail()">
              <b>{{carinfoDate.vinCode}}</b>
              <a v-if="isShowView">收起</a>
              <a v-if="!isShowView">车型详情</a>
            </span>
            <span class="em-licensePlateBox em-licensePlateInput" @click.stop="inputLicensePlate">
              <input type="text" name="" placeholder="请输入车牌号" readonly v-model="plate">
            </span>
          </dd>
        </dl>
      </div>
    </div>
    <!-- 配件更换周期 -->
    <autoMaintenance ref="autoMaintenance"></autoMaintenance>

    <!-- 新增保养记录 -->
    <maintainRecordCreator ref="maintainRecordCreator" v-on:savemaintainRecordenent="savemaintainRecordenent" v-bind:vinCode="vinCode" v-if="TodayList.length==0" v-bind:modalType="false"></maintainRecordCreator>

    <!-- 扫码收款入口 -->
    <div class="ec-receivablesButton" style="top:8.12rem">
      <a @click="launchMaintainPayDialog(0)"></a>
    </div>

    <!--保养记录-->
    <maintainRecordList ref="maintainRecordList" v-on:savemaintainList="savemaintainList" v-on:deleteMaintainList="deleteMaintainList" v-bind:modalType="1" ></maintainRecordList>
    <!-- 保养记录举例 -->
    <div class="ec-modularBox" v-if="!isShowRepairDepotHasMaintain">
      <div class="ec-modularTitle">
        <p>保养记录</p>
      </div>
      <div class="ec-maintainRecord ec-maintainRecordNew">
        <!-- 当前里程 -->
        <div class="er-maintainRecordNewMain er-maintainRecordSee">
          <ul>
            <!--<li>-->
              <!--<p>收款金额</p>-->
              <!--<span class="er-displayTextRed"><b>￥200.00</b>总金额：￥300.00，积分抵100.00元</span>-->
            <!--</li>-->
            <li>
              <p>当前里程</p>
              <span class="er-displayText"><b>1.68</b>万公里</span>
            </li>
            <li>
              <p>保养项目</p>
              <span class="er-displayText">机油+机油滤，空气滤，空调滤，前刹车片
                <b class="er-supplementExplain">补充说明：当前车型后刹车片也挺薄的，建议下次保养时一并更换掉</b>
              </span>
            </li>
            <li class="er-scenePicBox">
              <p>保养现场图</p>
              <!-- <a href="">上传</a> -->
              <div class="er-picListBox">
                <dl>
                  <dd v-for="(a,b) in imgLists" :key="b">
                    <span @click.stop="showCarImg(imgLists,$event,b,0)">
                      <img :src="a.imageUrl">
                    </span>
                    <p>{{a.imageType==0?'当前里程':'保养现场'}}</p>
                    <a ></a>
                  </dd>
                </dl>
              </div>
            </li>
            <li class="er-buttonBox">
              <a href="">保存</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--车型参数列表-->
    <carStateInfo ref="carStateInfo" style="top:2.5rem;"></carStateInfo>

    <maintainPayDialog v-if="maintainPayDialog_launched" v-bind:input="maintainPayDialog_input" v-on:finished="on_maintainPayDialog_finished"
      v-on:quit="on_maintainPayDialog_quit"></maintainPayDialog>

    <!--完善信息-->
    <perfectInformation ref="perfectInformation" v-on:CallBack="CallBack"></perfectInformation>
    <!--<div class="ec-guideBox" v-if="popPanment">-->
    <!--<div class="ec-guideMainBox">-->
    <!--<a @click="popPanment=false"></a>-->
    <!--</div>-->
    <!--</div>-->
    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
    <licensePlateInput ref="licensePlateInput" v-on:plateText="plateText" v-on:submitPlate="submitPlate"></licensePlateInput>

  </div>
</template>

<script>
  import {
    Toast
  } from "mint-ui";
  import {
    commonMixin
  } from "../../config/base/commonMixin.js";
  import {
    MessageBox
  } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import photowipe from '../../components/photoswipe.vue';
  import carStateInfo from "../../components/carStateInfo";
  import maintainRecordCreator from '../../components/maintainRecordCreator'
  import maintainRecordList from '../../components/maintainRecordList'
  import autoMaintenance from '../../components/autoMaintenance'
  import maintainPayDialog from '../../components/maintainPayDialog'
  import perfectInformation from '../../components/perfectInformation'
  import licensePlateInput from '../../components/licensePlateInput'
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainRecord",
    mixins: [commonMixin],
    components: {
      photowipe,
      carStateInfo,
      maintainRecordCreator,
      maintainRecordList,
      autoMaintenance,
      maintainPayDialog,
      perfectInformation,
      licensePlateInput
    },
    created(){
      //当天的保养信息
      this.GetTodayMaintain();
    },
    mounted() {
      var _this = this;
      _this.nativeLsitenBack();
      _this.setTitle('保养记录');
      _this.ModalHelper = _this.SlidingPen(); //执行滑动穿透的方法;

      _this.getVinData();
      //获取车型详情
      _this.getVinParamByVin();
      //获取保养记录列表
      _this.GetMaintainRecordList(1);
      _this.$refs.autoMaintenance.vinCode = _this.vinCode;
      _this.$refs.autoMaintenance.Start();
      _this.GetVehicleRemark();
      // _this.IsOnlineIncome(); //判断是否上传二维码

      //第一次启动引导收款
      //第一次着陆该页面
      // if(localStorage.getItem('payGuided')) {
      //   this.isFirstMainRecord = true;
      // }else {
      //   this.launchMaintainPayDialog(0);
      //   localStorage.setItem('payGuided',true);
      // }
      if (this.behaviorRecorder.getBehavior(this.behaviorRecorder.behaviorIndex.payGuided) == 0) {
        //第一次着陆页的时候显示收款窗口
        this.launchMaintainPayDialog(0)
        this.behaviorRecorder.setBehavior(this.behaviorRecorder.behaviorIndex.payGuided, 1);
      }else {
        this.isFirstMainRecord = true
      }
      //获取用户是否完善信息
      _this.IsVinSearchPower();

      _this.IsRepairDepotHasMaintain();
      //查询用户VIN码查询免广告权限,还可以返回国际品牌
      // _this.$nextTick(function () {
      //   var element = $(_this.maintains)
      //   if(element){
      //     debugger;
      //     var a= $('#modularBoxcreat').offset().top
      //     var height =$(element).offset().top-a;
      //     $('html,body').animate({scrollTop: height}, 800)
      //   }
      // })

    },
    data() {
      return {
        TodayList:[],
        plate: '',
        vinCode: this.getQueryString("v"),
        carinfoDate: {},
        isShowView: false,
        listData: [],
        searchType:0,
        count: 3, //初始计数
        // popPanment:false,
        maintainRecordId: '',
        isFirstMainRecord:false, //默认没有着陆过本页面
        imgLists: [{
          imageUrl: '//c1.51cjml.com/maintainrecord/pic_01.jpg',
          imageType: 1,
        },
        {
          imageUrl: '//c1.51cjml.com/maintainrecord/pic_02.jpg',
          imageType: 1,
        },
        {
          imageUrl: '//c1.51cjml.com/maintainrecord/pic_03.jpg',
          imageType: 1,
        },
        {
          imageUrl: '//c1.51cjml.com/maintainrecord/pic_04.jpg',
          imageType: 1,
          selected: false
        },
        {
          imageUrl: '//c1.51cjml.com/maintainrecord/pic_05.jpg',
          imageType: 1,
        },
        {
          imageUrl: '//c1.51cjml.com/maintainrecord/pic_06.jpg',
          imageType: 1,
        },
        {
          imageUrl: '//c1.51cjml.com/maintainrecord/pic_07.jpg',
          imageType: 1,
        },
        {
          imageUrl: '//c1.51cjml.com/maintainrecord/pic_08.jpg',
          imageType: 1,
        },
        ],
        audioList: [{
          "status": false,
          "url": "https://cjml.oss-cn-shanghai.aliyuncs.com/audioremark/audioremark_ios_1542641325319_14707.mp3",
          "time": 10,
          "selected": false,
          "text": '本次保养更换了机油机滤、前刹车片和刹车盘。后刹车片也挺薄的，建议下次保养时一并更换掉。'
        },
        {
          "status": false,
          "url": "https://cjml.oss-cn-shanghai.aliyuncs.com/audioremark/audioremark_ios_1542641731746_45186.mp3",
          "time": 15,
          "selected": false,
          "text": '刚才您扫码付款后您手机里就生成了一条本车的保养记录，您可以定期参考查看一下配件更换周期表，后期也可以电话联系我们提前预约保养。欢迎再次光临，谢谢!'
        }
        ],
        maxslideImg: [],
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
        isNeedFillUserInfo: 0, //是否可以晚上信息 0 是1 否
        maintainPayDialog_launched: false, //保养收款弹层是否启动
        maintainPayDialog_input: {}, //保养收款弹层入参
        isShowRepairDepotHasMaintain:true,
        maintains:this.getQueryString('mainrecid'),
      }
    },
    methods: {

      IsRepairDepotHasMaintain(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/IsRepairDepotHasMaintain",
          dataType: "JSON",

          success:function(str){
            if (str.Header.ErrorCode == 0) {
              _this.isShowRepairDepotHasMaintain = str.Body

            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      GetTodayMaintain(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetTodayMaintain",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success:function(str){
            if (str.Header.ErrorCode == 0) {

              _this.TodayList = str.Body.todayMaintain;

            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      GetVehicleRemark() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/UserCenter/GetVehicleRemark',
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.plate = str.Body.carNo;
              _this.$refs.licensePlateInput.setValue(_this.plate);
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      submitPlate(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/UserCenter/UpdateVehicleRemark',
          dataType: "JSON",
          data: {
            carNo: data,
            vinCode: _this.vinCode
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.GetVehicleRemark();
              _this.$refs.licensePlateInput.closewin()
              Toast('保存成功');
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      plateText(data) {
        this.plate = data;
      },
      //车牌输入
      inputLicensePlate() {
        this.$refs.licensePlateInput.show();
        this.$refs.licensePlateInput.setValue(this.plate);
      },
      hidePlate() {
        this.$refs.licensePlateInput.closewin()
      },
      CallBack() {
        window.location.reload()
      },
      pauseVoice(data, index) {

        for (var i = 0; i < this.audioList.length; i++) {
          this.audioList[i].selected = false;
          if (index == i) {
            this.audioList[i].selected = true;
          }
        }
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        var audio = $("#audio" + index).get(0);
        var allTime = data.time;
        if (audio.paused) {
          audio.play();
          //播放倒计时
          var timer = setInterval(function () {
            if (data.time == 0) {
              clearInterval(timer);
              data.time = allTime;
              audio.paused();
            }
            data.time--;
          }, 1000);
        }
      },
      IsVinSearchPower() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Order/IsVinSearchPower',
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.isNeedFillUserInfo = str.Body.isNeedFillUserInfo;
              _this.searchType = str.Body.searchType;
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //保养收费完成
      on_maintainPayDialog_finished(param) {
        var _this = this;
        this.maintainPayDialog_launched = false;

        //为了效果, 强刷2秒后取得保养列表
        Indicator.open({
          spinnerType: 'fading-circle'
        });

        setTimeout(function () {
          Indicator.close();
          _this.GetMaintainRecordList(1);
          _this.GetTodayMaintain();
          _this.IsRepairDepotHasMaintain();
        }, 2000);

      },
      //保养收费中途退出
      on_maintainPayDialog_quit(param) {
        var _this = this;
        this.maintainPayDialog_launched = false;

        if (param.maintainRecordId > 0) {
          //为了效果, 强刷2秒后取得保养列表
          Indicator.open({
            spinnerType: 'fading-circle'
          });

          setTimeout(function () {
            Indicator.close();
            _this.GetMaintainRecordList(1);
            _this.GetTodayMaintain();
            _this.IsRepairDepotHasMaintain();
          }, 2000);
        }
      },
      //提交保养记录
      savemaintainRecordenent(imgList, audioList,Mileage,displayText,supplementExplain) {
        if (this.isNeedFillUserInfo == 1) { //1代表需要完善
          this.$refs.perfectInformation.show();
        } else {

          this.CreateMaintainRecord(imgList, audioList,Mileage,displayText,supplementExplain);
        }

      },
      //更新保养记录
      savemaintainList(list) {

        this.UpdateMaintainRecord(list)
      },
      //删除单个列表
      deleteMaintainList(list, index, deta) {
        var _this = this;
        MessageBox.confirm("删除后将无法查看车型保养记录<br/>确认删除?").then(action => {
          if (action == 'confirm') {
            _this.DeleteMaintainRecord(list, index, deta)
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
      getVinData() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/auto/getautoinfobyvin',
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.carinfoDate = str.Body;
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //查看VIN码详情
      ViewVinDetail() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/ViewVinDetail",
          data: {
            vinCode: this.vinCode,
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },
      //查看VIN码车型详情
      seeVinDetail() {
        //阻止事件冒泡
        window.scrollTo(0, 0);
        event.stopPropagation();
        var _this = this;
        _this.$refs.carStateInfo.setValue(_this.vinJYData);

          if (_this.isShowView) {
            _this.isShowView = false;
            _this.$refs.carStateInfo.hide();
            _this.ModalHelper.beforeClose();

          } else {
            _this.isShowView = true;
            _this.$refs.carStateInfo.show();
            _this.ModalHelper.afterOpen();
            _this.ViewVinDetail();
          }
          $('#selectShop').toggleClass("bw-carInfoBox")
      },

      //获取精友参数
      getVinParamByVin() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/GetJYAutoByVin",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.vinJYData = str.Body[0].AutoParamList;;
            } else {
              Toast(str.Header.Message)
            }
          }
        });
      },
      //获取保养记录列表
      GetMaintainRecordList(type) {
        var _this = this;
        var myPromise = new Promise(function (resolve, reject) {
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/MaintainRecord/GetMaintainRecordList",
            dataType: "JSON",
            data: {
              vinCode: _this.vinCode
            },
            success: function (str) {
              if (str.Header.ErrorCode == 0) {
                if (str.Body.length > 0) {
                  if (type == 1) {
                    if (str.Body.length > 0) {
                      for (var i = 0; i < str.Body.length; i++) {
                        if (str.Body[i].voiceMessages.length > 0) {
                          for (var j = 0; j < str.Body[i].voiceMessages.length; j++) {
                            str.Body[i].voiceMessages[j].selected = false;
                          }
                        }
                      }
                    }
                    _this.$refs.maintainRecordList.setValue(str.Body);
                    _this.listData = str.Body;

                  } else {
                    if (str.Body.length > 0) {
                      str.Body[0].isedit = true;
                      _this.$refs.maintainRecordList.setValue(str.Body);
                    }
                  }
                }
                resolve();
              } else {
                Toast(str.Header.Message)
              }
            }
          });
        });

        return myPromise;
      },
      //新增保养记录
      CreateMaintainRecord(imgList, audioList,Mileage,displayText,supplementExplain) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/CreateMaintainRecord",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            images: imgList||[],
            voiceMessages: audioList||[],
            mileage:Mileage,
            projectNames:displayText,
            remark:supplementExplain
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              // Toast('创建成功');
              _this.$refs.maintainRecordCreator.clearData();
              // _this.IsRepairDepotHasMaintain();
              if (str.Body.needPay == true) {
                //需要支付则发起收款
                _this.launchMaintainPayDialog(str.Body.maintainRecordId);
              } else {
                //不需支付则刷新列表
                _this.GetMaintainRecordList(1);
                _this.GetTodayMaintain();
                _this.IsRepairDepotHasMaintain();
                // window.location.reload()
              }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //更新保养记录
      UpdateMaintainRecord(list) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/UpdateMaintainRecord",
          dataType: "JSON",
          data: {
            maintainRecordId: list.maintainRecordId,
            images: list.images,
            voiceMessages: list.voiceMessages,
            mileage:list.mileage,
            projectNames:list.projectNames,
            remark:list.remark
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.GetMaintainRecordList(1);
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //删除保养记录
      DeleteMaintainRecord(list, index, deta) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/DeleteMaintainRecord",
          dataType: "JSON",
          data: {
            maintainRecordId: deta.maintainRecordId
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              // _this.GetMaintainRecordList();
              list.splice(index, 1);
              Toast('删除成功');
              _this.GetTodayMaintain();
              _this.IsRepairDepotHasMaintain();

              setTimeout(function(){
                window.location.reload()
              },2000)
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },

      //启动扫码收款弹层
      launchMaintainPayDialog(maintainRecordId) {
        this.maintainPayDialog_input = {
          vinCode: this.vinCode, //VIN码
          maintainRecordId: maintainRecordId, //保养记录ID
        };
        this.maintainPayDialog_launched = true;

      },

    }
  }

</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/scavengingresultstyle.css");
  @import url("../../assets/css/maintainRecordList.css");
  @import url("../../assets/css/licensePlateInput.css");
  @import url("../../assets/css/diagnosisstyle.css");
</style>
