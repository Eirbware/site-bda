<template>
  <main class="py-2 px-12 flex-1 flex justify-center items-center">

    <div class="w-full flex flex-row justify-center">

      <!-- Colored wrapper -->
      <div class="rounded-2xl overflow-hidden bg-gray-200 shadow-2xl flex flex-col items-start py-10 px-24 w-[90rem]">

        <!-- Breadcrumbs -->
        <div class="text-sm breadcrumbs mb-5">
          <ul>
            <li><router-link to="/partentheses" class="badge">Liste des P'Art'enthèses</router-link></li>
            <li><span class="badge">{{ partenthese.title }}</span></li>
          </ul>
        </div>

        <!-- Header -->
        <div class="flex flex-row items-center justify-between w-full pb-5 mb-14 border-2 border-b-black">
          <div class="flex flex-col items-start">
            <div class="font-bold text-4xl mb-2">{{ partenthese.title }}</div>
            <div class="font-semibold text-2xl">{{ partenthese.partentheseCategory.name }}</div>
          </div>

          <div class="flex flex-col">
            <div class="uppercase font-bold text-xl">{{ partenthese.author.student.name }} {{ partenthese.author.student.surname }}</div>
            <div class="text-right font-bold">{{ partenthese.year }}</div>
          </div>
        </div>


        <div>{{ partenthese.content }}</div>
      </div>
    </div>
  </main>
</template>

<script>
import graphqlClient from "@/utils/graphqlClient";
import {emitter} from "@/emitter";
import {gql} from "graphql-tag";

export default {
  name: "PartentheseView",
  data() {
    return {
      partenthese: {
        id: 0,
        title: "",
        content: "",
        year: "",
        partentheseCategory: {
          id: 0,
          name: "",
        },
        author: {
          student: {
            name: "",
            surname: "",
          }
        }
      },
    };
  },
  mounted() {
    graphqlClient.query({
      query: gql`
        query {
          partenthese(id: ${this.$route.params.id}) {
            id
            title
            content
            year
            partentheseCategory {
              id
              name
            }
            author {
              student {
                name
                surname
              }
            }
          }
        }
      `,
    }).then((response) => {
      this.partenthese = response.data.partenthese;
    }).catch(error => {
      // Notify the user that the request failed via a notification toast
      emitter.emit("notification", {
        type: "error",
        message: error,
      });
    });
  }
}
</script>

<style scoped>

</style>