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
            <li><span class="badge">Édition</span></li>
          </ul>
        </div>


        <div class="flex flex-col w-full">

          <div class="flex flex-row mb-2">

            <!-- Category selection -->
            <select class="select w-56 mr-10" v-model="partenthese.partentheseCategory.id">
              <option value="-1" disabled selected>Catégorie</option>
              <option v-for="category in categories" :selected="category.id === partenthese.partentheseCategory.id" :value="category.id">{{ category.name }}</option>
            </select>

            <!-- Title input -->
            <input class="input flex-1" placeholder="Titre" id="title" type="text" v-model="partenthese.title" :class="isPartentheseTitleUnique ? '' : 'input-error'">
          </div>

          <!-- Input box -->
          <textarea class="textarea mt-5 resize-none w-full h-96"
                    :class="isPartentheseContentValid ? '' : 'textarea-error'"
                    placeholder="Description"
                    v-model="partenthese.content">

          </textarea>

          <!-- Validation button -->
          <div class="flex flex-row w-full justify-end mt-5">
            <span
                class="btn border-0 w-[13.5rem]"
                :class="isPartentheseValid ? 'bg-green-300 hover:bg-green-400 hover:cursor-pointer' : 'bg-gray-300'"
                @click="onValidateEditionButtonClick">Valider</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import graphqlClient from "@/utils/graphqlClient";
import {gql} from "graphql-tag";
import {emitter} from "@/emitter";

export default {
  name: "PartentheseEditView",
  data() {
    return {
      partenthese: {
        id: -1,
        partentheseCategory: {
          id: -1,
          name: ""
        },
        title: "",
        content: "",
      },
      partentheses: [],
      categories: [],
    }
  },
  mounted() {
    // Get the current partenthese's data
    graphqlClient.query({
      query: gql`
        query {
          partenthese(id: ${this.$route.params.id}) {
            id
            title
            content
            partentheseCategory {
              id
              name
            }
          }
        }
      `
    }).then((response) => {
      this.partenthese = response.data.partenthese;
    }).catch(this.handleRequestError);

    // Get all the existing partentheses
    graphqlClient.query({
      query: gql`
        query {
          partentheses {
            id
            title
          }
        }
      `
    }).then(({data: {partentheses}}) => {
      this.partentheses = partentheses;
    }).catch(this.handleRequestError);

    // Get all the existing categories
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
    }).catch(this.handleRequestError);
  },
  computed: {
    isPartentheseTitleUnique() {
      return this.partentheses.filter(partenthese => {
        return partenthese.title.toLowerCase().trim() === this.partenthese.title.toLowerCase().trim()
            && partenthese.id !== this.partenthese.id;
      }).length === 0;
    },
    isPartentheseValid() {
      return this.partenthese.title.trim() !== ""
          && this.isPartentheseContentValid
          && this.partenthese.partentheseCategory.id !== -1
          && this.isPartentheseTitleUnique;
    },
    isPartentheseContentValid() {
      return this.partenthese.content.trim() !== "";
    }
  },
  methods: {
    handleRequestError(error) {
      emitter.emit("notification", {
        type: "error",
        message: error
      });
    },
    onValidateEditionButtonClick() {
      if (!this.isPartentheseValid) {
        return;
      }

      // Send the request to the server
      graphqlClient.mutate({
        mutation: gql`
          mutation update($data: UpdatePartentheseArgs!) {
            updatePartenthese(data: $data) {
              id
            }
          }
        `,
        variables: {
          data: {
            id: this.partenthese.id,
            title: this.partenthese.title,
            content: this.partenthese.content,
            categoryId: this.partenthese.partentheseCategory.id,
          }
        }
      }).then(() => {
        // Notify the user that the partenthese has been updated
        emitter.emit("notification", {
          type: "success",
          message: "P'art'enthèse a été éditée avec succès."
        });
        this.$router.push("/dashboard/partentheses");
      }).catch(this.handleRequestError);
    },
  }
}
</script>

<style scoped>

</style>