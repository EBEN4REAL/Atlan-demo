

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>

<template>
  <main class="px-4 py-10 text-center text-teal-700 dark:text-gray-200">
    <div>
      <p class="text-4xl"></p>
    </div>
    <router-view />
    <div>
      <button class="m-3 mt-8 text-sm btn">back</button>
    </div>
  </main>
</template>
