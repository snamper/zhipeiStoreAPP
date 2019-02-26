<template>
  <div class="cd-activityDetailsPop" v-show="isHide">

    <div class="cd-activityDetailsBox">
      <ul>
        <li class="cd-activityTagBox" v-if="tagsInfo && tagsInfo.length>0">
          <span v-for="(oneTag,index) in tagsInfo">{{oneTag}}</span>
        </li>
        <li class="cd-activityDetailsMain">
          <span>活动</span>
          {{activityInfo.activityTitle}}
        </li>
        <li class="cd-activityDetailsExplain">
          <p class="cd-activityDetailsTime">活动时间：{{activityInfo.startDate}}-{{activityInfo.endDate}}</p>
          <p>{{activityInfo.activityContent}}</p>

        </li>
        <li class="cf-activityDetailsPicBox" v-show="imagesLoad.length>0">
          <p>活动图片：</p>
          <div class="cf-activityDetailsPic">
            <dl>
              <dd v-for="(item,index) in imagesLoad" @click="showCarImg(imagesLoad,$event,index,0)">
                <span><img :src="item"></span>
              </dd>
            </dl>
          </div>
        </li>
      </ul>
      <a class="cd-activityDetailsClose" @click="close"></a>
    </div>
    <photowipe v-bind:list="maxslideImg" ref="photowipe" v-bind:options="options"></photowipe>
  </div>
</template>

<script>
  import {
    Indicator
  } from "mint-ui";
  import {
    Toast
  } from "mint-ui";
  import photowipe from './photoswipe.vue';
  export default {
    name: "activitiesInfo",
    data() {
      return {
        isHide: false,
        tagsInfo: [],
        activityInfo: {},
        imagesLoad: [],
        maxslideImg: [],
        options: {
          getThumbBoundsFn(index) {
            var thumbnail = document.querySelectorAll('.action_carimg')[0];
            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            var rect = thumbnail.getBoundingClientRect();
            var ret = {
              x: rect.left + rect.width / 2,
              y: rect.top + pageYScroll + rect.height / 2,
              w: 0
            };
            return ret;
          }
        },
        isImage: 0,
      }
    },
    components: {
      photowipe
    },
    methods: {
      setValue(activity, tags) {

        this.activityInfo = activity;
        this.tagsInfo = tags;
        this.imagesLoad = activity.activityImg || []
      },
      show() {
        this.isHide = true;
      },
      hide() {
        this.isHide = false;
      },
      close() {
        this.hide();
      },
      //显示大图
      showCarImg(images, el, index, isImage) {
        this.isImage = isImage;
        //阻止事件冒泡
        event.stopPropagation();
        $(".action_carimg").removeClass("action_carimg");
        $(event.currentTarget).addClass("action_carimg");
        var _self = this;
        var imgInfo = images;
        _self.slideImg = imgInfo;
        _self.maxslideImg.splice(0);
        $.each(imgInfo, function (i, item) {
          _self.maxslideImg.push({
            src: item
          });
        });
        this.$refs.photowipe.show(index, false, isImage);
      }
    }
  }

</script>

<style scoped>
  @import url("../assets/css/onekeyinquiriesstyle0702.css");

</style>
