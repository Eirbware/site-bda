<template>
  <div class="bg-gray-300 min-h-16 w-2/6 rounded-xl overflow-hidden flex flex-row">
    <div class="alert shadow-lg" :class="color">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{this.notification.message}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Notification",
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  computed: {
    color() {
      switch (this.notification.type) {
        case "success":
          return "alert-successful";
        case "error":
          return "alert-error";
        case "warning":
          return "alert-warning";
        default:
          return "alert-info";
      }
    }
  }
}
</script>

<style scoped>

</style>