<template>
  <div class="ec-modularBox" id="modularBoxCreat">
    <div class="ec-modularTitle">
      <p>新增保养记录</p>
      <!-- <span>保养记录：0次</span> -->
      <div class="ec-modularTitleRight" v-if="modalType">
        <a @click="showMore">查看更多</a>
      </div>
      <div class="er-maintainRecordButton" style="display: none;">
        <a >修改</a>
        <a >删除</a>
      </div>
    </div>
    <!--新增保养记录-->
    <div class="ec-maintainRecord ec-maintainRecordNew">
      <!-- 当前里程 -->
      <div class="er-maintainRecordNewMain">
        <ul>
          <li @click="phoImage(entityStore,0)">
            <p>当前里程</p>
            <span v-if="!MileageText">请输入（万公里）</span>
            <span class="er-displayText" v-else><b>{{MileageText}}</b>万公里</span>
          </li>
          <li @click="openChoiceMaintainProject">
            <p>保养项目</p>
            <span class="er-displayText" v-if="displayText || supplementExplain">{{displayText}}
              <b class="er-supplementExplain" v-show="supplementExplain">补充说明：{{supplementExplain}}</b>
            </span>
            <span v-else>请选择</span>
          </li>
          <li class="er-scenePicBox">
            <p>保养现场图</p>
            <!-- <a href="">上传</a> -->
            <div class="er-picListBox">
              <dl>
                <dd class="er-newPic" @click="phoImage(entityStore,1)" v-show="entityStore.length<8">
                  <span></span>
                  <p>保养现场</p>
                </dd>
                <dd v-show="entityStore.length>0" v-for="(item,index) in entityStore" :key="index">
                  <span @click="showCarImg(entityStore,$event,index,0)">
                    <img :src="item.imageUrl">
                  </span>
                  <p>{{item.imageType==0?'当前里程':'保养现场'}}</p>
                  <a @click="deleteImg(index,entityStore)"></a>
                </dd>
              </dl>
            </div>
          </li>
          <li class="er-buttonBox">
            <a @click="submit"  v-if="checkPick">保存</a>
            <a class="er-prohibit" v-else>保存</a>

          </li>
        </ul>
      </div>
    </div>
    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
    <!--数字输入-->
    <digitalInpu ref="digitalInpu" v-on:submitDigital="submitDigital"></digitalInpu>
    <choiceMaintainProject ref="choiceMaintainProject" v-on:PreservationCallBack="PreservationCallBack" v-on:choiceMaintainHide="choiceMaintainHide"></choiceMaintainProject>
  </div>
</template>

<script>
  import photowipe from '../components/photoswipe';
  import { Indicator } from 'mint-ui';
  import { Toast } from "mint-ui";
  import { commonMixin } from '../config/base/commonMixin.js';
  import digitalInpu from '../components/digitalInpu'
  import choiceMaintainProject from '../components/choiceMaintainProject'
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainRecordCreator",
    mixins: [commonMixin],
    props: ['vinCode','modalType'],
    computed: {
      checkPick: function () {
        if (this.entityStore.length > 0 || this.MileageText !=='' ||this.displayText !=='' || this.supplementExplain !== '') {
          return true;
        }else {
          return false;
        }
      }
    },
    data() {
      return {
        // checkPick:false, //检验图片存在
        ModalHelper:null,
        uploader: null,
        entityStore: [
        ], //当前里程
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
        audioResult: [],
        time: null,
        canVoiceMessage: true,
        Mileage:'0',
        MileageText:'',
        displayText:'', //保养项目
        supplementExplain:'' //补充说明
      }
    },
    components: {
      photowipe,
      digitalInpu,
      choiceMaintainProject
    },
    mounted() {
      this.InitMaintainRecordCreator();
      this.GetMaintainRecordDraft();
      this.ModalHelper = this.SlidingPen(); //执行滑动穿透的方法;
    },
    methods: {
      PreservationCallBack(data,supplementExplain){
        this.supplementExplain = supplementExplain ||'';
        this.displayText = data.join(',') || '';
        this.SaveMaintainRecordDraft();
        this.$refs.choiceMaintainProject.hide();
      },
      choiceMaintainHide(){
        this.ModalHelper.beforeClose();
      },
      openChoiceMaintainProject(){
        this.ModalHelper.afterOpen();
        this.$refs.choiceMaintainProject.show();
        this.$refs.choiceMaintainProject.setValue(this.displayText,this.supplementExplain);

      },
      submitDigital(data){
        this.Mileage = data;
        if(data =='0.00'){
          this.MileageText = ''
        }else {
          this.MileageText = data
        }
        this.$refs.digitalInpu.hide();
        this.SaveMaintainRecordDraft()
      },

      InitMaintainRecordCreator() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/InitMaintainRecordCreator",
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.canVoiceMessage = str.Body.canVoiceMessage
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //取得保养记录草稿
      GetMaintainRecordDraft() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetMaintainRecordDraft",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.entityStore = str.Body.images || [];
              _this.audioResult = str.Body.voiceMessages || [];
              _this.displayText = str.Body.projectNames || '';
              _this.supplementExplain = str.Body.remark || ''

              if(str.Body.mileage=='0' || str.Body.mileage== null){
                _this.MileageText = ''
                _this.Mileage =0;
              }else{
                _this.MileageText = str.Body.mileage
                _this.Mileage =str.Body.mileage;
              }

            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //保存保養记录草稿
      SaveMaintainRecordDraft() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/SaveMaintainRecordDraft",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            images: _this.entityStore,
            voiceMessages: _this.audioResult,
            mileage:_this.Mileage,
            projectNames:_this.displayText, //保养项目
            remark:_this.supplementExplain //补充说明
          },
          success: function (str) {
            if (str.Header.ErrorCode != 0) {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //获取图片
      phoImage(list, type) {
        if (this.isAliPay()) {
          return;
        }
        if (this.$parent.searchType == 5) { //5完善信息
          this.$parent.$refs.perfectInformation.show();
          return;
        }

        // var a = "[""]"
        event.stopPropagation();
        var _this = this;
        if (type == 0) { //0当前里程
          _this.$refs.digitalInpu.show();
          _this.$refs.digitalInpu.setValue(_this.Mileage);

          //保存草稿
          // _this.SaveMaintainRecordDraft()


        } else {
          if (list.length > 8) {
            Toast('最多上传8张图片');
            return;
          }
          var count = 8;
          if (list.length == 0) {
            count = 8;
          } else {
            for (var i = 0; i < list.length; i++) {
              if (list[i].imageType == type) {
                count--
              }
            }
          }
          if (count == 0) {
            Toast('保养现场图片不能超过8张')
            return;
          }
          _this.getUploadImage('All', count, function (data, tp) {
            if (tp == 0) { //0表示低版本
              var obj = {
                imageUrl: data.url,
                imageType: type
              }
              list.push(obj);
            } else {
              if (_this.androidOrios() == 2) {
                var array = data.split(',');
                for (var i = 0; i < array.length; i++) {
                  var obj = {};
                  obj.imageUrl = array[i];
                  obj.imageType = type;
                  list.push(obj);
                }
              } else {
                var array = JSON.parse(data);
                for (var i = 0; i < array.length; i++) {
                  var obj = {};
                  obj.imageUrl = array[i];
                  obj.imageType = type;
                  list.push(obj);
                }
              }
            }

            //保存草稿
            _this.SaveMaintainRecordDraft()
          })


        }

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
      //删除图片
      deleteImg(index, list) {
        list.splice(index, 1);
        this.SaveMaintainRecordDraft()
      },
      // //点击录音
      // pinAuro() {
      //   //阻止事件冒泡
      //   event.stopPropagation();
      //   var _this = this;
      //   if (_this.audioResult.length > 3) {
      //     Toast('最多可录4条留言');
      //     return;
      //   }
      //   _this.setupWebViewJavascriptBridge(function (bridge) {
      //     bridge.callHandler("native_VoiceRecord", "", function (response) {
      //       if (response.time > 0) {
      //         response.selected = true;
      //         if (_this.audioResult.length > 0) {
      //           for (var i = 0; i < _this.audioResult.length; i++) {
      //             _this.audioResult[i].selected = false;
      //           }
      //         }
      //         _this.getVoiceToText(response, function (str) {
      //           response.text = '语音转译中...'
      //           _this.getSeekVoiceToText(str.Body.key, response)
      //         })
      //
      //       }
      //     });
      //   });
      // },
      //解析录音
      // getVoiceToText(response, callback) {
      //   var _this = this;
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/Common/BeginVoiceToText",
      //     dataType: "JSON",
      //     beforeSend: function () { },
      //     complete: function () { },
      //     data: {
      //       voiceUrl: response.url,
      //     },
      //     success: function (str) {
      //       if (str.Header.ErrorCode == 0) {
      //         callback(str)
      //       } else {
      //         Toast(str.Header.Message)
      //       }
      //     }
      //   })
      // },
      // getSeekVoiceToText(key, response) {
      //   var _this = this;
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/Common/SeekVoiceToText",
      //     dataType: "JSON",
      //     beforeSend: function () { },
      //     complete: function () { },
      //     data: {
      //       key: key,
      //     },
      //     success: function (str) {
      //       if (str.Header.ErrorCode == 0) {
      //         if (str.Body.status == 1 || str.Body.status == 2) {
      //           response.text = str.Body.text;
      //           response.textStatus = str.Body.status;
      //           _this.audioResult.push(response);
      //           //保存草稿
      //           _this.SaveMaintainRecordDraft()
      //
      //         } else {
      //           response.text = str.Body.text;
      //           setTimeout(function () {
      //             _this.getSeekVoiceToText(key, response)
      //           }, 500)
      //         }
      //       } else {
      //         Toast(str.Header.Message)
      //       }
      //     }
      //   })
      // },
      //点击播放录音
      // pauseVoice(data, index) {
      //   //阻止事件冒泡
      //   for (var i = 0; i < this.audioResult.length; i++) {
      //     this.audioResult[i].selected = false;
      //     if (index == i) {
      //       this.audioResult[i].selected = true;
      //     }
      //   }
      //   // $('audio').pause();
      //   event.stopPropagation();
      //   var _this = this;
      //   var audio = $("#audioTag" + index).get(0);
      //   var allTime = data.time;
      //   if (audio.paused) {
      //     audio.play();
      //     //播放倒计时
      //     var timer = setInterval(function () {
      //       if (data.time == 0) {
      //         clearInterval(timer);
      //         data.time = allTime;
      //         audio.paused();
      //       }
      //       data.time--;
      //     }, 1000);
      //   }
      // },
      //点击清除录音
      // clearAudio(list, index) {
      //   //阻止事件冒泡
      //   event.stopPropagation();
      //   //清除已经缓存下的录音
      //   list.splice(index, 1);
      //   this.SaveMaintainRecordDraft()
      // },
      //提交保存新增
      submit() {
        if(this.Mileage=='' && this.entityStore.length==0 && this.displayText =='' &&  this.supplementExplain==''){
          Toast('保养现场、保养里程、保养项目、补充说明必填一项');
          return;
        }
        this.$emit('savemaintainRecordenent', this.entityStore, this.audioResult,this.Mileage,this.displayText, this.supplementExplain)
      },
      //清空数据
      clearData() {
        this.entityStore = [];
        this.audioResult = [];
      },
      showMore(){
        var _this = this;
        var baseUrl = window.location.protocol + "//" + window.location.host + "/maintainRecord.html?cf=1&v=" + _this.vinCode;

        window.location.href = baseUrl;
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/css/maintainRecordNewMain.css");
  .webuploader-pick {
    color: #ccc;
    height: 1.4rem;
    line-height: 1.44rem;
  }
</style>
