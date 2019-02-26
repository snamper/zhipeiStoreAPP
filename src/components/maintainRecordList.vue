<template>
  <div class="ec-historicalBox" id="modularBoxList">
    <div class="ec-historicalTitle" v-show="istitle" v-if="RecordsList.length">
      <span></span>
      <p>保养记录</p>
      <!--<p>新增保养记录</p>-->
    </div>
    <!--新保养记录-->
    <div class="ec-modularBox" v-for="(item,index) in RecordsList" :key="index" :id="item.maintainRecordId">
      <div class="ec-modularTitle">
        <p v-if="modalType==1">{{item.createTimeText}}</p>
        <p v-if="modalType==0">新增保养记录</p>
        <!-- <span>保养记录：0次</span> -->
        <div class="ec-modularTitleRight" v-if="modalType==0">
          <a @click="showMore">查看更多</a>
        </div>
        <div class="er-maintainRecordButton" v-if="item.canUpdate" v-show="!item.isEditing">
          <a @click="editMaintainRecord(item)">修改</a>
          <a @click="deleteMaintainRecord(item,index)" v-show="item.canDelete">删除</a>
        </div>
      </div>
      <div class="ec-maintainRecord ec-maintainRecordNew" style="padding-top: 0">
        <!-- 当前里程 -->
        <div class="er-maintainRecordNewMain" :class="{'er-maintainRecordSee':!item.isEditing}" style="margin-top: 0">
          <ul>
            <li class="er-amouent" v-if="item.totalAmount>0">
              <p>收款金额</p>
              <span class="er-displayTextRed"><b>{{item.paidAmountText}}</b>{{item.viewAmount.length>0 ? "（" + item.viewAmount + "）" : ""}}</span>
            </li>
            <li :class="{'er-noneData':checkImg(item,2)}" @click="phoImage(item.images,0,item)">
              <p>当前里程</p>
              <span v-if="item.mileageText=='暂无'">请输入（万公里）</span>
              <span class="er-displayText" v-else><b>{{item.mileageText}}</b>万公里</span>
            </li>
            <li :class="{'er-noneData':checkImg(item,1)}" @click="openChoiceMaintainProject(item)">
              <p>保养项目</p>
              <span class="er-displayText" v-if="item.projectNames || item.remark">{{item.projectNames}}
                <b class="er-supplementExplain" v-show="item.remark">补充说明：{{item.remark}}</b>
              </span>
              <span v-else>请选择</span>
            </li>
            <li class="er-scenePicBox" :class="{'er-noneData':checkImg(item,0)}">
              <p>保养现场图</p>
              <!-- <a href="">上传</a> -->
              <div class="er-picListBox" style="display: block;">
                <dl>
                  <dd class="er-newPic" @click="phoImage(item.images,1,item)" v-show="item.images.length<8" v-if="item.isEditing">
                    <span></span>
                    <p>保养现场</p>
                  </dd>
                  <dd v-show="item.images.length>0" v-for="(ite,ind) in item.images" :key="ind">
                    <span @click.stop="showCarImg(item.images,$event,ind,0)">
                      <img :src="ite.imageUrl">
                    </span>
                    <p>{{ite.imageType==0?'当前里程':'保养现场'}}</p>
                    <a @click.stop="deleteImg(ind,item.images)"></a>
                  </dd>
                </dl>
              </div>
            </li>
            <div class="en-paymentBox" v-if="item.viewWaitPay" v-show="qrCodeImg(item.viewWaitPay)">
              <dl>
                <dt>
                  <p>{{item.viewWaitPay.payableAmountText}}</p>
                  <span>{{item.viewWaitPay.viewAmountText}}</span>
                </dt>
                <dd>
              <span>
                <img :src="qrCodeImg(item.viewWaitPay)" @touchstart="onTouchStart()" @touchend="onTouchEnd()"
                     @touchcancel="onTouchCancel()" @touchmove="onTouchMove()">
                 <b v-show="ResetqrCodeImg">请联系商家<br>重新扫码</b>
              </span>
                  <p v-if="item.viewWaitPay.sendScore>0">本次消费支付后可得{{item.viewWaitPay.sendScore}}积分，请长按二维码支付</p>
                  <p v-else>请长按二维码支付</p>
                  <a v-if="isAliPay()">微信支付可收藏本保养记录, 建议用微信扫码支付</a>
                </dd>
              </dl>
            </div>
            <li class="er-buttonBox">
              <a @click="submit(item)"  v-if="checkPick(item)">保存</a>
              <a class="er-prohibit" v-else>保存</a>
            </li>
          </ul>
        </div>
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
  import Vue from 'vue'
  import photowipe from '../components/photoswipe';
  import digitalInpu from '../components/digitalInpu';
  import choiceMaintainProject from '../components/choiceMaintainProject'
  import {
    Toast
  } from "mint-ui";
  import {
    commonMixin
  } from '../config/base/commonMixin.js';
  import { Lazyload } from 'mint-ui';
  //获取url参数
  function getQueryString(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      var strHash = window.location.hash;

      if (strHash &&
        strHash.length > 0 &&
        strHash.indexOf("?") > -1) {
        r = strHash.substr(strHash.indexOf("?") + 1).match(reg);
      }
      if (r != null) {
        return unescape(r[2]);
      }
    }
    return null;
  }
  Vue.use(Lazyload);
  // Vue.directive('top',function(el,binding){
  //   if(binding.value == getQueryString('maintainRecordId')){
  //     // var a= $('#modularBoxcreat').offset().top
  //     // var height =$(el).offset().top
  //     // debugger;
  //     // $('html,body').animate({scrollTop: height}, 800)
  //
  //
  // // var b= $(el).offset().top
  //     // debugger;
  //     // if(a>b){
  //     //   $(window).scrollTop(a)
  //     // }else {
  //     //   $(window).scrollTop(b)
  //     // }
  //   }
  // })
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "maintainRecordList",
    mixins: [commonMixin],
    props:['modalType','vinCode'],
    components:{
      digitalInpu,
      photowipe,
      choiceMaintainProject
    },
    data() {
      return {
        ModalHelper:null,
        styleObject: {
          borderBottom:'none',
          marginBottom:'0'
        },
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
        longTouch_timeoutInstance: 0, //长按超时器
        longTouch_signal: 0, //长按信号
        cachekey: this.getQueryString('cachekey'),
        timer: null,
        ResetqrCodeImg: false,
        maintainRecordId:this.getQueryString('mainrecid')||''
      }
    },
    mounted(){
      this.ModalHelper = this.SlidingPen(); //执行滑动穿透的方法;
    },

    methods: {
      PreservationCallBack(data,supplementExplain,obj){
        obj.remark = supplementExplain;
        obj.projectNames = data.join(',');
        this.$refs.choiceMaintainProject.hide();
      },
      choiceMaintainHide(){
        this.ModalHelper.beforeClose();
      },
      openChoiceMaintainProject(data){
        if(!data.isEditing){
          return
        }
        this.ModalHelper.afterOpen();
        // this.displayText = data.projectNames;
        // this.supplementExplain = data.remark;
        this.$refs.choiceMaintainProject.show(data);
        this.$refs.choiceMaintainProject.setValue(data.projectNames,data.remark);
      },
      checkImg(data,type){
        if(type ==0){
          if(data.images.length==0 && !data.isEditing){
            return true;
          }else {
            return false;
          }
        }else if(type ==1){
          if((data.projectNames=='' && data.remark=='') && !data.isEditing){
            return true;
          }else {
            return false;
          }
        }else if(type ==2){
          if(data.mileageText =='暂无' && !data.isEditing){
            return true;
          }else {
            return false;
          }
        }

      },
      checkPick (data) {
        if (data.images.length > 0 || data.mileageText !=='暂无' || data.projectNames !=='' || data.remark !=='') {
          return true;
        }else {
          return false;
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
              _this.$emit('getMaintainScore')
            } else {
              Toast(str.Header.Message);
            }
          }
        })
      },
      qrCodeImg(data){
        var str=''
        if(this.isInAlipayMiniProgram()){
          str='';
        }else if(this.isAliPay()) {
          str = data.alipayImg
        }else if(this.isWechat()){
          str= data.weChatImg
        }else {
          str = ''
          // str = data.weChatImg;
        }
        if(str){
          // this.$emit('ReceiptAmountBill')
          this.ReceiptAmountBill();
        }
        return str;
      },
      ReceiptAmountBill(){
        var _this = this;
        var count = 0
        _this.timer = setInterval(function () {
          count++;
          if (count < 60) {
            _this.QueryReceiptAmountBill();
          } else {
            clearInterval(_this.timer)
          }

        }, 10000)
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
      submitDigital(data,obj){
        if(data == '0.00'){
          obj.mileageText = '暂无';
        }else{
          obj.mileageText = data;
        }
        obj.mileage = data;
        // if(data =='0.00'){
        //   this.MileageText = '暂无'
        // }else {
        //   this.MileageText = data + '万公里'
        // }
        // obj.mileageText = data + '万公里';
        this.$refs.digitalInpu.hide();
      },
      //获取图片
      phoImage(list, type,obj) {

        event.stopPropagation();
        var _this = this;
        if (type == 0) { //0当前里程
          if(!obj.isEditing){
            return
          }
          _this.$refs.digitalInpu.show();
          _this.$refs.digitalInpu.setValue(obj.mileage.toString(),obj);
          // _this.getUploadImage('All', 1, function (data, tp) {
          //   if (tp == 0) { //0表示低版本
          //     var obj = {
          //       imageUrl: data.url,
          //       imageType: type
          //     }
          //     var ishave = false; //默认没有当前里程
          //     if (list.length == 0) {
          //       list.push(obj);
          //       ishave = true;
          //     } else {
          //       for (var i = 0; i < list.length; i++) {
          //         if (list[i].imageType == type) {
          //           list[i].imageUrl = data.url;
          //           ishave = true;
          //           break
          //         } else {
          //           ishave = false;
          //         }
          //       }
          //     }
          //     if (ishave == false) {
          //       list.push(obj);
          //     }
          //   } else {
          //     if (_this.androidOrios() == 2) {
          //       if(data.url ==''){
          //         return;
          //       }
          //       var obj = {
          //         imageUrl: data,
          //         imageType: type
          //       }
          //       var ishave = false; //默认没有当前里程
          //       if (list.length == 0) {
          //         list.push(obj);
          //         ishave = true;
          //       } else {
          //         for (var i = 0; i < list.length; i++) {
          //           if (list[i].imageType == type) {
          //             list[i].imageUrl = data;
          //             ishave = true;
          //             break
          //           } else {
          //             ishave = false;
          //           }
          //         }
          //       }
          //       if (ishave == false) {
          //         list.push(obj);
          //       }
          //     } else {
          //       var data = JSON.parse(data)
          //       var obj = {
          //         imageUrl: data[0],
          //         imageType: type
          //       }
          //       var ishave = false; //默认没有当前里程
          //       if (list.length == 0) {
          //         list.push(obj);
          //         ishave = true;
          //       } else {
          //         for (var i = 0; i < list.length; i++) {
          //           if (list[i].imageType == type) {
          //             list[i].imageUrl = data[0];
          //             ishave = true;
          //             break
          //           } else {
          //             ishave = false;
          //           }
          //         }
          //       }
          //       if (ishave == false) {
          //         list.push(obj);
          //       }
          //     }
          //   }
          // })
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
        this.$nextTick(function () {
          if(this.maintainRecordId){
            var height =0; //要滚动的高度
            var b=0 //有新增保养记录时要减去新增保养记录的高度
            if(this.$parent.TodayList.length==0){
              b = $('#modularBoxCreat').offset().top;
              height =$('#' + this.maintainRecordId).offset().top-b;
            }else {
              var a = $('#modularBoxList').offset().top;
              height =$('#' + this.maintainRecordId).offset().top-a;
            }
            $('html,body').animate({scrollTop: height}, 800)
          }
        })

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
            src: item.imageUrl.replace(/\?x-oss-process=image\/resize,m_lfit,h_100,w_100/,'')
          });
        });
        this.$refs.photowipe.show(index, false, isImage);
      },
      //删除图片
      deleteImg(index, list) {
        list.splice(index, 1);
      },
      //点击播放录音
      // pauseVoice(data, index, b, obj) {
      //   //阻止事件冒泡
      //
      //   for (var i = 0; i < obj.voiceMessages.length; i++) {
      //     obj.voiceMessages[i].selected = false;
      //     if (b == i) {
      //       obj.voiceMessages[i].selected = true;
      //     }
      //   }
      //   // $('audio').pause();
      //   event.stopPropagation();
      //   var _this = this;
      //   var audio = $("#audioTag" + index + b).get(0);
      //   var allTime = data.time;
      //   if (audio.paused) {
      //
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
      //
      // },
      editMaintainRecord(data) {
        this.$set(data, "isEditing", true) //正在修改中
      },
      //点击录音
      // pinAuro(voiceMessages) {
      //   //阻止事件冒泡
      //   event.stopPropagation();
      //   var _this = this;
      //   if (voiceMessages.length > 3) {
      //     Toast('最多可录4条留言');
      //     return;
      //   }
      //   _this.setupWebViewJavascriptBridge(function (bridge) {
      //     bridge.callHandler("native_VoiceRecord", "", function (response) {
      //       if (response.time > 0) {
      //         if (voiceMessages.length > 0) {
      //           for (var i = 0; i < voiceMessages.length; i++) {
      //             voiceMessages[i].selected = false;
      //           }
      //         }
      //         response.selected = true;
      //
      //         _this.getVoiceToText(response, function (str) {
      //           response.text = '语音转译中...'
      //           _this.getSeekVoiceToText(str.Body.key, response, voiceMessages)
      //         })
      //
      //
      //       }
      //     });
      //   });
      // },
      // getVoiceToText(response, callback) {
      //   var _this = this;
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/Common/BeginVoiceToText",
      //     dataType: "JSON",
      //     beforeSend: function () {},
      //     complete: function () {},
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
      // getSeekVoiceToText(key, response, voiceMessages) {
      //   var _this = this;
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/Common/SeekVoiceToText",
      //     dataType: "JSON",
      //     beforeSend: function () {},
      //     complete: function () {},
      //     data: {
      //       key: key,
      //     },
      //     success: function (str) {
      //       if (str.Header.ErrorCode == 0) {
      //         if (str.Body.status == 1 || str.Body.status == 2) {
      //           response.text = str.Body.text;
      //           response.textStatus = str.Body.status;
      //           voiceMessages.push(response);
      //         } else {
      //           response.text = str.Body.text;
      //           setTimeout(function () {
      //             _this.getSeekVoiceToText(key, response, voiceMessages)
      //           }, 500)
      //         }
      //       } else {
      //         Toast(str.Header.Message)
      //       }
      //     }
      //   })
      // },
      submit(data) {
        //要保养提交的那条数据
        this.$emit('savemaintainList', data);
      },
      deleteMaintainRecord(deta, index) {
        this.$emit('deleteMaintainList', this.RecordsList, index, deta)
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
  @import url("../assets/css/maintainRecordList.css");
  @import url("../assets/css/maintainRecordNewMain.css");

</style>
