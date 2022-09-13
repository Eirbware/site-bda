<template>
  <tr class="px-10">
    <td class="uppercase py-5 font-sans font-bold pl-10">{{category.name}}</td>
    <td class="uppercase py-5 font-sans">{{ category.partentheses.length }}</td>
    <td class="py-5 flex flex-row items-center">

      <div class="bg-red-400 flex justify-center items-center p-2 rounded-lg mr-2 hover:cursor-pointer" @click="onDeletionButtonClick">
        <!-- Trash SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </svg>
      </div>

    </td>
  </tr>
</template>

<script>
import graphqlClient from "@/utils/graphqlClient";
import {gql} from "graphql-tag";
import {emitter} from "@/emitter";

export default {
  name: "CategoryRow",
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  methods: {
    onDeletionButtonClick() {
      // Delete the category from the server
      graphqlClient.mutate({
        mutation: gql`
          mutation DeleteCategory($id: Float!) {
            deletePartentheseCategory(id: $id)
          }
        `,
        variables: {
          id: parseInt(this.category.id)
        }
      }).then(() => {
        // Emit an event to the parent component to refresh the list of categories
        emitter.emit("refreshCategories");

        // Display a toast to inform the user that the category has been deleted
        emitter.emit("notification", {
          type: "success",
          message: "La catégorie a bien été supprimée"
        });
      }).catch(error => {
        // Display a toast to inform the user that the category has not been deleted
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