<template>
  <div class="popup" :style="{'z-index':zIndex}">
    <div
      class="popup-content"
      :style="{width:width?width+'px':'auto',height:height?height+'px':'auto'}"
    >
      <div class="popup-top">
        <span class="popup-title">{{title}}</span>
        <span class="el-icon-close popup-close" @click="close"></span>
      </div>
      <div class="slotWrap">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "popup",
  props: {
    showModal: {
      type: Boolean,
      default() {
        return false;
      },
    },
    width: {
      // type: Number,
      default() {
        return false;
      },
    },
    height: {
      // type: Number,
      default() {
        return "auto";
      },
    },
    zIndex: {
      type: Number,
      default() {
        return 100;
      },
    },
    title: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      selfShow: this.showModal,
    };
  },
  methods: {
    close() {
      //console.log("emit?????");
      this.$emit("close", false);
    },
  },
  created() {
    //console.log(this.height)
  },
};
</script>

<style  lang="scss" scoped>
::-webkit-scrollbar {
  width: 5px;
  margin-top: 20px;
}
::-webkit-scrollbar-thumb {
  width: 5px;
  height: 50px;
  background: rgba(0, 0, 0, 0.15);
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000000000;
  overflow: hidden;

  .popup-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    min-width: 300px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: hidden;
    text-align: center;
    min-height: 200px;
    border-radius: 8px;
    // padding: 40px 30px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .popup-top {
      height: 55px;
      width: 100%;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      font-family: "PingFang Medium";
    }
    .popup-title {
      height: 24px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    .popup-close {
      font-size: 18px;
      font-weight: bold;
      z-index: 1000;
      cursor: pointer;
    }
    .popup-close:hover {
      animation: rotate 0.4s linear;
    }
    .slotWrap {
      width: 100%;
      height: calc(100% - 55px);
      box-sizing: border-box;
      padding-top: 24px;
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(270deg);
  }
}
</style>
