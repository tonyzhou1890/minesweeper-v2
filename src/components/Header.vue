<template>
  <div class="header">
    <div
      class="mask"
      :class="type ? 'show' : ''"
      :style="{
        right: right + 'px',
        top: top + 'px'
      }"
      @click="close"
    ></div>
    <div class="navbar">
      <ul class="menu-list">
        <!-- 游戏重开 -->
        <li class="menu-item" title="重新开始">
          <div
            class="menu-item-icon"
            @click="handleReset"
          >
            <svg-icon icon-class="reset" />
          </div>
        </li>
        <!-- 游戏记录 -->
        <li class="menu-item" title="记录">
          <div
            class="menu-item-icon"
            :class="type === 'record' ? 'menu-selected' : ''"
            @click="(e) => open(e, 'record')"
          >
            <svg-icon icon-class="record" />
          </div>
          <transition name="fade">
            <div v-if="type === 'record'" class="menu-item-dropdown">
              <p class="record-title">游戏记录</p>
              <section class="record-item">
                <p class="record-item-header">初级</p>
                <div class="record-item-row">
                  <p class="record-item-label">总局数：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows9.allGames }}</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">解开局数：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows9.winGames }}</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">胜率：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows9.winPercent }}%</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">最佳：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows9.best ? minesweeperSave.rows9.best + 's' : '暂无记录' }}</p>
                </div>
              </section>
              <section class="record-item">
                <p class="record-item-header">中级</p>
                <div class="record-item-row">
                  <p class="record-item-label">总局数：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows12.allGames }}</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">解开局数：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows12.winGames }}</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">胜率：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows12.winPercent }}%</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">最佳：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows12.best ? minesweeperSave.rows12.best + 's' : '暂无记录' }}</p>
                </div>
              </section>
              <section class="record-item">
                <p class="record-item-header">高级</p>
                <div class="record-item-row">
                  <p class="record-item-label">总局数：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows15.allGames }}</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">解开局数：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows15.winGames }}</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">胜率：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows15.winPercent }}%</p>
                </div>
                <div class="record-item-row">
                  <p class="record-item-label">最佳：</p>
                  <p class="record-item-value">{{ minesweeperSave.rows15.best ? minesweeperSave.rows15.best + 's' : '暂无记录' }}</p>
                </div>
              </section>
            </div>
          </transition>
        </li>
        <!-- 游戏设置 -->
        <li class="menu-item" title="设置">
          <div
            class="menu-item-icon"
            :class="type === 'setting' ? 'menu-selected' : ''"
            @click="(e) => open(e, 'setting')"
          >
            <svg-icon icon-class="setting" />
          </div>
          <transition name="fade">
            <div v-if="type === 'setting'" class="menu-item-dropdown">
              <p class="setting-title">游戏设置</p>
              <!-- 游戏难度 -->
              <section class="setting-item">
                <div class="setting-item-row">
                  <p class="setting-item-label">难度</p>
                  <select class="setting-item-value" v-model="setting.level">
                    <option
                      v-for="item in levels"
                      :key="item.key"
                      :value="item.key"
                    >{{ item.text }}</option> 
                  </select>
                </div>
              </section>
              <!-- 游戏皮肤 -->
              <section class="setting-item">
                <div class="setting-item-row">
                  <p class="setting-item-label">皮肤</p>
                  <p class="setting-item-value">{{ settingSkinText }}</p>
                </div>
                <div class="setting-item-preview">
                  <div
                    v-for="item in skins"
                    :key="item.key"
                    class="preview-img-wrapper"
                    @click="checkSkin(item.key)"
                  >
                    <img
                      class="preview-img"
                      :src="`${skinPath}${item.key}/thumbnail.png`"
                    />
                    <svg-icon v-if="item.key === setting.skin" icon-class="clasp" class-name="clasp" />
                  </div>
                </div>
              </section>
              <!-- 游戏背景 -->
              <section class="setting-item">
                <div class="setting-item-row">
                  <p class="setting-item-label">页面背景</p>
                  <p class="setting-item-value">{{ settingBackgroundText }}</p>
                </div>
                <div class="setting-item-preview">
                  <div
                    v-for="item in backgrounds"
                    :key="item.key"
                    class="preview-img-wrapper"
                    @click="checkBackground(item.key)"
                  >
                    <img
                      class="preview-img"
                      :src="`${backgroundPath}${item.key}.png`"
                    />
                    <svg-icon v-if="item.key === setting.background" icon-class="clasp" class-name="clasp" />
                  </div>
                </div>
              </section>
              <!-- 按钮 -->
              <div class="setting-action">
                <button class="setting-button cancel" @click="close">取消</button>
                <button class="setting-button ok" @click="handleOk">确定</button>
              </div>
            </div>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { levels, skins, skinPath, backgrounds, backgroundPath, defaultConfig, localSaveName, localSettingName } from '@/utils/config'
export default {
  name: 'Header',
  data() {
    return {
      type: '', // record, setting
      right: 0,
      top: 0,
      minesweeperSave: { // 游戏记录
        rows9: {
          allGames: 0,
          winGames: 0,
          winPercent: 0,
          best: null,
        },
        rows12: {
          allGames: 0,
          winGames: 0,
          winPercent: 0,
          best: null,
        },
        rows15: {
          allGames: 0,
          winGames: 0,
          winPercent: 0,
          best: null,
        }
      },
      levels, // 游戏难度
      skins, // 皮肤
      skinPath, // 皮肤路径
      backgrounds, // 背景
      backgroundPath, // 背景路径
      setting: { // 设置

      },
      settingBackup: null, // 旧的设置
    }
  },
  computed: {
    // 选择的皮肤名称
    settingSkinText() {
      return this.skins.find(item => item.key === this.setting.skin)?.text || ''
    },
    // 选择的背景名称
    settingBackgroundText() {
      return this.backgrounds.find(item => item.key === this.setting.background)?.text || ''
    }
  },
  created() {
    this.getSave()
    this.getSetting()
    this.bus.$on('gameEnd', this.handleGameEnd)
  },
  beforeDestroy() {
    this.bus.$off('gameEnd', this.handleGameEnd)
  },
  methods: {
    // 关闭弹窗
    close(e) {
      if (e.target === e.currentTarget) {
        this.type = ''
      }
      if (this.settingBackup) {
        this.setting = JSON.parse(JSON.stringify(this.settingBackup))
      }
    },
    // 打开弹窗
    open(e, type) {
      if (type === this.type) {
        this.type = ''
        return
      }
      this.type = type
      if (type === 'setting') {
        this.settingBackup = JSON.parse(JSON.stringify(this.setting))
      }
    },
    // 读取设置
    getSetting() {
      this.localforage.getItem(localSettingName)
        .then(res => {
          if (res) {
            this.setting = res
          } else {
            this.setting = defaultConfig
          }
        })
        .catch(e => {
          console.log(e)
          this.setting = defaultConfig
        })
        .finally(() => {
          this.bus.$emit('changeSetting', this.setting)
        })
    },
    // 获取存档
    getSave() {
      this.localforage.getItem(localSaveName)
        .then(res => {
          if (res) {
            this.minesweeperSave = res
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    // 选择皮肤
    checkSkin(key) {
      this.setting.skin = key
    },
    // 选择背景
    checkBackground(key) {
      this.setting.background = key
    },
    // 改变设置
    handleOk() {
      this.bus.$emit('changeSetting', this.setting)
      this.type = ''
      this.settingBackup = null
      this.localforage.setItem(localSettingName, this.setting)
    },
    // 游戏结束
    handleGameEnd(data) {
      const temp = this.minesweeperSave[data.level]
      temp.allGames++
      if (data.win) {
        temp.winGames++
        temp.best = temp.best == null || temp.best > data.time ? data.time : temp.best
      }
      temp.winPercent = parseFloat((temp.winGames / temp.allGames * 100).toFixed(2))
      this.localforage.setItem(localSaveName, this.minesweeperSave)
    },
    // 游戏重开
    handleReset() {
      this.bus.$emit('changeSetting', this.setting)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  width: 100%;
  height: 50px;
  overflow: visible;
  z-index: 4;
  .mask {
    position: fixed;
    right: 0;
    width: 0;
    height: 0;
    background-color: transparent;
    &.show {
      width: 100%;
      height: 100%;
      right: 0 !important;
      top: 0 !important;
    }
  }
  .navbar {
    width: 100%;
    .menu-list {
      margin: 0;
      padding: 0;
      list-style: none;
      text-align: right;
      .menu-item {
        display: inline-block;
        width: 50px;
        height: 50px;
        position: relative;
        overflow: visible;
        .menu-item-icon {
          width: 30px;
          height: 30px;
          margin-left: 10px;
          margin-top: 10px;
          vertical-align: middle;
          font-size: 30px;
          cursor: pointer;
          color: gray;
          &:hover,
          &.menu-selected {
            color: #222;
          }
        }
        .menu-item-dropdown {
          position: absolute;
          top: 50px;
          right: 10px;
          background-color: white;
          box-shadow: 0 2px 10px rgba(39,54,78,0.12);
          width: 200px;
          max-height: calc(100vh - 50px);
          overflow: auto;
          padding: 15px;
          box-sizing: border-box;
          p {
            margin: 0;
            line-height: 1.8;
          }
          .record-title,
          .setting-title {
            font-size: 24px;
            text-align: center;
          }
          .record-item,
          .setting-item {
            .record-item-header {
              font-size: 20px;
              text-align: center;
            }
            .record-item-row,
            .setting-item-row {
              display: flex;
              font-size: 16px;
              .record-item-label,
              .setting-item-label {
                color: gray;
                flex: 1;
                text-align: left;
              }
              .record-item-value,
              .setting-item-value {
                flex: 1;
              }
            }
            .setting-item-preview {
              width: 100%;
              max-height: 200px;
              overflow: auto;
              text-align: left;
              .preview-img-wrapper {
                display: inline-block;
                box-sizing: border-box;
                width: 33.3%;
                height: 56.6px;
                border: 2px solid white;
                position: relative;
                &:hover {
                  border-color: coral;
                }
                .preview-img {
                  width: 100%;
                  height: 100%;
                }
                .clasp {
                  font-size: 12px;
                  color: white;
                  background-color: coral;
                  position: absolute;
                  right: 2px;
                  top: 2px;
                  box-shadow: 0 0 2px white;
                }
              }
            }
          }
          .setting-action {
            display: flex;
            padding-top: 15px;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
            .setting-button {
              width: 60px;
              height: 30px;
              border: none;
              box-sizing: border-box;
              cursor: pointer;
              &.cancel {
                background-color: #eee;
                color: #333;
                border: 1px solid #333;
              }
              &.ok {
                background-color: rgb(0, 86, 247);
                color: white;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>