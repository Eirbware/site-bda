<template>
  <main class="py-7 px-12 mt-10">
    <div class="bg-gray-200 py-10 px-12 rounded-lg">

      <div class="w-full flex justify-between  items-center mb-5">

        <!-- Breadcrumbs -->
        <div class="text-sm breadcrumbs">
          <ul>
            <li><span class="badge">Dashboard</span></li>
            <li><span class="badge">Gestion des étudiant.e.s</span></li>
          </ul>
        </div>

        <div class="flex flex-row items-center">
          <input type="text" placeholder="Recherche" class="input input-bordered w-full max-w-xs h-10 mr-10"
                 @input="handleSearchInput"/>
          <router-link to="/dashboard/students/add" class="btn gap-2">

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

      <table class="table table-zebra w-full rounded-lg overflow-hidden">

        <thead>
        <tr>
          <th class="py-5 mb-10 pl-10">Prénom</th>
          <th class="py-5 mb-10">Nom</th>
          <th class="py-5 mb-10">Email</th>
          <th class="py-5 mb-10">BDA ?</th>
          <th class="py-5 mb-10">Actions</th>
        </tr>
        </thead>

        <tbody>
        <StudentRow v-for="student in students" :key="student.id" :student="student"/>
        </tbody>

      </table>
    </div>
  </main>
</template>

<script>
import StudentRow from "@/components/dashboard/students/StudentRow.vue";
import {getAllStudents} from "@/services/studentService";
import {emitter} from "@/emitter";
import Header from "@/components/Header.vue";

export default {
  name: "StudentManagementView",
  components: {Header, StudentRow},
  data() {
    return {
      students: [],
      studentsBackup: []
    }
  },
  async mounted() {
    emitter.on("reloadStudentList", () => {
      this.reloadList();
    });

    this.reloadList();
  },
  methods: {
    reloadList() {
      getAllStudents().then((students) => {
        this.students = students;
        this.studentsBackup = students;
      }).catch((err) => {
        emitter.emit("notification", {
          type: "error",
          message: err
        });
      });
    },
    handleSearchInput(e) {
      if (e.target.value === "") {
        this.students = this.studentsBackup;
        return;
      }

      this.students = this.studentsBackup.filter((student) => {
        return student.name.toLowerCase().includes(e.target.value.toLowerCase())
            || student.surname.toLowerCase().includes(e.target.value.toLowerCase())
            || student.email.toLowerCase().includes(e.target.value.toLowerCase())
            || student.uid.toString().toLowerCase().includes(e.target.value.toLowerCase());
      });
    }
  }
}
</script>

<style scoped>

</style>