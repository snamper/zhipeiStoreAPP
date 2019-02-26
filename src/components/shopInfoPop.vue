<template>
  <div class="ae-followCatalogPop" v-show="ishide">
    <div class="ae-followCatalogPopMain ae-cloudShopDestract">
      <!-- 关闭标签 -->
      <a class="ae-followCatalogClose" @click="ishide = false"></a>
      <!-- 店铺简介 -->
      <div class="ae-fitBrandName">
        <span>门店简介</span>
      </div>
      <!-- 简介内容 -->
      <div class="ao-shopIntroduceBox">
        <ul>
          <li v-show="shopInfo.business != ''">
            <span>主营：</span>
            <p>{{shopInfo.business}}</p>
          </li>
          <li v-show="shopInfo.desc !=''">
            <span>简介：</span>
            <p>{{shopInfo.desc}}</p>
          </li>
          <li v-show="shopInfo.address !=''">
            <span>地址：</span>
            <p>{{shopInfo.address}}</p>
          </li>
          <li>
            <span>图片：</span>
            <!--<p>李四</p>-->
            <span class="ao-businessCardPic" v-for="(item,index) in shopInfo.pics" v-show="shopInfo.pics.length>0">
              <img :src="item" @click="showCarImg(shopInfo.pics,$event,index,0)">
            </span>
            <p v-show="shopInfo.pics.length==0">暂无</p>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shopInfoPop",
    data() {
      return {
        ishide: false,
        shopInfo:{
          pics:[]
        }
      }
    },
    methods: {
      show() {
        this.ishide = true;
      },
      hide() {
        this.ishide = false;
      },
      setValue(info){
        this.shopInfo = info;
      },
      showCarImg(images, el, index, isImage){

        this.$emit("showPhoto", images, el, index, isImage);
      }
    }
  }
</script>

<style scoped>
  /* 店铺简介的样式 */
  .ae-cloudShopDestract {
    height: 7.84rem;
    top: 4.96rem;
  }

  .ae-cloudShopDestract .ae-followCatalogClose {
    top: 3.92rem;
  }

  .ae-destractCon {
    height: 6.4rem;
    padding: .32rem;
    background: #fff;
    border-top: 1px solid #ccc;
    margin-bottom: .3rem;
    overflow: hidden;
    overflow-y: auto;
    font-size: .32rem;
    text-align: justify;
    color: #666;
  }

  .ae-destractCon p {
    line-height: .64rem;
  }

  .ao-shopIntroduceBox {
    width: 100%;
    height: 6.16rem;
    margin-top: .32rem;
    overflow: hidden;
    float: left;
    clear: left;
  }

  .ao-shopIntroduceBox ul {
    width: 8.4rem;
    height: 6.16rem;
    padding-bottom: .08rem;
    margin-left: .32rem;
    overflow-x: hidden;
    overflow-y: auto;
    float: left;
    clear: left;
  }

  .ao-shopIntroduceBox li {
    width: 8.08rem;
    height: auto;
    padding-left: 1.5rem;
    float: left;
    clear: left;
  }

  .ao-shopIntroduceBox li span {
    width: 1.36rem;
    height: .64rem;
    margin-left: -1.36rem;
    font-size: .32rem;
    line-height: .64rem;
    text-align: left;
    color: #666;
    float: left;
    clear: none;
  }

  .ao-shopIntroduceBox li p {
    width: 100%;
    height: auto;
    font-size: .32rem;
    line-height: .64rem;
    text-align: left;
    color: #333;
    float: left;
    clear: none;
  }

  .ao-shopIntroduceBox li span.ao-businessCardPic {
    width: 1.39rem;
    height: 1.39rem;
    margin-left: 0.1rem;
    margin-top: .1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #dce6ef;
    box-shadow: 0.08rem 0.08rem 0 #dce6ef;
    float: left;
    /*clear: left;*/
  }

  .ao-shopIntroduceBox li span.ao-businessCardPic img {
    width: 100%;
    height: 100%;
    /*max-width: 1.39rem;*/
    /*max-height: 1.39rem;*/
  }
</style>
