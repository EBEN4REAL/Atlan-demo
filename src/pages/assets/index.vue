
<template>
  <router-view></router-view>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>
  
<route lang="yaml">
    meta:
        layout: default
        requiresAuth: true
</route>