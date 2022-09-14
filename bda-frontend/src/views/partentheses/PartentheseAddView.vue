<template>
  <main class="py-2 px-12 flex-1 flex justify-center items-center">

    <div class="w-full flex flex-row justify-center">

      <!-- Colored wrapper -->
      <div class="rounded-2xl overflow-hidden bg-gray-200 shadow-2xl flex flex-col items-start py-10 px-24 w-[90rem]">

        <!-- Breadcrumbs -->
        <div class="text-sm breadcrumbs mb-5">
          <ul>
            <li><span class="badge">Dashboard</span></li>
            <li>
              <router-link to="/dashboard/partentheses" class="badge">Gestion des p'Art'enthèses</router-link>
            </li>
            <li><span class="badge">Ajout</span></li>
          </ul>
        </div>


        <div class="flex flex-col w-full">

          <div class="flex flex-row mb-2">

            <!-- Category selection -->
            <select class="select w-56 mr-10" v-model="partenthese.categoryId">
              <option value="-1" disabled selected>Catégorie</option>
              <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
            </select>

            <!-- Title input -->
            <input class="input flex-1" placeholder="Titre" id="title" type="text" v-model="partenthese.title">
          </div>

          <!-- Input box -->
          <textarea class="textarea mt-5 resize-none w-full h-96" placeholder="Description" v-model="partenthese.content" >

          </textarea>

          <!-- Validation button -->
          <div class="flex flex-row w-full justify-end mt-5">
            <span
                class="btn bg-green-300 hover:bg-green-400 border-0 w-[13.5rem]"
                @click="onAddPartentheseButtonClick">Valider</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import graphqlClient from "@/utils/graphqlClient";
import {emitter} from "@/emitter";
import {gql} from "graphql-tag";

export default {
  name: "PartentheseAddView",
  data() {
    return {
      categories: [],
      partenthese: {
        content: "",
        categoryId: -1,
        title: ""
      }
    };
  },
  computed: {
    isPartentheseValid() {
      return this.partenthese.content.length > 0 && this.partenthese.categoryId !== -1 && this.partenthese.title.length > 0;
    }
  },
  mounted() {
    graphqlClient.query({
      query: gql`
        query {
          partentheseCategories {
            id
            name
          }
        }
      `
    }).then(({data: {partentheseCategories}}) => {
      this.categories = partentheseCategories;
    }).catch(error => {

      // Display a toast with the error message
      emitter.emit("notification", {
        type: "error",
        message: error
      });
    });
  },
  methods: {
    onAddPartentheseButtonClick() {
      if (this.isPartentheseValid) {
        graphqlClient.mutate({
          mutation: gql`
            mutation($data: CreatePartentheseArgs!) {
              createPartenthese(data: $data) {
                id
              }
            }
          `,
          variables: {
            data: this.partenthese
          }
        }).then(() => {

          // Display a toast with the success message
          emitter.emit("notification", {
            type: "success",
            message: "La p'Art'enthèse a bien été ajoutée !"
          });

          // Redirect to the partenthèses management view
          this.$router.push("/dashboard/partentheses");
        }).catch(error => {

          // Display a toast with the error message
          emitter.emit("notification", {
            type: "error",
            message: error
          });
        });
      }
    }
  }
}
</script>

<style scoped>

</style>