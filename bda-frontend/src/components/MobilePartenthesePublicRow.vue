<template>
  <tr class="px-10">
    <td class="uppercase py-5 font-sans font-bold pl-10 w-full text-center">
      <router-link :to="`/partentheses/${partenthese.id}`">
        {{ partenthese.title }}
      </router-link>
    </td>
  </tr>
</template>

<script>
export default {
  name: "MobilePartenthesePublicRow",
  props: {
    partenthese: {
      type: Object,
      required: true
    }
  },
}
</script>

<style scoped>

</style>