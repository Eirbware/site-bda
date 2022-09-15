<template>
  <tr class="px-10">
    <td class="uppercase py-5 font-sans font-bold pl-10">{{ partenthese.title }}</td>
    <td class="uppercase py-5 font-sans">{{ partenthese.author.student.name }}
      {{ partenthese.author.student.surname }}
    </td>
    <td class="uppercase py-5 font-sans">{{ partenthese.partentheseCategory.name }}</td>
    <td class="uppercase py-5 font-sans">{{ partenthese.year }}</td>
    <td class="uppercase py-5 font-sans">
      <router-link :to="`/partentheses/${partenthese.id}`" class="btn bg-betterPrimary hover:bg-betterPrimaryShadowed hover:cursor-pointer border-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </router-link>
    </td>
  </tr>
</template>

<script>
export default {
  name: "PartenthesePublicRow",
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