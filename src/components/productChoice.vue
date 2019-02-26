<template>
  <div class="cc-productChoice">
    <div class="aa-carAdaptationBox" style="display: block;">
      <div class="aa-carPopHead">
        <p>选择产品</p>
        <a v-on:click="cancelProductChoice()">×</a>
      </div>
      <div class="cc-productChoiceMain">
        <div class="cc-productChoiceLeft">

          <a v-for="(item, index) in changeWareBrand" :class="[item.isSelect?'cc-selected':'']"
             v-on:click="selcetItem(item)">{{item.brandName}}</a>

        </div>
        <div class="cc-productChoiceRight">
          <ul>
            <li v-for="(mod, index) in product" v-on:click="selcetProduct(mod)">
              <span :class="[mod.isSelect?'cc-choice cc-selected':'cc-choice']"></span>
              <p class="cc-productCode">{{mod.wareName}}</p>
              <p class="cc-productTab">
                <b class="cc-series">{{mod.seriesName}}</b>
                <b class="cc-imported">{{mod.productionPlace}}</b>
              </p>
              <span class="cc-price">{{mod.warePrice}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="cc-productChoiceFool">
        <a v-on:click="cancelProductChoice()">取消</a>
        <a v-on:click="exchange()" class="cc-buttonRight">确定</a>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from "mint-ui";
  import {commonMixin} from "../config/base/commonMixin.js";
  var resourceUrl = process.env.apiDomain;
  export default {
    name: "productChoice",
    props: ["productChoiceList", "changeWareBrand", "partsId"],
    mixins: [commonMixin],
    components: {},
    watch: {},
    data() {
      return {
        product: []
      };
    },
    created() {
      var _this = this;

      _this.selcetItem(_this.changeWareBrand[0]);
    },
    mounted() {
    },
    methods: {
      cancelProductChoice() {
        var _this = this;
        _this.$emit("cancelProductChoice");
      },
      selcetItem(item) {

        var _this = this;
        _this.changeWareBrand.forEach(element => {
          element.isSelect = false;
        });
        item.isSelect = true;
        _this.product = _this.filterList(item.brandId);
      },
      selcetProduct(mod) {
        console.log(mod);
        var _this = this;
        _this.product.forEach(element => {
          element.isSelect = false;
        });
        mod.isSelect = true;
      },
      exchange() {
        var _this = this;
        console.log(_this.product);
        // var prod = _this.product.filter(element => {
        //   return element.isSelect == true;
        // });

        var prod = [];
        for (var i = 0; i < _this.product.length; i++) {
          if (_this.product[i].isSelect == true) {
            prod.push(_this.product[i]);
            break
          }
        }

        if (prod.length > 0) {
          _this.$emit("CallbackProduct", {partsId: _this.$props.partsId, prod});
          _this.$emit("cancelProductChoice");
        } else {
          Toast({
            message: "请选择产品",
            position: "center",
            duration: 1500
          });
        }
      },
      filterList(brandId) {
        return this.$props.productChoiceList.filter(function (item) {
          item.isSelect = false;
          return item.brandId == brandId;
        });
      }
    },
    computed: {}
  };
</script>

<style>
  @import url("../assets/css/productChoice.css");
</style>
