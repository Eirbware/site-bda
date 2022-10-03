<template>
  <!-- Login button bar -->
  <div class="w-full flex justify-between items-end">
    <!-- Nav item -->
    <div class="btn-group ml-10">
      <router-link
          to="/"
          class="btn bg-betterPrimary border-0 w-44 rounded-none rounded-l-lg last:rounded-lg hover:bg-betterPrimaryShadowed">
        Accueil
      </router-link>
      <router-link
          to="/partentheses"
          class="btn bg-betterPrimary border-0 w-44 rounded-none rounded-l-lg last:rounded-lg hover:bg-betterPrimaryShadowed">
        P'Art'enthèses
      </router-link>

      <!-- Dropdown menu -->
      <div v-if="isMember" class="dropdown dropdown-end">
        <label tabindex="0"
               class="btn bg-betterPrimary border-0 rounded-none rounded-r-lg w-44 hover:bg-betterPrimaryShadowed">Gestion</label>
        <ul tabindex="0" class="dropdown-content menu shadow bg-base-100 rounded-box w-full mt-1">

          <li>
            <router-link to="/dashboard/partentheses">P'Art'enthèses</router-link>
          </li>
          <li>
            <router-link to="/dashboard/partentheses-categories">Catégories</router-link>
          </li>

          <li v-if="isAdmin">
            <router-link to="/dashboard/students">Étudiant.e.s
            </router-link>
          </li>

          <li v-if="isAdmin">
            <router-link to="/dashboard/members">Membres
            </router-link>
          </li>

          <li v-if="isAdmin">
            <a @click="onDebugButtonClick">Debug</a>
          </li>

        </ul>
      </div>
    </div>

    <!-- Menu when logged in -->
    <div v-if="myStudent" class="dropdown dropdown-end">
      <label tabindex="0" class="btn w-52 mt-10 mr-10 text-xl">{{ myStudent.name }}</label>
      <ul tabindex="0" class="dropdown-content menu  shadow bg-base-100 rounded-box w-52 mt-1 mr-10">
        <li class="bg-red-400 rounded-lg" @click="onLogoutButtonClick"><a>Déconnexion</a></li>
      </ul>
    </div>

    <!-- Login button -->
    <router-link to="/auth" v-else class="btn w-52 mt-10 mr-10 text-xl">Connexion</router-link>
  </div>
</template>

<script>
import {getMyStudent} from "@/services/studentService";
import {emitter} from "@/emitter";
import {logoutUser} from "@/services/authenticationService";
import graphqlClient from "@/utils/graphqlClient";
import {gql} from "graphql-tag";
import axios from "axios";

export default {
  name: "Header",
  data() {
    return {
      myStudent: null
    }
  },
  mounted() {
    emitter.on("login", student => {
      this.myStudent = student;
    });

    // Fetch the student's name, role and member object
    graphqlClient.query({
      query: gql`
        query myStudentHeader {
          myStudent {
            name
            role
            member {
              id
            }
          }
        }
      `
    }).then(({data}) => {
      if (data) {
        this.myStudent = data.myStudent;
      }

      return null;
    }).catch(error => {
    });
  },
  methods: {
    onLogoutButtonClick() {
      logoutUser().then(() => {
        getMyStudent().then(student => {
          this.myStudent = student;
        }).catch(error => {
          // Display a toast in the case where's an error
          emitter.emit("notification", {
            type: "error",
            message: error
          });
        });

        emitter.emit("notification", {
          type: "success",
          message: "Vous avez été déconnecté"
        });
      }).catch(error => {

        // Display a toast in the case where's an error
        emitter.emit("notification", {
          type: "error",
          message: error
        });
      });
    },
    onDebugButtonClick() {
      axios.get("https://bda.eirb.fr/api/debug", { withCredentials: true })
          .then(response => {
            console.log(response);
          }).catch(error => {
            console.error(error);
      });
    }
  },
  computed: {
    isAdmin() {
      return this.myStudent && this.myStudent.role === "ADMIN";
    },
    isMember() {
      return this.myStudent && this.myStudent.member;
    }
  }
}
</script>

<style scoped>

</style>