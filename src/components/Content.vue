<template>
  <div class="content-container">
    <div class="info-wrapper">
      <p class="time">{{ time }}</p>
      <p class="mines">{{ restMinesShow }}</p>
    </div>
    <div
      class="stage-wrapper"
      :data-loading="loading"
      :style="{
        height: height + 'px'
      }"
    >
      <div class="canvas-wrapper">
        <canvas
          class="canvas"
          ref="canvas"
          :style="{
            width: width + 'px',
            height: height + 'px'
          }"
          @click="handleClick"
          @contextmenu.prevent="handleContextMenu"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defaultConfig } from '@/utils/config'
import { skinLoader, initGame, onClick, onContentMenu } from '@/utils/main'
export default {
  name: 'Content',
  data() {
    return {
      loading: false,
      status: 0, // 0：未开始，1：进行中，2：胜利，3：失败
      setting: defaultConfig, // 设置
      ctx: null, // 绘图上下文
      time: '--',
      restMinesShow: '--',
      width: 0,
      height: 0,
      inter: null, // 定时器
    }
  },
  created() {
    this.bus.$on('changeSetting', this.handleChangeSetting)
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d')
  },
  beforeDestroy() {
    this.bus.$off('changeSetting', this.handleChangeSetting)
  },
  watch: {
    status: {
      handler(val) {
        this.bus.$emit('gameStatus', val)
      },
      immediate: true
    }
  },
  methods: {
    // 设置改变
    handleChangeSetting(setting) {
      this.setting = setting
      this.loading = true
      skinLoader(this.setting.skin)
        .then(() => {
          clearInterval(this.inter)
          this.inter = null
          this.loading = false
          this.time = '--'
          this.status = 0
          // 防止 ctx 为空
          this.$nextTick(() => {
            const res = initGame(this.ctx, this.setting.skin, this.setting.level)
            this.width = res.size.width
            this.height = res.size.height
            this.restMinesShow = res.mines
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 计时
    handleTime(stop) {
      if (stop) {
        clearInterval(this.inter)
      } else {
        this.time = 0
        this.inter = setInterval(() => this.time++, 1000)
      }
    },
    // 左键点击
    handleClick(e) {
      if (this.status === 2 || this.status === 3) return
      const res = onClick(e, this.ctx, this.setting.skin, this.setting.level)
      if (res) {
        if (this.time === '--') {
          this.handleTime()
          this.status = 1
        }
        if (res === 'win' || res === 'lose') {
          this.handleTime(true)
          this.status = res === 'win' ? 2 : 3
          // 触发游戏结束事件
          this.bus.$emit('gameEnd', {
            time: this.time,
            win: res === 'win',
            level: this.setting.level
          })
        }
      }
    },
    // 右键点击
    handleContextMenu(e) {
      if (this.status !== 1) return false
      const res = onContentMenu(e, this.ctx, this.setting.skin, this.setting.level)
      if (res) {
        this.restMinesShow = res.restMinesShow
        if (res.win) {
          this.handleTime(true)
          this.status = 2
          // 触发游戏结束事件
          this.bus.$emit('gameEnd', {
            time: this.time,
            win: true,
            level: this.setting.level
          })
        }
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.content-container {
  width: 100%;
  height: calc(~'100% - 190px');
  text-align: center;
  .info-wrapper {
    width: 350px;
    max-width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    height: 60px;
    font-size: 30px;
    font-family: 'FX-LED';
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .stage-wrapper {
    display: inline-block;
    max-width: 100%;
    max-height: calc(~'100% - 65px');
    overflow: hidden;
    position: relative;
    &::before {
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.9);
      position: absolute;
      left: 0;
      right: 0;
      z-index: -1;
      transition: opacity 0.2s;
      opacity: 0;
    }
    &[data-loading=true]::before {
      content: '';
      opacity: 1;
      z-index: 1;
    }
    &::after {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 4px solid purple;
      border-left-color: transparent;
      animation: rotate 1s linear infinite;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.2s;
    }
    &[data-loading=true]::after {
      content: '';
      opacity: 1;
      z-index: 1;
    }
    .canvas-wrapper {
      width: 100%;
      height: 100%;
      overflow: auto;
      .canvas {
        vertical-align: middle;
      }
    }
  }
}
</style>