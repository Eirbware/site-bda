<template>
  <div class="card w-80 bg-base-100 relative mb-5">
    <!-- Member picture -->
    <figure class="overflow-hidden h-56 flex" style="align-items: flex-start !important;"> <!-- Fuck you DaisyUI -->
      <img v-if="member.picture !== ''" :src="`${this.backendUrl}/images/members/${member.picture}`"
           alt="Photo membre" class="w-full"/>
      <img v-else src="@/assets/member.png" class="w-full" alt="Default member image"/>
    </figure>

    <!-- Card body -->
    <div class="card-body text-black">
      <h2 class="card-title justify-center">{{ member.student.name }} {{ member.student.surname }}</h2>
      <p class="w-full text-center">{{ member.title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MemberCard",
  props: {
    member: {
      type: Object,
      required: true
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