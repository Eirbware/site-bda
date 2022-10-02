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
              <router-link to="/dashboard/members" class="badge">Gestion des membres</router-link>
            </li>
            <li><span class="badge">Édition</span></li>
          </ul>
        </div>

        <div class="flex flex-row">

          <!-- Avatar preview and actions -->
          <div class="flex flex-col w-[13.5rem] mr-5">

            <!-- Preview -->
            <div class="avatar mb-5 w-full mr-5">
              <div class="rounded">
                <img :src="this.selectedFileData" v-if="selectedFileData" alt="Photo"/>
                <img v-else-if="this.member.picture" :src="`${this.backendUrl}/images/members/${this.member.picture}`" alt="Selected Member Picture"/>
                <img v-else src="@/assets/member.png" alt="Default Member Picture"/>
              </div>
            </div>

            <!-- Actions -->
            <div class="btn w-full mb-2" @click="onChangeAvatarButtonClick">Changer la photo</div>
            <div class="btn bg-red-400 border-0 hover:bg-red-500 w-full">Supprimer la photo</div>
          </div>


          <div class="flex flex-col justify-between">
            <!-- Input and validation -->
            <div class="flex flex-col">
              <!-- Member name and surname -->
              <div class="flex flex-row mb-5">
                <input class="input mr-10" placeholder="Nom" id="surname" type="text"
                       v-model="member.student.surname" disabled>
                <input class="input" placeholder="Prénom" id="name" type="text"
                       v-model="member.student.name"
                       disabled>
              </div>

              <!-- Title and description -->
              <div class="flex flex-row mb-5">
                <input class="input mr-10" placeholder="Poste" id="title" type="text"
                       v-model="member.title">
                <input class="input" placeholder="Description" id="description" type="text"
                       v-model="member.description">
              </div>

              <!-- Year and role -->
              <div class="flex flex-row mb-5">
                <input
                    class="input mr-10"
                    placeholder="Année"
                    id="year"
                    type="number"
                    v-model="member.year"
                >

                <select class="select w-[13.5rem]" v-model="member.student.role">
                  <option disabled selected>Role</option>
                  <option v-if="me.role === 'ADMIN'">ADMIN</option>
                  <option>PPC</option>
                  <option>USER</option>
                </select>
              </div>
            </div>

            <!-- Validation button -->
            <div class="flex flex-row justify-end">
            <span
                class="btn bg-green-300 border-0 hover:bg-green-400 w-56"
                @click="onModifyMemberButtonClick">Valider</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {getMember, updateMember} from "@/services/memberService";
import Header from "@/components/Header.vue";
import {emitter} from "@/emitter";
import {uploadProfilePicture} from "@/services/uploadService";
import {getMyStudent} from "@/services/studentService";

export default {
  name: "MemberEditView",
  components: {Header},
  data() {
    return {
      member: {
        student: {
          surname: "",
          name: "",
          role: ""
        },
        title: "",
        description: "",
        year: "",
        picture: ""
      },
      selectedFile: null,
      selectedFileData: null,
      me: {
        role: ""
      }
    }
  },
  mounted() {
    getMyStudent().then(student => {
      this.me = student;
    });

    getMember(this.$route.params.id).then((member) => {
      this.member = member;
    }).catch((error) => {
      emitter.emit("notification", {
        type: "error",
        message: error
      });
    });
  },
  methods: {
    onModifyMemberButtonClick() {
      uploadProfilePicture(this.selectedFile)
          .then(fileName => {
            this.member.picture = fileName;

            updateMember(this.member).then(() => {
              emitter.emit("notification", {
                type: "success",
                message: "Membre modifié avec succès"
              });

              this.$router.push("/dashboard/members");
            }).catch((error) => {
              emitter.emit("notification", {
                type: "error",
                message: error
              });
            });
          }).catch(err => {
        emitter.emit("notification", {
          type: "error",
          message: err
        });
      });
    },
    onChangeAvatarButtonClick() {
      // Open a file selection dialog for images and store it in this.selectedFile
      const inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.accept = "image/*";
      inputElement.multiple = false;

      inputElement.addEventListener("change", (event) => {
        this.selectedFile = event.target.files[0];

        const reader = new FileReader();

        reader.addEventListener("load", (event) => {
          this.selectedFileData = event.target.result;
        });

        reader.readAsDataURL(this.selectedFile);
      });

      inputElement.click();
    },
  },
  computed: {
    backendUrl() {
      return import.meta.env.VITE_BACKEND_ADDRESS;
    },
    profilePicture() {
      if (this.selectedFileData) {
        return this.selectedFileData;
      } else if (this.member && this.member.picture) {
        return `${this.backendUrl}/uploads/${this.member.picture}`;
      }
    }
  }
}
</script>

<style scoped>

</style>