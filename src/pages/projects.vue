<template>
  <div class="w-full p-10 overflow-y-auto">
    <div class="flex justify-between">
      <p class="mb-0 text-2xl ">Projects</p>
      <a-button type="primary" class="text-white rounded"
        >Create Project</a-button
      >
    </div>
    <div class="grid grid-flow-row gap-8 mt-8 xl:grid-cols-4 2xl:grid-cols-5">
      <template v-for="project in dummyProjects">
        <div class="rounded shadow cursor-pointer hover:shadow-lg">
          <div class="mb-2 overflow-hidden rounded-t shadow md:h-32 lg:h-36 ">
            <img
              src="https://picsum.photos/300/150"
              class="w-full h-auto"
              alt="Project Image"
            />
          </div>
          <div class="p-4">
            <p class="mb-2 text-lg text-gray-dark">{{ project.projectName }}</p>
            <p class="mb-2">{{ project.description }}</p>
            <div class="flex justify-between mt-6 ">
              <div>
                <div class="flex items-center">
                  <template v-for="view in views">
                    <img
                      :src="view.src"
                      alt="view"
                      class="w-8 h-8 rounded-full view"
                    />
                  </template>
                  +3 Others
                </div>
              </div>
              <a-button
                type="default"
                class="flex items-center justify-center rounded "
              >
                <span class="flex items-center justify-center mr-2">
                  <fa icon="fal circle"></fa
                ></span>
                Active</a-button
              >
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, toRaw, Ref, watch } from "vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {},
  setup() {
    useHead({
      title: "Query Playground",
    });
    const views = [
      {
        src: "https://picsum.photos/50/50",
      },
      {
        src: "https://picsum.photos/50/50",
      },
      {
        src: "https://picsum.photos/50/50",
      },
    ];
    const dummyProjects = [
      {
        projectName: "Sales churn analysis",
        description:
          "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
      },
      {
        projectName: "Sales churn analysis",
        description:
          "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
      },
      {
        projectName: "Sales churn analysis",
        description:
          "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
      },
      {
        projectName: "Sales churn analysis",
        description:
          "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
      },
      {
        projectName: "Sales churn analysis",
        description:
          "This project's focus is on understanding the pitfalls in our sales department and proivde feedback to the team",
      },
    ];
    return {
      dummyProjects,
      views,
    };
  },
});
</script>

<style lang="less" scoped>
.view {
  border: 3px solid white;
  margin-left: -8px;
}
</style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
