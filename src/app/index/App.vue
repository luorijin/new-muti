<template>
  <div id="app">
      <transition :name="transitionName">
          <keep-alive  include="activityList">
              <router-view class="view"/>
          </keep-alive>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      transitionName:"slide-right"
    }
  },
  watch: {
　　　$route (to, from) {
      if (to.meta.level > from.meta.level) {
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}
.view{
  position: absolute;
  left: 0;
  top:0;
  background: #fff;
  width: 100%;
  height: 100%;
}
body{
  position: fixed;
  height: 100%;
  width: 100%;
  margin: 0;
  font-size: 0.6rem;
  color: #333;
}
ul,li{
  margin: 0;
  padding: 0;
  list-style: none;
}
#app {
  height: 100%;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 300ms;
  position: fixed;
}
.slide-right-enter {
  transform: translate(-100%, 0);
  transition-timing-function: ease-in;
}
.slide-left-enter {
  transform: translate(100%, 0);
  transition-timing-function: ease-in;
}
</style>
