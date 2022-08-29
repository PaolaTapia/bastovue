<template>
<!-- <router-link to="/">Home</router-link>
{{' '}}
 <router-link to="/register">Register</router-link>
{{' '}}
<router-link to="/login">Login</router-link> -->
  <router-view />
</template>

<script setup lang="ts">

//import components
import { ref } from 'vue'

</script>


<style>
#app{
  font-family: 'roboto-font', Arial, Helvetica, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}</style>
