<template>
  <main class="py-2 px-2 lg:px-12 flex-1 flex justify-center items-center">

    <div class="w-full flex flex-row justify-center">

      <!-- Colored wrapper -->
      <div class="rounded-2xl overflow-hidden bg-gray-200 shadow-2xl flex flex-col items-start py-10 px-5 lg:px-24 w-[90rem]">

        <!-- Breadcrumbs -->
        <div class="text-sm breadcrumbs mb-5">
          <ul>
            <li><span class="badge">Liste des P'Art'enthèses</span></li>
          </ul>
        </div>

        <!-- Search bar and add button -->
        <div class="flex flex-row items-center w-full mb-5">
          <input type="text" placeholder="Recherche" class="input input-bordered w-full h-10"
                 v-model="searchQuery"
                 @input="handleSearchInput"/>
        </div>

        <table class="table table-zebra w-full rounded-lg overflow-hidden">

          <thead>
          <tr v-if="!isMobile">
            <th class="py-5 mb-10 pl-10">Titre</th>
            <th class="py-5 mb-10">Auteur.rice</th>
            <th class="py-5 mb-10">Catégorie</th>
            <th class="py-5 mb-10">Année</th>
            <th class="py-5 mb-10">Actions</th>
          </tr>

          <tr v-else>
            <th class="py-5 mb-10 pl-10 uppercase">Titre</th>
          </tr>
          </thead>

          <tbody v-if="!isMobile">
            <PartenthesePublicRow v-for="partenthese in partentheses" :partenthese="partenthese" :key="partenthese.id"/>
          </tbody>

          <tbody v-else>
            <MobilePartenthesePublicRow v-for="partenthese in partentheses" :partenthese="partenthese" :key="partenthese.id"/>
          </tbody>

        </table>
      </div>
    </div>
  </main>
</template>

<script>
import PartenthesePublicRow from "@/components/PartenthesePublicRow.vue";
import graphqlClient from "@/utils/graphqlClient";
import {gql} from "graphql-tag";
import {emitter} from "@/emitter";
import MobilePartenthesePublicRow from "@/components/MobilePartenthesePublicRow.vue";

export default {
  name: "PartentheseListView",
  components: {
    MobilePartenthesePublicRow,
    PartenthesePublicRow,
  },
  data() {
    return {
      partentheses: [],
      partenthesesBackup: [],
      searchQuery: "",
    };
  },
  mounted() {
    // Fetch all partentheses from server
    graphqlClient.query({
      query: gql`
        query {
          partentheses {
            id
            title
            author {
              id
              student {
                id
                name
                surname
               }
            }
            partentheseCategory {
              id
              name
            }
            year
          }
        }
      `
    }).then(({ data: { partentheses }}) => {
      this.partentheses = partentheses;
      this.partenthesesBackup = partentheses;
    }).catch(this.handleRequestError);
  },
  computed: {
    isMobile() {
      return document.body.clientWidth <= 768;
    },
  },
  methods: {
    /**
     * Notify the user that an error occurred via a notification toast
     * @param error The error to display
     */
    handleRequestError(error) {
      emitter.emit("notification", {
        type: "error",
        message: error,
      });
    },
    /**
     * Handle the user's input in the search bar
     */
    handleSearchInput() {
      // If the search query is empty, reset the partentheses list
      if (this.searchQuery === "") {
        this.partentheses = this.partenthesesBackup;
        return;
      }

      // Filter the partentheses list
      this.partentheses = this.partenthesesBackup.filter(partenthese => {
        return partenthese.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        || `${partenthese.author.student.name} ${partenthese.author.student.surname}`.toLowerCase().includes(this.searchQuery.toLowerCase())
        || partenthese.year.toString().includes(this.searchQuery.toLowerCase())
      });
    },
  },
}
</script>

<style scoped>

</style>