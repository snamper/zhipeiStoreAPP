<template>
  <!--下单选参数-->
  <div class="aq-parameterScreenPop zhipeiautoparam" v-if="show">
    <div class="aq-parameterScreenPopBox">
      <div class="aq-parameterScreenCenter">
        <span>请精确筛选车型参数<a href="javascript:void(0);" v-on:click="cancelChooseParam()">×</a></span>
        <div class="aq-parameterScreenMain" v-for="item in optionAutoParamList" :key="item.ParamTypeId">
          <template v-if="item.IsImage">
            <ul>
              <li class="aq-parameterScreenTitle">{{item.ParamTypeName}}</li>
              <li>
                <div class="aq-picBox">
                  <dl :style="'width: '+(item.AutoParamList.length*7.12)+'rem;'">
                    <dd v-for="pitem in item.AutoParamList" :key="pitem.ParamValueId"
                        v-on:click="SelectAutoParam(item,pitem)">
                      <span><img :src="pitem.ParamImage"></span>
                      <p><b :class="pitem.Selected?'bk-selected':''"></b>{{pitem.ParamValue}}</p>
                    </dd>
                  </dl>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <ul>
              <li class="aq-parameterScreenTitle">{{item.ParamTypeName}}</li>
              <li class="bk-picNoBox">
                <div class="bk-picNoMain">
                  <dl>
                    <dd :class="pitem.Selected?'bk-selected':''" v-for="pitem in item.AutoParamList"
                        :key="pitem.ParamValueId"
                        v-on:click="SelectAutoParam(item,pitem)">{{pitem.ParamValue}}
                    </dd>
                  </dl>
                </div>
              </li>
            </ul>
          </template>
        </div>
      </div>

      <div class="aq-parameterScreenFool">
        <a href="javascript:void(0);" class="aq-buttonLeft" v-on:click="cancelChooseParam()">取消</a>
        <a href="javascript:void(0);" class="aq-buttonRight" v-on:click.stop="confirmsubmitorder()">确定</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {commonMixin} from '../config/base/commonMixin.js';
  import {Toast} from 'mint-ui';

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "selectAutoParam",
    mixins: [commonMixin],
    components: {},
    data() {
      return {
        show:false,
        optionAutoParamList: [],
        type:0,
        ite:{}
      }
    },
    methods: {
      cancelChooseParam() {
        var _this = this;
        _this.$emit('cancelChooseParam');
      },
      SelectAutoParam: function (item, pitem) {
        item.AutoParamList.forEach(ele => {
          ele.Selected = false;
        });
        pitem.Selected = true;
      },
      confirmsubmitorder() {
        if (this.optionAutoParamList && this.optionAutoParamList.length > 0) {
          var alertlist = [];
          var userParam = [];
          this.optionAutoParamList.forEach(item => {
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
        }
        this.$emit("completeChooseParam", userParam,this.type,this.ite);
      },

      showPage(){
        this.show = true;
      },
      hide(){
        this.show = false;
      },
      setValue(data,type,item){
        this.optionAutoParamList = data;
        this.type = type,
          this.ite= item
      }
    }
  }
</script>

<style>
  @import url("../assets/css/app.css");
  @import url("../assets/css/parameterscreenstyle.css");

  ::-webkit-scrollbar {
    display: none;
  }
</style>
