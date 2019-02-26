<template>
  <div class="vendorsConcer" ref="mainBox">
    <!-- <headers title="关注的智能产品目录" v-if="jumpType!=0"></headers> -->
    <!-- <div class="pageMain pageMargin" :style="jumpType!=0?'':'padding:0;padding-bottom:1.28rem;'"> -->
    <div class="pageMain pageMargin" style="padding:0;padding-bottom:1.28rem;">
      <!-- 最近删除 -->
      <div class="cg-recycleBinBox" v-show="delCount>0" @click="toRecycleBin">
        <span class="cg-recycleBinIcon"></span>
        <p>最近删除</p>
        <span class="cg-number">{{delCount}}</span>
      </div>

      <!-- 搜索 -->
      <div :class="'aa-chooseBox ca-choose ca-followSearchBox'"
        v-if="userRule==2 && isEdit==false">
        <p>搜索查找厂商智能目录</p>
        <ul :class="'ca-chooseBox'">
          <li class="ca-followCatalogNodataText">
            <!-- 点击时的输入框样式  当所有的厂商目录都关注完成之后，“搜索查找厂商智能目录”模块去掉-->
            <p class="ca-followInput">
              <input type="" name="" v-model="CatalogName" placeholder="请输入厂商品牌名称">
              <a class="fc-followCancelButton" @click="cancelSearch">取消</a>
              <a class="ca-followInputButton" @click="searchCatalog">搜索</a>
            </p>
            <!-- 有结果的时候 -->
            <div class="ca-followSearchResult" v-for="(oneBrand,index) in getCatalogBrands" @click="oneBrand.isSelect==1?goStoreList(oneBrand.domain,oneBrand):''">
              <span class="ca-followSearchPic">
                <img v-if="oneBrand.brandLogo" :src="oneBrand.brandLogo">
                <img v-else src="../../assets/images/vendorsConcer/storeLogo.png" alt="">
                </span>
              <span class="ca-followSearchName">{{oneBrand.brandName}}</span>
              <span class="ca-followSearchName">{{oneBrand.brandModelName}}</span>
              <a v-if="oneBrand.isSelect==0" @click="followOneBrand(oneBrand)">关注</a>
              <span v-if="oneBrand.isSelect==1" class="ca-followAlready">已关注</span>
            </div>
            <!-- 报错 -->
            <div class="ca-followSearchError" v-if="getCatalogBrands.length==0 && isSearchResult">该品牌尚未收录，敬请期待</div>
          </li>
        </ul>
      </div>

      <!-- 常用目录  -->
      <div class="aa-chooseBox ca-choose">
        <p v-show="brandIdInfoUse!='' || brandIdInfoNoUse!=''">常用目录
          <a v-on:click="isEdit=true;" v-if="!isEdit&&jumpType==0">编辑</a>
          <a v-on:click="isEdit=false;" v-if="isEdit&&jumpType==0">完成</a>
        </p>
        <ul class="aa-followCatalog  " :class="isEdit?'by-followShop':''" v-if="brandIdInfoUse!=''">
          <li v-for="(item,index) in brandIdInfoUse" v-on:click="goStoreList(item.brandUrl,item)">
            <span v-if="isEdit" class="by-choiceBox" v-bind:class="buildElementClass(item)" v-on:click="checkSelect($event,item)"></span>
            <span class="aa-shopPic">
              <img v-if="item.brandLogo" :src="item.brandLogo">
              <img v-else src="../../assets/images/vendorsConcer/storeLogo.png" alt="">
            </span>
            <p class="aa-shopName ce-shopName">
              <span>{{item.brandName}}<b>{{item.brandModelName}}</b></span>
            </p>
            <!--<p class="aa-shopName aa-vendorsName"><span></span></p>-->
            <span class="aa-inactiveBox aa-commonBox" v-on:click="setOftenUse($event,item.brandId,item.dataType)">常用</span>
          </li>
        </ul>
        <ul class="aa-followCatalog  " :class="isEdit?'by-followShop':''" v-if="brandIdInfoNoUse!=''">
          <li v-for="(item,index) in brandIdInfoNoUse" v-on:click="goStoreList(item.brandUrl,item)">
            <span v-if="isEdit" class="by-choiceBox" v-bind:class="buildElementClass(item)" @click="checkSelect($event,item)"></span>
            <span class="aa-shopPic"><img :src="item.brandLogo"></span>
            <p class="aa-shopName ce-shopName">
              <span>{{item.brandName}}<b>{{item.brandModelName}}</b></span>
            </p>
            <!--<p class="aa-shopName aa-vendorsName">{{item.brandName}}</p>-->

            <span class="aa-inactiveBox" v-on:click="setOftenUse($event,item.brandId,item.dataType)">常用</span>
          </li>
        </ul>
      </div>
      <!--无品牌时的展示 新版-->
      <div class="ca-followCatalogNodate" v-if="brandIdInfoUse=='' && brandIdInfoNoUse==''">
        <ul>
          <li class="ca-followCatalogNodataTitle">公众号添加厂商智能目录</li>
          <li class="ca-followCatalogNodataText">
            <p>第一步：进入品牌厂商微信公众号；</p>
            <p>第二步：点击底部菜单“产品目录/产品查询”进入智能目录页面；</p>
            <p>第三步：点击右上角 <img src="../../assets/images/icon_userlogin.png"> 图标，用手机号进行注册；</p>
            <p>第四步：返回扫码APP“智配Store”进行操作。</p>
          </li>
        </ul>
      </div>

    </div>

    <div class="foolButtonOne" v-show="(brandIdInfoUse!='' || brandIdInfoNoUse!='') && userRule==1">
      <a v-on:click="shareVenApp(getBrandsCountData.todayFollowcount)" class="leftButton">查询更多智能产品目录</a>
    </div>

    <div class="foolButtonOne" v-show="isEdit&&(brandIdInfoUse!='' || brandIdInfoNoUse!='')">
      <a v-on:click="isDeleteConcer()" class="leftButton">取消关注</a>
    </div>

    <!-- toast提醒 关联数量达最大上限 -->
    <div class="bj-toastBoxNumber" v-if="tostToplimit">您今天关联的次数已经达到上限<br>请明天再来吧！</div>

    <!-- toast提醒 -->
    <div class="ca-toastBox" v-if="isToastShow">关注成功</div>

    <div class="by-confirmPop" v-show="isDeleteShow">
      <div class="by-confirmPopBox">
        <p>确认取消关注当前智能产品目录？</p>
        <span>
          <a v-on:click="isDeleteShow=false;" class="by-leftButton">取消</a>
          <a v-on:click="deleteConcer()">确认</a>
        </span>
      </div>
    </div>
    <!--如何关联更多智能产品目录-->
    <HowConcer v-if="concerVendorFlag" v-on:toParentHowConcer="getToParentHowConcer" howFlag="0"></HowConcer>
    <!-- 分享APP提醒弹层 -->
    <shareVenPop v-if="isShareVen" v-on:shareVenHide="shareVenHide" :shareInfo="shareData"></shareVenPop>
    <!--pop坦层-->
    <div class="ct-pop" v-show="stopNo">
      <!-- 关注的智能目录中点击国际目录 -->
      <div class="ct-popBox">
        <span class="ct-picOne"></span>
        <a @click="stopNo =false"></a>
      </div>
    </div>
    <!--排队坦层-->
    <customlayer ref="customlayer" v-on:Submit="Submit" v-on:tostep="tostep" v-on:hide="hide"></customlayer>
  </div>
</template>

<script>
  import {
    MessageBox
  } from 'mint-ui';
  import {
    Toast
  } from 'mint-ui';

  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  import howConcer from '../../components/howConcer.vue';
  import shareVenPop from '../../components/shareVenPop.vue';
  import customlayer from "../../components/customlayer"

  var resourceUrl = process.env.apiDomain;
  export default {
    name: 'vendorsConcer',
    mixins: [commonMixin],
    components: {
      HowConcer: howConcer,
      shareVenPop: shareVenPop,
      customlayer: customlayer
    },
    data() {
      return {
        brandIdInfoUse: ['1'],
        brandIdInfoNoUse: ['2'],
        urls: window.location.href,
        concerVendorFlag: false,
        isShareVen: false,
        getBrandsCountData: [], //关联产品目录信息、次数
        tostToplimit: false,
        shareData: [],
        userRule: 0,
        isEdit: this.getQueryString('edit') ? true : false,
        selectBrands: [],
        selectBrandCout: 0,
        isDeleteShow: false,
        jumpType: this.getQueryString('type') ? this.getQueryString('type') : 0,

        //搜索添加关注
        CatalogName: "",
        getCatalogBrands: [],
        isSearchResult: false,
        delCount: 0,
        stopNo: false,
        timeOut: null
      }
    },
    created() {
      var _this = this;
      _this.isInit();
      _this.setTitle('关注的智能产品目录');
      localStorage.setItem("vendorsHtml", window.location.href);
    },
    mounted() {
      var _this = this;
      this.nativeLsitenBack();
      this.LoadComplete(function () {

        _this.setTitle('关注的智能产品目录');
        _this.getDatas();
        _this.getdeletedbrandsbyuid();
        _this.getBrandsCount();
        _this.getUserInfo();
      })
    },
    methods: {
      //获取用户基本信息
      getUserInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetUser",
          dataType: "JSON",
          success: function (data) {
            if (data.Body) {
              _this.userRule = data.Body.userRule;
            }

          }
        });
      },
      //获取当前登录用户    今日关联(产品目录)次数
      getBrandsCount() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/GetBrandsCount",
          dataType: "JSON",
          success: function (data) {
            if (data.Body !== null) {
              _this.getBrandsCountData = data.Body;
            }
          }
        });
      },
      getDatas() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetBrandsByUid",
          dataType: "JSON",
          data: {
            "dataType": 0, //全部关联品牌 0  常用品牌 2
          },
          success: function (data) {
            if (data.Body.length > 0) {
              data.Body.forEach(function (oItem, index) {
                oItem.selected = false;
              });
            }
            _this.getIsUseData(data.Body);
          }
        }, true);
      },
      //处理常用和不常用的数据
      getIsUseData(data) {
        var _this = this;
        _this.brandIdInfoUse = [];
        _this.brandIdInfoNoUse = [];
        $.each(data, function (index, item) {
          if (item.dataType == 2) {
            _this.brandIdInfoUse.push(item);
          } else {
            _this.brandIdInfoNoUse.push(item);
          }
        });
      },
      //点击设置常用或不常用
      setOftenUse(event, brandId, dataType) {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        if (dataType == 1) {
          _this.isConcer(brandId, dataType);
        } else {
          MessageBox.confirm('', {
            message: '取消常用标记后，将不便查找该厂商目录<br/>确定取消常用标记吗？',
            confirmButtonText: '是',
            cancelButtonText: '否'
          }).then(action => {
            if (action == 'confirm') {
              _this.isConcer(brandId, dataType);
            }
          }).catch(err => {
            if (err == 'cancel') {}
          });
        }
      },
      isConcer(brandId, dataType) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/RelationBrand",
          dataType: "JSON",
          data: {
            "brandIds": brandId,
          },
          success: function (data) {
            if (dataType == 1) {
              var instance = Toast('关联成功');
              setTimeout(() => {
                instance.close();
              }, 500);
            };
            _this.getDatas();
          }
        });
      },

      //点击弹出如何关联的文案
      showHowConcer() {
        var _this = this;
        _this.concerVendorFlag = true;
      },
      //
      getToParentHowConcer(data) {
        var _this = this;
        _this.concerVendorFlag = data;
      },
      //点击跳转到厂商H5
      goStoreList(brandUrl, datas) {
        var _this = this;
        _this.checkIsVIP(function (isVip) {
          if (isVip) {
            //是VIP会员, 则跳转超级目录结果页
            _this.count(datas.brandId)
            var url = "//" + brandUrl + "/h5/#!/?appType=2&cf=1";
            setTimeout(function () {
              window.location.href = url;
            }, 50);
          } else {
            //不是VIP会员, 则跳转付费页
            var jumpUrl = "//" + brandUrl + "/h5/#!/?appType=2&cf=1"
            var baseUrl = window.location.protocol + "//" + window.location.host + "/internantionPayment.html?cf=1&brandId=" + datas.brandId +
              "&jumpUrl=" + encodeURIComponent(jumpUrl);
            window.location.href = baseUrl;
          }
        })
      },
      //验证是否VIP
      checkIsVIP(callBack) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/IsVIP",
          dataType: "JSON",
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              callBack(str.Body)
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //计数接口
      count(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeeCatalogLog",
          dataType: "JSON",
          data: {
            sourceType: 2,
            bid: data
          },
          success: function () {

          }
        })
      },
      shareVenApp(count) {
        var _this = this;
        window.location.href =  window.location.protocol + "//" + window.location.host + "/brandChoice.html";
      },
      // 获取分享传递的数据
      shareVenHide(data) {
        var _this = this;
        _this.isShareVen = data;
        _this.isShareVen = false;
      },
      //选择要删除的目录
      checkSelect(event, item) {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        item.selected = !item.selected;
        if (item.selected) {
          _this.selectBrands.push(item.brandId);
        } else {
          var index = _this.selectBrands.indexOf(item.brandId)
          _this.selectBrands.splice(index, 1);
        }
        _this.selectBrandCout = _this.selectBrands.length;
      },
      buildElementClass(item) {
        if (item.selected) return "bw-selected";
        return "";
      },
      isDeleteConcer() {
        var _this = this;
        if (_this.selectBrandCout > 0) {
          _this.isDeleteShow = true;

        } else {
          Toast("请选择要取消关注的品牌目录");
        }
      },
      //确认取消关注的目录
      deleteConcer() {
        var _this = this;
        _this.isDeleteShow = false;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/DeleteUserBrand",
          dataType: "JSON",
          data: {
            "brandId": _this.selectBrands,
          },
          success: function (data) {
            if (data.Body == 1) {

              var url = window.location.protocol + "//" + window.location.host;
              switch (_this.jumpType) {
                case 0:
                  _this.getDatas(); //刷新列表
                  _this.getdeletedbrandsbyuid();

                  _this.isEdit = false;
                  _this.selectBrands = [];
                  _this.selectBrandCout = 0;
                  break;
                case '1':
                  //跳回修理厂询价下单页offerInquiryNew.vue，并刷新常用智能目录列表
                  url += "/vinSearchResult.html?v=" + _this.getQueryString('v') + '&manageBack=1&cf=1';
                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: url
                    }, function (response) {});
                  });
                  break;
                case '2':
                  //跳回厂商或经销商Vin码结果页，并刷新常用智能目录列表
                  url += "/selectShop.html?v=" + _this.getQueryString('v') + '&cf=1&manageBack=1&r=' + Math.random();
                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: url
                    }, function (response) {});
                  });
                  break;
                case '3':
                  url += "/selectShop.html?v=" + _this.getQueryString('v') + '&cf=1&manageBack=1&r=' + Math.random() + '#/manufacturerPage';
                  _this.setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler('native_JumpUrl', {
                      url: url
                    }, function (response) {});
                  });
                default:
                  break;
              }
            } else {
              Toast(data.Header.Message);
            }
          }
        });
      },
      //取消搜索
      cancelSearch() {
        var _this = this;
        _this.isSearchResult = false;
        _this.getCatalogBrands = [];
      },

      //搜索
      searchCatalog() {
        var _this = this;
        _this.CatalogName = _this.CatalogName.replace(/[ ]/g, "");
        if (_this.CatalogName.length > 0) {
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/Common/GetCJMLBrandByName",
            dataType: "JSON",
            data: {
              "brandName": _this.CatalogName,
            },
            success: function (res) {
              if (res.Header.ErrorCode != 0) {
                Toast(res.Header.Message);
                return;
              }
              _this.isSearchResult = true;
              _this.getCatalogBrands = res.Body.brands || [];
            }
          });
        } else {
          Toast("请输入厂商品牌关键字");
        }
      },

      followOneBrand(oneBrand) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/AppendUserBrandFollow",
          dataType: "JSON",
          data: {
            brandIds: [oneBrand.brandId]
          },
          success: function (data) {
            if (data.Body) {
              //刷新列表
              _this.getDatas();
              oneBrand.isSelect = 1;
              Toast("关注成功");
            }
          }
        });
      },
      //获取回收站品牌列表
      getdeletedbrandsbyuid() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetDeletedBrandsByUid",
          dataType: "JSON",
          success: function (data) {
            _this.delCount = data.Body.length;

          }
        });

      },
      //跳到最近删除页面
      toRecycleBin() {
        var _this = this;

        // 目前是测试

        // var hostUrl = window.location.protocol + '//' + window.location.hostname +':'+ window.location.port+'/recycleBin.html'


        var url = window.location.protocol + "//" + window.location.host + "/recycleBin.html?backurl=native_CloseWebview&cf=1";
        window.location.href = url;
        // _this.setupWebViewJavascriptBridge(function(bridge) {
        //     bridge.callHandler('native_JumpUrl', {url:url}, function(response) {
        //     });
        // });

      },
      Submit(brandUrl, type, brandName, brandId) {

        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/DistributorTask/UsePrivilege',
          dataType: "JSON",
          success: function () {}
        })

        clearTimeout(_this.timeOut);
        _this.$refs.customlayer.hide();
        //计数
        _this.count(brandId)
        var url = "//" + brandUrl + "/h5/#!/?appType=2&cf=1";
        setTimeout(function () {
          window.location.href = url;
        }, 50);

      },
      tostep() {
        var _this = this;
        clearTimeout(_this.timeOut);
        _this.$refs.customlayer.hide();
        var baseUrl = window.location.protocol + '//' + window.location.host + "/step.html?backurl=native_CloseWebview";
        this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {
            url: baseUrl
          }, function (response) {})
        })

      },
      hide() {
        var _this = this;
        clearTimeout(_this.timeOut);
      }

    }
  }

</script>

<style>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/vendorsConcer/vendorsConcer.css");
  @import url("../../assets/css/deleteOperation.css");
  @import url("../../assets/css/popstyle.css");

  .bj-toastBoxNumber {
    width: 7.6rem;
    height: 1.84rem;
    margin: -.92rem 0 0 -3.8rem;
    background: rgba(0, 0, 0, 0.78);
    border-radius: .32rem;
    font-size: .4rem;
    line-height: .68rem;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 40;
  }

  .aa-followCatalog li p.aa-shopName>span b {
    font-weight: normal;
    color: #999;
  }

  .aa-followCatalog li p.aa-shopName>span {
    width: auto;
    max-width: 6.4rem;
    height: auto;
    font-size: .36rem;
    line-height: .5rem;
    word-break: break-all;
  }

  .aa-followShop li p.aa-shopName,
  .aa-followCatalog li p.ce-shopName {
    min-height: 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .cg-recycleBinBox {
    width: 100%;
    height: auto;
    min-height: 1.28rem;
    background: #fff url(../../assets/images/arrow_gray.png) no-repeat 9.52rem center;
    background-size: .16rem;
    padding-left: .32rem;
    border-bottom: 1px solid #dce6ef;
    float: left;
    clear: left;
  }

  .cg-recycleBinBox span {
    width: .88rem;
    height: .88rem;
    margin-top: .2rem;
    display: block;
    float: left;
    clear: none;
  }

  .cg-recycleBinBox span.cg-recycleBinIcon {
    border-radius: .44rem;
    background: #f0f0f0 url(../../assets/images/icon_recycleBinGray.png) no-repeat center center;
    background-size: .48rem;
    margin-right: .32rem;
  }

  .cg-recycleBinBox p {
    width: auto;
    height: 1.28rem;
    font-size: .4rem;
    line-height: 1.28rem;
    text-align: left;
    color: #666;
    display: block;
    float: left;
    clear: none;
  }

  .cg-recycleBinBox span.cg-number {
    width: auto;
    min-width: .48rem;
    height: .48rem;
    margin-top: .4rem;
    margin-left: .2rem;
    padding: 0 .04rem;
    border-radius: .32rem;
    background: #e74c3c;
    font-size: .32rem;
    line-height: .46rem;
    text-align: center;
    color: #fff;
    float: left;
    clear: none;
  }

</style>
