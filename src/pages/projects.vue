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
              <Editor></Editor>
            </div>
            <div
              class="p-6 m-6 overflow-x-auto bg-white border rounded table-wrapper"
            >
              <p class="">Table</p>
              <a-table
                class="overflow-x-auto"
                :dataSource="dataSource"
                :columns="columns"
              />
            </div>
          </pane> </splitpanes
      ></a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import Editor from "@/editor/index.vue";

import ProjectSidebar from "~/layouts/project/index.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    ProjectSidebar,
    Editor,
  },
  data() {
    return {
      editor: null,
    };
  },
  setup() {
    useHead({
      title: "Query Playground",
    });
    const router = useRouter();
    const dataSource = [
      // {
      //   key: "1",
      //   name: "Mike",
      //   age: 32,
      //   address: "10 Downing Street",
      // },
    ];

    const columns = [
      {
        title: "Row ID",
        dataIndex: "Row ID",
        width: "9vw",
        key: "Row ID",
      },
      {
        title: "Order ID",
        dataIndex: "Order ID",
        width: "9vw",
        key: "Order ID",
      },
      {
        title: "Ship Date_sales",
        dataIndex: "Ship Date_sales",
        width: "9vw",
        key: "Ship Date_sales",
      },
      {
        title: "Ship Mode_sales",
        dataIndex: "Ship Mode_sales",
        width: "9vw",
        key: "Ship Mode_sales",
      },
      {
        title: "Customer ID",
        dataIndex: "Customer ID",
        width: "9vw",
        key: "Customer ID",
      },
      {
        title: "Customer Name",
        dataIndex: "Customer Name",
        width: "9vw",
        key: "Customer Name",
      },
      {
        title: "Segment",
        dataIndex: "Segment",
        width: "9vw",
        key: "Segment",
      },
      {
        title: "City",
        dataIndex: "City",
        width: "9vw",
        key: "City",
      },
      {
        title: "State",
        dataIndex: "State",
        width: "9vw",
        key: "State",
      },
      {
        title: "Country",
        dataIndex: "Country",
        width: "9vw",
        key: "Country",
      },
      {
        title: "Postal Code",
        dataIndex: "Postal Code",
        width: "9vw",
        key: "Postal Code",
      },
      {
        title: "Sales_Market",
        dataIndex: "Sales_Market",
        width: "9vw",
        key: "Sales_Market",
      },
      {
        title: "Sales_Region",
        dataIndex: "Sales_Region",
        width: "9vw",
        key: "Sales_Region",
      },
      {
        title: "Product ID",
        dataIndex: "Product ID",
        width: "9vw",
        key: "Product ID",
      },
      {
        title: "Sales_Category",
        dataIndex: "Sales_Category",
        width: "9vw",
        key: "Sales_Category",
      },
      {
        title: "Sub-Category",
        dataIndex: "Sub-Category",
        width: "9vw",
        key: "Sub-Category",
      },
      {
        title: "Product Name",
        dataIndex: "Product Name",
        width: "9vw",
        key: "Product Name",
      },
      {
        title: "Sales",
        dataIndex: "Sales",
        width: "9vw",
        key: "Sales",
      },
      {
        title: "Quantity",
        dataIndex: "Quantity",
        width: "9vw",
        key: "Quantity",
      },
      {
        title: "Instant_Sales_Discount",
        dataIndex: "Instant_Sales_Discount",
        width: "9vw",
        key: "Instant_Sales_Discount",
      },
      {
        title: "Profit",
        dataIndex: "Profit",
        width: "9vw",
        key: "Profit",
      },
      {
        title: "Shipping Cost",
        dataIndex: "Shipping Cost",
        width: "9vw",
        key: "Shipping Cost",
      },
      {
        title: "Order Priority",
        dataIndex: "Order Priority",
        width: "9vw",
        key: "Order Priority",
      },
    ];

    const handleBack = () => {
      router.push("assets");
    };
    return {
      dataSource,
      columns,
      handleBack,
    };
  },
  mounted() {},
});
</script>

<style lang="less"></style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
<<<<<<< HEAD
</route>
=======
</route>
>>>>>>> development
