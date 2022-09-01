<template>
  <div class="row space-between">
    <div class="col-lg-6 col-md-6 col-sm-12 full-height" style="min-width: 500px">
      <q-img src="~/assets/vaca.png" style="height: 100vh" alt="logo" />
    </div>

    <div class="col-lg-66 col-md-6 col-sm-12">
      <div class="text-h3 text-center text-bold q-pt-xl">Sign Up</div>

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
          <q-input class="q-mt-sm" outlined type="password" name="password1" v-model="userInfo.password1"
            label="Your password *" lazy-rules :rules="[
              (val) =>
                (val.length > 5 && val.length < 9) || 'Debe tener entre 6 y 8 caracteres',

            ]" />
        </div>

        <div class="q-gutter-xs">
          <q-input class="q-mt-sm" outlined type="password" name="password2" v-model="userInfo.password2"
            label="Repeat your password *" lazy-rules :rules="[
              (val) =>
                (val.length > 5 && val.length < 9) || 'Debe tener entre 6 y 8 caracteres',
              isSamePassword
            ]" />
        </div>

        <div class="row">
          <div class="col-12">
            <!-- <router-link to="recover" class="float-right">Forgot password?</router-link> -->
            <router-link to="login" class="float-left">Login</router-link>
          </div>
        </div>

        <div class="row q-pt-md">
          <div class="col-12">
            <q-toggle class="float-right" v-model="userInfo.accept" label="I accept the license and terms"
              :style="userInfo.errorInAccept && !userInfo.accept && 'color:red'" />
          </div>
        </div>

        <div>
          <q-btn label="Registrarme" type="submit" color="primary" class="q-mt-sm full-width" />
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
      password1: '',
      password2: '',
      accept: false,
      remember: false,
      errorInAccept: false,
    });

    let $q = useQuasar();
    const router = useRouter();

    return {
      userInfo,
      authStore,

      async onSubmit() {

        if (userInfo.value.email === '' && userInfo.value.password1 === '') {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "cloud_done",
            message: "INGRESE USUARIO Y PASSWORD",
          });
        } else {

          if (!userInfo.value.accept) {
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "You need to accept the license and terms first",
            });
            userInfo.value.errorInAccept = true
            return
          } else {
            userInfo.value.errorInAccept = false;
            await authStore.registerUser(userInfo.value.email, userInfo.value.password1)
              .then(
                response => {
                  $q.notify({
                    color: "green-4",
                    textColor: "white",
                    icon: "cloud_done",
                    message: "Usuario registrado",
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
                    message: "usuario no pudo ser registrado"
                  })
                }
              }
              );
          }
        }

      },

      onReset() {
        userInfo.value = {
          email: '',
          password1: '',
          password2: '',
          accept: false,
          remember: false,
          errorInAccept: false,
        }
      },
      isValidEmail(val) {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'El correo no parece ser válido';
      },
      isSamePassword(val) {
        return (val === userInfo.value.password1) || 'Las contraseñas no son iguales'
      },

    };
  },
})
</script>
