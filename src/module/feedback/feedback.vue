<template>
  <div class="ej-problemFeedbackPage">
    <!-- 选择问题类型 -->
    <div class="ej-questionTypeBox">
      <dl>
        <dt>选择问题类型</dt>
        <dd class="ej-questionTypeMain">
          <a @click="tabSwitch(item)" :class="{'ej-selected':item.selected}" v-for="(item,index) in dataList" :key="index"><b>{{item.name}}</b></a>
        </dd>
        <dd class="ej-questionTypeText">
          <p v-for="(item,index) in dataList" :key="index" v-show="item.selected">{{item.disc}}</p>
        </dd>
      </dl>
    </div>
    <!-- 问题反馈操作部分 -->
    <div class="ej-questionDescribeBox">
      <div class="ej-questionDescribe">
        <textarea placeholder="请详细描述您的问题（至少5个字）" v-model="value" maxlength="500"></textarea>
      </div>
      <div class="ej-questionDescribePic">
        <a class="ej-newPicButton" @click="phoImage(entityStore)" v-show="entityStore.length<5"></a>
        <span class="ej-picBox" v-show="entityStore.length>0" v-for="(item,index) in entityStore" :key="index">
          <b @click="showCarImg(entityStore,$event,index,0)">
            <img :src="item">
          </b>
          <a @click="deleteImg(index,entityStore)"></a>
        </span>
      </div>
      <div class="ej-questionDescribeVoice">
        <span @click="pinAuro()" v-show="audioResult.length<3">点击留言</span>
        <span class="ej-voiceOne" v-if="audioResult.length>0" v-for="(items,index) in audioResult" :key="index" @click="pauseVoice(items,index)">{{items.time
          +'”'}}
          <a @click="clearAudio(audioResult,index)">×</a>
          <audio :id="'audioTag' + index" :src="items.url" style="display: none;"></audio>
        </span>
      </div>
    </div>
    <!-- 问题反馈操作按钮 -->
    <div class="ej-problemFeedbackFool">
      <span :class="{'ej-selected':isSelected}" @click="isSelected = !isSelected">需紧急处理</span>
      <a @click="submit">提交反馈</a>
    </div>
    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  import {
    Toast
  } from "mint-ui";
  import {
    MessageBox
  } from 'mint-ui';
  import photowipe from '../../components/photoswipe';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "feedback",
    mixins: [commonMixin],
    components: {
      photowipe
    },
    created() {
      this.setTitle('联系我们');
    },
    mounted() {
      var _this = this;
      _this.nativeLsitenBack('native_CloseWebview');
    },
    data() {
      return {
        dataList: [{
            name: '功能使用',
            selected: false,
            type: 1,
            disc: 'APP无法正常安装、使用，出现BUG或闪退等异常情况'
          },
          {
            name: '数据问题',
            selected: false,
            type: 2,
            disc: '匹配的产品型号或数据、数量错误以及车架号解析车型错误或异常'
          },
          {
            name: '交易及订单',
            selected: false,
            type: 3,
            disc: '无法正常提交、结算订单、付款或收款异常'
          },
          {
            name: '建议及其他',
            selected: false,
            type: 4,
            disc: '欢迎您提出宝贵建议以便我们更好的改进'
          },
        ],
        value: '',
        audioResult: [], //语音列表
        isSelected: false,
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
        entityStore: [], //图片地址列表
        isfirstSubmit:false //是否是第一次提交
      }
    },
    methods: {
      //选择问题类型切换
      tabSwitch(data) {
        for (var i = 0; i < this.dataList.length; i++) {
          this.dataList[i].selected = false;
          if (this.dataList[i].type == data.type) {
            this.dataList[i].selected = true;
          }
        }
      },
      //提交反馈
      submit() {
        if(this.isfirstSubmit){
          return;
        }
        var feedType = 0;
        for (var i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i].selected == true) {
            feedType = this.dataList[i].type;
            break;
          }
        }

        if (feedType == 0) {
          Toast('请选择问题类型');
          return;
        }

        if (this.value.trim().length < 5) {
          Toast('反馈内容至少5个字');
          return;
        }
        this.isfirstSubmit = true;
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/Feedback",
          dataType: "JSON",
          data: {
            FeedContent: _this.value.trim(),
            isEmergency: _this.isSelected == true ? 1 : 0,
            images: _this.entityStore,
            voices: _this.audioResult,
            feedType: feedType
          },
          success: function (data) {
            if (data.Header.ErrorCode == 0) {
              Toast('非常感谢您的反馈');
              setTimeout(function () {
                _this.setupWebViewJavascriptBridge(function (bridge) {
                  bridge.callHandler('native_CloseWebview', '', function (response) {});
                });
              }, 2000)
            } else {
              Toast(data.Header.Message)
            }
          }
        });
      },
      //点击播放录音
      pauseVoice(data, index) {
        //阻止事件冒泡
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
      //删除录音
      clearAudio(list, index) {
        //阻止事件冒泡
        event.stopPropagation();
        //清除已经缓存下的录音
        list.splice(index, 1);

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
            src: item
          });
        });
        this.$refs.photowipe.show(index, false, isImage);
      },
      //删除图片
      deleteImg(index, list) {
        list.splice(index, 1);
      },
      //图片上传
      phoImage(list) {

        event.stopPropagation();
        var _this = this;

        var count = 5;
        if (list.length == 0) {
          count = 5;
        } else {
          for (var i = 0; i < list.length; i++) {
            count--
          }
        }
        if (count == 0) {
          Toast('图片不能超过5张')
          return;
        }
        _this.getUploadImage('All', count, function (data, tp) {
          if (tp == 0) { //0表示低版本
            list.push(data.url);
          } else {
            if (_this.androidOrios() == 2) {
              var array = data.split(',');
              for (var i = 0; i < array.length; i++) {
                list.push(array[i]);
              }
            } else {
              var array = JSON.parse(data);
              for (var i = 0; i < array.length; i++) {
                list.push(array[i]);
              }
            }
          }
        })
        // _this.setupWebViewJavascriptBridge(function(bridge) {
        //   bridge.callHandler('native_UploadImage', '', function(response) {
        //     if(response.url){ //判断如果有值就push
        //       list.push(response.url);
        //     }
        //   });
        // });
      },
      //语音上传
      pinAuro() {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        if (_this.audioResult.length > 2) {
          Toast('最多可录3条留言');
          return;
        }
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("native_VoiceRecord", "", function (response) {
            if (response.time > 0) {
              _this.audioResult.push(response);
            }
          });
        });
      }
    }
  }

</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/problemfeedbackstyle.css");

</style>
