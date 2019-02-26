<template>
  <div class="ec-historicalBox">
    <div class="ec-historicalTitle" v-show="istitle" v-if="RecordsList.length">
      <span></span>
      <p>保养记录</p>
    </div>
    <!-- 保养记录 可编辑可删除 -->
    <div class="ec-modularBox ec-historicalRecords" v-for="(item,index) in RecordsList" :key="index">
      <div class="ec-modularTitle">
        <p>{{item.createTimeText}}</p>
        <div class="ec-modularTitleRight" v-if="item.isDisable">
          <a @click="editMaintainRecord(item)">修改</a>
          <!--<a @click="deleteMaintainRecord(item,index)" v-show="item.canDelete">删除</a>-->
        </div>
        <div class="ec-modularTitleRight" v-else>
          <a @click="submit(item)">保存</a>
        </div>
      </div>
      <!-- 保养记录 -->
      <div class="ec-maintainRecord" :class="{'ec-maintainRecordEdit':item.isEditing}">
        <!-- 保养记录价格 -->
        <div class="ec-maintainRecordPrice" :class="{'ec-maintainRecordPriceNoPic':!item.isEditing && item.images.length == 0 && item.voiceMessages.length == 0}"
          v-if="item.totalAmount>0">
          <span>收款金额：</span>
          <p><b>{{item.paidAmountText}}</b>{{item.viewAmount.length>0 ? "（" + item.viewAmount + "）" : ""}}</p>
        </div>
        <!-- 保养记录图片 -->
        <div class="ec-maintainRecordPic">
          <ul class="ec-picNewBox">
            <li class="ec-picNew" @click="phoImage(item.images,0)">
              <span></span>
              <p>当前里程</p>
            </li>
            <li class="ec-picNew" @click="phoImage(item.images,1)">
              <span></span>
              <p>保养现场</p>
            </li>
          </ul>
          <ul v-show="item.images.length>0">
            <li v-for="(ite,ind) in item.images" :key="ind">
              <span @click.stop="showCarImg(item.images,$event,ind,0)">
                <img v-lazy="ite.imageUrl">
              </span>
              <p>{{ite.imageType==0?'当前里程':'保养现场'}}</p>
              <a @click.stop="deleteImg(ind,item.images)"></a>
            </li>
          </ul>
        </div>
        <!-- 语音留言 -->
        <div class="ec-voiceBox" v-show="item.isEditing || item.voiceMessages.length>0">
          <p style="width: 2rem">语音备注：</p>
          <div class="ec-voiceMain">
            <span :class="{'ec-selected':a.selected}" v-for="(a,b) in item.voiceMessages" :key="b" @click.stop="pauseVoice(a,index,b,item)">{{a.time}}"
              <a @click.stop="clearAudio(item.voiceMessages,b)">×</a>
              <audio :id="'audioTag' + index + b" :src="a.url" style="display: none;"></audio>
            </span>
          </div>
          <div class="ec-voiceNew">
            <span @click="pinAuro(item.voiceMessages)">点一下</span>
          </div>
        </div>
        <div class="ec-voiceBox" v-show="item.text || !item.isDisable">
          <p style="width: 2rem">车主备注：</p>
          <div class="ec-voiceMain">
            <span class="ec-voiceTextBox">
              <textarea :class="{'ec-readonly':item.isDisable}" :readonly="item.isDisable" v-model="item.text"></textarea>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>
  import Vue from 'vue'
  import photowipe from '../components/photoswipe';
  import {
    Toast
  } from "mint-ui";
  import {
    commonMixin
  } from '../config/base/commonMixin.js';
  import { Lazyload } from 'mint-ui';

  Vue.use(Lazyload);
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainRecordList",
    mixins: [commonMixin],
    data() {
      return {
        istitle: true,
        RecordsList: [], //数据列表
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
      }
    },
    components: {
      photowipe
    },
    mounted() {
      var _this = this;

    },
    methods: {

      //获取图片
      phoImage(list, type) {
        if (list.length > 7) {
          Toast('最多上传8张图片');
          return;
        }
        event.stopPropagation();
        var _this = this;
        if (type == 0) { //0当前里程
          _this.getUploadImage('All', 1, function (data, tp) {
            if (tp == 0) { //0表示低版本
              var obj = {
                imageUrl: data.url,
                imageType: type
              }
              var ishave = false; //默认没有当前里程
              if (list.length == 0) {
                list.push(obj);
                ishave = true;
              } else {
                for (var i = 0; i < list.length; i++) {
                  if (list[i].imageType == type) {
                    list[i].imageUrl = data.url;
                    ishave = true;
                    break
                  } else {
                    ishave = false;
                  }
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
                  imageType: type
                }
                var ishave = false; //默认没有当前里程
                if (list.length == 0) {
                  list.push(obj);
                  ishave = true;
                } else {
                  for (var i = 0; i < list.length; i++) {
                    if (list[i].imageType == type) {
                      list[i].imageUrl = data;
                      ishave = true;
                      break
                    } else {
                      ishave = false;
                    }
                  }
                }
                if (ishave == false) {
                  list.push(obj);
                }
              } else {
                var data = JSON.parse(data)
                var obj = {
                  imageUrl: data[0],
                  imageType: type
                }
                var ishave = false; //默认没有当前里程
                if (list.length == 0) {
                  list.push(obj);
                  ishave = true;
                } else {
                  for (var i = 0; i < list.length; i++) {
                    if (list[i].imageType == type) {
                      list[i].imageUrl = data[0];
                      ishave = true;
                      break
                    } else {
                      ishave = false;
                    }
                  }
                }
                if (ishave == false) {
                  list.push(obj);
                }
              }
            }
          })
        } else {
          var count = 7;
          if (list.length == 0) {
            count = 7;
          } else {
            for (var i = 0; i < list.length; i++) {
              if (list[i].imageType == type) {
                count--
              }
            }
          }
          if (count == 0) {
            Toast('保养现场图片不能超过7张')
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
          })
        }

        /* _this.setupWebViewJavascriptBridge(function(bridge) {
           bridge.callHandler('native_UploadImage', '', function(response) {
             if(response.url){ //判断如果有值就push
               var obj={
                 imageUrl:response.url,
                 imageType:type
               }
               list.push(obj);
             }
           });
         });*/
      },
      setValue(data) {
        this.RecordsList = data;
      },
      setTitleHide() {
        this.istitle = false;
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
      },
      //点击播放录音
      pauseVoice(data, index, b, obj) {
        //阻止事件冒泡

        for (var i = 0; i < obj.voiceMessages.length; i++) {
          obj.voiceMessages[i].selected = false;
          if (b == i) {
            obj.voiceMessages[i].selected = true;
          }
        }
        // $('audio').pause();
        event.stopPropagation();
        var _this = this;
        var audio = $("#audioTag" + index + b).get(0);
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
      //点击清除录音
      clearAudio(list, index) {
        //阻止事件冒泡
        event.stopPropagation();
        //清除已经缓存下的录音
        list.splice(index, 1);

      },
      editMaintainRecord(data) {
        data.isDisable = false;
      },
      //点击录音
      pinAuro(voiceMessages) {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        if (voiceMessages.length > 3) {
          Toast('最多可录4条留言');
          return;
        }
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_VoiceRecord", "", function (response) {
            if (response.time > 0) {
              if (voiceMessages.length > 0) {
                for (var i = 0; i < voiceMessages.length; i++) {
                  voiceMessages[i].selected = false;
                }
              }
              response.selected = true;

              _this.getVoiceToText(response, function (str) {
                response.text = '语音转译中...'
                _this.getSeekVoiceToText(str.Body.key, response, voiceMessages)
              })


            }
          });
        });
      },
      getVoiceToText(response, callback) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/BeginVoiceToText",
          dataType: "JSON",
          beforeSend: function () { },
          complete: function () { },
          data: {
            voiceUrl: response.url,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              callback(str)
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      getSeekVoiceToText(key, response, voiceMessages) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeekVoiceToText",
          dataType: "JSON",
          beforeSend: function () { },
          complete: function () { },
          data: {
            key: key,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              if (str.Body.status == 1 || str.Body.status == 2) {
                response.text = str.Body.text;
                response.textStatus = str.Body.status;
                voiceMessages.push(response);
              } else {
                response.text = str.Body.text;
                setTimeout(function () {
                  _this.getSeekVoiceToText(key, response, voiceMessages)
                }, 500)
              }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      submit(data) {
        var _this = this;

        var ycf_carOwner_remark = [];
        this.RecordsList.forEach(oneRecord => {
          if (oneRecord.text) {
            ycf_carOwner_remark.push({
              maintainRecordId: oneRecord.maintainRecordId,
              text: oneRecord.text
            });
          }
        });

        try {
          // 判断是否运行在小程序环境里
          my.getEnv(function (res) {
            if (res.miniprogram) {
              my.setStorage({
                key: 'ycf_carOwner_remark',
                data: ycf_carOwner_remark,
                success: function () {
                  Toast('保存成功');
                  data.isDisable = true;
                }
              });
            }
          });
        } catch (e) {
        }
      },
      deleteMaintainRecord(deta, index) {
        this.$emit('deleteMaintainList', this.RecordsList, index, deta)
      }
    }
  }

</script>

<style scoped>
  @import url("../assets/css/maintainRecordList.css");
</style>