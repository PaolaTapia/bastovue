<template>

  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <div class="row space-between">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
          <img class="float-right" src="http://www.bastó.com.ar/images/new/logo-main.png"
            style="height:60px;  width: 60px">
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="left" bordered show-if-above :width="200" :breakpoint="400">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <!-- <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>
              Profile
            </q-item-section>
          </q-item> -->

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>

            <q-item-section>
              Animals
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item @click="logout" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>
              Cerrar Sesión
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">{{ userInfo.email }} </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>

      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Animals</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>

</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth/auth-store";
import { userInfo } from 'os';

const authStore = useAuthStore();

export default defineComponent({
  name: 'Layout',
  setup() {
    const rightDrawerOpen = ref(false)

    const userInfo = {
      email: localStorage.getItem('user')?.slice(1, (localStorage.getItem('user')?.length - 1)) || "[]"
    }

    const router = useRouter();

    return {
      userInfo,
      authStore,
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value
      },

      logout() {
        authStore.logoutUser()
          .then((res) => {
            if (!localStorage.getItem('user') || !localStorage.getItem('token')) { router.push('/login'); }
          })
          .catch(
            (error) => { console.log(error) }
          )
      }


    }
  },
})
</script>

<style>
</style>
