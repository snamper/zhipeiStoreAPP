<template>
  <div class="myMessage">
    <!-- <headers title="系统通知"></headers> -->

    <div class="aa-messageListMain" v-if="!noInfo">
      <div class="aa-messageListOne an-messageListOne" v-for="(item,index) in messageList"
           @click="goShopDetails(item.url)">
        <ul>
          <li :class="[item.count>0?'aa-infoLeft':'']"></li>
          <li class="aa-infoCenter">
            <p class="aa-orderStatusText">{{item.title}}</p>
            <p class="aa-messageContent">
              <span>{{item.memo}}</span>
            </p>
          </li>
          <li class="aa-infoRight"></li>
        </ul>
      </div>
    </div>


    <!--无消息的展示-->
    <div class="aa-nodataBox" v-if="noInfo">
      <span class="aa-noInfoPic"></span>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {InfiniteScroll} from 'mint-ui';
  import {commonMixin} from '../../config/base/commonMixin.js';
  import headers from '../../components/headers.vue';

  Vue.use(InfiniteScroll);
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "myMessage",
    mixins: [commonMixin],
    components: {
      headers: headers
    },
    data() {
      return {
        messageList: [],
        pageNum: 1,
        listOneBusy: true,
        noInfo: false,
      }
    },
    created() {
      var _this = this;
      _this.getMessageList();
      //设置原生标题
      _this.setTitle('系统通知');

    },
    mounted() {
      var _this = this;
      _this.listenBackEvent("native_CloseWebview");
    },
    methods: {
      //获取消息列表
      getMessageList() {
        var _this = this;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/usercenter/getmessagelist",
          dataType: "JSON",
          data: {
            "pageNum": _this.pageNum,
            "pageSize": 10,
            "rId": _this.getQueryString('rId'),
          },
          success: function (data) {
            _this.messageList = _this.messageList.concat(data.Body.msg);

            if (data.Body.msg.length <= 0) {
              _this.listOneBusy = true;
            } else {
              _this.listOneBusy = false;
            }
            if (_this.messageList == '') {
              _this.noInfo = true;
            }
            ;
          }
        })
      },
      //点击跳转到订单详情页
      goShopDetails(urls) {
        if (urls != '') {
          var _this = this;
          _this.setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('native_JumpUrl', {
              url: urls
            }, function (response) {
            });
          });
        }
      },
      listOneLoadMore() {
        var _this = this;
        _this.listOneBusy = true;
        _this.pageNum++;
        _this.getMessageList();
      },
    }
  }
</script>

<style>
  @import url("../../assets/css/app.css");
  @import url("../../assets/css/myMessage.css");
  @import url("../../assets/css/nearBystore.css");
</style>
