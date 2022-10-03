<template>
  <!-- Header if the user is not on mobile -->
  <Header v-if="!isMobile" />
  <MobileHeader v-else />

  <router-view></router-view>

  <div class="fixed w-full flex flex-row justify-end bottom-0 py-5 px-5">
    <!-- Notification -->
    <Notification v-if="currentNotification" :notification="currentNotification" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"></Notification>
  </div>
</template>

<script>
import {emitter} from "./emitter";
import Notification from "@/components/Notification.vue";
import Header from "@/components/Header.vue";
import MobileHeader from "@/components/MobileHeader.vue";

export default {
  name: 'App',
    components: {MobileHeader, Notification, Header},
  data() {
    return {
      currentNotification: null,
      timeout: null
    }
  },
  mounted() {
    emitter.on("notification", (notification) => {
      this.currentNotification = notification;
      this.timeout = setTimeout(() => {
        this.currentNotification = null;
      }, 3000);
    });
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768;
    }
  },
  methods: {
    handleMouseEnter() {
      clearTimeout(this.timeout);
    },
    handleMouseLeave() {
      this.timeout = setTimeout(() => {
        this.currentNotification = null;
      }, 3000);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;

  position: relative;
}

html, body {
  margin: 0;
  height: 100%;
}
</style>
