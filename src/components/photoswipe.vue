<template>
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp vux-previewer" tabindex="-1" role="dialog" aria-hidden="true">
      <!-- Background of PhotoSwipe.
           It's a separate element as animating opacity is faster than rgba(). -->
      <div class="pswp__bg" data-value="50"></div>
      <!-- Slides wrapper with overflow:hidden. -->
      <div class="pswp__scroll-wrap">
        <!-- Container that holds slides.
          PhotoSwipe keeps only 3 of them in the DOM to save memory.
          Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>
        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <!--  Controls are self-explanatory. Order can be changed. -->
            <div class="pswp__counter"></div>
            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
            <button class="pswp__button pswp__button--share" title="Share"></button>
            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
            <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
            <!-- element will get class pswp__preloader--active when preloader is running -->
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
      </div>
      <div class="delete" v-show="initFlag"  v-on:click="clearImg()">删除</div>
  </div>
</template>

<script>
import PhotoSwipe from 'photoswipe';
import UI from 'photoswipe/dist/photoswipe-ui-default';
import objectAssign from 'object-assign'
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
export default {
  methods: {
    init (index) {
      var _self=this;
      var options = objectAssign({
        history: false,
        shareEl: false,
        tapToClose: true,
        index: index
      }, _self.options)
      var i = 0;
      var cloutNumber=0;   
      //处理图片中不带大小的处理得到实际图片大小显示到界面
      for(; i < _self.list.length; i++) {
        if(!(_self.list[i].w>0 && _self.list[i].h>0 )){
          _self.imgReady(_self.list[i],function(){
              cloutNumber=cloutNumber+1;
              if(cloutNumber==_self.list.length){
                _self.photoswipe = new PhotoSwipe(_self.$el, UI, _self.list, options)
                _self.photoswipe.init()
                _self.photoswipe.listen('close', () => {
                  _self.$emit('on-close');
                })
              }
          });
        }
      }
    },
    show (index,data,count) {
      this.init(index);
      this.initFlag=data;
      this.initSum=count;
    },
    close () {
      this.photoswipe.close()
    },
    imgReady(model, ready, load, error) {
        var onready, isonready, width, height, newWidth, newHeight,img = new Image();
        var url=model.src;
         // 加载错误后的事件    
        img.onerror = function () {   
            isonready=true;
            clearInterval(myintervalId);     
            error && error.call(img);
            ready&& ready.call(img);  
            model.w=0;
            model.h=0;  
            img.onload = img.onerror = null;      
            return;
        }; 

        img.src = url;    
        // 如果图片被缓存，则直接返回缓存数据    
        if (img.complete) {
            isonready=true;
            model.w=img.width*2;
            model.h=img.height*2;      
            ready&& ready.call(img);    
            load && load.call(img);  
            img.onload = img.onerror = null;  
            return;    
        };

        width = img.width;    
        height = img.height;

        // 图片尺寸就绪    
        onready = function () {    
            newWidth = img.width;    
            newHeight = img.height;    
            if (newWidth !== width || newHeight !== height ||    
                // 如果图片已经在其他地方加载可使用面积检测    
                newWidth * newHeight > 1    
            ) { 
                isonready=true;  
                // console.log("图片宽度："+img.width);
                // console.log("图片高度："+img.height);
                clearInterval(myintervalId);
                model.w=img.width*2;
                model.h=img.height*2;
                ready&& ready.call(img);   
            };    
        }; 

        var myintervalId= setInterval(onready, 40); 
        // 完全加载完毕的事件    
        img.onload = function () {    
            // onload在定时器时间差范围内可能比onready快    
            // 这里进行检查并保证onready优先执行    
            !isonready && onready();
            load && load.call(img);    
            // IE gif动画会循环执行onload，置空onload即可    
            img.onload = img.onerror = null;    
        };    
    },
    //删除图片
    clearImg(){
    
      // if(this.initSum==0){
      console.log("1:"+index)
        var index=$('.pswp__counter').text().split('/')[0];
        index=index-1;      
        console.log("2:"+index)
        this.imagelist.splice(index,1);
        this.$parent.deleteImg(index);
      // }else{
      //   console.log(2)
      //   this.$parent.deleteImage();
      // }
    	
    	this.photoswipe.close();
      this.init(index);
    }
   
  },
  data: function () {
    return {
      intervalId:null,
      imagelist:[],
      initFlag:false,
      initSum:0,
    };
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
<style>
.delete{
		position: fixed;
		top: 0;
		right: 88px;
		color: #fff;
		width: 44px;
		height: 44px;
		text-align: center;
		line-height: 44px;
		margin-left: .32rem;
	}
</style>