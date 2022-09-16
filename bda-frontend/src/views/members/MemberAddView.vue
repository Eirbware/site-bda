<template>
  <main class="py-2 px-12 flex-1 flex justify-center items-center">
    <div class="w-full flex items-center justify-center">

      <div class="w-full flex justify-center">

        <!-- Colored wrapper -->
        <div class="rounded-2xl overflow-hidden bg-gray-200 flex flex-col items-start py-10 px-24">

          <!-- BreadCrumbs -->
          <div class="text-sm breadcrumbs mb-5">
            <ul>
              <li>
                <router-link to="/dashboard/members" class="badge">Dashboard</router-link>
              </li>
              <li><span class="badge">Ajout</span></li>
            </ul>
          </div>

          <div class="flex flex-col">

            <!-- Main row -->
            <div class="flex flex-row">

              <!-- Student search -->
              <div class="flex flex-col mr-10">
                <input list="students" type="text" placeholder="Rechercher..." class="input mb-2"
                       @input="onSearchQueryChange" v-model="searchQuery">

                <ul class="menu bg-base-100 w-56 rounded-lg h-96 overflow-auto">
                  <li
                      v-for="student in students"
                      class="w-full duration-150"
                      @click="onStudentClick(student)"
                      :class="this.selectedStudent.uid === student.uid ? 'bg-betterPrimary hover:bg-betterPrimaryShadowed' : 'hover:bg-gray-300'">
                    <span>{{ student.name }} {{ student.surname }}</span>
                  </li>
                </ul>
              </div>


              <div class="flex flex-col justify-between">
                <div class="flex flex-row">
                  <!-- Input and validation -->
                  <div class="flex flex-col">
                    <div class="flex flex-row mb-5">
                      <input class="input mr-10" placeholder="Poste" id="title" type="text"
                             v-model="member.title">
                      <input class="input px-5" placeholder="Description" id="description" type="text"
                             v-model="member.description">
                    </div>

                    <div class="flex flex-row mb-5">
                      <input
                          class="input mr-10"
                          placeholder="Année"
                          id="year"
                          type="number"
                          v-model="member.year"
                          :class="this.isMemberAlreadyExistingThisYear(member) ? 'input-error' : ''"
                      >

                      <select class="select w-[14rem]" v-model="member.student.role">
                        <option selected>USER</option>
                        <option v-if="me.role === 'ADMIN'">ADMIN</option>
                        <option>PPC</option>
                      </select>
                    </div>
                  </div>

                  <!-- Avatar and actions -->
                  <div class="flex flex-col ml-10">
                    <!-- Preview -->
                    <div class="avatar mb-5 w-[13.5rem] mr-5">
                      <div class="rounded">
                        <img :src="this.selectedFileData" v-if="selectedFileData" alt=""/>
                        <div class="w-full" v-else v-html="getIdenticon(this.identiconSeed)"/>
                      </div>
                    </div>

                    <div class="flex flex-col w-[13.5rem]">
                      <!-- Actions -->
                      <div class="btn w-full mb-2" @click="onChangeAvatarButtonClick">Changer la photo</div>
                      <div class="btn bg-red-400 border-0 hover:bg-red-500 w-full" @click="onDeleteAvatarButtonClick">
                        Supprimer la photo
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Confirmation button -->
                <div class="flex flex-row w-full justify-end">
                  <button
                      class="btn bg-green-300 hover:bg-green-400 border-0 w-[13.5rem] mr-5"
                      @click="onAddMemberButtonClick" :disabled="this.isMemberAlreadyExistingThisYear(member)">Valider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Header from "@/components/Header.vue";
import {getAllStudents, getMyStudent} from "@/services/studentService";
import {emitter} from "@/emitter";
import {createMember} from "@/services/memberService";
import {toSvg} from "jdenticon";
import {uploadProfilePicture} from "@/services/uploadService";

export default {
  name: "MemberAddView",
  components: {Header},
  data() {
    return {
      searchQuery: "",
      students: [],
      backupStudents: [],
      member: {
        title: "",
        picture: "",
        description: "",
        year: new Date().getFullYear(),
        student: {
          role: "USER"
        }
      },
      selectedStudent: {
        uid: null
      },
      selectedFile: null,
      selectedFileData: null,
      identiconSeed: new Date().toISOString(),
      me: {
        role: ""
      }
    }
  },
  mounted() {
    getMyStudent().then(student => {
      this.me = student;
    });

    getAllStudents().then((students) => {
      this.backupStudents = students;
      this.students = students;
    }).catch((error) => {
      emitter.emit("notification", {
        type: "error",
        message: error
      });
    });
  },
  methods: {
    onAddMemberButtonClick() {

      // Before everything, we upload the profile picture to the server
      uploadProfilePicture(this.selectedFile).then(fileName => {
        this.member.picture = fileName;

        createMember({
          ...this.member,
          studentId: parseInt(this.selectedStudent.id)
        }).then(() => {

          // Emit a success notification
          emitter.emit("notification", {
            type: "success",
            message: "Membre ajouté.e avec succès"
          });

          // Reroute to members list
          this.$router.push("/dashboard/members");
        });
      }).catch((error) => {

        // Emit an error notification
        emitter.emit("notification", {
          type: "error",
          message: error
        });
      });
    },
    onStudentClick(student) {
      this.selectedStudent = student;
    },
    onSearchQueryChange() {
      if (this.searchQuery === "") {
        this.students = this.backupStudents;
        return;
      }

      this.students = this.backupStudents.filter((student) => {
        return student.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            student.surname.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    isMemberAlreadyExistingThisYear(member) {
      return this.backupStudents
          .filter(s => (s.uid === this.selectedStudent.uid) && (s.member !== null && s.member.year === member.year))
          .length > 0
    },
    getIdenticon(value) {
      // Add width=100% to the svg to make it responsive
      return toSvg(value, 100, {
        backColor: "#ffffff",
      }).replace("<svg", "<svg width=\"100%\" height=\"auto\"");
    },
    onChangeAvatarButtonClick() {
      // Open a file selection dialog for images and store it in this.selectedFile
      const inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.accept = "image/*";
      inputElement.multiple = false;

      inputElement.addEventListener("change", (event) => {
        this.selectedFile = event.target.files[0];

        // Read file data to display it
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          this.selectedFileData = event.target.result;
        });

        reader.readAsDataURL(this.selectedFile);
      });

      inputElement.click();
    },
    onDeleteAvatarButtonClick() {
      this.selectedFile = null;
      this.selectedFileData = null;
    }
  }
}
</script>

<style scoped>

</style>