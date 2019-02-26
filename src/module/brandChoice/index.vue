<template>
  <div class="fc-brandChoicePage" style="padding: 1.12rem 0 1.28rem;">

    <!-- 选择品牌-顶部固定 -->
    <div class="fc-brandChoiceTop">
      <searchInput ref="searchInput" v-on:searchDat="searchDat" />
    </div>

    <!-- position: fixed;
        top: -.5rem;
        z-index: 10; -->

    <!-- 选择品牌-主体内容 -->
    <div class="fc-brandChoiceMain">

      <!-- 选择品牌-提示 -->
      <div class="fc-brandChoiceRemind" v-show="nodataInput">
        <p>添更多品牌，做更多生意</p>
      </div>

      <!-- 按类别查找 -->
      <div class="fc-categoryLookupBox" v-show="nodataInput">
        <div class="fc-categoryLookupTitle">
          <span>按类别查找</span>
        </div>
        <div class="fc-categoryListBox">
          <ul>
            <li><span class="fc-internationalIcon" @click="tochild(2)">国际品牌</span></li>
            <li><span class="fc-nearbyIcon" @click="tochild(3)">周边在售</span></li>
            <li><span class="fc-letterIcon" @click="initalphabetPicker">首字母查找</span></li>
            <li><span class="fc-addedIcon" @click="tochild(5)">已添加</span></li>
          </ul>
        </div>
        <div class="fc-categoryListTitle">按品类查找</div>
        <div class="fc-categoryListBox">
          <ul>
            <li><span class="fc-filterIcon" @click="toparams(4)">滤清器</span></li>
            <li><span class="fc-brakingIcon" @click="toparams(3)">制动系统</span></li>
            <li><span class="fc-tyreIcon" @click="toparams(30)">轮胎</span></li>
            <li><span class="fc-WiperIcon" @click="toparams(5)">雨刮片</span></li>
            <li><span class="fc-ignitionIcon" @click="toparams(2)">点火系统</span></li>
            <li><span class="fc-beltIcon" @click="toparams(10)">发动机皮带</span></li>
            <li><span class="fc-zsIcon" @click="toparams(19)">正时系统</span></li>
            <li><span class="fc-batteryIcon" @click="toparams(18)">蓄电池</span></li>
            <li><span class="fc-sparkplugIcon" @click="toparams(6)">火花塞</span></li>
            <li><span class="fc-transmissionIcon" @click="toparams(12)">传动系统</span></li>
            <li><span class="fc-chassisIcon" @click="toparams(99)">底盘悬挂</span></li>
          </ul>
        </div>
      </div>
      <focusBrandFilter id="focusBrandFilter" ref='focusBrandFilter' @confirm="on_brandFeedbackDialog_confirm"></focusBrandFilter>
      <!-- 选择品牌-方式 -->




      <searchBrandList id="searchBrandListid" ref="searchBrandList" @refreshlist="refreshlist" />
      <div class="fc-brandNoDataBox" v-if="searchList.length==0">
        <dl>
          <dt>
            <p v-if="inputshow">抱歉，我们没有找到“{{inputvalue}}”品牌</p>
            <p v-else>暂无相关品牌</p>
            <span v-show="inputshow">您可以反馈给我们，我们会努力去找的</span>
          </dt>
          <dd>
            <a v-show="inputshow" @click="initFillback(2)">我要提交</a>
          </dd>
        </dl>
      </div>

    </div>

    <!-- 选择品牌-底部固定 -->
    <div class="fc-brandChoiceFool bottom-menu-fixed">
      <a class="fc-feedbackLink" @click="initFillback(1)">我希望收录的品牌</a>
      <a class="fc-completeButton" @click="nextpage" >完成</a>
      <a @click="inviteDialog_displaying = true" class="fc-doubtButton"></a>
    </div>

    <!-- 点击邀请的弹层 -->
    <div class="brandPop" v-if="inviteDialog_displaying">
      <ul>
        <li>没有我代理的品牌怎么办？<br>放弃他？不放弃！我要他加进来！</li>
        <li class="brandButton">
          <a @click="shareBrandShop()">邀请品牌厂商</a>
        </li>
        <a @click="inviteDialog_displaying = false">×</a>
      </ul>
    </div>
    <brandFeedbackDialog v-if="brandFeedbackDialog_launched" ref="brandFeedbackDialog" :input="brandFeedbackDialog_input" @cancel="brandFeedbackDialog_cancel"
      @commit="brandFeedbackDialog_commit" />

    <alphabetPicker v-if="alphabetPicker_launched" ref="alphabetPicker" :input="alphabetPicker_input" @cancel="alphabetPicker_cancle" @confirm="alphabetPicker_confirm" />
    <!-- 分享弹层 -->
    <shareFriends v-if="shareFriends_displaying" v-on:shareFriendsHide="onShareFriends_hide" v-bind:shareFlag="6" v-bind:shareData="userId"
      @callbackshore='shareFriendsCallback'></shareFriends>
  </div>
</template>
<script>
  import {
    Indicator
  } from "mint-ui";
  import {
    Toast
  } from "mint-ui";
  import {
    commonMixin
  } from "../../config/base/commonMixin.js";
  import {
    MessageBox
  } from 'mint-ui';

  import searchInput from '../../components/searchInput';
  import searchBrandList from '../../components/searchBrandList'
  import focusBrandFilter from '../../components/focusBrandFilter'
  import brandFeedbackDialog from '../../components/brandFeedbackDialog'
  import alphabetPicker from '../../components/alphabetPicker'
  import router from "../../router/brandChoice.js";
  import shareFriends from "../../components/shareFriends.vue";
  var resourceUrl = process.env.apiDomain;
  export default {
    name: 'index',
    mixins: [commonMixin],
    props: {

    },
    components: {
      searchInput,
      searchBrandList,
      focusBrandFilter,
      brandFeedbackDialog,
      alphabetPicker,
      shareFriends
    },
    data() {
      return {
        searchList: [],
        focusBrandFilter_input: {
          mode: 0, // 模式 0: 无固化 1:固化品类 2:固化国际品牌 3:固化周边 4:固化首字母 5:固化已添加
          // mode_categoryGroup : 1 ,  //固化品类时, 需要给个品类组ID
          // mode_alphabet: 'C' 
        },
        searchData: {},
        inputvalue: '',
        brandFeedbackDialog_input: {
          brandName: ''
        },
        brandFeedbackDialog_launched: false,
        alphabetPicker_launched: false,
        alphabetPicker_input: {
          alphabet: "A"
        },
        inviteDialog_displaying: false,
        shareFriends_displaying: false, //分享弹层展示中
        userId: {
          title: "我代理的其他汽配品牌都和超级目录合作了，就差你了！",
          desc: "和超级目录合作，为经销商提供整套的配件目录数据系统。",
          href: 'https://www.51cjml.com/brandinvite.html'
        },
        inputshow: true,
        nodataInput:true,
      }
    },
    created() {
      this.setTitle('选择品牌');
    },
    mounted() {

      this.nativeLsitenBack();
      this.$refs.focusBrandFilter.active({
        mode: 0,
      });
      // this.searchData= this.$refs.focusBrandFilter.getResult();
      $(window).scroll(function (e) {
        // var top = $('#focusBrandFilter .fc-brandChoiceModeChild').offset().top-$(window).scrollTop();
        var listtop = $('#searchBrandListid').offset().top - $(window).scrollTop();
        console.log(listtop)
        if (listtop > 86) {
          $('#focusBrandFilter .fc-brandChoiceModeChild').removeClass("postionclass");
        } else {
          $('#focusBrandFilter .fc-brandChoiceModeChild').addClass("postionclass");
        }
        // debugger;
      })
    },
    computed: {

    },
    methods: {
      initFillback(type) {
        if (type == 2) {
          this.brandFeedbackDialog_input.brandName = this.inputvalue;
        } else {
          this.brandFeedbackDialog_input.brandName = "";
        }
        this.brandFeedbackDialog_launched = true
      },
      tochild(type) {
        router.push({
          name: 'info',
          query: {
            mode: type,
          }
        })
      },
      toparams(id) {
        router.push({
          name: 'info',
          query: {
            mode: 1,
            mode_categoryGroup: id
          }
        })
      },
      initalphabetPicker() {
        this.alphabetPicker_launched = true;
      },
      alphabetPicker_cancle() {

        this.alphabetPicker_launched = false;
      },
      alphabetPicker_confirm(data) {
        router.push({
          name: 'info',
          query: {
            mode: 4,
            mode_alphabet: data.alphabet
          }
        })
        this.alphabetPicker_launched = false;
      },
      brandFeedbackDialog_cancel() {
        this.brandFeedbackDialog_launched = false;
      },
      brandFeedbackDialog_commit() {
        this.brandFeedbackDialog_launched = false;
      },
      refreshlist() {

        this.searchDat(this.inputvalue);
      },
      on_brandFeedbackDialog_confirm(data) {
        this.searchData = data;
        this.inputshow = false;
        this.searchDat(this.inputvalue);
        this.nodataInput = true;
      },
      searchDat(value) {
        this.inputshow = true;
        this.nodataInput = false;
        this.inputvalue = value || "";
        var _this = this;
        this.searchData.keyWord = value;
        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SearchCJMLBrand",
          dataType: "JSON",
          data: _this.searchData,
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.searchList = str.Body.searchList;
              _this.$refs.searchBrandList.setValue(_this.searchList);
            }
          }
        })

      },
      // 邀请品牌厂商
      shareBrandShop() {
        this.shareFriends_displaying = true;
        this.inviteDialog_displaying = false;
      },
      // 分享提醒弹层Hide事件
      onShareVenPop_hide() {
        this.shareVenPop_displaying = false;
      },
      // 分享提醒弹层Callback事件
      onShareVenPop_callback() {
        this.shareVenPop_displaying = false;
        // this.resetUserBrandFollow(); //重置用户关联品牌
      },
      shareFriendsCallback() {
        this.shareFriends_displaying = false;
        this.searchDat(this.inputvalue);
      },
      onShareFriends_hide() {
        this.shareFriends_displaying = false;
      },
      nextpage() {
          var flug=false;
          if(this.searchList.length>0){
            for(var i=0;i<this.searchList.length;i++){
                if(this.searchList[i].brandList.length>0){
                    for(var j=0;j<this.searchList[i].brandList.length;j++){
                        if(this.searchList[i].brandList[j].isUserBrand){
                            flug=true;
                            
                            break;
                        }
                    }   
                }
            }
          }
          if(flug){
            window.history.go(-1);
          }else {
              Toast('至少添加一个品牌')
          }
        
      }
    },

  }

</script>
<style scoped lang="">

</style>
