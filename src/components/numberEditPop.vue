<template>
    <div class="cf-numberEditPop" v-show="isHide">
        <ul>
            <li class="cf-numberEdit">
                <p>修改数量</p>
                <span>
					<a @click="increment(wareCounts)">-</a>
					<b>{{wareCounts}}</b>
					<a @click="decriment(wareCounts)">+</a>
				</span>
            </li>
            <li class="cf-numberEditButton">
                <a  class="cf-buttonLeft" @click="hide">取消</a>
                <a @click="sive">确认</a>
            </li>
        </ul>
    </div>
</template>

<script>
    import { commonMixin } from "../config/base/commonMixin.js";
    export default {
        name: "numberEditPop",
        mixins: [commonMixin],
        props:['wareCount'],
        data(){
            return {
                isHide:false,
                wareCounts:0,
                wareId:'',
                noincrement:false

            }
        },
        mounted(){

        },
        methods:{
            setvalue(val,bol){
                if(bol){
                  this.noincrement=true;
                }else {
                  this.noincrement=false;
                }

                this.wareCounts = val.wareCount;
                this.wareId = val.wareId;
                this.brandId = val.categoryId

            },
            hide(){
                this.isHide = false;
            },
            show(){
                this.isHide = true;
            },
            increment(data){
              if(this.noincrement){
                var that = this
                this.wareCounts --
                if(this.wareCounts==0){
                  this.hide();

                  this.$emit("siveCounts", that.wareCounts,that.wareId,that.brandId);
                }

              }else {
                if(data>1){
                  this.wareCounts --
                }
              }

            },
            decriment(data){
                this.wareCounts ++
            },
            sive(){
                var that = this
                that.hide();
                if(that.noincrement){
                  that.$emit("siveCounts", that.wareCounts,that.wareId,that.brandId);
                }else {
                  that.$emit("siveCount", that.wareCounts,that.wareId);
                }
            }

        }
    }
</script>

<style scoped>
    @import url("../assets/css/onekeyinquiriesstyle0705.css");
</style>
