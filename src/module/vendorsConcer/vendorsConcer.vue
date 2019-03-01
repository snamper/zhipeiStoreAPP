<template>
  <div class="vendorsConcer" ref="mainBox">
    <div class="pageMain pageMargin" style="padding:0;padding-bottom:1.28rem;">

      <!--搜索 只有修理厂才有-->
      <div class="fd-followSearchBox" style="position: fixed; top: 0; left: 0; z-index: 10;" v-if="userRule==2">
        <div class="fc-brandChoiceSeach">
          <div class="fc-brandChoiceSeachLeft" :class="{'fd-brandChoiceSeachLeftTrigger': page_mode==1}">
            <span></span>
            <input type="" name="" placeholder="请输入厂商品牌名称" v-model="searchKey" @input="on_searchKey_input" @click="on_searchKey_click">
            <a class="fc-emptyButton" v-show="searchKey.length>0" @click="on_clearSearchKey_click"></a>
          </div>
          <div class="fc-brandChoiceSeachRight" v-show="page_mode==1">
            <a @click="on_cancelSearchMode_click">取消</a>
          </div>
        </div>
      </div>

      <div class="aa-chooseBox ca-choose" style="margin-top: 1.12rem" v-if="searchResult.length>0">
        <ul class="aa-followCatalog">
          <li v-for="(oneBrand,index) in searchResult">
            <span class="by-choiceBox"></span>
            <span class="aa-shopPic">
              <img v-if="oneBrand.brandLogo" :src="oneBrand.brandLogo">
              <img v-else src="../../assets/images/vendorsConcer/storeLogo.png" alt="">
            </span>
            <span class="fd-labelBox" v-show="oneBrand.isZhiPeiVipPay==1">VIP</span>
            <p class="aa-shopName ce-shopName">
              <span>{{oneBrand.brandName}}<b>{{oneBrand.brandModelName}}</b></span>
            </p>
            <span class="fd-focusedButton" v-if="oneBrand.isSelect==1"><b>已添加</b></span>
            <span class="fd-unfocusButton" v-if="oneBrand.isSelect==0" @click="on_followBrand_click(oneBrand)"><b>添加</b></span>
          </li>
        </ul>
      </div>

      <!--搜索无结果-->
      <div class="ca-followSearchError" style="margin-top: 1.12rem" v-if="searchResult.length==0 && is_search_done">该品牌尚未收录，敬请期待</div>


      <!--常用目录 -->
      <div class="aa-chooseBox ca-choose" :style="{'margin-top': userRule==2?'1.12rem':'0'}" v-show="page_mode==0">
        <p v-show="brandList.length>0">常用目录
          <a v-on:click="is_edit_mode=true;" v-if="!is_edit_mode">编辑</a>
          <a v-on:click="is_edit_mode=false;" v-if="is_edit_mode">完成</a>
        </p>

        <ul class="aa-followCatalog" :class="is_edit_mode?'by-followShop':''" v-if="brandList.length>0">
          <li v-for="(oneBrand,index) in brandList" @click="on_gotoCjml_click(oneBrand.brandUrl,oneBrand)">
            <span v-if="is_edit_mode" class="by-choiceBox" :class="oneBrand.selected?'bw-selected':''" @click="on_checkSelect_click($event,oneBrand)"></span>
            <span class="aa-shopPic">
              <img v-if="oneBrand.brandLogo" :src="oneBrand.brandLogo">
              <img v-else src="../../assets/images/vendorsConcer/storeLogo.png" alt="">
            </span>
            <span class="fd-labelBox" v-show="oneBrand.isZhiPeiVipPay==1">VIP</span>
            <p class="aa-shopName ce-shopName">
              <span>{{oneBrand.brandName}}<b>{{oneBrand.brandModelName}}</b></span>
            </p>
            <span class="fd-topButton" v-show="index>0" v-on:click="setBrandTop($event,oneBrand.brandId)"><b>置顶</b></span>
          </li>
        </ul>
      </div>

      <!--无品牌时的展示-->
      <div class="ca-followCatalogNodate" v-if="init_complete && brandList.length==0" v-show="page_mode==0">
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

    <!-- 查询更多 只有经销商才有 -->
    <div class="foolButtonOne" v-show="userRule==1">
      <a v-on:click="on_findmore_click" class="leftButton">查询更多智能产品目录</a>
    </div>

    <!-- 编辑模式时的底部按钮 -->
    <div class="foolButtonOne" v-show="is_edit_mode && brandList.length>0">
      <a v-on:click="on_deleteConcer_click" class="leftButton">取消关注</a>
    </div>

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

  var resourceUrl = process.env.apiDomain;
  export default {
    name: 'vendorsConcer',
    mixins: [commonMixin],
    components: {},
    data() {
      return {
        init_complete: false, //初始化完成
        page_mode: 0, //0:展示模式  1:搜索模式
        brandList: [], //品牌集合
        userRule: 0, //用户角色 1:经销商 2:修理厂 3:厂商
        is_edit_mode: false, //是否在编辑模式
        searchKey: "", //搜索关键字
        searchResult: [], //搜索结果
        is_search_done: false, //是否搜索结束
      }
    },
    created() {
      var _this = this;
      _this.setTitle('关注的智能产品目录');
      localStorage.setItem("vendorsHtml", window.location.href);
    },
    mounted() {
      var _this = this;
      this.nativeLsitenBack('native_CloseWebview');
      this.LoadComplete(function () {
        _this.setTitle('关注的智能产品目录');
        _this.getUserInfo();
        _this.getBrandsByUid();
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

      //取得用户关注品牌
      getBrandsByUid() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetBrandsByUid",
          dataType: "JSON",
          data: {
            "dataType": 0, //全部关联品牌 0  常用品牌 2
          },
          success: function (data) {
            _this.brandList = [];
            if (data.Body.length > 0) {
              data.Body.forEach(function (oItem, index) {
                oItem.selected = false;
              });
            }
            _this.init_complete = true;
            _this.brandList = data.Body;
          }
        });
      },

      //设置置顶
      setBrandTop(event, brandId) {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/SortUserBrand",
          dataType: "JSON",
          data: {
            brandId: brandId,
          },
          beforeSend: function () {},
          complete: function () {},
          success: function (data) {
            _this.getBrandsByUid();
          }
        });
      },

      //跳转到超级目录
      on_gotoCjml_click(brandUrl, datas) {
        var _this = this;
        _this.checkIsVIP(function (isVip) {
          if (isVip) {
            //是VIP会员, 则跳转超级目录结果页
            _this.seeCatalogLog(datas.brandId)
            
            // _this.count(datas.brandId)
            _this.setupWebViewJavascriptBridge(function (bridge) {
              bridge.callHandler('native_JumpUrl', {
                url: window.location.protocol + '//' + brandUrl + "/h5/#!/?appType=2&cf=1"
              }, function (response) {});
            });
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
          beforeSend: function () {},
          complete: function () {},
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              callBack(str.Body)
            } else {
              Toast(str.Header.Message)
            }
          }
        })
      },
      //查看目录 统计日志
      seeCatalogLog(data) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SeeCatalogLog",
          dataType: "JSON",
          data: {
            sourceType: 2,
            bid: data
          },
          beforeSend: function () {},
          complete: function () {},
          success: function () {}
        })
      },

      on_searchKey_click() {
        this.page_mode = 1;
        this.is_edit_mode = false;
      },

      on_findmore_click() {
        window.location.href = window.location.protocol + "//" + window.location.host + "/brandChoice.html";
      },

      on_clearSearchKey_click() {
        this.searchKey = "";
        this.searchBrand();
      },

      on_cancelSearchMode_click() {
        this.page_mode = 0;
        this.searchKey = "";
        this.searchBrand();
      },

      //选择要删除的目录
      on_checkSelect_click(event, item) {
        //阻止事件冒泡
        event.stopPropagation();
        item.selected = !item.selected;
      },

      getSelectedBrands() {
        var result = [];
        this.brandList.forEach(oneBrand => {
          if (oneBrand.selected) result.push(oneBrand.brandId);
        });
        return result;
      },

      on_deleteConcer_click() {
        var _this = this;
        var selectedBrands = this.getSelectedBrands();
        if (selectedBrands.length > 0) {
          MessageBox.confirm('', {
            title: '',
            message: '确认取消关注当前智能产品目录？',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(action => {
            _this.deleteConcer(selectedBrands);
          });
        } else {
          Toast("请选择要取消关注的品牌目录");
        }
      },

      //确认取消关注的目录
      deleteConcer(brands) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/DeleteUserBrand",
          dataType: "JSON",
          data: {
            "brandId": brands,
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }

            _this.is_edit_mode = false;
            _this.getBrandsByUid();
          }
        });
      },

      on_searchKey_input() {
        this.searchBrand();
      },

      //搜索品牌
      searchBrand() {
        var _this = this;
        this.searchKey = this.searchKey.replace(/[ ]/g, "");
        if (this.searchKey.length == 0) {
          _this.is_search_done = false;
          _this.searchResult = [];
          return;
        }
        //执行搜索
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/GetCJMLBrandByName",
          dataType: "JSON",
          data: {
            "brandName": _this.searchKey,
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }
            _this.is_search_done = true;
            _this.searchResult = res.Body.brands || [];
          }
        });
      },

      on_followBrand_click(oneBrand) {
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
              _this.getBrandsByUid();
              oneBrand.isSelect = 1;
              Toast("添加成功");
            }
          }
        });
      },
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

  .aa-followCatalog li {
    padding-right: 1.76rem;
  }

  .aa-followCatalog li span.fd-topButton {
    width: 1.44rem;
    height: .72rem;
    border: 1px solid #d53533;
    border-radius: .16rem;
    font-size: .32rem;
    line-height: .64rem;
    text-align: center;
    color: #e74c3c;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: .32rem;
    top: .34rem;
  }

  .aa-followCatalog li span.fd-topButton>b {
    padding-left: .4rem;
    background: #fff url(../../assets/images/icon_top.png) no-repeat left center;
    background-size: .28rem;
    font-weight: normal;
  }

  .aa-followCatalog li span.fd-focusedButton {
    width: 1.44rem;
    height: .72rem;
    border: 1px solid #e8e8e8;
    background: #e8e8e8;
    border-radius: .16rem;
    font-size: .32rem;
    line-height: .64rem;
    text-align: center;
    color: #acacac;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: absolute;
    right: .32rem;
    top: .34rem;
  }

  .aa-followCatalog li span.fd-focusedButton>b {
    font-weight: normal;
  }

  .aa-followCatalog li span.fd-unfocusButton {
    width: 1.44rem;
    height: .72rem;
    border: 1px solid #d53533;
    border-radius: .16rem;
    font-size: .32rem;
    line-height: .64rem;
    text-align: center;
    color: #e74c3c;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: .32rem;
    top: .34rem;
  }

  .aa-followCatalog li span.fd-unfocusButton>b {
    font-weight: normal;
  }

  .aa-followCatalog li span.fd-labelBox {
    width: auto;
    height: .44rem;
    padding: 0 .08rem;
    background: url(../../assets/images/label_purchase.png) no-repeat top center;
    background-size: 100% .44rem;
    font-size: .28rem;
    line-height: .36rem;
    text-align: center;
    color: #fff;
    display: block;
    position: absolute;
    top: 0;
    left: .16rem;
    z-index: 3;
  }

  .aa-chooseBox .by-followShop li span.fd-labelBox {
    left: .96rem;
  }

  /*20190227关注的品牌搜索框*/
  .fd-followSearchBox {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #eee;
    float: left;
    clear: left;
  }

  .fc-brandChoiceSeach {
    width: 100%;
    background: #d53533;
    padding: 0 .4rem .32rem;
    float: left;
    clear: left;
  }

  .fc-brandChoiceSeachLeft {
    width: 100%;
    height: .8rem;
    padding: .12rem 0;
    background: #fff;
    border-radius: .4rem;
    overflow: hidden;
    float: left;
    clear: left;
  }

  .fc-brandChoiceSeachLeft>span {
    width: .8rem;
    height: .56rem;
    background: url(../../assets/images/icon_seachGrayFollow.png) no-repeat center center;
    background-size: .36rem;
    border-radius: .4rem;
    float: left;
    clear: none;
  }

  .fc-brandChoiceSeachLeft>input {
    width: 5.16rem;
    height: .56rem;
    border: 0;
    font-size: .4rem;
    line-height: .56rem;
    text-align: left;
    color: #282828;
    float: left;
    clear: none;
  }

  .fc-brandChoiceSeachLeft>input::-webkit-input-placeholder {
    font-size: .36rem;
    color: #ccc;
  }

  .fc-brandChoiceSeachLeft>a {
    width: auto;
    height: .56rem;
    float: right;
    clear: none;
  }

  .fc-brandChoiceSeachLeft>a.fc-emptyButton {
    width: .8rem;
    background: url(../../assets/images/icon_emptyGray.png) no-repeat center center;
    background-size: .48rem;
  }

  .fc-brandChoiceSeachLeft>a.fc-searchButton {
    width: auto;
    padding: 0 .16rem;
    margin-right: .2rem;
    font-size: .36rem;
    line-height: .56rem;
    text-align: center;
    color: #e74c3c;
  }

  .fc-brandChoiceSeachRight {
    width: .8rem;
    height: .8rem;
    float: right;
    clear: none;
  }

  .fc-brandChoiceSeachRight>a {
    width: .8rem;
    height: .8rem;
    font-size: .36rem;
    line-height: .8rem;
    text-align: center;
    color: #fff;
    float: left;
    clear: none;
  }

  .fd-brandChoiceSeachLeftTrigger {
    width: 8rem;
  }

</style>
