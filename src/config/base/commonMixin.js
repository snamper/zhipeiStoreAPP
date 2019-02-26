import {
  Indicator
} from 'mint-ui';

var scrollingElement = require('../../assets/js/scrolling-element')
var commonMixin = {
  data() {
    return {
      behaviorRecorder: this.getBehaviorRecorder(),
    }
  },
  methods: {

    //是否支付宝环境
    isAliPay() {
      var ua = navigator.userAgent.toLowerCase();
      return ua.indexOf('alipayclient') !== -1;
    },

    //是否微信环境
    isWechat() {
      var ua = navigator.userAgent.toLowerCase();
      return ua.indexOf('micromessenger') !== -1;
    },

    //判断安卓或苹果环境
    androidOrios() {
      var _this = this;

      if (this.getCookie('CJML.APP.Intellip.DevelopMode') == "1") {
        //调试模式返回"浏览器"
        return 0;
      }

      // if (this.isAliPay() || this.isWechat()) {
      //   return 0;
      // }

      // 1表示IOS；2表示安卓
      var androidOrios = 0;
      var ua = navigator.userAgent.toLowerCase();

      if (ua.indexOf('{') === 0) {
        var oua = JSON.parse(ua);
        if (oua.sourcetype === "2") {
          // 安卓使用旧的JSBridge
          androidOrios = 2;
        }
      } else if (ua.indexOf('cjmlappios') > -1 || ua.indexOf('iphone') > -1) {
        androidOrios = 1;
      }

      return androidOrios;
    },
    /**与APP交互的基础方法 **/
    setupWebViewJavascriptBridge(callback) {
      var _this = this;
      var androidOrios = _this.androidOrios();
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge)
      } else {
        if (androidOrios == 2) {
          document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge)
          }, false)
          return;
        } else {

          if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
          }
          window.WVJBCallbacks = [callback];
          var WVJBIframe = document.createElement('iframe');
          WVJBIframe.style.display = 'none';
          WVJBIframe.src = 'https://__bridge_loaded__';
          document.documentElement.appendChild(WVJBIframe);
          setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe)
          }, 0);
          return;
        }
      }
    },


    //安卓初始化的方法
    isInit() {
      var _this = this;
      this.setupWebViewJavascriptBridge(function (bridge) {

        if (_this.androidOrios() == 2) {
          bridge.init(function (message, responseCallback) {
            if (responseCallback) {
              responseCallback("Right back atcha");
            }
          });
        }
      })
    },
    LoadComplete(callback) {
      var _this = this;
      if(_this.androidOrios() == 0){
        callback();
      }else {
        this.setupWebViewJavascriptBridge(function (bridge) {

          bridge.registerHandler('native_LoadComplete', function (data, response) {
            callback();
          });

        })
      }

    },
    //ajax获取数据
    ajax(opt) {
      var _this = this;
      if (_this.isAliPay() || _this.isWechat() || _this.androidOrios() == 0) {
        //支付宝环境 or 微信环境 or 非APP环境, 则执行Jquery的Ajax
        opt = opt || {};
        opt.method = opt.method.toUpperCase() || 'POST';

        opt.url = opt.url || '';
        opt.async = opt.async;
        opt.data = opt.data || null;
        opt.success = opt.success || function () { };
        opt.beforeSend = opt.beforeSend || function () {
          Indicator.open({
            spinnerType: 'fading-circle'
          });

        };
        opt.complete = opt.complete || function () {
          setTimeout(function () {
            Indicator.close();
          }, 1);
        };
        var _SourceType = 1;
        //注意, 开发者调试模式时, 开发者必须在cookie里设置开关声明, 别改硬编码!
        var _UserTicket = this.getCookie('CJML.APP.Intellip.DevelopMode') == "1" ? this.getCookie('CJML.APP.Intellip.UserTicketDev') : ""; //从cookie里读取用户票据
        var _key = "";
        var _signCode = "789649779a49df79sad7fa9sd87";
        var _time = Math.round(new Date().getTime() / 1000).toString();
        var xmlHttp = null;
        var _dataOpts = {
          "Header": {
            "SourceType": _SourceType,
            "UserTicket": _UserTicket,
            "GuestTicket": _this.getQueryString("guestticket"),
            "AgentTicket": _this.getQueryString("agentticket"),
            "SignCode": _signCode,
            "machineKey": _key,
            "timeStamp": _time,
            "version": 4.0,
          },
          "Body": opt.data
        };
        opt.data = _dataOpts;
        return $.ajax(opt);
      } else {
        //APP环境, 则执行APP的Ajax
        this.setupWebViewJavascriptBridge(function (bridge) {
          // 获取用户信息
          bridge.callHandler('native_GetBaseInfo', {}, function (response) {
            opt = opt || {};
            opt.method = opt.method.toUpperCase() || 'POST';
            opt.url = opt.url || '';
            opt.async = opt.async;
            opt.data = opt.data || null;
            opt.success = opt.success || function () { };
            opt.beforeSend = opt.beforeSend || function () {
              Indicator.open({
                spinnerType: 'fading-circle'
              });
            };
            opt.complete = opt.complete || function () {
              setTimeout(function () {
                Indicator.close();
              }, 1);
            };
            var _SourceType = 1;
            var _UserTicket = response.userticket; //
            var _key = response.machinekey; //"123456789";
            var _signCode = "789649779a49df79sad7fa9sd87";
            var _time = Math.round(new Date().getTime() / 1000).toString();
            var xmlHttp = null;
            var _dataOpts = {
              "Header": {
                "SourceType": _SourceType,
                "UserTicket": _UserTicket,
                "GuestTicket": _this.getQueryString("guestticket"),
                "AgentTicket": _this.getQueryString("agentticket"),
                "SignCode": _signCode,
                "machineKey": _key,
                "timeStamp": _time,
                "version": response.version,
              },
              "Body": opt.data
            };
            opt.data = _dataOpts;
            return $.ajax(opt);
          })
        })
      }
    },
    //存储cookie
    setCookie(name, value) {
      var _this = this;
      var Days = 30;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //得到cookie
    getCookie(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    },
    //获取warekey
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    //获取warekey
    getNewGuid() {
      var _this = this;
      localStorage.setItem('userkey', (_this.S4() + _this.S4() + '-' + _this.S4() + '-4' + _this.S4().substr(0, 3) + '-' + _this.S4() + '-' + _this.S4() + _this.S4() + _this.S4()).toLowerCase());
      return (_this.S4() + _this.S4() + '-' + _this.S4() + '-4' + _this.S4().substr(0, 3) + '-' + _this.S4() + '-' + _this.S4() + _this.S4() + _this.S4()).toLowerCase();
    },
    //默认登录
    appUserTicketLogin(callback) {
      var _this = this;
      _this.setupWebViewJavascriptBridge(function (bridge) {
        // 获取用户信息
        bridge.callHandler('native_GetBaseInfo', {}, function (response) {
          $.ajax({
            type: "POST",
            url: process.env.apiDomain + '/UserInfo/LoginFromApp',
            data: {
              "Header": {
                "SourceType": 1,
                "UserPermit": 2,
                "UserTicket": "",
                "SignCode": "",
              },
              "Body": {
                "userTicket": response.userticket
              }
            },
            success: function (data) {
              _this.setCookie('CJML_CloudShop_UserTicket', data.Body.userTicket);

              if (callback) {
                callback();
              }
            }
          });
        })
      });
    },
    //外面调用默认登录
    appLoadComplete(callback) {
      if (callback) {
        var _this = this;
        _this.isInit();
        // 如果是APP则调用登录
        if (_this.androidOrios() > 0) {
          _this.appUserTicketLogin(function () {
            callback();
          });
        } else {
          callback();

        }
      }
    },
    //设置原生标题
    setTitle(title) {
      this.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('native_SetTitle', title, function (response) { });
      });
    },
    //获取url参数
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      } else {
        var strHash = window.location.hash;

        if (strHash &&
          strHash.length > 0 &&
          strHash.indexOf("?") > -1) {
          r = strHash.substr(strHash.indexOf("?") + 1).match(reg);
        }
        if (r != null) {
          return unescape(r[2]);
        }
      }
      return null;
    },
    //更新url参数
    updateQueryStringParameter(uri, key, value) {
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf('?') !== -1 ? "&" : "?";
      if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
      } else {
        return uri + separator + key + "=" + value;
      }
    },
    // 获得需要还原的车型选择数据
    getReductionAuto() {
      var ReductionAuto = sessionStorage.getItem("ReductionAuto");
      if (ReductionAuto) {
        return JSON.parse(ReductionAuto);
      }
    },
    // 设置需要还原的车型选择数据
    setReductionAuto(data) {
      sessionStorage.setItem("ReductionAuto", data);
    },
    // 构造车型品牌Logo路径
    buildAutoBrandLogo(filename, imagesize) {
      var files = filename.split(".");
      files[0] = this.stringPad(files[0]);
      return process.env.sourceDomain + "/autobrandlogo" + files[0] + imagesize + "." + files[1];
    },
    // 构造车型图片路径
    buildAutoModelLogo(filename, imagesize) {
      var filenamelist = filename.split(";");
      var ret = "";
      for (var i = 0; i < filenamelist.length; i++) {
        var files = filenamelist[i].split(".");
        files[0] = this.stringPad(files[0]);
        ret += process.env.sourceDomain + "/carmodelpic" + files[0] + imagesize + "." + files[1] + ",";
      }
      if (ret != "") {
        return ret.substring(0, ret.length - 1);
      } else {
        return ret;
      }

    },
    //取得弹出层关闭次数
    getPopupCount(key) {
      var _this = this;
      // 当前浏览器是否支持localStorage
      if (localStorage) {
        let count = localStorage.getItem(key);
        if (count) {
          return count;
        } else {
          return 0;
        }
      }
    },
    //取得弹出层关闭次数
    SetPopupCount(key) {
      var _this = this;
      // 当前浏览器是否支持localStorage
      if (localStorage) {
        // localStorage.removeItem('CJML_APP_PlaceOrder_Count');
        let count = localStorage.getItem(key);
        if (count) {
          localStorage.setItem(key, parseInt(count) + 1);
        } else {
          localStorage.setItem(key, 0);
        }
      }
    },
    // 补全方法
    stringPad(num) {
      var filepath = "";
      var maxlength = 9;
      var shengyu = maxlength - num.length;
      if (shengyu > 0) {
        for (var i = 0; i < shengyu; i++) {
          num = "0" + num;
        }
      }

      for (var i = 0; i < maxlength; i++) {
        if (i % 3 == 0) {
          filepath += "/";
        }
        if (num[i]) {
          filepath += num[i];
        }
      }
      return filepath;
    },
    //ios和andriod,浏览器的路径跳转
    goUrl(urls, paramObj) {
      var _this = this;
      var headerDomain = window.location.href.split('h5')[0] + 'h5/' + urls + '.html';
      var url = process.env.siteDirectory + urls + '.html';
      if (paramObj != "") {
        var str = "";
        for (var v = 0; v < paramObj.length; v++) {
          if (v == paramObj.length - 1) {
            str = str + paramObj[v].param + '=' + paramObj[v].value;
          } else {
            str = str + paramObj[v].param + '=' + paramObj[v].value + '&';
          }
        };
        headerDomain = headerDomain + '?' + str;
        url = url + '?' + str;
      };
      if (_this.androidOrios() == 0) {
        window.location.href = url;
      } else {
        window.location.href = headerDomain;
      }
    },
    //获取图片
    getUploadImage(oType, imgCount, callBack) { //oType  Camera 只拍照 Album 只上传，imgCount 图片张数
      var _this = this;
      _this.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler("native_GetVersion", "", function (response) {
          //_this.version = response;
          if (response > 2.96) {
            _this.setupWebViewJavascriptBridge(function (bridge) {
              //var data = {
              //	"openType": "All",//All:拍照/相册   Camera: 单相机 Album 单相册
              //	"ImgCount": 1,//1-9  图片都需要压缩，拍照需要剪切
              //};
              var data = {
                "openType": oType,
                "ImgCount": imgCount,
              };
              bridge.callHandler('native_UploadImageV1', data, function (str) {
                //response 返回上传后的图片数组
                //["图片地址1","图片地址2","图片地址2"]
                callBack(str, 1)
              });
            });
          } else {
            _this.setupWebViewJavascriptBridge(function (bridge) {
              bridge.callHandler('native_UploadImage', '', function (str) {
                if (str.url) { //判断如果有值就push
                  callBack(str, 0)
                }
              });
            });
          }
        });
      });
    },
    // 监听回退事件
    listenBackEvent(defaulturl) {

      var _this = this;
      _this.$nextTick(function () {
        $(".returnLink").click(function () {
          // 浏览器逻辑

          var backurl = _this.getQueryString("backurl");

          if (backurl && backurl.length > 0 && backurl != "null") {
            if (backurl == "native_CloseWebview") {
              _this.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('native_CloseWebview', '', function (response) { });
              });
            } else {
              window.location.href = backurl;
            }
          } else if (defaulturl && defaulturl.length > 0 && defaulturl != "null") {
            if (defaulturl == "native_CloseWebview") {
              _this.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('native_CloseWebview', '', function (response) { });
              });
            } else {
              window.location.href = defaulturl;
            }
          } else {
            window.history.go(-1);
          }
        });
      });
    },
    //原生监听回退事件
    nativeLsitenBack(defaulturl) {
      var _this = this;
      _this.setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('native_BackBtn', '', function (response) {

          var backurl = _this.getQueryString("backurl");
          if (backurl && backurl.length > 0 && backurl != "null") {
            if (backurl == "native_CloseWebview") {
              _this.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('native_CloseWebview', '', function (response) { });
              });
            } else if (backurl == "native_GoHome") {
              _this.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('native_GoHome', '', function (response) { });
              });
            } else {
              window.location.href = backurl;
            }
          } else if (defaulturl && defaulturl.length > 0 && defaulturl != "null") {
            if (defaulturl == "native_CloseWebview") {
              _this.setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('native_CloseWebview', '', function (response) { });
              });
            } else {
              window.location.href = defaulturl;
            }
          } else {
            window.history.go(-1);
          }

        });
      })
    },
    //解决滑动穿透问题
    SlidingPen() {

      function addScript(src, supported) {
        if (!supported)
          document.write('<script src="' + src + '" async ></' + 'script>');
      }
      addScript(scrollingElement, document.scrollingElement)

      var ModalHelper = (function (bodyCls) {
        var scrollTop;
        return {
          afterOpen: function () {
            scrollTop = document.scrollingElement.scrollTop;

            document.body.classList.add(bodyCls);

            document.body.style.top = -scrollTop + "px";
          },
          beforeClose: function () {
            document.body.classList.remove(bodyCls);
            // scrollTop lost after set position:fixed, restore it back.
            document.scrollingElement.scrollTop = scrollTop;
          }
        };
      })("modal-open");
      return ModalHelper;
    },

    // 前端行为记录器
    getBehaviorRecorder() {

      //注册业务Index
      var behaviorIndex = {
        favoriteGuided: 0, //是否已引导车主收藏(1是0否)
        payGuided: 1, //是否已引导保养记录付款(1是0否)
        scoreOpenGuideCount: 2, //引导开启积分次数
      }

      var cookieName = "CJML.APP.Intellip.Client.BehaviorRecorder";

      // function getCookie(c_name) {
      //   if (document.cookie.length > 0) {
      //     var c_start = document.cookie.indexOf(c_name + "=");
      //     if (c_start != -1) {
      //       c_start = c_start + c_name.length + 1;
      //       var c_end = document.cookie.indexOf(";", c_start)
      //       if (c_end == -1) c_end = document.cookie.length;
      //       return unescape(document.cookie.substring(c_start, c_end));
      //     }
      //   }
      //   return "";
      // }

      if (!String.prototype.padEnd) {
        String.prototype.padEnd = function padEnd(targetLength, padString) {
          targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
          padString = String((typeof padString !== 'undefined' ? padString : ' '));
          if (this.length > targetLength) {
            return String(this);
          } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
              padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0, targetLength);
          }
        };
      }

      // function setCookie(name, value, expiredays) {
      //   var exdate = new Date();
      //   exdate.setDate(exdate.getDate() + expiredays);
      //   document.cookie = name + "=" + escape(value) + ((!expiredays) ? "" : ";expires=" + exdate.toGMTString()) + "; path=/";
      // }

      //通过行为索引取得行为数据
      function getBehavior(behaviorIndex) {
        if (behaviorIndex < 0) return 0; //index只支持大于等于零的值
        var cookieValue =localStorage.getItem(cookieName)
        // var cookieValue = getCookie(cookieName);
        if (cookieValue == null) return 0;
        var behaviorText = cookieValue.substr(behaviorIndex, 1);
        if (behaviorText.length == 0) return 0;
        return Number(behaviorText);
      }

      //改变行为数据
      function setBehavior(behaviorIndex, value) {
        if (behaviorIndex < 0) return; //index只支持大于等于零
        if (value < 0 || value > 9) return; //value只能0-9, 否则超过1位了
        var cookieValue =localStorage.getItem(cookieName)
        // var cookieValue = getCookie(cookieName);
        if(!cookieValue){
          cookieValue ='';
        }
        var prefix = cookieValue.substr(0, behaviorIndex).padEnd(behaviorIndex, 0);
        var suffix = cookieValue.substr(behaviorIndex + 1);
        var result = prefix + value + suffix;
        // setCookie(cookieName, result, 365 * 50);
        localStorage.setItem(cookieName,result);
      }


      return {
        behaviorIndex: behaviorIndex,
        getBehavior: getBehavior,
        setBehavior: setBehavior
      };
    }
  }
}
export {
  commonMixin
};
