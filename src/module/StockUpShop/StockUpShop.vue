<template>
  <div class="StockUpShop" ref="mainBox">
    <!--<headers title="备货下单" :rightBtnText="rightTitle" @rightBtnEvent="rightBtnEvent"></headers>-->
    <div style="width:100%;background: #fff;float: left;clear: left;">

      <div class="cc-seePriceTop" style="z-index: 53">
        <!-- 店铺名及简介 -->
        <div class="db-shopBox">
          <div class="db-shopPic">
            <img :src="shopInfo.logo" v-if="shopInfo.logo" @click="showCarLogo(shopInfo.logo,$event)">
            <img src="../../assets/images/pic_no.jpg" v-else>
          </div>
          <div class="db-shopText">
            <ul>
              <li class="db-shopName"><i class="ibox">{{shopInfo.shopName}}</i><a class="db-shopDetailsEntrance" @click="showinfo" v-if="shopInfo.desc != ''">详情</a></li>
              <li class="db-shopMain" v-if="shopInfo.desc != ''">
                <span><b>简介：</b>{{shopInfo.desc}}</span>
                <!--<a @click="showinfo" v-if="shopInfo.desc != ''">详情</a>-->
              </li>

              <li class="db-shopImg" v-show="imagesLoad.length>0">
                <span v-for="(item,index) in imagesLoad">
                  <img :src="item" @click="showCarImg(imagesLoad,$event,index,0)">
                </span>
              </li>


              <template v-if="(shopInfo.promotionTags && shopInfo.promotionTags.length>0) && shopInfo.activity == null">
                <!-- 只有促销标签 -->
                <li class="ad-activityTagBox">
                  <span v-for="(oneTag,index) in shopInfo.promotionTags">{{oneTag}}</span>
                </li>
              </template>
              <template v-else-if="(!shopInfo.promotionTags || shopInfo.promotionTags.length==0) && shopInfo.activity != null">
                <!-- 只有活动 -->
                <li class="ad-shopMain" @click="seeInfo(shopInfo.activity, shopInfo.promotionTags)">
                  <p class="ch-shopActivity">
                    <a class="ch-activityBox">
                      <span><b>活动</b>{{shopInfo.activity.activityTitle}}</span>
                    </a>
                  </p>
                </li>
              </template>
              <template v-else-if="(shopInfo.promotionTags && shopInfo.promotionTags.length>0) && shopInfo.activity != null">
                <!-- 又有活动, 又有促销标签 -->
                <li class="ad-activityTagBox ad-expandable" @click="seeInfo(shopInfo.activity, shopInfo.promotionTags)">
                  <span v-for="(oneTag,index) in shopInfo.promotionTags">{{oneTag}}</span>
                </li>
              </template>

            </ul>
          </div>
        </div>
        <!-- 备货批量下单查询及添加通用件 -->
        <div class="cv-stockUpQuery">
          <p>备货批量下单

            <a class="db-textLink" @click="showStockInventory(1)">智能推荐</a>
            <a class="db-textLink dv-margin" @click="rightBtnEvent">{{rightTitle}}</a>
          </p>
          <div class="db-operationBox">
            <span :style="{'width':shopInfo.isShowGeneralParts==1?'85%':'100%','border':shopInfo.isShowGeneralParts==1?null:0}">
              <input type="text" name="" placeholder="请输入商品编码" v-model="keyWord" v-on:blur="keyWordBlur" :style="{'width':shopInfo.isShowGeneralParts==1?'85%':'95%'}"
                v-on:focus="keyWordFocus" v-on:change="keyWordBlur">
              <!--<span @click="audioinfo()"></span>-->
              <!-- <a href=""></a> -->
            </span>
            <a v-on:click="chooseGenericParts" v-show="shopInfo.isShowGeneralParts==1">通用件</a>
          </div>
          <div class="cv-relationBox" v-show="isShowSearchResault">
            <dl>
              <template v-if="searchResault.length>0">
                <dd v-for="item in searchResault" v-on:click="addToShopCart(item)">{{item.displayName}}</dd>
              </template>
              <template v-else>
                <dd>未找到任何结果！</dd>
              </template>
            </dl>
          </div>
        </div>
      </div>
      <!--添加的商品列表-->
      <div class="cc-seePriceMain" :style="{'padding-top': imagesLoad.length>0?'6.5rem':'5rem'}" v-if="shopCartList.length>0">
        <!-- 已添加商品的列表 -->
        <div class="db-goodsAddedBox">
          <div class="db-commodityBox" v-for="(item,itemindex) in shopCartList">
            <p class="db-commodityCategory">{{item.categoryName}}</p>
            <div class="db-commodityOne db-commodityOneSelected">
              <dl>
                <dt>
                  <p class="db-commodityName" style="max-width: 3.6rem">{{item.brandName}} {{item.wareName}}</p>
                  <a class="db-addButton" v-on:click="seeDetails(item)" v-show="item.wareKind==0">详情</a>
                  <a class="db-commodityNumber" v-on:click="changeCount(item,itemindex)">×{{item.wareCount}}</a>
                  <span class="db-commodityPrice">{{item.warePrice}}</span>
                </dt>
              </dl>
              <!--<div style="width: auto" class="cv-alias" :class="{'cv-takeUp':item.selecteds}" v-on:click.stop="isOpen(item,$event)" v-show="item.otherCodes && item.otherCodes.length>0">-->
              <!--<dl>-->
              <!--<template v-for="(other,index) in item.otherCodes">-->
              <!--<dt v-if="index==0">{{other}}</dt>-->
              <!--<dd v-else>{{other}}</dd>-->
              <!--</template>-->
              <!--</dl>-->
              <!--</div>-->
            </div>
          </div>
        </div>

      </div>
      <!-- 初始空页面 -->
      <div class="cc-seePriceMain" :style="{'padding-top': imagesLoadtop()}" v-else>
        <div class="db-setMealRecommend">
          <div class="db-setMealRecommendTitle">
            <p>智能推荐备货清单</p>
            <a @click="showToust()">
              <!--点击后增加 class:db-click -->
              <div class="db-supernatant">
                <span></span>
                <p>这里是说明性文案这里是说明性文案这里是说明性文案这里是说明性文案</p>
              </div>
            </a>
          </div>
          <div class="db-setMealRecommendTab">
            <a @click="showStockInventory(1)">
              <!--点击后增加class:db-selected-->
              <p>套餐A</p>
              <span>必选套餐</span>
            </a>
            <a @click="showStockInventory(2)">
              <p>套餐B</p>
              <span>常规套餐</span>
            </a>
            <a @click="showStockInventory(3)">
              <p>套餐C</p>
              <span>全面套餐</span>
            </a>
            <a @click="showStockInventory(4)">
              <p>套餐D</p>
              <span>常用配件</span>
            </a>
          </div>
        </div>
      </div>

      <!--底部-->
      <div class="cc-seePriceFool" style="position: fixed; display: block;" v-show="shopCartStatistics.viewPrice && shopCartStatistics.viewPrice.length>0">
        <div class="cv-totalPrice">
          <ul>
            <li class="cv-left" v-show="getquantityCount()>0">
              共 {{getquantityCount()}} 件商品
              <!--{{shopCartStatistics.promotionNotice}}-->
              <!--<a href="javascript:void(0);"-->
              <!--v-show="shopCartStatistics.promotionNotice_suffix && shopCartStatistics.promotionNotice_suffix.length>0"-->
              <!--v-on:click="chooseGenericParts">去凑单</a>-->
            </li>
            <li class="cv-right">
              <p><b>{{shopCartStatistics.viewPrice}}</b>{{shopCartStatistics.viewMemo}}</p>
            </li>
          </ul>
        </div>
        <!-- 默认的按钮 -->
        <a href="javascript:void(0);" :class="{'cc-disable':shopCartList.length==0}" v-on:click="submitOrder">确定</a>
      </div>
    </div>
    <!--上平数量加减弹层-->
    <div class="cf-numberEditPop" v-show="isShowChangeShopCartPop">
      <ul>
        <li class="cf-numberEdit">
          <p>修改数量</p>
          <span>
            <a href="javascript:void(0);" v-on:click="increment(changeShopCartItem)">-</a>
            <b>{{changeShopCartItem.wareCount}}</b>
            <a href="javascript:void(0);" v-on:click="changeShopCartItem.wareCount++">+</a>
          </span>
        </li>
        <li class="cf-numberEditButton">
          <a href="javascript:void(0);" class="cf-buttonLeft" v-on:click="isShowChangeShopCartPop=false;changeShopCartItem.wareCount=changeShopCartItem.oldcount">取消</a>
          <a href="javascript:void(0);" v-on:click="isShowChangeShopCartPop=false;getBillingInformation(shopCartList)">确认</a>
        </li>
      </ul>
    </div>
    <FitCar ref="FitCar" v-show="fitCarIsShow"></FitCar>
    <!--参数坦层详情-->
    <!--<parameterPop ref="parameterPop" v-on:tabRight="tabRight"></parameterPop>-->
    <!--添加通用组件-->
    <!--<addGenericParts ref="addGenericParts" v-on:selectedpro="selectedpro" v-on:addProduct="addProduct"></addGenericParts>-->
    <addGenericPartsNew ref="addGenericPartsNew" v-bind:shopid="shopInfo.shopId" v-on:addProduct="addProduct"></addGenericPartsNew>

    <!--查看Logo图片-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>

    <!--查看Logo图片-->
    <photowipe v-bind:list="lideImg" ref="photoLogo" v-bind:options="options"></photowipe>
    <!--店铺简介-->
    <shopInfoPop ref="shopInfoPop" v-on:showPhoto="showCarImg"></shopInfoPop>
    <!--备货清单-->
    <stockInventory ref="stockInventory" v-on:addPriceLeve="addPriceLeve" v-on:seeDetails="seeDetails"></stockInventory>
    <!--参数坦层详情-->
    <parameterPop ref="parameterPop" v-on:tabRight="tabRight"></parameterPop>
    <!--收银台-->
    <!--<paymentPop ref="paymentPop" v-on:tonoPay="tonoPay" v-on:payType="payType"></paymentPop>-->
    <!--活动详情-->
    <activitiesInfo ref="activitiesInfo"></activitiesInfo>

    <div class="dz-billEntrance" v-if="AccountBalance" @click="toMybill">
      <span>对账单</span>
    </div>
  </div>
</template>

<script>
  import {MessageBox} from 'mint-ui';
  import {Toast} from 'mint-ui';
  import headers from '../../components/headers.vue';
  import FitCar from '../../components/fitCar.vue';
  import addGenericPartsNew from "../../components/addGenericPartsNew.vue"
  import photowipe from '../../components/photoswipe.vue';
  import {commonMixin} from '../../config/base/commonMixin.js';
  import shopInfoPop from '../../components/shopInfoPop.vue'
  import stockInventory from '../../components/stockInventory.vue'
  import parameterPop from "../../components/parameterPop"
  import activitiesInfo from "../../components/activitiesInfo"
  var resourceUrl = process.env.apiDomain;
  var keyWordsetTimeout;
  export default {
    name: 'StockUpShop',
    mixins: [commonMixin],
    components: {
      headers: headers,
      FitCar,
      photowipe: photowipe,
      shopInfoPop: shopInfoPop,
      stockInventory: stockInventory,
      parameterPop: parameterPop,
      addGenericPartsNew,
      activitiesInfo,

    },
    data() {
      return {
        keyWord: "",
        searchResault: [], // 配件搜索结果
        isShowSearchResault: false, // 是否显示搜索结果
        shopCartList: [], // 临时购物车
        shopCartStatistics: {}, // 购物车统计
        shopInfo: { // 当前店铺信息
          shopId: this.getQueryString('shopId'),
        },
        fitCarIsShow: false,
        changeShopCartItem: {}, // 正在编辑数量的购物车商品
        isShowChangeShopCartPop: false,
        submitBtnIsDisable: false,
        imagesLoad: [],
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
        maxslideImg: [],
        lideImg: [],
        rightTitle: '车型下单',
        onceFist: false,
        AccountBalance: false
      }
    },
    watch: {
      "keyWord": function (newVal, oldVal) {
        clearTimeout(keyWordsetTimeout);
        keyWordsetTimeout = setTimeout(() => {
          this.keyWordFocus();
        }, 300);
      },
      "shopCartList": function (newVal, oldVal) {
        var _this = this;
        _this.getBillingInformation(newVal);
      }
    },
    created() {
      this.setTitle('备货下单');
      // _this.isInit();

      // _this.setupWebViewJavascriptBridge(function (bridge) {
      //   bridge.callHandler('native_SetTitle', "备货下单", function (response) {});
      // });
    },
    mounted() {
      var _this = this;
      var guestTicket = _this.getQueryString("guestticket");
      if (guestTicket == null || guestTicket == undefined || guestTicket == '') {
        _this.rightTitle = '车型下单';
      } else {
        _this.rightTitle = '';
      }
      _this.nativeLsitenBack("native_CloseWebview");
      _this.ajax({
        method: "POST",
        url: resourceUrl + "/order/InitBeihuoOrder",
        dataType: "JSON",
        data: {
          shopId: _this.shopInfo.shopId
        },
        success: function (str) {
          if (str.Header.ErrorCode == 0) {
            if (str.Body) {

              str.Body.shopId = _this.shopInfo.shopId;
              _this.shopInfo = str.Body;
              _this.imagesLoad = str.Body.pics;
            }
          }
        }
      });
      //能否展示对账单
      _this.CanAccountBalance()
    },
    methods: {
      imagesLoadtop(){
        if(this.imagesLoad.length>0){
          if(this.shopInfo.activity){
            return'6.6rem'
          }else {
            return'6.1rem'
          }

        }else {
          if(this.shopInfo.activity){
            return'5.2rem'
          }else {
            return'4.7rem'
          }
        }
      },
      //跳转到我的账单页面
      toMybill() {
        // debugger;
        var _this = this;
        var baseUrl = window.location.protocol + '//' + window.location.host + "/myBill.html?cf=1&shopId=" + this.shopInfo.shopId + "&math=" + Math.random();
        // window.location.href=baseUrl;
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {
            url: baseUrl
          }, function (response) {})
        })

      },
      CanAccountBalance() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/cloudshop/CanAccountBalance",
          data: {
            shopId: _this.shopInfo.shopId
          },
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.AccountBalance = str.Body
            } else {
              Toast(str.Header.Message);
            }

          }
        })
      },
      //开始录音识别
      audioinfo() {
        var _this = this;
        this.setupWebViewJavascriptBridge(function (bridge) {
          //url 语音文案说明图片地址
          var url =
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537248251244&di=023e4a21c1185ef22e5c2612fbe6eab7&imgtype=0&src=http%3A%2F%2Fwww.jsocr.com%2Fuploads%2F150526%2F2-150526141355D2.jpg";
          bridge.callHandler('native_VoiceRecognizer', url, function (response) {
            _this.keyWord = response;
          });
        });

      },
      //查看详情
      seeInfo(activity, tags) {
        var _this = this;
        _this.$refs.activitiesInfo.show();
        _this.$refs.activitiesInfo.setValue(activity, tags);
      },
      //获取商品数量
      getquantityCount() {
        var count = 0;
        for (var i = 0; i < this.shopCartList.length; i++) {
          count += this.shopCartList[i].wareCount
        }
        return count;
      },
      //添加商品
      addPriceLeve(list) {

        var wareIds = [];
        for (var i = 0; i < list.length; i++) {
          wareIds.push(list[i].wareId)
        }
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/order/GetShopWareDetails",
          dataType: "JSON",
          data: {
            shopId: _this.shopInfo.shopId,
            wareIds: wareIds,
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              //添加wareCount
              // str.Body[0].otherCodes=[1,2,3,4,5]
              var shopList = str.Body;
              if (shopList.length > 0) {
                for (var i = 0; i < shopList.length; i++) {
                  for (var j = 0; j < list.length; j++) {
                    if (shopList[i].wareId == list[j].wareId) {
                      shopList[i].wareCount = list[j].wareCount;
                    }
                  }
                }
              }
              if (_this.shopCartList.length == 0) {
                _this.shopCartList = shopList;
                _this.$refs.stockInventory.hide();
              } else {
                for (var i = 0; i < _this.shopCartList.length; i++) {
                  for (var j = 0; j < shopList.length; j++) {
                    if (_this.shopCartList[i].wareId == shopList[j].wareId) {
                      _this.shopCartList[i].wareCount += shopList[j].wareCount;
                      shopList.splice(j, 1);
                    }
                  }
                }
                _this.shopCartList = _this.shopCartList.concat(shopList);
                _this.$refs.stockInventory.hide();
              }

            }

          }
        })
      },
      //获取推荐的智能商品
      showStockInventory(val) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/order/RecommendShopWare",
          dataType: "JSON",
          data: {
            shopId: _this.shopInfo.shopId
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              if (str.Body) {
                _this.$refs.stockInventory.show();
                _this.$refs.stockInventory.setValue(str.Body, val);
              }

            }

          }
        })

      },
      //显示详情
      showinfo() {
        this.$refs.shopInfoPop.show();
        this.$refs.shopInfoPop.setValue(this.shopInfo);

      },
      //显示logo
      showCarLogo(images, el) {
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(el.currentTarget).addClass("action_carimg")
        var _self = this;
        images = images.replace("?x-oss-process=image/resize,m_fill,h_96,w_96", "");
        var imgInfo = images.split('?');

        _self.lideImg.splice(0);
        $.each(imgInfo, function (i, item) {
          _self.lideImg.push({
            src: item
          });
        });
        this.$refs.photoLogo.show(0);
      },
      //显示图片
      showCarImg(images, el, index, isImage) {
        //阻止事件冒泡
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(event.currentTarget).addClass("action_carimg");

        var _self = this;
        var imgInfo = images;
        _self.maxslideImg.splice(0);
        $.each(imgInfo, function (i, item) {
          _self.maxslideImg.push({
            src: item
          });
        });

        this.$refs.photowipe.show(index, false, isImage);
      },
      //提醒弹层
      showToust() {
        Toast("根据过去四周实际订单中产品型号和产品数量推荐");
      },
      //减少商品
      increment(changeShopCartItem) {
        changeShopCartItem.wareCount--
        if (changeShopCartItem.wareCount == 0) {
          this.delShopCart(changeShopCartItem.index)
          this.isShowChangeShopCartPop = false
        }
      },
      //添加通用件
      chooseGenericParts() {
        var _this = this;
        _this.$refs.addGenericPartsNew.show();
      },
      selectedpro(data, callBack) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/order/GetShopSelfWaresByCategory",
          dataType: "JSON",
          data: {
            shopId: _this.shopInfo.shopId,
            cId: data.categoryId
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              callBack();
              _this.$refs.addGenericParts.setWares(str.Body);
            }
          }
        })
      },
      //选择添加通用件
      addProduct(val) {
        var _this = this;

        _this.addToShopCart(val);
        // _this.$refs.addGenericParts.hide();
      },
      //
      keyWordFocus() {
        if (this.keyWord.length == 0) {
          this.searchResault = [];
          this.isShowSearchResault = false;
        } else {
          this.searchWare(this.keyWord);
          this.isShowSearchResault = true;
        }
      },
      keyWordBlur() {
        this.isShowSearchResault = false
      },
      // 搜索商品
      searchWare(key) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/order/SearchShopWare",
          dataType: "JSON",
          data: {
            shopid: _this.shopInfo.shopId,
            key: _this.keyWord,
          },
          success: function (data) {
            _this.searchResault = data.Body;
          }
        });
      },
      delShopCart(index) {
        Toast({
          message: "删除成功",
          position: "center",
          duration: 1500
        });
        this.shopCartList.splice(index, 1);
      },
      findShopCartListIndex(wareId) {
        for (var i = 0; i < this.shopCartList.length; i++) {
          if (wareId == this.shopCartList[i].wareId) {
            return i;
          }
        }
        return -1;
      },
      // 添加到临时购物车
      addToShopCart(item) {

        var _this = this;
        _this.keyWord = "";
        var findShopCartIndex = this.findShopCartListIndex(item.wareId); //_this.shopCartList.findIndex(l=>l.wareId==item.wareId);
        if (findShopCartIndex > -1) {

          Toast('添加成功')
          _this.shopCartList[findShopCartIndex].wareCount++;
          _this.getBillingInformation(_this.shopCartList);
        } else {
          if (item.wareKind == 1) {
            Toast('添加成功')
            _this.shopCartList.push(item);
          } else {
            _this.ajax({
              method: "POST",
              url: resourceUrl + "/order/GetShopWareDetail",
              dataType: "JSON",
              data: {
                shopid: _this.shopInfo.shopId,
                wareId: item.wareId,
              },
              success: function (data) {
                var shopCartItem = data.Body;
                shopCartItem.wareCount = 1;
                shopCartItem.isShowMoreotherCodes = false;
                debugger;
                _this.shopCartList.push(shopCartItem);
              }
            });
          }
        }
      },
      tabRight(cb, wareId) {


        var _this = this;

        if (_this.onceFist == false) {
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/order/GetFitAuto",
            dataType: "JSON",
            data: {
              shopId: _this.shopInfo.shopId,
              wareId: wareId,
            },
            success: function (str) {
              if (str.Header.ErrorCode == 0) {
                cb();
                _this.onceFist = true;
                _this.$refs.parameterPop.setRight(str.Body.validAutos);
              } else {
                Toast(str.Header.Message)
              }
            }
          });
        } else {
          cb();
        }

      },
      // 显示隐藏更多otherCodes
      showMoreotherCodes(item) {
        item.isShowMoreotherCodes = !item.isShowMoreotherCodes;
      },
      // 获取结算信息
      getBillingInformation(shopCartList) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/order/StatisticalPrice",
          dataType: "JSON",
          data: {
            mode: "normal",
            shopId: _this.shopInfo.shopId,
            totalPrice: JSON.stringify(shopCartList),
          },
          success: function (data) {
            _this.shopCartStatistics = data.Body;
          }
        });
      },
      // 点击查看详情
      seeDetails(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/cloudshop/GetShopWareDetail",
          dataType: "JSON",
          data: {
            shopId: _this.shopInfo.shopId,
            wareId: data.wareId
          },
          success: function (str) {
            if (str.Header.ErrorCode == 0) {

              if (str.Body) {
                _this.$refs.parameterPop.show();
                _this.$refs.parameterPop.setValue(str.Body);
                _this.$refs.parameterPop.setWareId(data.wareId)
                _this.onceFist = false;

              }

            } else {
              Toast(str.Header.Message)
            }
          }
        });

      },
      // 修改商品数量
      changeCount(item, index) {
        this.changeShopCartItem = item;
        this.changeShopCartItem.index = index;
        this.changeShopCartItem.oldcount = this.changeShopCartItem.wareCount;
        this.isShowChangeShopCartPop = true;
      },
      // 提交订单
      submitOrder() {
        var _this = this;
        if (_this.submitBtnIsDisable == true) {
          return;
        }
        _this.submitBtnIsDisable = true;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Order/SubmitBeihuoOrder",
          dataType: "JSON",
          data: {
            orderWareList: _this.shopCartList,
            CategoryIds: _this.shopCartList.map(l => l.categoryId), //分类ID列表
            CloudShopIds: [_this.shopInfo.shopId],
          },
          beforeSend: function () {},
          success: function (data) {
            if (data.Body) {
              if (data.Body.result == 'repaircenter_success') {
                if (data.Body.needPay == 0) {
                  // debugger;
                  //路由跳转到成功页面
                  var baseUrl = window.location.protocol + "//" + window.location.host + "/shoph5/orderSuccess.html?or=3&cf=1&shopOrderId="+data.Body.shopOrderId
                  window.location.href=baseUrl;
                  // _this.setupWebViewJavascriptBridge(function(bridge) {
                  //   bridge.callHandler('native_JumpUrl', {url:baseUrl}, function(response) {
                  //   });
                  // });
                  /*window.location.href = "vinSearchResult.html?backurl=native_CloseWebview&cf=1&model=beihuo&shopOrderId=" + data.Body.shopOrderId +
                    "#/offerResultShop";*/
                } else {
                  // _this.GetCashier(data);
                }



              } else {
                if (data.Body.needPay == 0) {
                  var baseUrl = window.location.protocol + "//" + window.location.host +
                    "/manageh5/orderDetails.html?shopOrderId=" + data.Body.shopOrderId + "&cf=1&backurl=native_CloseWebview&shopid=" + data.Body
                    .shopId + "&math=" + Math.random();
                  // "/manageh5/orderItems.html?appType=2&orderItems=10&backurl=native_CloseWebview&shopid=" + data.Body.shopId+ "&math=" + Math.random();

                  // window.location.href=baseUrl
                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: baseUrl
                    }, function (response) {

                    })
                  })
                } else {
                  // _this.GetCashier(data);
                }

              }

            } else {
              Toast({
                message: data.Header.Message,
                position: "center",
                duration: 1500
              });
            }
          }
        });
        setTimeout(() => {
          _this.submitBtnIsDisable = false;
        }, 500);
      },

      //跳转至车型下单页面
      rightBtnEvent() {

        var _this = this;
        localStorage.removeItem('autoparam');
        var baseUrl = window.location.protocol + '//' + window.location.host + "/shoph5/autoPlaceOrder.html?cf=1&backurl=native_CloseWebview&shopid=" +
          _this.shopInfo.shopId + "&math=" + Math.random();
        // debugger;
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {
            url: baseUrl
          }, function (response) {});
        });
      },
      isOpen(data) {
        if (data.selecteds == false || data.selecteds == null) {
          this.$set(data, 'selecteds', true)
        } else {
          this.$set(data, 'selecteds', false)
        }
      }
    }
  }

</script>

<style>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/onekeyinquiriesstyle0626.css");
  @import url("../../assets/css/onekeyinquiriesstyle0815.css");
  @import url("../../assets/css/onekeyinquiriesstyle0705.css");

  @import url("../../assets/css/stockupstyle.css");

  .db-shopText li.db-shopName {
    font-size: .44rem;
  }

  .db-shopText li.db-shopName a.db-shopDetailsEntrance {
    width: auto;
    height: .64rem;
    background: none;
    font-size: .32rem;
    line-height: .96rem;
    text-align: left;
    color: #3086db;
    float: right;
    clear: none;
  }

  .db-shopText li.db-shopMain {
    padding: 0;
  }

  .ibox {
    font-style: normal;
    width: 86%;
    height: auto;
    line-height: .78rem;
    text-align: left;
    float: left;
    clear: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ch-shopActivity .ch-activityBox {
    height: .6rem;
    padding-top: .05rem;
  }

  .ch-shopActivity .ch-activityBox span {
    width: auto;
    max-width: 7.6rem;
    padding-right: .48rem;
    font-size: .32rem;
    line-height: .6rem;
    text-align: left;
    color: #f39c12;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    clear: left;
  }

  .ch-shopActivity .ch-activityBox span b {
    width: auto;
    height: .48rem;
    margin: .06rem .12rem 0 0;
    border: 0;
    border-radius: .12rem;
    background: #f39c12;
    padding: 0 .12rem;
    font-size: .32rem;
    font-weight: normal;
    line-height: .48rem;
    text-align: left;
    color: #fff;
    position: static;
    float: left;
    clear: none;
  }

  .ch-shopActivity .ch-activityBox {
    width: auto;
    background: url(../../assets/images/arrow_gray_down.png) no-repeat center right;
    background-size: .32rem;
    float: left;
    clear: left;
  }

  .cv-stockUpQuery>p a.db-textLink {
    background: none;
    padding-left: 0;
    font-size: .36rem;
    line-height: 1rem;
    text-align: center;
    color: #2d83e6;
    float: right;
    clear: none;
  }

  .dv-margin {
    margin-right: .48rem;
  }

  /*1029 新增*/
  .dz-billEntrance {
    width: 1.44rem;
    height: 1.44rem;
    background: #fff;
    border-radius: .72rem;
    box-shadow: 0 0 0.16rem #e74c3c;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: .4rem;
    bottom: 3.3rem;
    z-index: 299;
  }

  .dz-billEntrance span {
    background: url(../../assets/images/icon_bill.png) no-repeat center top;
    background-size: auto .48rem;
    padding-top: .52rem;
    font-size: .28rem;
    line-height: .36rem;
    text-align: center;
    color: #e74c3c;
    float: left;
    clear: left;
  }

  .db-shopText li.ad-activityTagBox {
    width: 100%;
    padding: .16rem 0;
    background-size: .24rem;
    float: left;
    clear: left;
  }

  .db-shopText li.ad-expandable {
    background: url(../../assets/images/arrow_gray_down.png) no-repeat center right;
    background-size: .32rem;
  }

  .db-shopText li.ad-activityTagBox span {
    width: auto;
    height: .44rem;
    margin-right: .08rem;
    padding: 0 .08rem;
    border-radius: .08rem;
    background: #f39c12;
    font-size: .32rem;
    line-height: .44rem;
    text-align: center;
    color: #fff;
    display: inline-block;
    float: left;
    clear: none;
  }

</style>
