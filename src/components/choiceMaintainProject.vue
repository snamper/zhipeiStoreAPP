<template>
  <div class="eq-choicemaintainprojectPop" v-if="isShow">
  <div class="eq-choicemaintainproject" >

    <div class="er-choicemaintainprojectName">
      <p>请选择保养项目</p>
      <a @click="hide()">×</a>
    </div>
    <!-- 选择保养项目 -->
    <div class="eq-choicemaintainprojectMain" >
      <!-- 单个保养类型 -->
      <div class="er-maintenanceTypeBox" :class="addClassname(item)" v-for="(item,index) in dataList" :key="index">
        <p @click="openAndClose(item)">{{item.projectType}}</p>
        <div class="er-maintenanceMain">
          <ul>
            <li v-for="(i,ind) in item.projectName" :key="ind" :class="{'eq-selected':i.isSeleted}" @click="selectionAndCancel(i)">{{i.projectName}}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="er-foolBox bottom-menu-fixed">
      <!-- 备注 -->
      <div class="eq-remarksBox">
        <p>补充说明</p>
        <div class="er-remarksMain">
          <ul>
            <li>
              <textarea v-model="supplementExplain" maxlength="300" placeholder="请在此备注本次保养的相关信息（如：更换了前刹车片和后刹车片）"></textarea>
            </li>
            <li>
              <a @click="audioinfo"></a>
              <span>{{supplementExplain.length}}/300</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="eq-choicemaintainprojectButton">
        <a @click="submit">完成</a>
      </div>
    </div>
  </div>
  </div>

</template>

<script>
  import { Toast } from "mint-ui";
  import { commonMixin } from '../config/base/commonMixin.js';
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "choiceMaintainProject",
    mixins: [commonMixin],
    // props:['displayText','supplementExplain'],
    mounted(){
      // this.GetMaintainProject();
    },
    data(){
      return {
        isShow:false,
        dataList:[],
        objDate:{},
        displayText:'',
        supplementExplain:''
      }
    },
    methods:{
      setValue(displayText,supplementExplain){
        this.displayText = displayText;
        this.supplementExplain = supplementExplain||'';
        this.GetMaintainProject()
      },
      //开始录音识别
      audioinfo() {
        var _this = this;
        this.setupWebViewJavascriptBridge(function (bridge) {
          //url 语音文案说明图片地址
          var url = "https://c1.zhipeicloud.com/voiceexample/voiceExample.png"
          bridge.callHandler('native_VoiceRecognizer', url, function (response) {
            if(_this.supplementExplain.length<300){
              _this.supplementExplain = _this.supplementExplain + response +',';
              if(_this.supplementExplain.length>300){
                _this.supplementExplain = _this.supplementExplain.substring(0,300)
              }
            }else {
              return;
            }
          });
        });

      },
      selectionAndCancel(data){
        data.isSeleted = !data.isSeleted;
      },
      addClassname(data){
        if(data.projectType =='美容'){
          if(data.open){
            // this.$set(data,'open',false);
            return 'er-maintenanceTypeOpen'
          }else {
            // this.$set(data,'open',true);
            return 'meirongClassName'
          }

        }else{
          if(data.projectName.length<7){
            return 'er-maintenanceTypeUnfolded';
          }else {
            // if(data.open){
              return 'er-maintenanceTypeUnfolded';
            // }else {
            //   if(data.open==false){
            //     return '';
            //   }else {
            //     var a=false
            //     for(var i=0;i<data.projectName.length;i++){
            //       if(data.projectName[i].isSeleted){
            //         a= true;
            //       }
            //     }
            //     if(a){
            //       this.$set(data,'open',true);
            //       return 'er-maintenanceTypeOpen'
            //     }else {
            //       this.$set(data,'open',false);
            //       return '';
            //     }
            //   }
            //
            //
            // }
          }
        }

      },
      openAndClose(data){
        if(data.projectType =='美容'){
          if(data.open){
            this.$set(data,'open',false);
          }else {
            this.$set(data,'open',true);
          }
        }else {
          if(data.projectName.length<7){
            return;
          }else {
            if(data.open){
              this.$set(data,'open',false);
            }else {
              this.$set(data,'open',true);
            }

          }

        }
      },
      show(data){
        this.isShow = true;

        if(data){
          this.objDate = data;
        }
      },
      hide(){
        this.isShow = false;
        this.$emit('choiceMaintainHide')
      },
      submit(){
        var arr =[];
        for(var i=0;i<this.dataList.length;i++){
          if(this.dataList[i].projectName.length>0){
            for(var j=0; j<this.dataList[i].projectName.length;j++){
              if(this.dataList[i].projectName[j].isSeleted ==true){
                arr.push(this.dataList[i].projectName[j].projectName)
              }
            }
          }
        }
        this.$emit('PreservationCallBack',arr,this.supplementExplain,this.objDate);
      },
      GetMaintainProject(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/MaintainRecord/GetMaintainProject",
          dataType: "JSON",
          beforeSend:function(){},
          complete:function(){},
          data:{
            projectNames:_this.displayText
          },
          success:function(res){
            if (res.Header.ErrorCode == 0) {
              _this.dataList = res.Body;

            } else {
              Toast(res.Header.Message)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import url("../assets/css/choicemaintainprojectstyle.css");
</style>
