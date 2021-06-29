<template>
  <a-layout class="min-h-screen">
    <!-- <a-layout-header
      theme="light"

      class="flex items-center px-0 leading-none align-middle text-primary-100 bg-primary-500"
      style="height: 42px"
    >
      <div
        class="flex items-center h-full px-4 mr-3 align-middle border-r border-primary-400 hover:bg-primary-600"
        @click="handleBack"
      >
        <fa icon="fal chevron-left" class="text-xl"></fa>
      </div>
      <p class="mb-0 leading-none tracking-wide">
        Personal Workspace
      </p></a-layout-header
    > -->
    <a-layout :hasSider="true">
      <!-- <a-layout-sider
        class="border-r bg-sidebar"
        :collapsedWidth="48"
        :collapsed="true"
        :style="{
          overflow: 'auto',
        }"
      >
        <ProjectSidebar class="mt-3"></ProjectSidebar
      ></a-layout-sider> -->
      <a-layout-content>
        <splitpanes class="bg-white default-theme">
          <pane size="20" class="p-4 bg-white">
            <a-tabs>
              <a-tab-pane key="1" tab="All">
                <a-input-search placeholder="Search projects" />
                <a-list item-layout="horizontal" :data-source="listData">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta>
                        <template #title>
                          <a href="https://www.antdv.com/">{{ item.title }}</a>
                        </template>
                        <template #description>
                          {{ item.description }}
                        </template>
                      </a-list-item-meta>
                    </a-list-item>
                  </template>
                </a-list>
              </a-tab-pane>
              <a-tab-pane key="2" tab="My Queries" force-render
                >Content of Tab Pane 2</a-tab-pane
              >
              <a-tab-pane key="3" tab="Shared"
                >Content of Tab Pane 3</a-tab-pane
              >
            </a-tabs>
          </pane>
          <pane size="80" class="shadow-md">
            <div class="p-4 m-6 bg-white border rounded">
              <Editor @run="runQuery" :isQueryRunning="isQueryRunning"></Editor>
            </div>
            <div
              class="p-6 m-6 overflow-x-auto bg-white border rounded table-wrapper"
            >
              <!-- {{ queryResult }} -->
              <a-table
                class="overflow-x-auto"
                :dataSource="dataList"
                :columns="columnList"
                :scroll="{ x: 500, y: 240 }"
              />
            </div>
          </pane> </splitpanes
      ></a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref, inject, toRaw, Ref, watch } from "vue";
import Editor from "@/editor/index.vue";
import useProject from "~/composables/projects/useProject";
import ProjectSidebar from "~/layouts/project/index.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    ProjectSidebar,
    Editor,
  },
  setup() {
    useHead({
      title: "Query Playground",
    });
    const $keycloak = inject("$keycloak");
    const token = $keycloak.token;

    const {
      queryRun,
      isQueryRunning,
      handleBack,
      dataList,
      columnList,
      listData,
    } = useProject();

    const runQuery = () => {
      queryRun(token);
    };

    return {
      isQueryRunning,
      runQuery,
      listData,
      dataList,
      columnList,
      handleBack,
    };
  },
});
</script>

<style lang="less"></style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
