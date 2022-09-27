<template>
  <div class="card w-80 bg-base-100 shadow-xl relative mb-5">

    <!-- Text description -->
    <div class="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-80 transition duration-300 ease-in-out flex flex-col justify-center items-center">
      <div class="text-white text-2xl font-bold">{{ member.student.name }}</div>
      <div class="text-white text-lg">{{ member.description }}</div>
    </div>

    <!-- Member picture -->
    <figure class="overflow-hidden h-56 flex items-start">
      <img v-if="member.picture !== ''" :src="`${this.backendUrl}/images/members/${member.picture}`"
           alt="Photo membre" class="h-full min-w-full"/>
      <div class="w-full" v-else v-html="getIdenticon(member.student.email)"></div>
    </figure>

    <!-- Card body -->
    <div class="card-body text-black">
      <h2 class="card-title justify-center">{{ member.student.name }} {{ member.student.surname }}</h2>
      <p class="w-full text-center">{{ member.title }}</p>
    </div>
  </div>

</template>

<script>
import {toSvg} from "jdenticon";

export default {
  name: "MemberCard",
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  methods: {
    getIdenticon(value) {
      // Add width=100% to the svg to make it responsive
      return toSvg(value, 100).replace("<svg", "<svg width=\"100%\"");
    }
  },
  computed: {
    backendUrl() {
      return import.meta.env.VITE_BACKEND_ADDRESS;
    }
  }
}
</script>

<style scoped>

</style>