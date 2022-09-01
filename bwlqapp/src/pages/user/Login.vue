<template>
  <div class="row space-between">
    <div class="col-lg-6 col-md-6 col-sm-12 full-height" style="min-width: 500px">
      <q-img src="~/assets/vaca.png" style="height: 100vh" alt="logo" />
    </div>

    <div class="col-lg-66 col-md-6 col-sm-12">
      <div class="text-h3 text-center text-bold q-pt-xl">Login</div>

      <q-separator class="q-my-md" />

      <q-form @submit="onSubmit" @reset="onReset" class="q-pt-xl q-pr-xl q-pl-xl q-gutter-xs">
        <div class="q-py-sm">
          <q-input class="q-mt-sm" outlined v-model="userInfo.email" label="Your email *" type="email" name="email"
            placeholder="Enter your email" hint="email@example.com" lazy-rules :rules="[
              (val) => (val && val.length > 0) || 'This field is required',
              isValidEmail // = (val) => isValidEmail (val)
            ]" />
        </div>

        <div class="q-gutter-xs">
          <q-input class="q-mt-sm" outlined type="password" name="password" v-model="userInfo.password"
            label="Your password *" lazy-rules :rules="[
              (val) =>
                (val !== null && val !== '') || 'Please type your password',
            ]" />
        </div>

        <div class="row">
          <div class="col-12">
            <!-- <router-link to="recover" class="float-right">Forgot password?</router-link> -->
            <router-link to="register" class="float-left">Sign Up</router-link>
          </div>
        </div>

        <!-- <div class="row q-pt-md">
          <div class="col-12">
            <q-checkbox class="float-left" v-model="userInfo.remember" label="Remember Me" />
          </div>
        </div> -->

        <div>
          <q-btn label="Login" type="submit" color="primary" class="q-mt-sm full-width" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm full-width" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth/auth-store";

const authStore = useAuthStore();

export default defineComponent({
  name: 'SignIn',
  setup() {
    const userInfo = ref({
      email: '',
      password: '',
      accept: false,
      // remember: false,
      errorInAccept: false,
    });

    let $q = useQuasar();
    const router = useRouter();

    return {
      userInfo,
      authStore,

      async onSubmit() {
        if (userInfo.value.email === '' && userInfo.value.password === '') {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "cloud_done",
            message: "INGRESE USUARIO Y PASSWORD",
          });
        } else {
          await authStore.loginUser(userInfo.value.email, userInfo.value.password)
            .then(
              response => {
                $q.notify({
                  color: "green-4",
                  textColor: "white",
                  icon: "cloud_done",
                  message: "Usuario logeado",
                });
                router.push('/');
              }
            )
            .catch(error => {
              if (error) {
                console.log(error.message)
                $q.notify({
                  color: "red-5",
                  textColor: "white",
                  icon: "warning",
                  message: "usuario no econtrado"
                })
              }
            }
            );
        }
      },

      onReset() {
        userInfo.value = {
          email: '',
          password: '',
          accept: false,
          // remember: false,
          errorInAccept: false,
        }
      },
      isValidEmail(val) {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'El correo no parece ser válido';
      },

    };
  },
})
</script>
