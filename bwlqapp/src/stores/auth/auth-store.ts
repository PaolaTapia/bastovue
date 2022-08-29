import axios from "axios";
import { defineStore } from "pinia";
// import { api } from "src/boot/axios";
// import router from "src/router";

export interface Iuser {
  email: "";
  password: "";
}

const baseUrl = `${import.meta.env.VITE_API_URL}/auth`;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem("user") || "[]"),
    returnUrl: null,
    userData: {
      _id: "",
      email: "",
      password: "",
      is_active: true,
      token: "",
    },
    loading: false,
  }),
  getters: {
    userAuth: (state) => state,
  },
  actions: {
    //logout
    async logoutUser() {
      this.loading = true;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.loading = false;
    },
    //login
    async loginUser(email: string, password: string): Promise<void> {
      this.loading = true;
      await axios
        .post(`${baseUrl}/login`, {
          email,
          password,
        })
        .then((res) => {
          //auth token
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.token;
          // update pinia state
          this.userAuth.userData = res.data.user;
          // store user details and jwt in local storage to keep user logged in between page refreshes
          localStorage.setItem("user", JSON.stringify(res.data.user.email));
          localStorage.setItem("token", JSON.stringify(res.data.token));
        })
        .catch((error) => error.response.data);

      this.loading = false;
    },
    //register
    async registerUser(email: string, password: string): Promise<void> {
      this.loading = true;
      await axios
        .post(`${baseUrl}/register`, {
          email,
          password,
          repeatpassword: password,
        })
        .then((res) => {
          console.log("RESPUESTA", res);
          //auth token
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.token;
          // update pinia state
          this.userAuth.userData = res.data;
          // // store user details and jwt in local storage to keep user logged in between page refreshes
          // localStorage.setItem("user", JSON.stringify(res.data.user.email));
          // localStorage.setItem("token", JSON.stringify(res.data.token));
        })
        .catch((error) => error.response.data);

      this.loading = false;
    },
  },
});
