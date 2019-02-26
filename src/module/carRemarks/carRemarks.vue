<template>
  <div class="ek-carRemarksPage">

    <!-- 车型信息 -->
    <div class="ek-carBox">
      <div class="ek-carPic">
        <img :src="carInfo.autoBrandLogo">
      </div>
      <div class="ek-carMain">
        <p>{{carInfo.autoBrandName}} {{carInfo.autoModelName}}</p>
        <span>{{carInfo.vinCode}}</span>
      </div>
    </div>

    <!-- 车辆备注 -->
    <div class="ek-carRemarksBox">
      <ul>
        <li>
          <span>车牌号：</span>
          <input type="text" name="" v-model="carNo" placeholder="如：鲁T78890" readonly @click.stop="inputLicensePlate">
        </li>

        <li>
          <span style="width: 25%;">保险到期时间：</span>
          <input style="width: 75%" type="text" name="" v-model="strMaintenanceTime" placeholder="请选择保养到期时间"  @click.prevent="maintenanceTimeOpen" onfocus="this.blur()">
        </li>
        <li>
          <span>车主姓名：</span>
          <input type="text" name="" v-model="carUser" placeholder="请输入车主姓名">
        </li>
        <li>
          <span>联系方式：</span>
          <input type="number" name="" v-model="carMobile"  maxlength="11" placeholder="请输入车主联系方式">
        </li>
        <li>
          <span>验车时间：</span>
          <input type="text" name="" v-model="strCarTime" placeholder="请选择验车时间"  @click.prevent="startTime" onfocus="this.blur()">
        </li>
        <li>
          <span>其他：</span>
          <textarea v-model="carMemo"></textarea>
        </li>
      </ul>
    </div>
    <licensePlateInput ref="licensePlateInput" v-on:plateText="plateText" v-on:submitPlate="submitPlate"></licensePlateInput>
    <!-- 车辆备注按钮 -->
    <mt-datetime-picker
      type="date"
      ref="startPicker"
      v-model="carTiem"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
      :endDate="mindata"
      :startDate="maxDate"
    >
    </mt-datetime-picker>
    <mt-datetime-picker
      type="date"
      ref="startPickerMainten"
      v-model="maintenanceTime"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirmMainten"
      :endDate="mindata"
      :startDate="maxDate"
    >
    </mt-datetime-picker>
    <div class="ek-carRemarksButton">
      <a @click="submitCarInfo" v-if="carUser || carMobile || carNo || carMemo || strCarTime ||strMaintenanceTime">保存</a>
      <a v-else style="color: #acacac;background-color: #efefef">保存</a>
      <a @click="cancel" class="ek-carRemarksLink">取消</a>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import {Toast} from "mint-ui";
  import {commonMixin} from "../../config/base/commonMixin.js";
  import licensePlateInput from '../../components/licensePlateInput'
  import { DatetimePicker } from 'mint-ui';
  var resourceUrl = process.env.apiDomain;
  Vue.component(DatetimePicker.name, DatetimePicker);
  export default {
    name: "carRemarks",
    mixins: [commonMixin],
    components:{
      licensePlateInput
    },
    data(){
      return {
        vinCode:this.getQueryString("v"),
        carInfo:{},
        carUser:'', //车主姓名
        carMobile:'', //车主电话
        carNo:'', //车牌号
        carMemo:'', //vin码备注
        carTiem:'', //验车时间
        strCarTime:'',
        maintenanceTime:'',
        strMaintenanceTime:'',
        // carEndTiem:'' //保养到期时间
        maxDate: new Date('2002/01/01'),
        mindata: new Date(),
      }
    },
    created() {
      var _this = this;
      _this.setTitle('车辆备注');
      _this.nextYear();
    },
    mounted(){
      var _this =this;
      if(_this.strCarTime ==''){
        _this.carTiem = new Date();
      }
      if(_this.strMaintenanceTime =='') {
        _this.maintenanceTime == Date();
      }

      _this.nativeLsitenBack('native_CloseWebview');
      //获取车辆信息
      _this.getautoinfobyvin();
      //获取车辆备注信息
      _this.GetVehicleRemark();
    },
    methods:{
      nextYear(){
        var date =  new Date();
        // var y = 1900+date.getYear()
        var y = date.getFullYear() +2; //使用新方法
        var m = "0"+(date.getMonth()+1);
        var d = "0"+date.getDate();
        var time = y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
        this.mindata = new Date(time);
      },
      handleConfirm(date){
        var time = this.fmtDate(date)
        this.carTiem = time;
        this.strCarTime = time;
      },
      handleConfirmMainten(date){
        var time = this.fmtDate(date)
        this.maintenanceTime = time;
        this.strMaintenanceTime = time;
      },
      //时间格式化
      fmtDate(obj){

        var date =  new Date(obj);
        // var y = 1900+date.getYear()
        var y = date.getFullYear(); //使用新方法
        var m = "0"+(date.getMonth()+1);
        var d = "0"+date.getDate();
        return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
      },
      startTime(){
        this.$refs.startPicker.open()
      },
      maintenanceTimeOpen(){
        this.$refs.startPickerMainten.open()
      },
      //车牌输入
      inputLicensePlate(){
        this.$refs.licensePlateInput.show();
        this.$refs.licensePlateInput.setValue(this.carNo);
      },
      submitPlate(data){
        this.carNo = data;
        this.$refs.licensePlateInput.closewin();
      },
      plateText(data){
        this.carNo = data;
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
               _this.carUser = str.Body.carUser;
               _this.carMobile = str.Body.carMobile;
               _this.carNo = str.Body.carNo;
               _this.carMemo = str.Body.carMemo;

               _this.strCarTime = str.Body.checkCarDate || '';
               if(str.Body.checkCarDate){
                 _this.carTiem = str.Body.checkCarDate;
               }else {
                 _this.carTiem  = new Date();
               }
               _this.strMaintenanceTime = str.Body.insuranceDate || '';
               if(str.Body.insuranceDate){
                _this.maintenanceTime = str.Body.insuranceDate;
               }else {
                 _this.maintenanceTime = new Date();
               }
             }
           } else {
             Toast(str.Header.Message)
           }
         }
       })
      },
      //获取车辆信息
      getautoinfobyvin(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/auto/getautoinfobyvin",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode
          },
          success:function(str){
            if(str.Header.ErrorCode ==0){
              _this.carInfo = str.Body
            }else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //提交车辆信息
      submitCarInfo(){
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/SetVehicleRemark",
          dataType: "JSON",
          data: {
            carUser: _this.carUser,
            carMobile: _this.carMobile,
            carNo: _this.carNo,
            carMemo: _this.carMemo,
            vinCode: _this.vinCode,
            checkCarDate: _this.strCarTime,
            insuranceDate: _this.strMaintenanceTime
          },
          success:function(str) {
            if(str.Header.ErrorCode == 0) {
              Toast('备注成功');
              setTimeout(function(){
                _this.setupWebViewJavascriptBridge(function (bridge) {
                  bridge.callHandler('native_CloseWebview', '', function (response) {});
                });
              },2000)
            }else {
              Toast(str.Header.Message);
            }
          }
        })
      },
      //取消提交
      cancel() {
        var _this = this;
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_CloseWebview', '', function (response) {});
        });
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/carremarksstyle.css");
  @import url("../../assets/css/licensePlateInput.css");
</style>
