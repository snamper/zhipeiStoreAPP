<template>
  <div id="ycfHomepage">
    <div class="en-inputVinPage">
      <div class="en-inputVinMain">
        <dl>
          <dt>
            <span></span>
          </dt>
          <dd class="en-vinInputBox">
            <input type="text" placeholder="请输入你的VIN码" v-model="vin">
          </dd>
          <dd class="en-vinInputButton">
            <a href="javascript:;" v-on:click="submit">确认</a>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Toast
  } from 'mint-ui';
  import {
    commonMixin
  } from '../../config/base/commonMixin.js';

  var resourceUrl = process.env.apiDomain;
  export default {
    name: "ycfHomepage",
    mixins: [commonMixin],
    components: {},
    created() {
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        vin: "",
        repairDepotKeeperId: this.getQueryString('rdk'),
        agentTicket: this.getQueryString('agentticket'),
      }
    },
    methods: {
      init() {

      },

      submit() {
        var _this = this;

        //秘籍
        if (this.vin == 'starwaytest') {
          ap.redirectTo({
            url: window.location.protocol + "//" + window.location.host + "/starwaytest.html",
          });

          return;
        }

        _this.ajax({
          method: "POST",
          url: resourceUrl + "/Auto/GetAutoInfoByVin",
          dataType: "JSON",
          data: {
            vinCode: _this.vin,
          },
          success: function (res) {
            if (res.Header.ErrorCode != 0) {
              Toast(res.Header.Message);
              return;
            }

            ap.redirectTo({
              url: window.location.protocol + "//" + window.location.host + "/maintainRecordReader.html",
              data: {
                vin: _this.vin,
                rdk: _this.repairDepotKeeperId,
                agentticket: _this.agentTicket,
              }
            });

          }
        });
      }


    }
  }

</script>
<style>
  @import url("../../assets/css/app.css");

  /*车主端VIN码输入*/
  .en-inputVinPage {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    left: 0;
    top: 0;
    /* z-index: 2; */
  }

  .en-inputVinMain {
    width: 100%;
    padding: 1.96rem .4rem 0;
    float: left;
    clear: left;
    box-sizing: border-box;
  }

  .en-inputVinMain dt {
    width: 100%;
    margin-bottom: 2.08rem;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .en-inputVinMain dt span {
    width: 2.24rem;
    height: 2.24rem;
    background: url(../../assets/images/ycjl_logo.jpg) no-repeat center center;
    background-size: 100%;
    border-radius: .32rem;
    overflow: hidden;
    display: block;
    float: left;
    clear: left;
  }

  .en-inputVinMain dd {
    width: 100%;
    margin: 0 0 .4rem;
    border-radius: .2rem;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    clear: left;
  }

  .en-inputVinMain dd.en-vinInputBox {
    border: 1px solid #d8d8d8;
    height: 1.04rem;
  }

  .en-inputVinMain dd.en-vinInputBox input {
    width: 96%;
    border: 0;
    font-size: .4rem;
    line-height: .8rem;
    text-align: center;
    color: #181818;
    background: transparent;
  }

  .en-inputVinMain dd.en-vinInputButton a {
    width: 100%;
    background: #e74c3c;
    font-size: .48rem;
    line-height: 1.08rem;
    text-align: center;
    color: #fff;
    float: left;
    clear: left;
    text-decoration: none;
  }
</style>