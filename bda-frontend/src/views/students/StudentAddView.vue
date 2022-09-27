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
            <li><span class="badge">Ajout</span></li>
          </ul>
        </div>


        <div class="flex flex-row items-start">
          <div class="flex flex-col mr-10">
            <input list="students" type="text" placeholder="Rechercher..." class="input mb-2"
                   @input="fetchStudentFromLDAP" v-model="searchQuery">

            <div class="overflow-auto h-96 bg-white rounded-lg w-[13.5rem]">
              <div
                  v-for="student in students"
                  class="flex flex-row items-center justify-between px-5 py-2 hover:cursor-pointer"
                  @click="onStudentClick(student)"
                  :class="this.selectedStudent.uid === student.uid ? 'bg-blue-300 hover:bg-blue-400' : 'hover:bg-gray-300'">
                <span>{{ student.name }} {{ student.surname }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col justify-between h-full  ">

            <div class="flex flex-col">
              <div class="flex flex-row mb-5">
                <input class="input mr-10" placeholder="Nom" id="name" type="text" v-model="student.name">
                <input class="input" placeholder="UID" id="uid" type="text" v-model="student.uid">
              </div>

              <div class="flex flex-row mb-5">
                <input class="input mr-10" placeholder="Prénom" id="surname" type="text"
                       v-model="student.surname">
                <input class="input" placeholder="Email" id="email" type="text" v-model="student.email">
              </div>
            </div>

            <div class="flex flex-row w-full justify-end">
            <span
                class="btn bg-green-300 hover:bg-green-400 border-0 w-[13.5rem]"
                @click="onAddStudentButtonClick">Valider</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Header from "@/components/Header.vue";
import {createStudent, getAllStudents, getStudentByUid, queryLDAP} from "@/services/studentService";
import {emitter} from "@/emitter";

export default {
  name: "StudentAddView",
  components: {Header},
  data() {
    return {
      searchQuery: "",
      timeoutId: null,
      students: [],
      selectedStudent: {
        uid: null
      },
      student: {
        name: "",
        surname: "",
        uid: "",
        email: "",
        role: "USER"
      },
      allStudents: []
    }
  },
  mounted() {
    getAllStudents().then(students => {
      this.allStudents = students;
    }).catch(err => {
      emitter.emit("notification", {
        type: "error",
        message: err
      })
    });
  },
  methods: {
    fetchStudentFromLDAP() {
      // Wait for the user to stop typing
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        queryLDAP(this.searchQuery).then((students) => {
          this.students = students.filter(student => {
            return !this.allStudents.some(s => s.uid === student.uid);
          });
        }).catch((error) => {
          if (!this.searchQuery) {
            return;
          }

          emitter.emit("notification", {
            type: "error",
            message: error
          });
        });
      }, 400);
    },
    onAddStudentButtonClick() {
      createStudent(this.student).then(() => {
        emitter.emit("notification", {
          type: "success",
          message: "L'étudiant.e a bien été ajouté.e"
        });

        this.$router.push("/dashboard/students");
      }).catch((error) => {
        emitter.emit("notification", {
          type: "error",
          message: error
        });
      });
    },
    onStudentClick(student) {
      this.selectedStudent = student;
      Object.keys(student).forEach((key) => {
        this.student[key] = student[key];
      });

      // Check if the student is already in the database
      getStudentByUid(student.uid).then((student) => {
        if (student) {
          emitter.emit("notification", {
            type: "error",
            message: "L'étudiant.e est déjà dans la base de données"
          });
        }
      }).catch((error) => {
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