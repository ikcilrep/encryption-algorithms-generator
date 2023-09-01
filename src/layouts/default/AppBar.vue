<template>
  <v-app>
    <v-main style="min-height: 90vh">
      <v-app-bar>
        <router-link to="/" class="text-black text-decoration-none d-flex w-66 align-center ml-3">
          <v-img
              class="mx-3"
              src="logo.png"
              max-height="35"
              max-width="35"
              contain
          ></v-img>
          <v-toolbar-title to="/">
            Encryption algorithms generator
          </v-toolbar-title>
        </router-link>
      </v-app-bar>
      <router-view />
    </v-main>
    <v-footer class="d-flex justify-center text-center py-5">
      &copy; {{ new Date().getFullYear().toString() }} Szymon Perlicki<br>
    </v-footer>
  </v-app>
</template>

<script setup>
  //
</script>
