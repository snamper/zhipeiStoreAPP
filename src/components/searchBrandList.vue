<template>
  <!-- 按字母分组排列 -->
  <div class="fc-letterModularBox">
    <dl v-for="(item,index) in list" :key="index">
      <dt>{{item.alphabet}}</dt>
      <dd v-for="(it,ind) in item.brandList" :key="ind">
        <span class="fc-brandPic">
          <template v-if="it.isFamousBrand==0">
            <img v-if="it.brandLogo !=''" :src="it.brandLogo" alt="" style="width: 100%;height: auto;">
            <img v-else src="../assets/images/vendorsConcer/storeLogo.png" alt="" style="width: 100%;height: auto;">
          </template>
          <template v-else>
            <i>
              {{it.brandName.substring(0,1)}}
            </i>
          </template>
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
      <!-- <dd class="fc-bigBrand">
					  <span class="fc-brandPic">博</span>
						<div class="fc-brandMain">
							<ul>
								<li class="fc-brandName">
									<p>博世</p>
									<span class="fc-labelNews" style="display: none;">News</span>
									<span class="fc-labelPay">付费才可查看结果</span>
								</li>
								<li class="fc-brandAlias" style="display: none;">格莱利/CAC/安世/Asimco/华美</li>
							</ul>
						</div>
					  <a  class="fc-addedButton">已添加</a>
					</dd> -->

    </dl>

  </div>
</template>
<script>
  var resourceUrl = process.env.apiDomain;
  import {
    commonMixin
  } from "../config/base/commonMixin.js";
  import {
    Toast
  } from "mint-ui";
  export default {
    name: 'searchBrandList',
    mixins: [commonMixin],
    props: {

    },
    components: {

    },
    data() {
      return {
        list: []
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
            data: {
              brandId: arr
            },
            dataType: "JSON",
            success: function (str) {
              if (str.Header.ErrorCode == 0) {
                Toast('添加成功');
                _this.$emit('refreshlist');
                // _this.$parent.GetCjmlVinQueryPowerDetail();
              }
            }
          })
        }
        
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
