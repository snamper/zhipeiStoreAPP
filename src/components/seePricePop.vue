<template>
  <div class="seePricePop" style="
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.48);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 55;
">
    <div class="cc-seePricePop" style="top: 1.96rem;">
      <div class="cc-seePriceTop" style="padding: 0 .32rem;">
        <span>查看价格-{{selectShopsName}}</span>
        <a v-on:click="cancelSeePrice()">×</a>
      </div>

      <div class="cc-seePriceMain">
        <!--汽车等级-->
        <div class="cz-priceSetupRemind" v-if="priceLevelNotice !=''" v-show="seepricePopPromotion">{{priceLevelNotice}}<a @click="eventseepricePop">立即申请</a></div>

        <!--<div class="cd-remindBox" v-show="priceRemind != ''">{{priceRemind}}</div>-->



        <div class="cc-seePriceOne" v-for="(item,index) in seePricePopList">
          <ul>
            <li class="cc-seePriceCategory">
              <p>{{item.partsName}}</p>
              <span class="dl-price4S" v-show="item.fours_price_text.length>0">4S店售价 {{item.fours_price_text}}</span>


              <!--<div v-on:click="selcetItem(item)">-->
              <!--<span :class="[item.wareDetails[0].isSelect ?'cc-selected':'']"></span>-->
              <!--<p>{{item.partsName}}</p>-->
              <!--</div>-->

              <!--<a v-if="item.wareDetails[0].changeWares.length>1"-->
              <!--v-on:click="changeOhter(item.wareDetails[0].changeWares,item.wareDetails[0].changeWareBrand,item.wareDetails[0].partsId)">换一个</a>-->
            </li>


            <li class="cc-seePriceProduct" v-on:click="selcetItem(item.wares,detail)" v-for="(detail,dIndex) in item.wares" v-if="item.wares[0].brandId>0"
              :class="[detail.isSelect?'dl-selected':'']">
              <p class="dl-productName">{{detail.brandName}} {{detail.wareName}}</p>
              <a class="dl-parameterLink" @click.stop="showinfo(detail)">详情</a>
              <span>{{detail.warePrice}}</span>
              <a class="ce-number" @click.stop="clickPrice(detail)">×{{detail.wareCount}}</a>

              <!--<p>{{detail.brandName}} {{detail.wareName}}</p>-->
              <!--<p class="cc-seePriceTab">-->
              <!--<b class="cc-series">{{detail.seriesName}}</b>-->
              <!--<b class="cc-Imported">{{detail.productionPlace}}</b>-->
              <!--</p>-->
              <!--<span class="ce-price">{{detail.warePrice}}</span>-->
              <!--<a class="ce-number" @click="clickPrice(detail)">×{{detail.wareCount}}</a>-->
              <!--<div class="cv-alias" :class="{'cv-takeUp':!detail.isOtherCodesCollapse}" @click="isOpen(detail)" v-show="detail.otherCodes.length>0" >-->
              <!--<dl>-->
              <!--<template v-for="(other,index) in detail.otherCodes">-->
              <!--<dt v-if="index==0">{{other}}</dt>-->
              <!--<dd v-else>{{other}}</dd>-->
              <!--</template>-->
              <!--</dl>-->
              <!--</div>-->
            </li>
            <li class="cc-seePriceProduct" v-on:click="selcetItem(item.wares,detail)" v-for="(detail,dIndex) in item.wares" v-else :class="[detail.isSelect?'dl-selected':'']">
              <p class="cc-notAvailable">暂无现货，替您调货</p>
              <a class="ce-number cf-numberNotAvailable" @click="clickPrice(detail)">×{{detail.wareCount}}</a>
            </li>


          </ul>
        </div>

        <!--添加的通用页-->
        <div class="cc-seePriceOne" v-for="item in universalParts" v-show="universalParts.length>0">
          <ul>
            <li class="cc-seePriceCategory">
              <p>{{item.categoryName}}</p>
            </li>
            <li class="cc-seePriceProduct dl-seePriceCurrency" v-for="(detali,index) in item.wares" :key="index">
              <p>{{detali.brandName}} {{detali.wareName}}</p>
              <span class="ce-price">{{detali.warePrice}}</span>
              <a class="ce-number" @click="clickPrice(detali,true)">×{{detali.wareCount}}</a>
            </li>
          </ul>
        </div>
        <!--添加通用按钮-->
        <div class="cv-universalPartsNew" v-show="isGenralButton">
          <a @click="addTo">添加通用件</a>
        </div>
      </div>

      <div class="cc-seePriceFool">
        <div class="cv-totalPrice">
          <ul>
            <li class="cv-left"><b v-show="promotionNotice_prefix !='' ">{{promotionNotice_prefix}}</b>{{viewNotice}}<a @click="addTo">{{promotionNotice_suffix}}</a></li>
            <!--<li class="cv-left"><i  style="color: #2d83e6">{{'去凑单'}}</i></li>-->

            <li class="cv-right">
              <!--<span>总价：<b>￥</b></span>-->
              <p><b>{{priceonut}}</b>{{prictitle}}</p>
            </li>
          </ul>
        </div>
        <!-- 默认的按钮 -->
        <div v-show="showBtn==2 || showBtn==1">
          <a class="cv-routine" v-on:click="CallbackSubmitWares(2)" v-if="submitWaresData.length>0" :class="{marginLeft:showBtn==2||showBtn ==3 }">常规调货</a>
          <a class="cv-routine cc-disable" v-on:click="toastMsg()" v-else :class="{marginLeft:showBtn==2||showBtn ==3 }">常规调货</a>
        </div>

        <div v-show="showBtn==3 || showBtn==1">
          <a v-on:click="CallbackSubmitWares(3)" v-if="submitWaresData.length>0" :class="{marginLeft:showBtn==2||showBtn ==3 }">紧急调货</a>
          <a class="cc-disable" v-on:click="toastMsg()" v-else :class="{marginLeft:showBtn==2||showBtn ==3 }">紧急调货</a>
        </div>


        <!--<a href="javascript:;" v-on:click="CallbackSubmitWares()" v-if="selectCount>0">立即调货</a>-->
        <!-- 禁用样式的按钮 -->
        <!--<a href="javascript:;" class="cc-disable" v-on:click="toastMsg()" v-else>立即调货</a>-->

      </div>
    </div>
    <!--换一个-->
    <!--<productChoice v-bind:productChoiceList="productChoiceList" v-bind:partsId="partsId" v-bind:changeWareBrand="changeWareBrand"-->
      <!--v-on:CallbackProduct="CallbackProduct" v-on:cancelProductChoice="cancelProductChoice" v-if="isShowProductChoice"></productChoice>-->
    <!--添加通用组件-->
    <!--<addGenericParts ref="addGenericParts" v-on:selectedpro="selectedpro" v-on:addProduct="addProduct"></addGenericParts>-->
    <addGenericPartsNew ref="addGenericPartsNew" v-bind:shopid="shopid" v-on:addProduct="addProduct"></addGenericPartsNew>

    <!--改变数量组建-->
    <numberEditPop :wareCount="wareCount" ref="prices" v-on:siveCount="siveCount" v-on:siveCounts="siveCounts"></numberEditPop>

    <!--参数坦层详情-->
    <parameterPop ref="parameterPop" v-on:tabRight="tabRight"></parameterPop>

    <!--申请提交成功弹层-->
    <div class="cf-numberEditPop" v-show="successMusk">
      <ul>
        <li class="cy-submissionSuccess">
          <p>申请提交成功</p>
          <span>供货商同意后您可查看客户会员价</span>
        </li>
      </ul>
    </div>
  </div>


</template>


<script>
  import {
    Toast
  } from "mint-ui";
  import {
    Indicator
  } from 'mint-ui';
  import {
    commonMixin
  } from "../config/base/commonMixin.js";
  // import productChoice from "./productChoice.vue";
  import numberEditPop from "./numberEditPop.vue"
  // import addGenericParts from "./addGenericParts"
  import addGenericPartsNew from "./addGenericPartsNew"
  import parameterPop from "./parameterPop"


  var resourceUrl = process.env.apiDomain;
  export default {
    name: "seePricePop",
    props: ["seePricePopList", "selectShopsName", "tatoContdata", "shopid", "seepriceState", "priceLevelNotice"],
    mixins: [commonMixin],
    components: {
      // productChoice,
      numberEditPop,
      // addGenericParts,
      parameterPop,
      addGenericPartsNew
    },
    watch: {},
    data() {
      return {
        // productChoiceList: [],
        // changeWareBrand: [],
        partsId: 0,
        isShowProductChoice: false,
        select: true,
        seePricePopLists: [],
        priceonut: 0.00,
        prictitle: '',
        submitData: [],
        wareCount: 0, //默认数两
        viewNotice: '',
        universalParts: [], //添加的通用件列表
        isGenralButton: true,
        // isTogether:false, //是否去凑单
        disablebtn: true,
        showBtn: 1,
        promotionNotice_prefix: '',
        promotionNotice_suffix: '',
        seepricePopPromotion: true,
        successMusk: false, //成功弹层
        fist: true,
        onceFist:false,
        pageIndex:1,
        wares:[]
      };
    },
    mounted() {
      // var arr = this.$props.seePricePopList
      var _this = this;
      _this.seePricePopLists = _this.$props.seePricePopList;
      _this.showBtn = _this.$props.seepriceState
      console.log(_this.seePricePopLists)

      _this.setValue(_this.$props.tatoContdata)

    },

    computed: {
      selectCount() {
        return this.$props.seePricePopList.filter(function (item) {
          return item.wareDetails[0].isSelect;
        }).length;
      },
      submitWaresData() {
        var list = [];
        for (var i = 0; i < this.$props.seePricePopList.length; i++) {

          for (var j = 0; j < this.$props.seePricePopList[i].wares.length; j++) {
            if (this.$props.seePricePopList[i].wares[j].isSelect) {
              var obj = {};
              obj.wareKind = this.$props.seePricePopList[i].wares[j].wareKind;
              obj.wareId = this.$props.seePricePopList[i].wares[j].wareId;
              obj.wareCount = this.$props.seePricePopList[i].wares[j].wareCount;
              obj.partsId = this.$props.seePricePopList[i].wares[j].partsId;
              obj.oemIds = this.$props.seePricePopList[i].wares[j].changeableOems;
              list.push(obj);
            }
          }
        }
        return list;
      },
    },
    methods: {
      //点击立即申请
      eventseepricePop() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/CloudShop/ApplyForPriceLevel",
          dataType: "JSON",
          data: {
            shopId: _this.$props.shopid
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.successMusk = true;

              setTimeout(function () {
                _this.seepricePopPromotion = false;
                _this.successMusk = false;
              }, 3000) //3秒后隐藏成功弹层
            } else {
              Toast(str.Header.Message)
              return;
            }

          }
        })

      },
      //展开隐藏别名
      // isOpen(data) {
      //   if (data) {
      //     data.isOtherCodesCollapse = !data.isOtherCodesCollapse
      //   }
      // },
      //设置值
      setValue(value) {
        var _this = this;
        _this.priceonut = value.viewPrice;
        _this.prictitle = value.viewMemo;
        _this.viewNotice = value.promotionNotice;
        _this.promotionNotice_prefix = value.promotionNotice_prefix;
        _this.promotionNotice_suffix = value.promotionNotice_suffix;
        if (value.isShowGeneralParts == 0) {
          _this.isGenralButton = false;
        }
        if (value.isShowGeneralParts == 1) {
          _this.isGenralButton = true;
        }
      },
      clickPrice(price, bool) {
        if (bool == true) {
          this.$refs.prices.show();
          this.$refs.prices.setvalue(price, true);
        } else {
          this.$refs.prices.show();
          this.$refs.prices.setvalue(price);
        }

      },
      siveCount(data, id) {
        var _this = this
        for (var i = 0; i < _this.seePricePopLists.length; i++) {
          if (_this.seePricePopLists[i].wares.length > 0) {
            for (var j = 0; j < _this.seePricePopLists[i].wares.length; j++) {
              if (_this.seePricePopLists[i].wares[j].wareId == id) {
                _this.seePricePopLists[i].wares[j].wareCount = data;
              }
            }
          }
        }
        //开始计算总价
        _this.processingData();

      },
      //编辑数据时提交的数据
      siveCounts(data, id, brandId) {

        var _this = this;

        if (data == 0) {
          for (var i = 0; i < _this.universalParts.length; i++) {

            if (brandId == _this.universalParts[i].partsId) {
              if (_this.universalParts[i].wares.length > 1) {
                for (var j = 0; j < _this.universalParts[i].wares.length; j++) {
                  if (id == _this.universalParts[i].wares[j].wareId) {
                    _this.universalParts[i].wares.splice(j, 1);
                    break;
                  }
                }
              } else {
                _this.universalParts.splice(i, 1);
                break
              }
            }
          }

        } else {
          for (var i = 0; i < _this.universalParts.length; i++) {

            if (brandId == _this.universalParts[i].partsId) {

              for (var j = 0; j < _this.universalParts[i].wares.length; j++) {
                if (_this.universalParts[i].wares[j].wareId == id) {
                  _this.universalParts[i].wares[j].wareCount = data;
                }
              }
            }
          }
        }
        //开始计算总价
        _this.processingData();

      },
      cancelSeePrice() {
        var _this = this;
        _this.$emit("cancelSeePrice");
      },
      selcetItem(list, data) {
        var _this = this;
        if (list.length > 0) {

          for (var i = 0; i < list.length; i++) {
            if (list[i].wareId == data.wareId) {

              if (list[i].isSelect == true) {
                list[i].isSelect = !list[i].isSelect;
              } else {

                for (var j = 0; j < list.length; j++) {
                  list[j].isSelect = false;
                }
                for (var j = 0; j < list.length; j++) {
                  if (list[j].wareId == data.wareId) {

                    list[j].isSelect = !list[j].isSelect;
                  }
                }

              }
            }
          }

        }


        //开始计算总价
        _this.processingData();
      },
      showinfo(data) {

        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/cloudshop/GetShopWareDetail",
          dataType: "JSON",
          data: {
            shopId: _this.$props.shopid,
            wareId: data.wareId
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              if (str.Body) {
                _this.$refs.parameterPop.show();
                _this.$refs.parameterPop.setValue(str.Body);
                _this.$refs.parameterPop.setWareId(data.wareId);
                _this.onceFist=false;
              }

            } else {
              Toast(str.Header.Message)
            }
          }
        });
      },
      tabRight(cb, wareId) {
        var _this = this;

        if(_this.onceFist==false){
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/order/GetFitAuto",
            dataType: "JSON",
            data: {
              shopId: _this.$props.shopid,
              wareId: wareId,
            },
            success: function (str) {
              if (str.Header.ErrorCode == 0) {
                cb();
                _this.onceFist=true;
                _this.$refs.parameterPop.setRight(str.Body.validAutos);

              } else {
                Toast(str.Header.Message)
              }
            }
          });
        }else {
          cb();
        }

      },
      //计算总价方法
      tatoCount(data) {
        var _this = this;
        var mode = '';
        if (_this.showBtn == 2) {
          mode = "normal"
        } else if (_this.showBtn == 3) {
          mode = "emergency"
        }
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/StatisticalPrice",
          dataType: "JSON",
          data: {
            totalPrice: JSON.stringify(data),
            shopId: _this.$props.shopid,
            mode: mode,
          },
          success: function (str) {
            if (str.Body) {

              _this.priceonut = str.Body.viewPrice;
              _this.prictitle = str.Body.viewMemo;
              _this.viewNotice = str.Body.promotionNotice;
              _this.promotionNotice_prefix = str.Body.promotionNotice_prefix,
                _this.promotionNotice_suffix = str.Body.promotionNotice_suffix

            }
          }

        });
      },
      toastMsg() {
        Toast({
          message: "请选择配件",
          position: "center",
          duration: 1500
        });
      },
      // cancelProductChoice() {
      //   var _this = this;
      //   _this.isShowProductChoice = !_this.isShowProductChoice;
      // },
      // changeOhter(item, brand, partsId) {
      //   var _this = this;
      //   _this.isShowProductChoice = !_this.isShowProductChoice;
      //
      //   _this.productChoiceList = item;
      //   _this.changeWareBrand = brand;
      //   _this.partsId = partsId;
      // },
      // CallbackProduct(Product) {
      //   var _this = this;
      //   _this.$emit("CallbackProduct", Product, _this.universalParts);
      // },
      CallbackSubmitWares(value) {
        var _this = this;
        if (_this.disablebtn) {
          _this.$emit("CallbackSubmitWares", _this.submitWaresData, _this.universalParts, value);
          _this.disablebtn = false;
        }

      },
      //添加通用件
      addTo() {
        var _this = this;
        _this.$refs.addGenericPartsNew.show();
      },

      // selectedpro(data, callBack) {
      //   var _this = this;
      //   _this.ajax({
      //     method: "POST",
      //     url: resourceUrl + "/order/GetShopSelfWaresByCategory",
      //     dataType: "JSON",
      //
      //     data: {
      //       shopId: _this.$props.shopid,
      //       cId: data.categoryId
      //     },
      //     success: function (str) {
      //       if (str.Header.ErrorCode == 0) {
      //         callBack();
      //         _this.$refs.addGenericParts.setWares(str.Body);
      //       }
      //     }
      //   })
      // },

      findOneWare(source, oneWare) {
        for (var i = 0; i < source.wares.length; i++) {
          if (source.wares[i].wareId == oneWare.wareId) {
            return source.wares[i];
          }
        }
        return null;
      },

      //选择添加通用件
      addProduct(val) {
        var obj = {};
        obj.partsId = val.categoryId;
        obj.categoryName = val.categoryName;
        obj.wares = [];
        obj.wares.push(val);
        var _this = this;
        if (_this.universalParts.length == 0) {
          Toast('添加成功');
          _this.universalParts.push(obj);
        } else {
          var isFindGroup = false;
          for (var i = 0; i < _this.universalParts.length; i++) {
            var oneGroup = _this.universalParts[i];
            if (oneGroup.partsId == obj.partsId) {
              isFindGroup = true;
              for (var k = 0; k < obj.wares.length; k++) {
                var findResult = _this.findOneWare(oneGroup, obj.wares[k]);
                if (findResult != null) {
                  Toast('添加成功');
                  findResult.wareCount += obj.wares[k].wareCount;
                } else {
                  Toast('添加成功');
                  oneGroup.wares.push(obj.wares[k]);
                }
              }
            }
          }
          if (isFindGroup == false) {
            Toast('添加成功');
            _this.universalParts.push(obj);
          }
        }


        // _this.$refs.addGenericParts.hide();
        //开始计算总价

        _this.processingData();

      },
      //专门处理总价提交数据
      processingData() {
        var _this = this;
        var data = _this.seePricePopLists;
        var universaList = _this.universalParts;
        var list = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].wares.length > 0) {
              for (var j = 0; j < data[i].wares.length; j++) {
                if (data[i].wares[j].isSelect == true) {
                  var str = {};
                  str.sortPrice = data[i].wares[j].sortPrice;
                  str.wareCount = data[i].wares[j].wareCount;
                  list.push(str);
                }
              }
            }
          }
        }

        if (universaList.length > 0) {
          for (var i = 0; i < universaList.length; i++) {

            if (universaList[i].wares.length > 0) {

              for (var j = 0; j < universaList[i].wares.length; j++) {
                var str = {}
                str.sortPrice = universaList[i].wares[j].sortPrice;
                str.wareCount = universaList[i].wares[j].wareCount;
                list.push(str);
              }

            }
          }
        }

        _this.tatoCount(list)
      },
    },


  };

</script>

<style>
  @import url("../assets/css/seePricePop.css");
  @import url("../assets/css/onekeyinquiriesstyle0702.css");
  @import url("../assets/css/onekeyinquiriesstyle0705.css");

  .cc-seePriceFool a {
    width: 36%;
    height: .96rem;
    border: 1px solid #d53533;
    border-radius: .48rem;
    margin: .16rem;
    font-size: .4rem;
    line-height: .88rem;
    float: left;
    clear: none;
  }

  .cc-seePriceFool a.cv-routine {
    background: #fff;
    color: #d53533;
    margin-left: 1.08rem;
  }

  .cc-seePricePop .cc-seePriceFool {
    display: block;
  }


  .cc-seePriceOne li.cc-seePriceProduct p {
    max-width: 6rem;
  }

  .cc-seePriceOne li.cc-seePriceProduct span.ce-number {
    right: 2.4rem;
    font-size: .32rem;
    color: #acacac;
  }

</style>
