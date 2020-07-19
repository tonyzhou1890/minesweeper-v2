<template>
  <transition name="fade">
    <div class="notify-wrapper" :class="type">
      {{ text }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Notify',
  props: {
    text: {
      type: String,
      default: 'Notify'
    },
    type: {
      type: String,
      default: ''
    }
  },
  // created() {
  //   this.timeout = setTimeout(() => {
  //     this.$parent.$el.removeChild(this.$el)
  //     this.$destroy()
  //   }, this.duration || 3000)
  // },
  // beforeDestroy() {
  //   clearTimeout(this.timeout)
  // }
}
</script>

<style lang="less" scoped>
.notify-wrapper {
  position: fixed;
  padding: 3px 5px;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  color: white;
  z-index: 100;
  &.success {
    background-color: #1968ad;
    // box-shadow: 0 0 3px #1968ad;
  }
  &.fail {
    background-color: rgb(255, 30, 30);
    // box-shadow: 0 0 3px rgb(255, 30, 30);
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