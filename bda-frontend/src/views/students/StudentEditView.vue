<template>
  <main class="py-2 px-12 flex-1 flex justify-center items-center">

    <div class="w-full flex flex-row justify-center">

      <!-- Colored wrapper -->
      <div class="rounded-2xl overflow-hidden bg-gray-200 shadow-2xl flex flex-col items-start py-10 px-24">

        <!-- Breadcrumbs -->
        <div class="text-sm breadcrumbs mb-5">
          <ul>
            <li><span class="badge">Dashboard</span></li>
            <li>
              <router-link to="/dashboard/students" class="badge">Gestion des étudiant.e.s</router-link>
            </li>
            <li><span class="badge">Édition</span></li>
          </ul>
        </div>

        <!-- Inputs and validation button -->
        <div class="flex flex-col">
          <div class="flex flex-row mb-5">
            <input class="input mr-10" placeholder="Prénom" id="name" type="text" v-model="student.name">

            <!-- Swap button -->
            <div class="btn mr-10" @click="onSwapButtonClick">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>

            <input class="input" placeholder="Nom" id="surname" type="text"
                   v-model="student.surname">
          </div>

          <div class="flex flex-row mb-5">
            <input class="input mr-[8.65rem]" placeholder="UID" id="uid" type="text" v-model="student.uid">
            <input class="input" placeholder="Email" id="email" type="text" v-model="student.email">
          </div>

          <!-- Validation button -->
          <div class="flex flex-row justify-end">
            <span
                class="btn bg-green-300 hover:bg-green-400 border-0 w-[13.5rem]"
                @click="onModifyStudentButtonClick">Valider</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {getStudent, updateStudent} from "@/services/studentService";
import {emitter} from "@/emitter";
import Header from "@/components/Header.vue";

export default {
  name: "StudentEditView",
  components: {Header},
  data() {
    return {
      student: {
        name: "",
        surname: "",
        uid: "",
        email: ""
      }
    }
  },
  mounted() {
    getStudent(this.$route.params.id).then((student) => {
      this.student = student;
    }).catch((error) => {
      emitter.emit("notification", {
        type: "error",
        message: error
      });
    });
  },
  methods: {
    onModifyStudentButtonClick() {
      updateStudent(this.student).then(() => {
        emitter.emit("notification", {
          type: "success",
          message: "L'étudiant.e a bien été modifié.e"
        });

        this.$router.push("/dashboard/students");
      }).catch((err) => {
        emitter.emit("notification", {
          type: "error",
          message: err
        });
      });
    },
    onSwapButtonClick() {
      const temp = this.student.name;
      this.student.name = this.student.surname;
      this.student.surname = temp;
    }
  }
}
</script>

<style scoped>

</style>