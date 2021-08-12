<template>
  <div class="w-full min-h-screen">
    <header class="w-full overflow-hidden md:h-20 xl:h-28">
      <img
        src="https://picsum.photos/800/450"
        alt="project_image"
        class="w-full h-auto"
      />
    </header>
    <div class="flex px-10 py-5">
      <div class="w-3/4 mr-8">
        <div>
          <div class="flex items-center mb-2 ">
            <p class="mb-0 mr-4 text-2xl text-gray-500">
              Sales churn analysis
            </p>
            <div
              class="flex items-center justify-center text-xs  px-2  py-0.5 h-7 text-green-500 border rounded bg-green-50"
            >
              <span class="flex items-center justify-center mr-2">
                <fa icon="fal circle"></fa
              ></span>
              Active
            </div>
          </div>
          <p class="text-sm text-gray ">
            This project's focus is on understanding the pitfalls in our sales
            department and proivde feedback to the team
          </p>
        </div>
        <div>
          <a-tabs v-model:activeKey="activeKey" :tab-bar-style="tabBarStyle">
            <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.name">
              <component
                :is="tab.component"
                :ref="
                  (el) => {
                    refMap[tab.id] = el;
                  }
                "
                @change="handleChange"
              ></component>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <div class="w-1/4 pr-4 overflow-y-auto sidebar-widget-container">
        <div class="h-64 mb-4 border rounded">
          <p class="px-4 py-2 text-lg border-b text-gray-500">Project info</p>
        </div>
        <div class="h-64 mb-4 border rounded">
          <p class="px-4 py-2 text-lg border-b text-gray-500">Saved Assets</p>
        </div>
        <div class="h-64 mb-4 border rounded">
          <p class="px-4 py-2 text-lg border-b text-gray-500">Activity</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    projectHome: defineAsyncComponent(() =>
      import("~/components/projects/tabs/projectHome.vue")
    ),
    dataProfile: defineAsyncComponent(() =>
      import("~/components/projects/tabs/dataProfile.vue")
    ),
    settings: defineAsyncComponent(() =>
      import("~/components/projects/tabs/settings.vue")
    ),
    assetBrowser: defineAsyncComponent(() =>
      import("~/components/projects/tabs/assetBrowser.vue")
    ),
    queryEditor: defineAsyncComponent(() =>
      import("~/components/projects/tabs/queryEditor.vue")
    ),
  },
  props: {
    id: String,
  },
  setup(props) {
    useHead({
      title: `Project ${props.id}`,
    });
    const activeKey = ref("1");
    const tabs = [
      {
        id: "1",
        name: "Project Home",
        component: "projectHome",
      },
      {
        id: "2",
        name: "Asset Browser",
        component: "assetBrowser",
      },
      {
        id: "3",
        name: "Query Editor",
        component: "queryEditor",
      },
      {
        id: "4",
        name: "Data Profile",
        component: "dataProfile",
      },
      {
        id: "5",
        name: "Settings",
        component: "settings",
      },
    ];
    const tabBarStyle = { color: "#000", marginBottom: "0" };
    const refMap: { [key: string]: any } = ref({});
    const handleChange = (value: any) => {
      console.log(value);
    };

    return {
      tabBarStyle,
      activeKey,
      tabs,
      refMap,
      handleChange,
    };
  },
});
</script>

<style lang="less" scoped>
.view {
  border: 3px solid white;
  margin-left: -8px;
}
.sidebar-widget-container {
  height: calc(100vh - 12.5rem);
}
</style>

<route lang="yaml">
    meta:
      layout: default
      requiresAuth: true
  </route>
