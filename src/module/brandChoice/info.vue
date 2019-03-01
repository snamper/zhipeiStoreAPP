<template>
  <div class="fc-brandChoicePage" v-bind:style="{ 'padding-top': content_padding_top }">

    <!-- 选择品牌-顶部固定 -->
    <div class="fc-brandChoiceTop">
      <searchInput ref="searchInput" v-on:searchDat="searchDat" />
      <focusBrandFilter id="focusBrandFilterid" ref='focusBrandFilter' @confirm="on_brandFeedbackDialog_confirm" />
    </div>
    <!-- <searchInput ref="searchInput" v-on:searchDat="searchDat"/>
		<focusBrandFilter ref='focusBrandFilter' v-bind:input="focusBrandFilter_input" @confirm="on_brandFeedbackDialog_confirm"/> -->
    <!-- 遮罩层 -->
    <div class="fc-mackBox" style="display: none;"></div>

    <!-- 选择品牌-主体内容 -->
    <div class="fc-brandChoiceMain">
      <!-- 无结果 -->
      <searchBrandList ref="searchBrandList" @refreshlist="refreshlist" @loadMore="searchBrandList_loadMore"/>
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
      <a @click="initFillback(1)" class="fc-feedbackLink">我希望收录的品牌</a>
      <a class="fc-completeButton" @click="nextpage">完成</a>
      <a class="fc-doubtButton" @click="inviteDialog_displaying = true"></a>
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

    <shareFriends v-if="shareFriends_displaying" v-on:shareFriendsHide="onShareFriends_hide" v-bind:shareFlag="6" v-bind:shareData="userId"
      @callbackshore='shareFriendsCallback'></shareFriends>
  </div>
</template>
<script>
  var resourceUrl = process.env.apiDomain;
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
  import router from "../../router/vinSearchResult.js";
  import searchInput from '../../components/searchInput';
  import focusBrandFilter from '../../components/focusBrandFilter';
  import searchBrandList from '../../components/searchBrandList';
  import brandFeedbackDialog from '../../components/brandFeedbackDialog'
  import shareFriends from "../../components/shareFriends.vue";
  export default {
    name: 'info',
    mixins: [commonMixin],
    props: {

    },
    components: {
      searchInput,
      focusBrandFilter,
      searchBrandList,
      brandFeedbackDialog,
      shareFriends
    },
    data() {
      return {
        content_padding_top: "0px",
        inputvalue: "",
        searchData: {},
        focusBrandFilter_input: {},
        searchList: [],
        brandFeedbackDialog_launched: false,
        shareFriends_displaying: false, //分享弹层展示中
        inviteDialog_displaying: false,
        brandFeedbackDialog_input: {
          brandName: ''
        },
        userId: {
          title: "我代理的其他汽配品牌都和超级目录合作了，就差你了！",
          desc: "和超级目录合作，为经销商提供整套的配件目录数据系统。",
          href: 'https://www.51cjml.com/brandinvite.html'
        },
        inputshow: false,
        pageIndex:1 //第一页
      }
    },
    computed: {

    },
    created() {
      this.setTitle('选择品牌');
    },
    mounted() {
			this.nativeLsitenBack();
      this.$refs.focusBrandFilter.active({
        mode: this.getQueryString('mode'),
        mode_alphabet: this.getQueryString('mode_alphabet'),
        mode_categoryGroup: this.getQueryString('mode_categoryGroup'),
      });
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
      brandFeedbackDialog_cancel() {
        this.brandFeedbackDialog_launched = false;
      },
      brandFeedbackDialog_commit() {
        this.brandFeedbackDialog_launched = false;
      },
      searchBrandList_loadMore(listOneBusy){
        this.$refs.searchBrandList.listOneBusy = true;
        // listOneBusy=true;
        this.pageIndex++
        if(this.pageIndex >1){
          this.searchData.pageIndex = this.pageIndex;
          var _this = this;
          this.SearchCJMLBrand(function(data){
            _this.$refs.searchBrandList.listOneBusy = data;
            // listOneBusy=data;
          });
        }
        
      },
      on_brandFeedbackDialog_confirm(data) {
        this.searchData = data;
        // this.searchDat(this.inputvalue);
        this.searchData.keyWord = this.inputvalue;
        this.inputshow = false;
        this.pageIndex =1
        this.searchList=[];
        this.searchData.pageIndex = this.pageIndex;
        var _this = this;
        this.SearchCJMLBrand(function(data){
           _this.$refs.searchBrandList.listOneBusy = data;
        });

      },
      searchDat(value) {

        this.inputvalue = value || "";
        if(value){
          this.inputshow = true;
        }else{
          this.inputshow = false;
        }
        // this.inputshow = true;
        this.searchList=[]
        this.searchData.keyWord = this.inputvalue;
        this.pageIndex =1
        this.searchData.pageIndex = this.pageIndex;
        var _this = this;
        this.SearchCJMLBrand(function(data){
           _this.$refs.searchBrandList.listOneBusy = data;
        });

      },
      SearchCJMLBrand(callback){
         var _this = this;
         _this.ajax({
          method: "POST",
          url: resourceUrl + "/Common/SearchCJMLBrand",
          dataType: "JSON",
          data: _this.searchData,
          success: function (str) {
            if (str.Header.ErrorCode == 0) {
              _this.searchList = _this.searchList.concat(str.Body.searchList);
              // _this.searchList = str.Body.searchList;

              if(_this.searchList.length>0){
                var arr= [];
                for(var i=0;i<_this.searchList.length;i++){
                  arr.push(_this.searchList[i].alphabet);
                }
                arr = _this.uniq(arr);
                
                var searchList =[]
                for(var i=0;i<arr.length;i++){
                  var obj={
                    searchList:[]
                  };
                  for(var j=0;j<_this.searchList.length;j++){
                    if(arr[i] ==_this.searchList[j].alphabet ){
                      
                      obj.alphabet = arr[i];
                      obj.searchList.push(_this.searchList[j])
                    }
                  }
                  searchList.push(obj);
                }
                 _this.$refs.searchBrandList.setValue(searchList);
              }else {
                 _this.$refs.searchBrandList.setValue([]);
              }
             


              if(str.Body.searchList.length>0){
                 if(callback){
                  callback(false);
                }
              }else {

                if(callback){
                  callback(true);
                }
              }
            }
            setTimeout(() => {
              _this.content_padding_top = $(".fc-brandChoiceTop").height() + "px";
            }, 100);

          }
        })
      },
      //数组去重
      uniq(arr){
        for (var i = 0;i < arr.length; i++) {
          if(arr.indexOf(arr[i]) != i){
            arr.splice(i,1);
            i--;
          }
    }
        return arr;
      },
      refreshlist() {
        this.searchDat(this.inputvalue);
      },
      // 邀请品牌厂商
      shareBrandShop() {
        this.shareFriends_displaying = true;
        this.inviteDialog_displaying = false;
      },
      shareFriendsCallback() {
        this.shareFriends_displaying = false;
        this.searchDat(this.inputvalue);
      },
      onShareFriends_hide() {
        this.shareFriends_displaying = false;
      },
      nextpage() {
						this.$router.go(-1)
      }
    },

  }

</script>
<style scoped>

</style>
