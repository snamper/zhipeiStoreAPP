<template>
  <div class="infoFinish">
    <headers title="信息完善" v-show="getuserInfoData.userRule==1"></headers>
    <!--修理厂完善信息 getuserInfoData.userRule==2-->
    <div class="bf-perfectInfoBox" style="margin-top:0;" v-show="getuserInfoData.userRule==2">
      <ul>
        <li class="bf-perfectInfoTitle">
          <p>完善个人信息后即刻获得</p>
          <span>上百家品牌目录供您查询</span>
        </li>
        <li>
          <span>公司/门店：</span>
          <input type="text" name="" placeholder="请输入公司/门店名称(必填)" v-model="userCompanyName">
        </li>
        <li>
          <span>姓名：</span>
          <input type="text" name="" placeholder="请输入姓名(必填)" v-model="userRealName">
        </li>
        <li>
          <span>地址：</span>
          <textarea v-model="userCompanyAddress">上海市嘉定区安亭镇墨玉南路1033号</textarea>
        </li>
        <!--<li class="bf-perfectInfoMainTitle">请选择要查询的配件品类及品牌</li>-->
      </ul>
    </div>
    <!--主题内容 1经销商 2修理厂-->
    <div class="pageMain " :class="[getuserInfoData.userRule==2?'bf-perfectInfoMain':'bf-pageMain']" v-show="getuserInfoData.userRule==2">

      <div class="bf-screenBox" v-if="getuserInfoData.userRule==1">请选择要查询的目录品牌及品类</div>

      <div class="navLeftBox">
        <ul>
          <li ref="leftNav" v-for="(item,index) in leftData" :class="[index==currentIndex?'selected':'']" v-bind:id="item.cGroupId" v-on:click="chooseSort($event,item.cGroupId,index)">
            {{item.cGroupName}}
            <span v-show="item.selCount>0">{{item.selCount}}</span>
          </li>
        </ul>
      </div>
      <div class="mainRightBox" ref="mainRightBox">

        <div class="screenBox">
          <ul>
            <li v-for="(item,index) in cateGoryData" ref="allParts" v-bind:id="item.cId" v-on:click="selectPartsId($event,item.cId,item.gId)">{{item.cName}}</li>
          </ul>
        </div>
        <div class="brandBox" ref="brandBox" v-for="(item,index) in rightData.a">
          <p ref="pl" v-bind:id="item.letter">{{item.letter}}</p>
          <ul>
            <li v-for="(ite,ind) in item.brandList" ref='allLi' v-on:click="selectedBrands($event,index,ind,item.letter,ite.cids,ite.brandId)" :id="ite.cids">
              <span class="brandPic">
                <img :src="ite.brandLogo">
                <!--<img :src="ite.brandLogo">-->
              </span>
              <p class="brandName">{{ite.brandName}}
                <b v-if="false">{{ite.cNames}}</b>
              </p>
              <span class="brandFrame" :class="[ite.isSelect==1?'selected':'']" ref="bodyNav"></span>
            </li>
          </ul>
        </div>
      </div>

      <div class="navLetter">
        <a v-for="(item,index) in rightData.z" v-on:click="gotoIndex($event,index)">{{item}}</a>
      </div>

    </div>
    <!--底部按钮-->
    <div :class="[getuserInfoData.userRule==2?'bf-foolButtonOne':'foolButtonOne']" v-show="getuserInfoData.userRule==2">

      <!--getuserInfoData.userRule==1(经销商)身份点击确认弹出完善店铺信息弹层 -->
      <a v-on:click="(getuserInfoData.userRule==2)?saveUserInfoAndBrands():saveShopuserRule()" class="foolButton">确定</a>
      <a v-if="getuserInfoData.userRule==1" @click="inviteBrandCate=true" class="doubtButton"></a>
    </div>
    <!--分享弹层-->

    <!--关联品牌-->
    <bindBrandSelector :top="top" v-show="getuserInfoData.userRule==1" @submit="on_bindBrandSelector_submit"></bindBrandSelector>

    <div class="brandPop" style="display: none;">
      <ul>
        <li>没有我代理的品牌怎么办？<br>放弃他？不放弃！我要他加进来！</li>
        <li class="brandButton"><a href="">邀请品牌厂商</a></li>
        <a href="">×</a>
      </ul>
    </div>
    <!-- toast提醒弹层 -->
    <div class="bf-toastBox" v-show="isToastShow">{{toastText}}</div>
    <!-- 完善个人信息弹层 getuserInfoData.userRule==1(经销商) -->

    <div class="ao-shopMainSupplementPop" v-if="isShowUserRule&&isShopShow">
      <div class="ao-shopMainSupplement">
        <div class="ao-shopSupplementTop">
          <p>完善个人信息</p>
          <a @click="isShopShow=false">×</a>
        </div>
        <div class="ao-shopSupplementCenter">
          <ul>
            <!-- <li class="ao-shopPrompt">门店信息完整，修理厂才能放心下单，快完善吧！</li> -->
            <li class="bf-shopAddress">
              <span>公司/门店：</span>
              <input type="" name="" placeholder="请输入公司/门店名称(必填)" v-model="shopcloudShopName">
            </li>
            <li class="bf-shopAddress">
              <span>姓名：</span>
              <input type="" name="" placeholder="请输入姓名(必填)" v-model="shopcontacts">
            </li>
            <li class="bf-shopAddress">
              <span>地址：</span>
              <textarea class="bf-shopAddressInput" v-model="shopshopAddress">上海市嘉定区安亭镇墨玉南路1033号</textarea>
            </li>
            <li class="ao-shopIntroduce bf-shopAddress">
              <span>简介：</span>
              <textarea placeholder="最多不超过300个字符" v-model="shopdescription"></textarea>
              <span class="ao-picBox">
                <a v-if="imagesLoad?(imagesLoad.length==6?false:true):true" @click="upLoadImages()"></a>
                <p v-if="IsUpDesc&&(imagesLoad==null||imagesLoad=='')">点击上传照片</p>


                <b v-if="imagesLoad" v-for="(item,index) in imagesLoad" @click="showCarImg(imagesLoad,$event,index,0)">
                  <img :src="item" @touchstart="showDeleteButton(index)" @touchend="clearLoop">
                </b>
              </span>
            </li>
          </ul>
        </div>
        <div class="ao-shopSupplementFool">
          <!-- 初始状态a标签中增加样式：ao-disable -->
          <a  class="passClass" style="width:30%;background: #f95858;" @click="isFirstClick?saveShopInfo(0):''">跳过</a>
          <a @click="isFirstClick?saveShopInfo(1):''" :class="isFirstClick?'':'ao-disable'" style="width:70%">保存</a>
          <!--<a @click="saveShopInfo()" >保存</a>-->
        </div>
      </div>
    </div>

    <!-- 点击邀请的弹层 -->
    <div class="brandPop" v-if="inviteBrandCate">
      <ul>
        <li>没有我代理的品牌怎么办？<br>放弃他？不放弃！我要他加进来！</li>
        <li class="brandButton">
          <a @click="shareBrandShop()">邀请品牌厂商</a>
        </li>
        <a @click="inviteBrandCate=false">×</a>
      </ul>
    </div>

    <!-- 经销商完善信息成功弹层 -->
    <div class="bi-offerPop" v-if="inShopInfoSuccess">
      <div class="bi-adPicBox">
        <a class="bi-adPicMain">
          <img src="../../assets/images/pic_ad3.png">
        </a>
        <a @click="closePop()" class="bi-adPicButton"></a>

      </div>

    </div>
    <!-- 分享APP -->
    <shareFriends v-if="sharePop" v-on:shareFriendsHide="shareFriendsHide" v-bind:shareFlag="2"></shareFriends>
    <!--查看Logo图片-->
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>
  import {
    Toast
  } from 'mint-ui';
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';
  import headers from '../../components/headers.vue';
  import shareFriends from '../../components/shareFriends.vue';
  import bindBrandSelector from '../../components/bindBrandSelector';
  import photowipe from '../../components/photoswipe.vue';

  var resourceUrl = process.env.apiDomain;
  var nowOffset = 0;
  export default {
    name: 'infoFinish',
    mixins: [commonMixin],
    components: {
      headers: headers,
      shareFriends,
      photowipe: photowipe,
      bindBrandSelector
    },
    data() {
      return {
        getuserInfoData: [],
        //修理厂完善信息
        userCompanyName: "",
        userRealName: "",
        userCompanyAddress: "",

        leftData: sessionStorage.getItem('leftData') ? JSON.parse(sessionStorage.getItem('leftData')) : [],
        cateGoryData: [],
        rightData: sessionStorage.getItem('allRightData') ? JSON.parse(sessionStorage.getItem('allRightData'))[0] : [],
        allRightData: sessionStorage.getItem('allRightData') ? JSON.parse(sessionStorage.getItem('allRightData')) : [],
        currentIndex: sessionStorage.getItem('currentIndex') || 0,

        newCid: [],
        newCids: sessionStorage.getItem('infonewCids') ? JSON.parse(sessionStorage.getItem('infonewCids')) : [],
        nextStepAfinish: false,
        gId: "",
        flag: false,
        flagTop: false,
        inviteBrandCate: false,
        sharePop: false,
        n: 0,
        numArr: sessionStorage.getItem('infonumArr') ? JSON.parse(sessionStorage.getItem('infonumArr')) : [],
        isShopShow: true,
        isShowUserRule: false,
        isUserFollow: false,
        shopcloudShopName: "",
        shopcontacts: "",
        shopshopAddress: "",
        shopdescription: "",
        shoplogo: "",
        shopId: 0,
        toastText: "",
        isToastShow: false,
        isFirstClick: true,
        newBrandID: sessionStorage.getItem('newBrandID') ? JSON.parse(sessionStorage.getItem('newBrandID')) : [],
        inShopInfoSuccess: false,
        selCount: 0,
        // 看图需要的参数
        IsUpDesc: true,
        isImage: 0,
        imagesLoad: sessionStorage.getItem('descriptionmages') ? JSON.parse(sessionStorage.getItem('descriptionmages')) : [],
        Loop: undefined,
        maxslideImg: [],
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
        top: '2.24rem',
        bindBrandSelector_newBrands: [], //关联品牌组件返回值
      }
    },
    created() {
      var _this = this;
      _this.getuserInfo().then(_this.GetSelfShopInfo());
      // _this.GetSelfShopInfo();
      _this.getBrandsCount();
      _this.intclear();
      if (_this.getQueryString('backurl')) {
        if (_this.getQueryString('shopName')) {
          sessionStorage.setItem('infoFinish', decodeURI(_this.getQueryString('shopName')));
        } else {
          _this.nextStepAfinish = true;
        }
      } else {
        if (!sessionStorage.getItem('infoFinish')) {
          _this.nextStepAfinish = true;
        };
      }
      _this.setTitle('信息完善');
    },
    beforeMount() {
      var _this = this;
      _this.getLeftData();
    },
    methods: {
      //初始化，清空页面缓存
      intclear() {
        var _this = this;
        _this.newBrandID = [];
        _this.newCids = [];
        // _this.leftData[_this.currentIndex].count=0;
        sessionStorage.clear();
      },
      //获取用户基本信息
      getuserInfo() {
        var _this = this;
        var myPromise = new Promise(function (resolve, reject) {
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/usercenter/getuser",
            dataType: "JSON",
            success: function (data) {
              _this.getuserInfoData = data.Body;
              _this.userCompanyAddress = data.Body.companyAddress != '' ? data.Body.companyAddress : data.Body.lastLoginAddress.Address;
              _this.userCompanyName = data.Body.companyName;
              _this.userRealName = data.Body.realName;
              resolve();
            }
          });

        })
        return myPromise
      },

      //获取经销商基本信息
      GetSelfShopInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/UserCenter/GetSelfShopInfo",
          dataType: "JSON",
          success: function (data) {
            if (data.Body != null) {
              _this.shopId = data.Body.cloudShopId;
              _this.shopcloudShopName = data.Body.cloudShopName != '' ? data.Body.cloudShopName : _this.userCompanyName;
              _this.shopcontacts = data.Body.contacts != '' ? data.Body.contacts : _this.userRealName;
              _this.shopshopAddress = data.Body.shopAddress != "" ? data.Body.shopAddress : _this.userCompanyAddress;
              _this.shopdescription = data.Body.description;
              _this.shoplogo = data.Body.logo;

            } else {
              _this.shopshopAddress = _this.userCompanyAddress;
            }
          }
        });
      },
      //获取用户关注的品牌数量
      getBrandsCount() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/GetBrandsCount",
          dataType: "JSON",
          success: function (data) {
            if (data.Body !== null) {
              _this.isUserFollow = data.Body.userFollowcount > 0 ? true : false;
            }
          }
        });
      },
      //点击定位
      gotoIndex(el, index) {
        var _this = this;
        if (index == 0) {
          $(_this.$refs.mainRightBox).animate({
            scrollTop: 0
          }, 500, function () {});
        } else {
          _this.handlePosi(el);
        }
      },
      //处理定位的问题
      handlePosi(el) {
        var _this = this;
        var me = $(_this.$refs.pl).eq($(el.currentTarget).index());
        var nowTopoffset = me.offset().top;
        var bodyoffset = $(_this.$refs.mainRightBox).offset().top;
        var realSite = $(_this.$refs.mainRightBox).scrollTop();
        if (realSite != nowOffset) {
          nowOffset += realSite - nowOffset;
        }
        nowOffset += nowTopoffset - bodyoffset;
        $(_this.$refs.mainRightBox).animate({
          scrollTop: nowOffset
        }, 500, function () {});
      },
      //默认选中
      defaultSelected() {
        var _this = this;
        if (_this.newCids != '') {
          $.each(_this.newCids, function (index, item) {
            var elment = $(_this.$refs.brandBox).find(_this.$refs.allLi);
            $.each(elment, function () {
              if ($(this).attr('id') == item) {
                $(this).find(_this.$refs.bodyNav).addClass('selected');
              }
            })
          });

        };
        if (sessionStorage.getItem('infonumArr')) {
          $.each(JSON.parse(sessionStorage.getItem('infonumArr')), function (index, item) {
            var gid = item.split("_")[0];
            $('#' + gid).find("span").html(item.split("_")[1])
          });
        };
        $(_this.$refs.leftNav).each(function () {
          if ($(this).find('span').html() == 0) {
            $(this).find('span').hide();
          }
        });
      },
      //获取左侧栏的数据
      getLeftData() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Common/GetCJMLCategoryGroup',
          dataType: "JSON",
          async: false,
          success: function (data) {
            _this.leftData = data.Body;
            // $.each(_this.leftData, function(index, item) {
            // 	item.count=0;
            // });
            _this.cateGoryData = _this.leftData[_this.currentIndex].cList;
            _this.gId = _this.leftData[_this.currentIndex].cGroupId;
            _this.getMiddleData([], _this.leftData[_this.currentIndex].cGroupId);
          }
        })
      },
      //获取中间栏的数据
      getMiddleData(cId, gId) {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Common/GetCJMLBrandCategoryGroup',
          dataType: "JSON",
          data: {
            "cId": cId,
            "gId": gId,
            "mobile": _this.getQueryString("m")
          },
          async: false,
          success: function (data) {
            _this.rightData = data.Body;
            // if(_this.rightData.a[0].letter.indexOf('已关注的品牌')!=-1){
            // 	_this.leftData[_this.currentIndex].count=_this.rightData.a[0].brandList.length;
            // };
            // $(_this.$refs.leftNav).each(function() {
            // });
            // _this.leftData[_this.currentIndex].allNum = data.Body.selectCount;
            _this.allRightData[_this.currentIndex] = _this.rightData;
            sessionStorage.setItem('allRightData', JSON.stringify(_this.allRightData));
          }
        })
      },
      //选择配件
      selectPartsId(el, cId) {
        var _this = this;
        $('#' + cId).toggleClass('selected');
        if ($(el.currentTarget).hasClass('selected')) {
          _this.newCid.push(cId);
        } else {
          for (var i = 0; i < _this.newCid.length; i++) {
            if (cId == _this.newCid[i]) {
              _this.newCid.splice(i, 1);
            }
          }
        };
        // $(el.currentTarget).find(_this.$refs.bodyNav).toggleClass('selected');
        _this.getMiddleData(_this.newCid, _this.gId);
        _this.flag = true;

      },
      //点击选择品类
      chooseSort(el, cGroupId, index) {
        var _this = this;
        _this.gId = cGroupId;
        _this.currentIndex = index;
        $(el.currentTarget).addClass('selected').siblings().removeClass('selected');
        if (_this.allRightData[_this.currentIndex]) {
          _this.rightData = _this.allRightData[_this.currentIndex];
        } else {
          _this.getMiddleData([], _this.leftData[_this.currentIndex].cGroupId);
        };
        _this.cateGoryData = _this.leftData[index].cList;
        // _this.getMiddleData([], cGroupId);


        //切换万分类之后，如果存储的没有符合默认条件选中的就全部清空
        _this.flag = true;
        _this.flagTop = true;
        _this.newCid = [];
        _this.n = $('#' + cGroupId).find('span').html();
        // console.log("chooseSort:"+_this.n )

      },
      //点击选择品牌
      selectedBrands(el, index, ind, letter, cids, brandId) {
        var _this = this;
        var gid = cids.split('_')[0];
        $.each(_this.numArr, function (index, item) {
          if (item.split('_')[0] == gid) {
            _this.n = item.split('_')[1];
          }
        })
        $('#' + gid).find('span').show();
        $(el.currentTarget).find(_this.$refs.bodyNav).toggleClass('selected');
        if ($(el.currentTarget).find(_this.$refs.bodyNav).hasClass('selected')) {
          _this.n++;
          _this.leftData[_this.currentIndex].selCount++;
          _this.newCids.push(cids);
          _this.newBrandID.push(brandId);
          _this.rightData.a[index].brandList[ind].isSelect = 1;
        } else {
          _this.n--;
          _this.leftData[_this.currentIndex].selCount--;
          _this.newCids.splice(_this.newCids.indexOf(cids), 1);
          _this.newBrandID.splice(_this.newBrandID.indexOf(brandId), 1);
          _this.rightData.a[index].brandList[ind].isSelect = 0;
        };

        // if(_this.n == 0) {
        // 	$('#' + gid).find('span').hide();
        // };
        // $('#' + gid).find('span').html(_this.n);
        // _this.leftData[_this.currentIndex].selCount;

        if (_this.numArr.indexOf(gid + '_' + ((_this.n) - 1)) != -1) {
          _this.numArr.splice(_this.numArr.indexOf(gid + '_' + (_this.n - 1)), 1);
        };
        if (_this.numArr.indexOf(gid + '_' + ((_this.n) + 1)) != -1) {
          _this.numArr.splice(_this.numArr.indexOf(gid + '_' + (_this.n + 1)), 1);
        };
        _this.numArr.push(gid + '_' + _this.n);

        // console.log("selectedBrands_newBrandID:"+_this.newBrandID )

        // 验证gid+'_'+_this.n-1 在不在数组里面  在的话删除 gid+'_'+_this.n 加入
        if (_this.newBrandID != '') {
          _this.isAddMore(_this.newBrandID);
          if (_this.newBrandID.length > 5) {
            _this.toastShow('所选新品牌，不可多于5个');
          }
        };

        sessionStorage.setItem('infonewCids', JSON.stringify(_this.newCids));
        sessionStorage.setItem('infonumArr', JSON.stringify(_this.numArr));
        sessionStorage.setItem('leftData', JSON.stringify(_this.leftData));
        sessionStorage.setItem('allRightData', JSON.stringify(_this.allRightData));

      },
      //判断所选品牌是否大于5个
      isAddMore(newBrandID) {
        var _self = this;
        var newArr = [],
          obj = {};
        //给数组去重
        for (var i = 0; i < newBrandID.length; i++) {
          if (!obj[newBrandID[i]]) {
            obj[newBrandID[i]] = 1;
            newArr.push(newBrandID[i]);
          }
        };
        _self.newBrandID = newArr;
        // sessionStorage.setItem('newBrandID', JSON.stringify(_self.newBrandID));
      },
      // 获取分享传递的数据
      shareFriendsHide(data) {
        var _this = this;
        _this.sharePop = data;
      },
      // 点击分享
      shareBrandShop() {
        var _this = this;
        _this.sharePop = true;
        _this.inviteBrandCate = false;
      },
      //去除重复品牌
      deleteRepeat(arr) {
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
          if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
          }
        }
        return res;
      },
      //修理厂完善用户信息保存关注的品牌
      saveUserInfoAndBrands() {
        var _this = this;
        if (!_this.userCompanyName) {
          _this.toastShow('请填写公司名');
        } else if (!_this.userRealName) {
          _this.toastShow('请填写姓名');
        } else if (!_this.userCompanyAddress) {
          _this.toastShow('请填写地址');
        } else if (_this.newBrandID != '') {
          _this.isAddMore(_this.newBrandID);
          if (_this.newBrandID.length > 5) {
            _this.toastShow('所选新品牌，不可多于5个');
          } else if (_this.isUserFollow == false && _this.newBrandID.length <= 0) {
            _this.toastShow('您还未选择新品牌');
          } else {
            _this.saveUserInfo();
          }

        } else {
          if (_this.isUserFollow) {
            _this.saveUserInfo();
          } else {
            _this.toastShow('您还未选择新品牌');
          }
        }

      },
      saveUserInfo() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + '/Common/SaveUserInfoAndBrands',
          dataType: "JSON",
          data: {
            "brandCategory": sessionStorage.getItem('infonewCids') ? JSON.parse(sessionStorage.getItem('infonewCids')) : [],
            "companyName": _this.userCompanyName,
            "realName": _this.userRealName,
            "companyAddress": _this.userCompanyAddress,
          },
          success: function (data) {
            if (data.Body == null) {
              _this.toastText = data.Header.Message;
              _this.isToastShow = true;
              setTimeout(function () {
                _this.isToastShow = false;
              }, 1000);
            } else {
              //跳转到Vin码结果页
              window.location.href = "selectShop.html?v=" + _this.getQueryString('v') + '&cf=1&backurl=' + encodeURIComponent(window.location.href);

            }
          }
        });
      },
      saveShopuserRule() {
        var _this = this;
        if (_this.newBrandID != '') {
          _this.isAddMore(_this.newBrandID);
          if (_this.newBrandID.length > 5) {
            _this.toastShow('所选新品牌，不可多于5个');
          } else if (_this.isUserFollow == false && _this.newBrandID.length <= 0) {
            _this.toastShow('您还未选择新品牌');
          } else {
            _this.isShowUserRule = true;
            _this.isShopShow = true;
          }
        } else {
          if (_this.isUserFollow) {
            _this.isShowUserRule = true;
            _this.isShopShow = true;
          } else {
            _this.toastShow('您还未选择新品牌');
          }
        }
      },
      //经销商完善店铺信息，若未开店。则创建店铺
      
      saveShopInfo(type) {
        var _this = this;
        debugger;
        if ((_this.shopcloudShopName && _this.shopcontacts && _this.shopshopAddress) ||type==0) {
          // console.log(sessionStorage.getItem('infonewCids'))
          _this.isFirstClick = false;
          _this.ajax({
            method: "POST",
            url: resourceUrl + '/Common/SaveShopInfo',
            dataType: "JSON",
            data: {
              "brandCategory": _this.bindBrandSelector_newBrands,
              "cloudShopName": _this.shopcloudShopName,
              "cloudShopId": _this.shopId,
              "contacts": _this.shopcontacts,
              "shopAddress": _this.shopshopAddress,
              "description": _this.shopdescription,
              "logo": _this.imagesLoad.join(),
            },
            success: function (data) {
              // debugger;
              if (data.Body == null) {
                _this.toastText = data.Header.Message;
                _this.isToastShow = true;
                setTimeout(function () {
                  _this.isToastShow = false;
                }, 1000);
              } else {
                _this.inShopInfoSuccess = true;
              }
            },
            error: function () {}
          });
        } else {
          // debugger;
          if (!_this.shopcloudShopName) {
            _this.toastShow('请填写公司名或门店名');
          } else if (!_this.shopcontacts) {
            _this.toastShow('请填写姓名');
          } else if (!_this.shopshopAddress) {
            _this.toastShow('请填写公司/门店地址');
          }
        }
      },
      on_bindBrandSelector_submit(arg) {
        //显示经销商信息填写
        var _this = this;
        // isShowUserRule&&isShopShow
        _this.isShowUserRule = true;
        _this.isShopShow = true;
        _this.bindBrandSelector_newBrands = arg.newBrands;
      },
      //点击上传图片
      upLoadImages() {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_UploadImage', '', function (response) {
            //上传简介图片
            _this.IsUpDesc = false;
            _this.imagesLoad.push(response.url);
            sessionStorage.setItem('descriptionmages', JSON.stringify(_this.imagesLoad));
          });
        });
        sessionStorage.setItem('descriptionmages', JSON.stringify(_this.imagesLoad));
      },
      //点击查看图片
      showCarImg: function (images, el, index, isImage) {
        this.isImage = isImage;
        //阻止事件冒泡
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(event.currentTarget).addClass("action_carimg");
        var _self = this;
        var imgInfo = images;
        _self.slideImg = imgInfo;
        _self.maxslideImg.splice(0);
        $.each(imgInfo, function (i, item) {
          _self.maxslideImg.push({
            src: item
          });
        });
        this.$refs.photowipe.show(index, true, isImage);
      },
      showDeleteButton(index) {
        //阻止事件冒泡
        event.stopPropagation();
        var _this = this;
        clearInterval(this.Loop); //再次清空定时器，防止重复注册定时器
        _this.Loop = setTimeout(function () {
          _this.imagesLoad.splice(index, 1);
        }, 1000);
        sessionStorage.setItem('descriptionmages', JSON.stringify(_this.imagesLoad));
      },
      clearLoop() {
        //阻止事件冒泡
        event.stopPropagation();
        clearInterval(this.Loop);
      },
      //删除图片
      deleteImg(index) {
        var _self = this;
        _self.imagesLoad.splice(index, 1);
        sessionStorage.setItem('descriptionmages', JSON.stringify(_self.imagesLoad));
      },
      closePop() {
        var _this = this;
        _this.inShopInfoSuccess = false;

        var url = window.location.protocol + "//" + window.location.host + "/selectShop.html?v=" + _this.getQueryString('v') +
          '&cf=1&backurl=native_CloseWebview';

        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_CloseWebview', '', function (response) {});
        });

        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_JumpUrl', {
            url: url
          }, function (response) {})
        })


      },
      //信息提示层
      toastShow(message) {
        Toast({
          message: message,
          position: 'center',
          duration: 1000
        });
      },
    },
    mounted() {
      var _this = this;
      // _this.defaultSelected();
      _this.listenBackEvent();
    },
    updated() {
      var _this = this;
      if (_this.flag) {
        $.each(_this.newCids, function (index, item) {
          var elment = $(_this.$refs.brandBox).find(_this.$refs.allLi);
          $.each(elment, function () {
            if ($(this).attr('id') == item) {
              $(this).find(_this.$refs.bodyNav).addClass('selected');
            };
          })
        });
      }
      if (_this.flagTop) {
        $(_this.$refs.allParts).removeClass('selected')
      }
      _this.flagTop = false;
      _this.flag = false;
    }
  }

</script>

<style>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/infoFinish.css");
  @import url("../../assets/css/commonPop.css");

</style>
