<template>
  <div class="fitCar">
    <div class="ae-followCatalogPop">
		<div class="ae-followCatalogPopMain">
			<!-- 关闭标签 -->
			<a class="ae-followCatalogClose" @click="closeFitCar()"></a>
			<!-- 适配车型标题 -->
			<div class="ae-fitBrandName" v-if="autoinfo">
				<!--<span>适配车型：{{autoinfo.brandName?autoinfo.brandName.substring(1):''}} {{autoinfo.ModelName||autoinfo.seriesName}}</span>-->
        <span>适配车型</span>
			</div>
			<!-- 适配内容 -->
			<div class="tableWarp">
          <div class="cn-carMainBox" v-for="(items,index) in autoDetail">
            <div class="cn-carBrandBox" >
              {{items.abName}}
            </div>
            <table class="isTableList">
              <tbody>
              <template v-for="(item,index) in items.details">
                <tr class="isBgColor-auto">
                  <td width="20%" colspan="2">{{item.amName}}&nbsp;{{item.asName}}</td>
                </tr>
                <tr v-for="(ite,ind) in item.aparams" :class="[ind%2==0?'isBgColor-sub2':'isBgColor-sub1']">
                  <td style="float:left" width="48%" v-if="ite.param!=''">{{ite.param}}</td>
                  <td style="float:left" width="48%" v-if="ite.year!=''">{{ite.year}}</td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>


				</div>
		</div>

	</div>
  </div>
</template>

<script>

export default {
  props:['autoinfo'],
  name:"fitCar",
  data(){
    return{
      autoDetail:[],
    }
  },
  created(){
    var _this=this;
  },
  methods:{
    // 点击关闭适配车型
    closeFitCar(){
      var _this=this;
      _this.$parent.fitCarIsShow=false;
    }
  }
}
</script>

<style>
/* 适配车型的样式 */
.ae-followCatalogPop
{
	width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.64);
    position: fixed;
    top: 0;
    left: 0;
	z-index: 316;
	overflow: hidden;
}
.ae-followCatalogPopMain
{
	width: 87.2%;
    height: 13.12rem;
    position: fixed;
	left: 6.4%;
	top:2.32rem;
	z-index: 33;
	background: #fff;
}
.ae-fitBrandName
{
	width: auto;
	height: 1.04rem;
	background: #f3f7fa;
	padding:0 .32rem;
	line-height: 1.04rem;
	font-size: .36rem;
	color: #333;
}
.tableWarp {
	height:11.4rem;
    padding: .32rem;
    background: #fff;
    border-top: 1px solid #ccc;
	margin-bottom: .3rem;
	overflow: hidden;
	overflow-y: auto;
}
.isTableList {
    width: 100%;
}
.isTableList {
    line-height: .8rem;
}
.isBgColor-auto {
    background: #e5faff;
}
.isBgColor-sub1 {
    background: #fff;
}
.isBgColor-sub2 {
    background: #f6f6f6;
}
.isTableList tbody tr {
    width: auto;
    height: .747rem;
    line-height: .747rem;
    color: #666;
    padding: 0 .32rem;
}
.isTableList tbody td {
    font-size: .32rem;
    padding-left: .15625rem;
}
.ae-followCatalogClose{
	display: block;
	width: .76rem;
	height: 1.92rem;
	background: url(../assets/images/button_closePop.png) no-repeat center 0;
	background-size:.76rem 1.92rem;
	position: fixed;
	left: 83.6%;
	top: 1.28rem;
}
  .fitCar .ae-followCatalogPopMain {
    top: 2.32rem !important;
  }
  .cn-carMainBox {
    width: 100%;
    height: auto;
    float: left;
    clear: left;
  }
  .cn-carBrandBox {
    width: 100%;
    height: auto;
    font-size: .36rem;
    line-height: 1.04rem;
    text-align: left;
    color: #333;
    float: left;
    clear: left;
  }
</style>
