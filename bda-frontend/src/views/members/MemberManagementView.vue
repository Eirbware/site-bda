<template>
  <main class="py-7 px-12 mt-10">
    <div class="bg-gray-200 py-10 px-12 rounded-lg">
      <div class="w-full flex justify-between items-center mb-5">

        <!-- Breadcrumbs -->
        <div class="text-sm breadcrumbs">
          <ul>
            <li><span class="badge">Dashboard</span></li>
            <li><span class="badge">Gestion des membres</span></li>
          </ul>
        </div>

        <div class="flex flex-row items-center">
          <input type="text" placeholder="Recherche" class="input input-bordered w-full max-w-xs h-10 mr-10" v-model="searchQuery"
                 @input="handleSearchInput"/>

          <!-- Add button -->
          <router-link to="/dashboard/members/add" class="btn gap-2">

            <!-- Add icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor"
                 class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>

            <span class="text-md font-bold uppercase">Ajouter</span>
          </router-link>
        </div>
      </div>

      <table class="w-full table table-zebra">

        <thead>
        <tr class="">
          <th class="py-5 mb-10 pl-10">Nom</th>
          <th class="py-5 mb-10">Prénom</th>
          <th class="py-5 mb-10">Fonction</th>
          <th class="py-5 mb-10">Année</th>
          <th class="py-5 mb-10">Actions</th>
        </tr>
        </thead>

        <draggable v-model="members" tag="tbody" @change="handleReorder" filter=".ignore-elements">
          <MemberRow v-for="member in members" :key="member" :member="member" :class="this.searchQuery.length !== 0 ? 'ignore-elements' : ''"/>
        </draggable>

      </table>
    </div>
  </main>
</template>

<script>
import {getAllMembers, reorderMembers} from "@/services/memberService";
import Header from "@/components/Header.vue";
import {emitter} from "@/emitter";
import MemberRow from "@/components/dashboard/members/MemberRow.vue";
import {VueDraggableNext} from "vue-draggable-next";

export default {
  name: "MemberManagementView",
  components: {
    MemberRow,
    Header,
    draggable: VueDraggableNext,
  },
  data() {
    return {
      members: [],
      backupMembers: [],
      enabled: false,
      searchQuery: ""
    }
  },
  async mounted() {
    emitter.on("reloadMemberList", () => {
      this.reloadList();
    });

    this.reloadList();
  },
  methods: {
    reloadList() {
      getAllMembers().then((members) => {
        // Sort members by increasing order
        const sortedMembers = members.sort((a, b) => a.order - b.order);

        this.members = sortedMembers;
        this.backupMembers = sortedMembers;
      }).catch((err) => {
        emitter.emit("notification", {
          type: "error",
          message: err
        });
      });
    },
    handleSearchInput() {
      const search = this.searchQuery.toLowerCase();

      if (search.length === 0) {
        this.members = this.backupMembers;
        return;
      }

      this.members = this.backupMembers.filter((member) => {
        return member.student.name.toLowerCase().includes(search)
            || member.student.surname.toLowerCase().includes(search)
            || member.student.uid.toLowerCase().includes(search)
            || member.year.toString().toLowerCase().includes(search)
            || member.title.toLowerCase().includes(search)
      });
    },
    handleReorder() {
      this.members.forEach((member, index) => member.order = index);

      reorderMembers(this.members).catch(err => {
        emitter.emit("notification", {
          type: "error",
          message: err
        });
      });
    }
  }
}
</script>

<style scoped>

</style>