<template>
  <main class="py-2 px-12 flex-1 flex justify-center items-center">

    <div class="w-full flex flex-row justify-center">

      <!-- Colored wrapper -->
      <div class="rounded-2xl overflow-hidden bg-gray-200 shadow-2xl flex flex-col items-start py-10 px-24 w-[90rem]">

        <!-- Breadcrumbs -->
        <div class="text-sm breadcrumbs mb-5">
          <ul>
            <li><span class="badge">Dashboard</span></li>
            <li><span class="badge">Gestion des P'Art'enthèses</span></li>
          </ul>
        </div>

        <!-- Search bar and add button -->
        <div class="flex flex-row items-center w-full mb-5 justify-between">
          <input type="text" placeholder="Recherche" class="input input-bordered w-full max-w-xs h-10 mr-10"
                 v-model="searchQuery"
                 @input="handleSearchInput"/>

          <!-- Add button -->
          <router-link to="/dashboard/partentheses/add" class="btn gap-2">

            <!-- Add icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor"
                 class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>

            <span class="text-md font-bold uppercase">Ajouter</span>
          </router-link>
        </div>

        <table class="table table-zebra w-full rounded-lg overflow-hidden">

          <thead>
          <tr>
            <th class="py-5 mb-10 pl-10">Titre</th>
            <th class="py-5 mb-10">Auteur.rice</th>
            <th class="py-5 mb-10">Catégorie</th>
            <th class="py-5 mb-10">Année</th>
            <th class="py-5 mb-10">Actions</th>
          </tr>
          </thead>

          <tbody>
          <PartentheseRow v-for="partenthese in partentheses" :partenthese="partenthese" :key="partenthese.id"/>
          </tbody>

        </table>
      </div>
    </div>
  </main>
</template>

<script>
import PartentheseRow from "@/components/dashboard/partentheses/PartentheseRow.vue";
import graphqlClient from "@/utils/graphqlClient";
import {gql} from "graphql-tag";
import {emitter} from "@/emitter";

export default {
  name: "PartentheseManagementView",
  components: {PartentheseRow},
  data() {
    return {
      searchQuery: "",
      partentheses: [],
      partenthesesBackup: [],
    }
  },
  mounted() {
    emitter.on("reloadPartentheseList", () => {
      this.fetchPartentheses();
    });

    this.fetchPartentheses();
  },
  methods: {
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
    fetchPartentheses() {
      graphqlClient.query({
        query: gql`
          query {
            partentheses {
              id
              title
              year
              partentheseCategory {
                id
                name
              }
              author {
                student {
                  id
                  name
                  surname
                }
              }
            }
          }
        `
      }).then(({data: {partentheses}}) => {
        this.partentheses = partentheses;
        this.partenthesesBackup = partentheses;
      }).catch(error => {
        // Display a toast notification on error
        emitter.emit("notification", {
          type: "error",
          message: error
        });
      })
    }
  }
}
</script>

<style scoped>

</style>