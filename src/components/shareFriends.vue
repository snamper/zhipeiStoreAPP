<template>
  <div class="shareFriends">
    <div class="aa-sharePop">

      <div class="maskBox" v-on:click="clickCancel()"></div>

      <!--以下是更多智能门店的弹层-->
      <div class="aa-shareBox">
        <div class="aa-shareMain">
          <ul>
            <li v-on:click="shareWeiXin()" v-if="isShow==null">
              <span><img src="../assets/images/icon_weixin.png"></span>
              <p>微信</p>
            </li>
            <li v-on:click="shareFriendQ()" v-if="showfriends!=true">
              <span><img src="../assets/images/icon_pengyouquan.png"></span>
              <p>朋友圈</p>
            </li>
          </ul>
        </div>
        <a v-on:click="clickCancel()">取消</a>
      </div>

    </div>
  </div>
</template>

<script>
  import {
    commonMixin
  } from '../config/base/commonMixin.js';
  export default {
    props: ['shareFlag', 'shareData', 'isShow', 'shareInfo','showfriends'],
    name: "shareFriends",
    mixins: [commonMixin],
    data() {
      return {
        // isShow:true,
        postData: {
          "type": "1",
          "shareType": "1",
          "title": '',
          "desc": "",
          "img": "https://c1.51cjml.com/webresources/zhipeihome/pc/images/icon_app.png",
          "href": "",
        }
      }
    },
    methods: {
      clickCancel() {
        var _this = this;
        _this.$emit('shareFriendsHide', false);
        if (_this.$props.isShow == 1) {
          if (_this.$props.shareInfo.type == 1) {
            //跳转回Vin码结果页
            //selectShop.html?v=YV1FW63CXD1090561&cf=1&r=525442
            window.location.href = "selectShop.html?v=" + _this.$props.shareInfo.vinCode + '&cf=1&r=' + Math.random() + '&backurl=' +
              encodeURIComponent(window.location.href);

          } else if (_this.$props.shareInfo.type == 2) {
            //跳转回智能目录页
            ///vendorsConcer.html?r=978197&cf=1
            window.location.href = "vendorsConcer.html?r=" + Math.random() + '&cf=1&backurl=' + encodeURIComponent(window.location.href);

          }
        }

      },
      //分享微信好友
      shareWeiXin() {
        var _this = this;
        _this.$emit('shareFriendsHide', false);
        _this.postData.shareType = "1";
        if (_this.$props.shareFlag == 1) {
          _this.postData.title = '这是个扫VIN码神器，扫一扫精准匹配，超好用';
          _this.postData.desc = '只需对准车架号轻轻一扫，立马知道适用的配件型号和数量。大家用了都说好，你也来试试~';
          _this.postData.href = 'https://www.zhipeicloud.com/appdown/downapp.html';
        };

        if (_this.$props.shareFlag == 2) {
          _this.postData.title = '我要扫车架号找你调货，快来开个智能门店！';
          _this.postData.desc = '这个智能门店很方便，扫一下车架号就能找你下单调货，其他经销商都开店了，就等你了！';
          var destionUrl = 'https://app.zhipeicloud.com/advertise/shareRepairPlant.html?userId=' + _this.$props.shareData;
          _this.postData.href = destionUrl;
        };
        if (_this.$props.shareFlag == 4) {

          _this.postData.title = '这是个扫VIN码神器，扫一扫精准匹配，超好用';
          _this.postData.desc = '只需对准车架号轻轻一扫，立马知道适用的配件型号和数量。大家用了都说好，你也来试试~';
          _this.postData.href = 'https://www.zhipeicloud.com/appdown/downapp.html';
          // if(_this.$props.shareData){
          //   _this.postData.img = _this.$props.shareData.logo;
          // }

        }
        if (_this.$props.shareFlag == 3) {
          _this.postData.title = _this.$props.shareData.title || '这是个扫VIN码神器，扫一扫精准匹配，超好用';
          _this.postData.desc = _this.$props.shareData.desc || '只需对准车架号轻轻一扫，立马知道适用的配件型号和数量。大家用了都说好，你也来试试~';
          _this.postData.href = _this.$props.shareData.href || 'https://www.zhipeicloud.com/appdown/downapp.html';
        }
        if (_this.$props.shareFlag == 5) {
          _this.postData.title = '智配Store 分期支付活动，你也来参加吧！';
          _this.postData.desc = '用智配Store 分期支付，减少对账繁琐，你也来试试吧！';
          _this.postData.href = _this.$props.shareData.href
        }
        if(_this.$props.shareFlag == 6){
           _this.postData.title = _this.$props.shareData.title 
          _this.postData.desc = _this.$props.shareData.desc
          _this.postData.href = _this.$props.shareData.href || 'https://www.zhipeicloud.com/appdown/downapp.html';
        }
        if (_this.androidOrios() == 1) {
          _this.postData = JSON.stringify(_this.postData);
        };
        _this.$emit('callbackshore')
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_WechatShare', _this.postData, function (response) {

          })
        })


      },
      //分享朋友圈
      shareFriendQ() {
        var _this = this;
        _this.$emit('shareFriendsHide', false);
        _this.postData.shareType = "2";
        if (_this.$props.shareFlag == 1) {
          _this.postData.title = '这是个扫VIN码神器，扫一扫精准匹配，超好用';
          _this.postData.desc = '只需对准车架号轻轻一扫，立马知道适用的配件型号和数量。大家用了都说好，你也来试试~';
          _this.postData.href = 'https://www.zhipeicloud.com/appdown/downapp.html';
        };

        if (_this.$props.shareFlag == 2) {
          _this.postData.title = '我要扫车架号找你调货，快来开个智能门店！';
          _this.postData.desc = '这个智能门店很方便，扫一下车架号就能找你下单调货，其他经销商都开店了，就等你了！';
          var destionUrl = 'https://app.zhipeicloud.com/advertise/shareRepairPlant.html?userId=' + _this.$props.shareData;
          _this.postData.href = destionUrl;
        };
        if (_this.$props.shareFlag == 4) {
          _this.postData.title = '这是个扫VIN码神器，扫一扫精准匹配，超好用';
          _this.postData.desc = '只需对准车架号轻轻一扫，立马知道适用的配件型号和数量。大家用了都说好，你也来试试~';
          _this.postData.href = 'https://www.zhipeicloud.com/appdown/downapp.html';

          // if(_this.$props.shareData){
          //   _this.postData.img = _this.$props.shareData.logo;
          // }


        }
        if (_this.$props.shareFlag == 5) {
          _this.postData.title = '智配Store 分期支付活动，你也来参加吧！';
          _this.postData.desc = '用智配Store 分期支付，减少对账繁琐，你也来试试吧！';
          _this.postData.href = _this.$props.shareData.href;
        }

        if (_this.$props.shareFlag == 3) {
          _this.postData.title = _this.$props.shareData.title || '这是个扫VIN码神器，扫一扫精准匹配，超好用';
          _this.postData.desc = _this.$props.shareData.desc || '只需对准车架号轻轻一扫，立马知道适用的配件型号和数量。大家用了都说好，你也来试试~';
          _this.postData.href = _this.$props.shareData.href || 'https://www.zhipeicloud.com/appdown/downapp.html';
        }
        if(_this.$props.shareFlag == 6){
           _this.postData.title = _this.$props.shareData.title 
          _this.postData.desc = _this.$props.shareData.desc
          _this.postData.href = _this.$props.shareData.href || 'https://www.zhipeicloud.com/appdown/downapp.html';
        }
        if (_this.androidOrios() == 1) {
          _this.postData = JSON.stringify(_this.postData);
        };
        if (_this.$props.isShow == 1) {
          _this.$emit('callback')
          //跳转到选择品牌页
          //window.location.href="selectBrand.html?v="+_this.$props.shareInfo.vinCode+'&selectBrand=1&type='+_this.$props.shareInfo.type+'&cf=1&backurl='+encodeURIComponent(window.location.href);

        }
        _this.$emit('callbackshore')
        _this.setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler('native_WechatShare', _this.postData, function (response) {

          })

        })

      }
    }
  }

</script>

<style>
  .aa-sharePop {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 31;
  }

  .maskBox {
    width: 100%;
    height: 100%;
    background: #000;
    filter: alpha(opacity=64);
    -moz-opacity: 0.64;
    -khtml-opacity: 0.64;
    opacity: 0.64;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
  }

  .aa-shareBox {
    width: 100%;
    height: auto;
    max-height: 4rem;
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 30;
  }

  .aa-shareMain {
    width: 100%;
    height: auto;
    padding: .32rem 0 0 .32rem;
    background: #f2f5f7;
    float: left;
    clear: left;
  }

  .aa-shareMain li {
    width: 1.616rem;
    height: auto;
    margin: 0 .32rem .32rem 0;
    float: left;
    clear: none;
  }

  .aa-shareMain li span {
    width: 1.6rem;
    height: 1.6rem;
    background: #fff;
    border-radius: .24rem;
    margin: 0 .008rem;
    text-align: center;
    vertical-align: middle;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: none;
  }

  .aa-shareMain li span img {
    width: auto;
    height: auto;
    max-width: .84rem;
    max-height: .84rem;
  }

  .aa-shareMain li p {
    width: 100%;
    height: .52rem;
    margin-top: .2rem;
    font-size: .36rem;
    line-height: .64rem;
    text-align: center;
    color: #666;
    float: left;
    clear: left;
  }

  .aa-shareBox>a {
    width: 100%;
    height: 1.28rem;
    display: block;
    border-top: 1px solid #dce6ef;
    font-size: .48rem;
    line-height: 1.28rem;
    text-align: center;
    color: #666;
    float: left;
    clear: left;
  }

</style>
