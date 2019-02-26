<template>
  <div class="ec-modularBox">
    <div class="ec-modularTitle">
      <p>新增保养记录</p>
      <!--<div class="ec-modularTitleRight">-->
      <!--&lt;!&ndash;<a @click="submit">保存</a>&ndash;&gt;-->
      <!--</div>-->
    </div>
    <!-- 保养记录 -->
    <div class="ec-maintainRecord ec-maintainRecordNew">
      <!-- 保养记录图片 -->
      <div class="ec-maintainRecordPic">
        <ul>
          <li class="ec-picNew" @click="phoImage(entityStore,0)" v-if="isAliPays">
            <span></span>
            <p>当前里程</p>
          </li>
          <div class="ec-picNew" id="divUploadPicRar" v-else style="width: 1.8rem;
            height: auto;
            border: 1px solid #e8e8e8;
            margin: 0 .4rem .32rem 0;
            position: relative;
            float: left;
            padding: .2rem 0;
            clear: none;"></div>
          <li class="ec-picNew MaintenancdivUploadPicRar" @click="phoImage(entityStore,1)" id="MaintenanceSite">
            <span></span>
            <p>保养现场</p>
          </li>
        </ul>
        <ul>
          <li v-show="entityStore.length>0" v-for="(item,index) in entityStore" :key="index">
            <span @click="showCarImg(entityStore,$event,index,0)">
              <img :src="item.imageUrl">
            </span>
            <p>{{item.imageType==0?'当前里程':'保养现场'}}</p>
            <a @click="deleteImg(index,entityStore)" style="display: block"></a>
          </li>
        </ul>
      </div>
      <!-- 语音留言 -->
      <div class="ec-voiceBox" v-show="canVoiceMessage">
        <p style="width: 2rem">语音备注：</p>
        <div class="ec-voiceNew">
          <span @click="pinAuro()">点一下</span>
          <span class="ec-voiceOne" :class="{'ec-selected':items.selected}" v-if="audioResult.length>0" v-for="(items,index) in audioResult" :key="index"
            @click="pauseVoice(items,index)">{{items.time +'”'}}
            <a @click="clearAudio(audioResult,index)">×</a>
            <audio :id="'audioTag' + index" :src="items.url" style="display: none;"></audio>
          </span>
          <span class="ec-voiceTextBox" v-for="(items,index) in audioResult" :key="index" v-show="items.selected" v-if="false">
            <textarea :style="{color:items.textStatus ==2?'#e74c3c':''}" :disabled="items.textStatus==2" v-model="items.text"></textarea>
          </span>
        </div>
      </div>
      <div class="em-maintainRecordButton">
        <a @click="submit" v-if="checkPick">保存</a>
        <a class="disable" v-else>保存</a>
      </div>
    </div>
    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>
  import photowipe from '../components/photoswipe';
  import { Indicator } from 'mint-ui';
  import { Toast } from "mint-ui";
  import { commonMixin } from '../config/base/commonMixin.js';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainRecordCreator",
    mixins: [commonMixin],
    props: ['vinCode'],
    computed: {
      checkPick: function () {
        var obj = false;
        var a = false; //当前里程显示
        var b = false; //保养现场显示
        if (this.entityStore.length > 0) {
          for (var i = 0; i < this.entityStore.length; i++) {
            if (this.entityStore[i].imageType == 0) {
              a = true;
            }
            if (this.entityStore[i].imageType == 1) {
              b = true;
            }
          }
          if (true == true && b == true) {
            obj = true
          }
        } else {
          obj = false;
        }

        return obj
      }
    },
    data() {
      return {
        // checkPick:false, //检验图片存在
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
        isAliPays:this.isAliPay()?true:false
      }
    },
    components: {
      photowipe
    },
    mounted() {
      //InitMaintainRecordCreator
      var _this = this;
      this.InitMaintainRecordCreator();
      this.GetMaintainRecordDraft();
      if (_this.isAliPay()) {
        this.GetPolicy();
      }
      this.GetPolicy();

    },
    methods: {
      WebUploader(data) {
        var _this = this;
        if (WebUploader) {
          _this.host = data.host;
          _this.fileKey = data.fileKey;
          _this.gbguid = data.gbguid
          _this.uploader = WebUploader.create({
            pick: {
              id: '#divUploadPicRar',
              // label: '当前里程',
              innerHTML: '当前里程'
            },
            formData: {
              'Filename': '${filename}',
              'key': data.fileKey + data.gbguid + '${filename}',
              'policy': data.policy,
              'OSSAccessKeyId': data.accessid,
              'success_action_status': '200', //让服务端返回200,不然，默认会返回204
              'signature': data.signature
            },
            auto: true,
            //chunked: true,
            //chunkSize: 5 * 1024 * 1024,
            //chunkRetry:5,
            // swf: resourcePath + '/js/uploader.swf',
            server: data.host,
            fileNumLimit: 10,
            threads: 1,
            accept: {
              title: 'jpg',
              extensions: 'jpg,png,gif,jpeg'
            },
            disableGlobalDnd: true,
            fileSingleSizeLimit: 10 * 1024 * 1024,
            compress: false,
            // compress: {
            //
            //   // 图片质量，只有type为`image/jpeg`的时候才有效。
            //   quality: 90,
            //
            //   // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            //   allowMagnify: false,
            //
            //   // 是否允许裁剪。
            //   crop: false,
            //
            //   // 是否保留头部meta信息。
            //   preserveHeaders: true,
            //
            //   // 如果发现压缩后文件大小比原来还大，则使用原来图片
            //   // 此属性可能会影响图片自动纠正功能
            //   noCompressIfLarger: false,
            //
            //   // 单位字节，如果图片大小小于此值，不会采用压缩。
            //   compressSize: 0
            // }
          });

          //错误
          _this.uploader.on('error', function (type) {
            alert('上传失败')
            if (type == 'Q_TYPE_DENIED')
              Toast('请选择正确的图片')
            else if (type == 'Q_EXCEED_SIZE_LIMIT' || type == 'F_EXCEED_SIZE')
              Toast('文件最大不能超过10MB')
            else
              Toast('选择文件出错！' + type)
          });
          _this.uploader.on('uploadStart', function () {
            alert('开始上传')
            Indicator.open({
              spinnerType: 'fading-circle'
            });
          })
          //上传进度
          _this.uploader.on('uploadProgress', function (file, percentage) {
            alert('上传中...')
          });

          //上传成功
          _this.uploader.on('uploadSuccess', function (file, res) {
            alert('上传成功')
            var fullImgUrl = _this.host + "/" + _this.fileKey + _this.gbguid + file.name;
            var obj = {
              imageUrl: fullImgUrl,
              imageType: 0
            }
            var ishave = false; //默认没有当前里程
            if (_this.entityStore.length == 0) {
              _this.entityStore.push(obj);
              ishave = true;
            } else {
              for (var i = 0; i < _this.entityStore.length; i++) {
                if (_this.entityStore[i].imageType == 0) {
                  _this.entityStore[i].imageUrl = fullImgUrl;
                  ishave = true;
                  break
                } else {
                  ishave = false;
                }
              }
            }
            if (ishave == false) {
              _this.entityStore.push(obj);
            }
            Indicator.close();
            _this.uploader.reset();
          });
        }
      },

      MaintenanceWebUploader(data) {
        var _this = this;
        if (WebUploader) {
          _this.host = data.host;
          _this.fileKey = data.fileKey;
          _this.gbguid = data.gbguid
          _this.Maintenanceuploader = WebUploader.create({
            pick: {
              id: '.MaintenancdivUploadPicRar',
              // label: '保养现场',
              innerHTML: '保养现场'
            },
            formData: {
              'Filename': '${filename}',
              'key': data.fileKey + data.gbguid + '${filename}',
              'policy': data.policy,
              'OSSAccessKeyId': data.accessid,
              'success_action_status': '200', //让服务端返回200,不然，默认会返回204
              'signature': data.signature
            },
            auto: true,
            //chunked: true,
            //chunkSize: 5 * 1024 * 1024,
            //chunkRetry:5,
            // swf: resourcePath + '/js/uploader.swf',
            server: data.host,
            fileNumLimit: 10,
            threads: 1,
            accept: {
              title: 'jpg',
              extensions: 'jpg,png,gif,jpeg'
            },
            disableGlobalDnd: true,
            fileSingleSizeLimit: 10 * 1024 * 1024,
            compress: false,
            // compress: {

            //   // 图片质量，只有type为`image/jpeg`的时候才有效。
            //   quality: 90,

            //   // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            //   allowMagnify: false,

            //   // 是否允许裁剪。
            //   crop: false,

            //   // 是否保留头部meta信息。
            //   preserveHeaders: true,

            //   // 如果发现压缩后文件大小比原来还大，则使用原来图片
            //   // 此属性可能会影响图片自动纠正功能
            //   noCompressIfLarger: false,

            //   // 单位字节，如果图片大小小于此值，不会采用压缩。
            //   compressSize: 0
            // }
          });

          //错误
          _this.Maintenanceuploader.on('error', function (type) {
            if (type == 'Q_TYPE_DENIED')
              Toast('请选择正确的图片')
            else if (type == 'Q_EXCEED_SIZE_LIMIT' || type == 'F_EXCEED_SIZE')
              Toast('文件最大不能超过200MB')
            else
              Toast('选择文件出错' + type)
          });
          _this.Maintenanceuploader.on('uploadStart', function () {
            Indicator.open({
              spinnerType: 'fading-circle'
            });
          })
          //上传进度
          _this.Maintenanceuploader.on('uploadProgress', function (file, percentage) {
            // Indicator.open({
            //   spinnerType: 'fading-circle'
            // });
          });
          //上传成功
          _this.Maintenanceuploader.on('uploadSuccess', function (file, res) {
            if (_this.entityStore.length > 7) {
              Toast('最多上传8张图片');
              return;
            }
            var fullImgUrl = _this.host + "/" + _this.fileKey + _this.gbguid + file.name;
            var obj = {
              imageUrl: fullImgUrl,
              imageType: 1
            }
            _this.entityStore.push(obj);
            Indicator.close();
            _this.Maintenanceuploader.reset();
          });
        }
      },
      GetPolicy() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Upload/GetPolicy",
          dataType: "JSON",
          data: {
            ESourceTypeId: 10258
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              str.Body.gbguid = Math.round(Math.random() * 100000);
              _this.WebUploader(str.Body)
              _this.MaintenanceWebUploader(str.Body)
            } else {
              Toast(str.Header.Message)
            }
          }
        })
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
            voiceMessages: _this.audioResult
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
        if (this.$parent.isNeedFillUserInfo == 1) { //1完善
          this.$parent.$refs.perfectInformation.show();
          return;
        }
        if (list.length > 7) {
          Toast('最多上传8张图片');
          return;
        }
        // var a = "[""]"
        event.stopPropagation();
        var _this = this;
        if (type == 0) { //0当前里程
          _this.getUploadImage('All', 1, function (data, tp) {
            if (tp == 0) { //0表示低版本
              if (data.url == '') {
                return;
              }
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
              //保存草稿
              _this.SaveMaintainRecordDraft()
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
                //保存草稿
                _this.SaveMaintainRecordDraft()
              } else {
                var data = JSON.parse(data)
                if (data[0] == '') {
                  return;
                }
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
                //保存草稿
                _this.SaveMaintainRecordDraft()
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
      //点击录音
      pinAuro() {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        if (_this.audioResult.length > 3) {
          Toast('最多可录4条留言');
          return;
        }
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_VoiceRecord", "", function (response) {
            if (response.time > 0) {
              response.selected = true;
              if (_this.audioResult.length > 0) {
                for (var i = 0; i < _this.audioResult.length; i++) {
                  _this.audioResult[i].selected = false;
                }
              }
              _this.getVoiceToText(response, function (str) {
                response.text = '语音转译中...'
                _this.getSeekVoiceToText(str.Body.key, response)
              })

            }
          });
        });
      },
      //解析录音
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
      getSeekVoiceToText(key, response) {
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
                _this.audioResult.push(response);
                //保存草稿
                _this.SaveMaintainRecordDraft()

              } else {
                response.text = str.Body.text;
                setTimeout(function () {
                  _this.getSeekVoiceToText(key, response)
                }, 500)
              }
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //点击播放录音
      pauseVoice(data, index) {
        //阻止事件冒泡
        for (var i = 0; i < this.audioResult.length; i++) {
          this.audioResult[i].selected = false;
          if (index == i) {
            this.audioResult[i].selected = true;
          }
        }
        // $('audio').pause();
        event.stopPropagation();
        var _this = this;
        var audio = $("#audioTag" + index).get(0);
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
        this.SaveMaintainRecordDraft()
      },
      //提交保存新增
      submit() {
        this.$emit('savemaintainRecordenent', this.entityStore, this.audioResult)
      },
      //清空数据
      clearData() {
        this.entityStore = [];
        this.audioResult = [];
      }
    }
  }
</script>

<style scoped>
  .webuploader-pick {
    color: #ccc;
    height: 1.4rem;
    line-height: 1.44rem;
  }
</style>
