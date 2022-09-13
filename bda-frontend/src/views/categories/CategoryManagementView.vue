<template>
  <main class="py-2 px-12 flex-1 flex justify-center items-center">

    <div class="w-full flex flex-row justify-center">

      <!-- Colored wrapper -->
      <div class="rounded-2xl overflow-hidden bg-gray-200 shadow-2xl flex flex-col items-start py-10 px-24">

        <!-- Breadcrumbs -->
        <div class="text-sm breadcrumbs mb-5">
          <ul>
            <li><span class="badge">Dashboard</span></li>
            <li><span class="badge">Gestion des catégories de P'Art'enthèses</span></li>
          </ul>
        </div>

        <!-- Search bar and add button -->
        <div class="flex flex-row items-center w-full mb-5">
          <input type="text" placeholder="Recherche" class="input input-bordered w-full max-w-xs h-10 mr-10"
                 v-model="searchQuery"
                 @input="handleSearchInput"/>

          <!-- Add button -->
          <div @click="onAddButtonClick" class="btn gap-2">

            <!-- Add icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor"
                 class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>

            <span class="text-md font-bold uppercase">Ajouter</span>
          </div>
        </div>

        <table class="table table-zebra w-full rounded-lg overflow-hidden">

          <thead>
          <tr>
            <th class="py-5 mb-10 pl-10">Nom</th>
            <th class="py-5 mb-10">Nombre</th>
            <th class="py-5 mb-10">Actions</th>
          </tr>
          </thead>

          <tbody>

          <!-- Creation form -->
          <tr v-if="addMode" class="px-10">
            <td>
              <input type="text" v-model="newCategory.name" class="uppercase py-5 input input-bordered" :class="isInputInvalid ? 'input-error' : ''"/>
            </td>
            <td class="uppercase py-5 font-sans">{{ newCategory.partentheses.length }}</td>
            <td class="py-5 flex flex-row items-center">

              <button :disabled="isInputInvalid"
                      class=" text-white font-bold p-2 rounded-lg"
                      :class="isInputInvalid ? 'bg-gray-300' : 'bg-green-300 hover:bg-green-400 hover:cursor-pointer'"
                   @click="onValidationButtonClick">

                <!-- Check mark SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

              </button>

            </td>
          </tr>

          <CategoryRow v-for="category in categories" :key="category.id" :category="category"/>
          </tbody>

        </table>
      </div>
    </div>
  </main>
</template>

<script>
import graphqlClient from "@/utils/graphqlClient";
import {gql} from "graphql-tag";
import {emitter} from "@/emitter";
import CategoryRow from "@/components/dashboard/categories/CategoryRow.vue";

export default {
  name: "CategoryManagementView",
  components: {
    CategoryRow

  },
  data() {
    return {
      searchQuery: "",
      categories: [],
      categoriesBackup: [], // Used to restore the original list when the search query is empty
      addMode: false,
      newCategory: {
        name: "",
        partentheses: []
      }
    }
  },
  mounted() {
    this.fetchCategories();

    emitter.on("refreshCategories", () => {
      this.fetchCategories();
    });
  },
  computed: {
    /**
     * The input is considered invalid if the name is empty or if the name is already used
     * @returns {boolean} true if the input is invalid, false otherwise
     */
    isInputInvalid() {
      return this.newCategory.name.length === 0
          || this.categoriesBackup.some(category => category.name === this.newCategory.name);
    }
  },
  methods: {
    /**
     * Filter the original categories list based on the search query
     */
    handleSearchInput() {
      this.categories = this.categoriesBackup.filter((category) => {
        return category.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    onAddButtonClick() {
      this.addMode = true;
    },
    onValidationButtonClick() {
      if (this.isInputInvalid) return;

      // Disable the add mode
      this.addMode = false;

      // Add the new category to the server
      graphqlClient.mutate({
        mutation: gql`
          mutation createCategory($name: String!) {
            createPartentheseCategory(name: $name) {
              id
              name
              partentheses {
                id
              }
            }
          }
            `,
        variables: {
          name: this.newCategory.name
        }
      }).then(({data: {createPartentheseCategory}}) => {
        // Add the new category to the list
        this.categoriesBackup.push(createPartentheseCategory);

        // Emit a notification toast in the case where the request succeeds
        emitter.emit("notification", {
          type: "success",
          message: "La catégorie a été ajoutée avec succès"
        });
      }).catch((error) => {
        // Emit a notification toast in the case where the request fails
        emitter.emit("notification", {
          type: "error",
          message: error
        });
      });

      // Replace dummy
      this.newCategory = {
        name: "",
        partentheses: []
      };
    },
    fetchCategories() {
      // Fetch all categories from the server
      graphqlClient.query({
        query: gql`
        query {
          partentheseCategories {
            id
            name
            partentheses {
              id
            }
          }
        }
      `
      }).then(({data: {partentheseCategories}}) => {
        this.categories = partentheseCategories;
        this.categoriesBackup = partentheseCategories;
      }).catch((error) => {
        // Emit a notification toast in the case where the request fails
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