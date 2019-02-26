<template>
  <div class="howConcer">

    <div class="aa-followCatalogPop">

      <div class="aa-followCatalogPopMain">
        <ul>
          <li v-show="howFlag==0">如何关联品牌厂商智能在线目录</li>
          <li v-show="howFlag==0">
            <p>第一步：进入品牌厂商微信公众号；</p>
            <p>第二步：点击底部菜单“产品目录/产品查询”进入智能目录页面；</p>
            <p>第三步：点击右上角 <img src="../assets/images/icon_userlogin.png"> 图标，用手机号进行注册；</p>
            <p>第四步：返回扫码APP“智配Store”进行操作。</p>
          </li>
          <li v-show="howFlag==1">如何关联经销商门店</li>
          <li v-show="howFlag==1">
            <p>第一步：请直接联系经销商店主，将您添加为其客户，添加成功之后，您就可以自动关联该经销商门店；</p>
            <p>第二步：添加成功之后，直接在"关注的智能门店"查看；</p>
          </li>
        </ul>
        <a v-on:click="hideTanWen()" class="aa-followCatalogClose"></a>
      </div>


    </div>
  </div>
</template>

<script>
  export default {
    props: ['howFlag'],
    name: "howConcer",
    methods: {
      //点击隐藏弹层的文案
      hideTanWen() {
        var _this = this;
        _this.$emit('toParentHowConcer', false);
      }
    }
  }
</script>

<style>
</style>