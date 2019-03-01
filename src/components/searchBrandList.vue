<template>
  <!-- 按字母分组排列 -->
  <div class="fc-letterModularBox" v-infinite-scroll="listOneLoadMore" infinite-scroll-disabled="listOneBusy" infinite-scroll-distance="10" v-show="list.length>0">
    <dl v-for="(item,index) in list" :key="index">
      <template>
        <dt>{{item.alphabet}}</dt>
        <dd v-for="(it,ind) in item.searchList" :key="ind" :class="{'fc-bigBrand':it.isFamousBrand==1}">
          <span class="fc-brandPic">
            <template v-if="it.isFamousBrand==0">
              <img v-if="it.brandLogo !=''" :src="it.brandLogo" alt="" style="width: 100%;height: auto;">
              <img v-else src="../assets/images/vendorsConcer/storeLogo.png" alt="" style="width: 100%;height: auto;">
            </template>
            <!-- <template v-else>
              <i>
                {{it.brandName.substring(0,1)}}
              </i>
            </template> -->
          </span>
          <div class="fc-brandMain">
            <ul>
              <li class="fc-brandName">
                <p>{{it.brandName}}</p>
                <span class="fc-labelNews" v-show="it.isNewBrand">New</span>
                <span class="fc-labelPay" v-show="it.isZhiPeiVipPay!=0">VIP会员可查看结果</span>
              </li>
              <li class="fc-brandAlias">{{it.brandModelName}}</li>
            </ul>
          </div>
          <a :class="{'fc-addedButton':it.isUserBrand}" @click="add(it)">{{it.isUserBrand?'已添加':'添加'}}</a>
        </dd>
      </template>
      
    </dl>

  </div>
</template>
<script>
  var resourceUrl = process.env.apiDomain;
  import Vue from 'vue'
  import { InfiniteScroll } from 'mint-ui';
  Vue.use(InfiniteScroll);
  import {
    commonMixin
  } from "../config/base/commonMixin.js";
  import {
    Toast
  } from "mint-ui";
  import { Lazyload } from 'mint-ui';
  import { MessageBox } from 'mint-ui';

  Vue.use(Lazyload);
  export default {
    name: 'searchBrandList',
    mixins: [commonMixin],
    props: {

    },
    components: {

    },
    data() {
      return {
        list: [],
        listOneBusy: true,
      }
    },
    computed: {

    },
    methods: {
      setValue(data) {
        // data[0].brandList[1].brandLogo ="";
        this.list = data;
      },
      add(data) {
        var arr = []
        arr[0] = data.brandId
        var _this = this;
        if(!data.isUserBrand){
          _this.ajax({
            method: "POST",
            url: resourceUrl + "/Common/FollowOneBrand",
            beforeSend:function(){},
            complete:function(){},
            data: {
              brandId: arr
            },
            dataType: "JSON",
            success: function (str) {
              if (str.Header.ErrorCode == 0) {
                Toast('添加成功');
                data.isUserBrand=true
                // _this.$emit('refreshlist');
                // _this.$parent.GetCjmlVinQueryPowerDetail();
              }
            }
          })
        }else {
          MessageBox.confirm('',{
            title: '',
            message: '取消后将无法查看当前品牌目录<br/>确定取消添加？',
            confirmButtonText: '不再添加',
            cancelButtonText: '继续保留'
          }).then(action => {
            if(action=="confirm"){
              _this.ajax({
                method: "POST",
                url: resourceUrl + "/UserCenter/DeleteUserBrand",
                beforeSend:function(){},
                complete:function(){},
                data: {
                  brandId: arr
                },
                dataType: "JSON",
                success: function (str) {
                  if (str.Header.ErrorCode == 0) {
                    Toast('已取消添加');
                    data.isUserBrand=false
                    // _this.$emit('refreshlist');
                    // _this.$parent.GetCjmlVinQueryPowerDetail();
                  }
                }
              })
            }
          })
        }
        
      },
      listOneLoadMore(){
        this.$emit('loadMore',this.listOneBusy)
        // debugger;
      }
    },
    created() {

    },
    mounted() {

    }
  }

</script>
<style scoped lang="">

</style>
