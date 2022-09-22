<template>
  <div class="relative">
    <div class="w-full p-2">
      <div class="w-full py-3 px-5 bg-betterPrimary shadow-2xl flex flex-row justify-between rounded-lg items-center">
        <span class="uppercase text-2xl text-white font-sans">Menu</span>

        <!-- Burger button -->
        <div class="rounded-lg border-2 border-betterPrimaryShadowed flex justify-center items-center p-2 hover:cursor-pointer text-betterPrimaryShadowed"
             @click="toggleMenu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
        </div>
      </div>
    </div>

    <div v-if="menuOpen" class="w-full px-2 pb-2 absolute flex flex-col items-center">

      <div class="p-2 rounded-lg bg-betterPrimary shadow-2xl w-full flex flex-col" id="drawer">
        <router-link @click="onLinkClick" to="/" class="py-2  border-b-gray-300 border-b-2 last:border-0 w-full flex justify-center items-center text-white text-xl font-sans">Accueil</router-link>
        <router-link @click="onLinkClick" to="/partentheses" class="py-2  border-b-gray-300 border-b-2 last:border-0 w-full flex justify-center items-center text-white text-xl font-sans">P'Art'enthèses</router-link>
        <router-link @click="onLinkClick" to="/auth" v-if="!isLoggedIn" class="py-2  border-b-gray-300 border-b-2 last:border-0 w-full flex justify-center items-center text-white text-xl font-sans">Connexion</router-link>
        <router-link @click="onLinkClick" to="/logout" v-if="isLoggedIn" class="py-2  border-b-gray-300 border-b-2 last:border-0 w-full flex justify-center items-center text-white text-xl font-sans">Déconnexion</router-link>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "MobileHeader",
  data() {
    return {
      myStudent: {
        member: null,
        role: 'USER'
      },
      menuOpen: false,
      links: [

      ]
    }
  },
  computed: {
    isAdmin() {
      return this.myStudent.role === "ADMIN";
    },
    isMember() {
      return this.myStudent.member;
    },
    isLoggedIn() {
      return (this.myStudent.name !== undefined) && (this.myStudent.surname !== undefined);
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    onLinkClick() {
      this.menuOpen = false;
    }
  },
  mounted() {
    // Close the menu when the user clicks outside of it
    document.addEventListener('click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.menuOpen = false;
      }
    });
  }
}
</script>

<style scoped>
/* Animation from top to bottom */
#drawer {
  animation: slidein 1s ease-in-out;
}
</style>