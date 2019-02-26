<template>
  <div class="cc-productChoice" v-show="isShow">
    <div class="aa-carAdaptationBox" style="display: block;">
      <div class="aa-carPopHead">
        <p>添加通用件</p>
        <a v-on:click="hide()">×</a>
      </div>
      <div class="cc-productChoiceMain">
        <div class="cc-productChoiceLeft">
          <a v-for="(item, index) in changeWareBrand" :class="[item.isSelected?'cc-selected':'']" v-on:click="selcetItem(item)">{{item.categoryName}}</a>

        </div>
        <div class="cc-productChoiceRight">
          <ul v-show="product.length>0">
            <li v-for="(mod, index) in product" v-on:click="selcetProduct(mod)">
              <span :class="[mod.isSelected?'cc-choice cc-selected':'cc-choice']"></span>
              <span class="cc-box">
                <p class="cc-productCode">{{mod.brandName}}&nbsp&nbsp{{mod.wareName}}</p>
                <!--<p class="cc-productTab">-->
                  <!--<b class="cc-series"></b>-->
                  <!--&lt;!&ndash;<b class="cc-imported">{{mod.productionPlace}}</b>&ndash;&gt;-->
                <!--</p>-->
              </span>

              <span class="cc-price">{{mod.warePrice}}</span>
            </li>
          </ul>

          <ul v-show="product.length==0">
            <li class="cw-productNo"></li>
          </ul>

        </div>
      </div>
      <div class="cc-productChoiceFool">
        <a v-on:click="hide()">取消</a>
        <a v-on:click="exchange()" class="cc-buttonRight">确定</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Toast
  } from "mint-ui";
  import {
    commonMixin
  } from "../config/base/commonMixin.js";

  export default {
    name: "addGenericParts",
    props: [],
    mixins: [commonMixin],
    data() {
      return {
        product: [],
        isShow: false,
        changeWareBrand: []
      };
    },
    mounted() {

    },
    methods: {
      hide() {
        this.isShow = false;
      },
      show() {
        this.isShow = true;
      },
      setCategorys(value) {
        this.changeWareBrand = value;
      },
      setWares(value) {
        this.product = value
      },
      selcetItem(item) {
        var _this = this;
        _this.$emit("selectedpro", item, function () {
          _this.changeWareBrand.forEach(element => {
            element.isSelected = false;
          });
          item.isSelected = true;

        })

      },
      selcetProduct(mod) {
        var _this = this;
        _this.product.forEach(element => {
          element.isSelected = false;
        });
        mod.isSelected = true;
      },
      exchange() {
        var _this = this;
        var prod = null;
        for (var i = 0; i < _this.product.length; i++) {
          if (_this.product[i].isSelected == true) {
            prod = _this.product[i]
            break
          }
        }
        if (prod) {
          _this.$emit("addProduct", {
            wareKind: prod.wareKind, //商品类型
            wareId: prod.wareId, //商品ID
            wareName: prod.wareName, //商品名称
            brandId: prod.brandId, //品牌ID
            brandName: prod.brandName, //品牌名称
            categoryId: prod.categoryId, //品类ID
            categoryName: prod.categoryName, //品类名称
            sortPrice: prod.sortPrice, //参考价
            warePrice: prod.warePrice, //展示用价格
            wareCount: 1 //商品数量
          });
        } else {
          Toast({
            message: "请选择产品",
            position: "center",
            duration: 1500
          });
        }
      },
    }
  }

</script>

<style scoped>
  @import url("../assets/css/productChoice.css");

</style>
