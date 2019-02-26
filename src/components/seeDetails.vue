<template>
	<div class="seeDetails">
		<!--以下是门店主营业务的弹层-->
		<div class="maskBox" v-on:click="clickHide()"></div>
		<div class="aa-carAdaptationBox aa-shopPop">
			<div class="aa-carPopHead">
				<p><b>这里是  {{getParentData.shopName}}</b>门店主营</p>
				<a v-on:click="clickHide()">×</a>
			</div>
			<div class="aa-shopOwner">{{getParentData.business}}</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:"seeDetails",
		props:['parentData'],
		data(){
			return{
				getParentData:this.$props.parentData,
			}			
		},
		methods:{
			//点击隐藏查看碳层
			clickHide()
			{
				var _this=this;
				_this.$emit("hideDetails",false);
			}
		},
		
	}
</script>

<style>
	@import url("../assets/css/app.css");
</style>