<template>
  <div class="ec-jurisdictionPop" v-if="isshow">
    <div class="ec-seePricePopBox">
      <div class="ec-seePriceMain">
        <p>{{title}}</p>
        <!-- 选择车型参数 -->
        <div class="ec-choiceParameter" v-show="list.length>0">
          <p>请精确筛选车型参数</p>
          <div class="ec-parameterOneBox" v-for="(item,index) in list" :key="index">
            <p>{{item.ParamTypeName}}</p>
            <span v-for="(it,ind) in item.AutoParamList" :key="ind" :class="{'ec-selected':it.Selected}" @click="SelectAutoParam(item,it)">
              <b>{{it.ParamValue}}</b>
              <a @click="showCarLogo(it.ParamImage,$event)" v-show="it.ParamImage"></a>
            </span>
          </div>

        </div>
        <!-- 配件4S店价格 -->
        <div class="ec-priceExhibition" v-show="seelist.length>0">
          <p></p>
          <dl>
            <dt>配件4S店价格</dt>
            <dd v-for="(item,index) in seelist" :key="index">
              <p>{{item.partsName}}:</p>
              <span>{{item.partsPrice}}</span>
            </dd>
          </dl>
        </div>
        <!-- 按钮 -->
        <div class="ec-seePriceButton">
          <a @click="submit">选择此配件</a>
        </div>
      </div>
      <a @click="hide()">×</a>
    </div>
    <!--查看大图-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>
  import {commonMixin} from '../config/base/commonMixin.js';
  import {Toast} from 'mint-ui';
  var resourceUrl = process.env.apiDomain;
  import photowipe from './photoswipe.vue';
  export default {
    name: "AccessoryParameters",
    mixins: [commonMixin],
    components:{
      photowipe
    },
    data(){
      return {
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
        isshow:false,
        list:[],
        seelist:[],
        maxslideImg:[],
        title:'',
        ite:{},
        vinCode: this.getQueryString("v"),
      }
    },
    methods:{
      show(){
        this.isshow = true;
      },
      hide(){
        this.isshow = false;
      },
      setValue(data,type,title){
        if(type==0){
          this.list = data;
          this.seelist=[]
        }else {
          this.seelist = data.partPrice;
          this.list = [];
        }

        this.title = title.categoryName;
        this.ite = title;
      },
      submit(){
        var alertlist = [];
        var userParam = [];

        this.list.forEach(item => {
          var isselected = false;
          item.AutoParamList.forEach(item1 => {
            if (item1.Selected) {
              isselected = true;
              userParam.push({
                pTypeId: item1.ParamTypeId,
                pValueId: item1.ParamValueId,
              });
            }
          });
          if (isselected == false) {
            alertlist.push("请选择" + item.ParamTypeName);
          }
        });
        if (alertlist.length > 0) {
          Toast({
            message: alertlist[0],
            position: "center",
            duration: 2000
          });
          return;
        }
        this.$emit("completeChooseParam", userParam,0,this.ite);

      },
      //显示大图Logo
      showCarLogo(images, el){
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(el.currentTarget).addClass("action_carimg")
        var _self = this;
        images = images.replace("?x-oss-process=image/resize,m_fill,h_96,w_96", "");
        var imgInfo = images.split('?');

        _self.maxslideImg.splice(0);
        $.each(imgInfo, function (i, item) {

          _self.maxslideImg.push({
            src: item
          });
        });
        this.$refs.photowipe.show(0);
      },
      SelectAutoParam(item,ite){
        item.AutoParamList.forEach(ele => {
          ele.Selected = false;
        });
        ite.Selected = true;
        this.SeePartsFourPrice(ite)
      },
      SeePartsFourPrice(deta){

        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/SeePartsFourPrice",
          dataType: "JSON",
          data: {
            vinCode: _this.vinCode,
            userParam:[{
              pTypeId:deta.ParamTypeId,
              pValueId:deta.ParamValueId
            }],
            categoryId: _this.ite.categoryId,
          },
          success:function(str){
            if(str.Header.ErrorCode==0){
              if(str.Body){
                _this.seelist = str.Body.partPrice;
              }
            }else {
              Toast(str.Header.Message)
            }
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
