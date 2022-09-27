<template>
  <!-- Banner with logo -->
  <div class="w-full flex justify-center mt-2 items-center mb-10">
    <!-- Logo -->
    <div class="h-72 bg-white w-auto w-auto rounded-[50%] p-8 shadow-2xl shadow-2xl">
      <img src="../assets/logo.svg" alt="logo-BDA" class="w-full h-full"/>
    </div>
  </div>

  <div class="w-full flex justify-center">
    <div class="w-11/12 lg:w-3/4 bg-white rounded-lg p-5 text-center shadow-xl">
      <p class="pb-2">Que vous soyez un artiste en Eirb, un grand amateur d'arts ou un débutant en soif de culture, nous sommes là pour vous !</p>
      <p class="pb-2">Le Bureau des Arts de l'ENSEIRB-MATMECA est l'association qui regroupe les clubs artistiques de l'école, et il y en a pour tous les goûts !</p>
      <p class="pb-2">Laissez-nous vous faire découvrir ce qui se fait de mieux à Bordeaux: ne loupez pas nos événements et profitez des nombreux partenariats que nous avons liés avec les établissements et les artistes !</p>
      <p>Votre BDA dynamique tisse des liens avec ceux d'autres écoles pour vous présenter toujours plus d'animations et d'expériences inoubliables.</p>
    </div>
  </div>

  <div class="flex-col flex items-center justify-center w-full pb-10">

    <!-- Year group -->
    <div v-for="year in Object.keys(members).reverse()" class="text-white w-full mt-10">
      <!-- Year title -->
      <div class="flex flex-row justify-evenly items-center w-full mb-10">

        <!-- Left bar -->
        <div class="w-[30%] h-1 bg-white rounded-xl shadow-2xl"></div>

        <div class="text-4xl font-bold w-[30%] lg:w-[20%] text-center outline shadow-2xl relative p-2 lg:p-0" >
          <span>{{ year }}</span>
          <div class="absolute top-0 left-0 w-full h-full bg-black opacity-10" style="z-index: -1"></div>
        </div>

        <!-- Right bar -->
        <div class="w-[30%] h-1 bg-white rounded-xl shadow-2xl shadow-black"></div>
      </div>

      <!-- Members -->
      <div class="flex justify-center items-center">
        <div class="w-3/4 flex flex-row justify-evenly flex-wrap">
          <MemberCard v-for="member in members[year].sort((a, b) => a.order - b.order)" :member="member" :key="member.id"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {getAllMembers} from "@/services/memberService";
import {toSvg} from "jdenticon";
import {emitter} from "@/emitter";
import Header from "@/components/Header.vue";
import MemberCard from "@/components/home/MemberCard.vue";

export default {
  name: "HomeView",
  components: {
    MemberCard,
    Header
  },
  data() {
    return {
      rawMembers: [],
    }
  },
  mounted() {
    getAllMembers().then(members => {
      this.rawMembers = members;
    }).catch(error => {
      emitter.emit("notification", {
        type: "error",
        message: error
      });
    });
  },
  computed: {
    members() {
      // Group members by year
      let groupedMembers = this.rawMembers.reduce((acc, member) => {
        if (!acc[member.year]) {
          acc[member.year] = [];
        }
        acc[member.year].push(member);
        return acc;
      }, {});

      // Sort members with year as key and members as value
      return Object.keys(groupedMembers).sort().reduce(
          (obj, key) => {
            obj[key] = groupedMembers[key];
            return obj;
          }, {});
    }
  }
}
</script>

<style scoped>
figure svg {
  width: 100%;
}
</style>