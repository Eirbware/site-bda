<template>
  <a :href="authUrl"
     class="p-5 no-underline text-black visited:no-underline visited:text-black active:no-underline active:outline-0flex items-center justify-center bg-gray-100 rounded-lg">
    Se connecter
  </a>
</template>

<script>
import {authenticateUser} from "@/services/authenticationService";
import {emitter} from "@/emitter";

export default {
  name: "AuthenticationView",
  computed: {
    authUrl() {
      return `https://cas.bordeaux-inp.fr/login?service=https://aboin.vvv.enseirb-matmeca.fr/casAuth/?token=${window.btoa(`${import.meta.env.VITE_FRONTEND_ADDRESS}/#/auth`)}@bordeaux-inp.fr`;
    }
  },
  async mounted() {
    // Check if the user is already authenticated by looking for ticket and token in the url
    const token = this.$route.query.token;
    const ticket = this.$route.query.ticket;
    // Authenticate the user by using the backend API
    if (token && ticket) {
      authenticateUser(`${ticket}`, `${token}`)
          .then(() => {
            // Redirect to the root page
            this.$router.push("/");
          })
          .catch(error => {
            emitter.emit("notification", {
              type: "error",
              message: error
            });
          });
    }
  }
}
</script>

<style scoped>

</style>