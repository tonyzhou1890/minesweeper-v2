<template>
  <div id="app" :style="{ backgroundImage: `url(${backgroundImage})`}">
    <Header />
    <div class="title-wrapper">
      <p class="title" :data-status="status">minesweeper</p>
      <span v-if="levelText" class="level-tag">{{ levelText }}</span>
    </div>
    <Content></Content>
    <Notify
      v-if="notify.show"
      :text="notify.text"
      :type="notify.type"
    />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Notify from './components/Notify.vue'
import Content from './components/Content.vue'
import { backgroundPath, levels } from '@/utils/config'

export default {
  name: 'App',
  components: {
    Header,
    Notify,
    Content
  },
  data() {
    return {
      backgroundImage: '', // 页面背景图片
      level: '', // 难度
      levelText: '', // 难度文字
      status: 0, // 0：未开始，1：进行中，2：胜利，3：失败
      notify: {
        text: '',
        type: '',
        show: false
      }
    }
  },
  created() {
    this.bus.$on('changeSetting', this.handleChangeSetting)
    this.bus.$on('gameEnd', this.handleGameEnd)
    this.bus.$on('gameStatus', this.handleGameStatus)
  },
  beforeDestroy() {
    this.bus.$off('changeSetting', this.handleChangeSetting)
    this.bus.$off('gameEnd', this.handleGameEnd)
    this.bus.$off('gameStatus', this.handleGameStatus)
  },
  methods: {
    handleChangeSetting(setting) {
      this.backgroundImage = `${backgroundPath}${setting.background}.png`
      console.log(setting)
      this.level = setting.level
      this.levelText = levels.find(item => item.key === setting.level).text
    },
    handleGameEnd(data) {
      console.log(data)
      this.notify = {
        show: true,
        text: data.win ? '太棒了，我赢了！' : '真遗憾，失败了……',
        type: data.win ? 'success' : 'fail'
      }
      setTimeout(() => {
        this.notify.show = false
      }, 3000)
    },
    handleGameStatus(val) {
      this.status = val
    }
  }
}
</script>

<style lang="less">
html, body {
  margin: 0;
  background-color: #f5f5f5;
  width: 100%;
  height: 100%;
}

* {
  user-select: none;
}

@font-face {
  font-family: '汉仪霹雳体';
  src: url('./assets/fonts/汉仪霹雳体简.subset.ttf');
}

@font-face {
  font-family: 'FX-LED';
  src: url('./assets/fonts/FX-LED.TTF');
}

// https://stackoverflow.com/questions/12557010/how-to-simplify-this-less-css-box-shadow-mixin-multiple-shadows-with-directio
.text-shadow-3d(@x, @y, @index, @color) when (@index > 0) {

  // Loop-de-loop.
  .text-shadow-3d(@x, @y, @index - 1, @color);

  // The '+' after 'text-shadow' concatenates with comma.
  text-shadow+: @x*@index @y*@index 0 @color;
}

@keyframes blink {
  0% {
    .text-shadow-3d(0, 1px, 6, rgba(120, 130, 140, 1));
    text-shadow+: 0 7px 12px rgba(100, 100, 100, 1);
  }
  50% {
    .text-shadow-3d(0, 1px, 8, rgb(55, 81, 107));
    text-shadow+: 0 9px 16px rgb(78, 55, 55);
  }
  100% {
    .text-shadow-3d(0, 1px, 6, rgba(120, 130, 140, 1));
    text-shadow+: 0 7px 12px rgba(100, 100, 100, 1);
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgba(44, 62, 80, 1);
  width: 100%;
  height: 100%;
  background-size: repeat;
  overflow: auto;
  .title-wrapper {
    display: inline-block;
    margin-top: 50px;
    padding: 40px 10px 0;
    height: 140px;
    box-sizing: border-box;
    .title {
      font-size: 60px;
      font-family: '汉仪霹雳体';
      margin: 0;
      .text-shadow-3d(0, 1px, 6, rgba(120, 130, 140, 1));
      text-shadow+: 0 7px 12px rgba(100, 100, 100, 1);
      &[data-status='1'] {
        animation: blink 2s infinite;
      }
      &[data-status='2'] {
        color: rgb(109, 86, 153);
        animation: blink 2s infinite;
      }
      &[data-status='3'] {
        text-shadow: none;
        color: gray;
      }
    }
    .level-tag {
      float: right;
      padding: 2px 3px;
      border-radius: 3px;
      border: 1px solid gray;
      font-size: 12px;
      margin-top: -12px;
      background-color: white;
    }
    @media screen and (max-width: 459px) {
      .title {
        font-size: 50px;
      }
    }
    @media screen and (max-width: 379px) {
      .title {
        font-size: 40px;
      }
    }
  }
}
</style>
