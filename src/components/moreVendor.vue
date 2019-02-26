<template>
  <div class="moreVendor">
    <div class="maskBox" id="maskBox" v-on:click="hideToolVen()"></div>
    <div class="aa-carAdaptationBox aa-shopPop">
      <div class="aa-carPopHead">
        <p>更多厂商智能目录</p>
        <a v-on:click="hideToolVen()">×</a>
      </div>
      <div class="es-brandCatalogue" style="">
        <div class="es-followBrandBox">
          <ul class="" style="overflow-y: auto;max-height: 8rem;">
          <li v-for="(item,index) in allBrandLogosData" @click="selected(item.brandUrl,item.dataType,item.brandName,item)">
           
              <span class="es-brandCataloguePic">
                <img :src="item.brandLogo" v-if="item.isFamousBrand==0">
                <b class="fc-brandBig" v-else>{{item.viewBrandName.substring(0,1)}}</b>
              </span>
              <p class="es-brandCatalogueName">{{item.viewBrandName}}</p>
            

          </li>
        </ul>
        </div>
        
      </div>
    </div>
    <!--排队坦层-->
    <customlayer ref="customlayer" v-on:Submit="Submit" v-on:tostep="tostep" v-on:hide="hide"></customlayer>

    <div class="ct-pop" v-show="stopNo">
      <!-- 扫码结果页中点击国际目录 -->
      <div class="ct-popBox">
        <span class="ct-picTwo"></span>
        <a @click="stopNo =false "></a>
      </div>

    </div>
  </div>
</template>

<script>

  import {commonMixin} from '../config/base/commonMixin.js';
  import customlayer from "../components/customlayer"

  var resourceUrl = process.env.apiDomain;
  export default {
    props: ['allBrandLogos'],
    name: 'moreVendor',
    mixins: [commonMixin],
    components: {
      customlayer
    },
    data() {
      return {
        allBrandLogosData: this.$props.allBrandLogos,
        vin: this.getQueryString('v'),
        timeOut: null,
        stopNo: false
      }
    },
    mounted() {
      // debugger;


      // var myScroll = new IScroll('#wrapper', { mouseWheel: true });
    },
    methods: {

      //点击隐藏弹层
      hideToolVen() {
        var _this = this;
        _this.$emit('toParentVenFlag', false);
      },
      //跳转超级目录
      GotoCjmlVinPage() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/GotoCjmlVinPage",
          data: {
            vinCode: this.vin
          },
          dataType: "JSON",
          success: function (data) {
            //do nothing
            //仅仅记录一下
          }
        });
      },
      selected(brandUrl, type, brandName, datas) {
        var _this = this;
        //计数
        if(datas.isZhiPeiVipPay ==0){
          _this.count(datas.brandId)
          _this.GotoCjmlVinPage(); //记录跳转超级目录
          var urls = window.location.protocol + '//' + window.location.hostname + '/cjml/h5/#!/vin?cf=1&v=' + _this.vin + '&appType=2&td=' + brandUrl + '&bn=' + encodeURIComponent(brandName);
          setTimeout(function () {
            _this.setupWebViewJavascriptBridge(function (bridge) {
              bridge.callHandler('native_JumpUrl', {
                url: urls
              }, function (response) {
              });
            });
          }, 500)
        }else {
          _this.$parent.$refs.internationalBrand.goPay();
        }
        
       /* _this.ajax({
          method: "POST",
          url: resourceUrl + '/DistributorTask/NeedWaitTask',
          dataType: "JSON",
          data: {
            brandId: datas.brandId,
          },
          success: function (data) {

            if (data.Body.mode == 'redirect') {

            } else if (data.Body.mode == 'wait') {

              _this.$refs.customlayer.show(brandUrl, type, brandName, datas.brandId);
              if (data.Body.privilegeCount > 0 && data.Body.canDoTask == true) {
                _this.$refs.customlayer.setValue(data.Body.privilegeCount)

              } else if (data.Body.privilegeCount <= 0 && data.Body.canDoTask == true) {
                _this.$refs.customlayer.butHide()
                _this.$refs.customlayer.setValue(data.Body.privilegeCount)
              } else if (data.Body.privilegeCount > 0 && data.Body.canDoTask == false) {
                _this.$refs.customlayer.enable = false;
                _this.$refs.customlayer.setValue(data.Body.privilegeCount);
              } else {
                _this.$refs.customlayer.butHide();
                _this.$refs.customlayer.status = false;
                _this.$refs.customlayer.enable = false;
              }

              var Time = data.Body.waitTime;
              _this.timeOut = setTimeout(function () {
                _this.$refs.customlayer.hide();
                //计数
                _this.count(datas.brandId)
                var urls = window.location.protocol + '//' + window.location.hostname + '/cjml/h5/#!/vin?cf=1&v=' + _this.vin + '&appType=2&td=' + brandUrl + '&bn=' + encodeURIComponent(brandName);
                setTimeout(function () {
                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: urls
                    }, function (response) {
                    });
                  });
                }, 500)

              }, Time * 1000)
            } else if (data.Body.mode == 'stop') {
              _this.stopNo = true;
            }
          }
        })*/
        // var goUrl=window.location.href;
        // if(window.location.href.indexOf('/selectShop')!=-1){
        // 	goUrl=window.location.href.split('/selectShop')[0];
        // };
        // var urls=goUrl+


      },
      Submit(brandUrl, type, brandName, brandId) {
        var _this = this;

        _this.ajax({
          method: "POST",
          url: resourceUrl + '/DistributorTask/UsePrivilege',
          dataType: "JSON",
          success: function () {
          }
        })

        clearTimeout(_this.timeOut)
        _this.$refs.customlayer.hide();
        //计数
        _this.count(brandId)
        var urls = window.location.protocol + '//' + window.location.hostname + '/cjml/h5/#!/vin?cf=1&v=' + _this.vin + '&appType=2&td=' + brandUrl + '&bn=' + encodeURIComponent(brandName);
        setTimeout(function () {

          _this.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('native_JumpUrl', {
              url: urls
            }, function (response) {
            });
          });
        }, 500)
      },
      tostep() {
        var _this = this;
        clearTimeout(_this.timeOut);
        _this.$refs.customlayer.hide();
        var baseUrl = window.location.protocol + '//' + window.location.host + "/step.html?backurl=native_CloseWebview";
        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {url: baseUrl}, function (response) {

          })
        })
      },
      hide() {
        var _this = this;
        clearTimeout(_this.timeOut);
      },
      count(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeeVinDetailLog",
          dataType: "JSON",
          data: {
            vinCode: _this.vin,
            sourceType: 1,
            bid: data
          },
          success: function () {

          }
        })
      },

    }

  }
</script>

<style scoped>
  @import url("../assets/css/app.css");
  @import url("../assets/css/popstyle.css");
</style>
