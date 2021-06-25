<template>
  <a-layout class="min-h-screen">
    <!-- <a-layout-header
      theme="light"
      class="
        flex
        items-center
        px-0
        leading-none
        align-middle
        text-primary-100
        bg-primary-500
      "
      style="height: 42px"
    >
      <div
        class="
          flex
          items-center
          h-full
          px-4
          mr-3
          align-middle
          border-r border-primary-400
          hover:bg-primary-600
        "
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
          <pane size="20" class="bg-white p-4">
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
              <Editor></Editor>
            </div>
            <div
              class="
                p-6
                m-6
                overflow-x-auto
                bg-white
                border
                rounded
                table-wrapper
              "
            >
              {{ queryResult }}
              <a-table
                class="overflow-x-auto"
                :dataSource="dataSource"
                :columns="columns"
                :scroll="{ x: 500, y: 240 }"
              />
            </div>
          </pane> </splitpanes
      ></a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from "vue";
import { useRouter } from "vue-router";
import { sse } from "~/utils/sse";
import Editor from "@/editor/index.vue";
import queryData from "@/editor/monaco/queryData.json";

import ProjectSidebar from "~/layouts/project/index.vue";

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
    const router = useRouter();
    const $keycloak = inject("$keycloak");
    const queryResult = ref("");
    // const dataSource = [
    //   // {
    //   //   key: "1",
    //   //   name: "Mike",
    //   //   age: 32,
    //   //   address: "10 Downing Street",
    //   // },
    // ];
    const listData = [
      {
        title: "Profit by Segment",
        description:
          'SELECT "Segment", SUM("Profit") AS "sum of Profit" FROM "superstore_sales_data_2016-present" GROUP BY "Segment"',
      },
      {
        title: "Sales by City",
        description:
          'SELECT "City", COUNT("Sales") AS "count of Sales" FROM "superstore_sales_data_2016-present" GROUP BY "City" ORDER BY "count of Sales" DESC  LIMIT 50',
      },
      {
        title: "Missing Postal Codes",
        description:
          'SELECT * FROM "superstore_sales_data_2016-present" WHERE "Postal Code" IS NULL LIMIT 50',
      },
      {
        title: "Orders by City",
        description:
          'SELECT "Segment", SUM("Profit") AS "sum of Profit" FROM "superstore_sales_data_2016-present" GROUP BY "Segment"',
      },
    ];

    const dataSource = queryData;

    let URL =
      "https://alpha.atlan.com/heka/api/query/tenants/default/sql/stream?sql=c2VsZWN0ICogZnJvbSAiV0VCX1NBTEVTIiBsaW1pdCAyMDA%3D&defaultSchema=SNOWFLAKE_SAMPLE_DATA.TPCDS_SF10TCL&dataSourceName=default%2Fsnowflake%2Fnqmebzz7r&length=16";

    const listenEvents = () => {
      sse(URL, {}, $keycloak.token, {})
        .then((sse) => {
          sse.onError((e) => {
            console.error("lost connection; giving up!", e);
            sse.close();
          });
          sse.subscribe("", (message) => {
            console.log(message);
            queryResult.value(message);
          });
        })
        .catch((err) => {
          console.error("Failed to connect to server");
          console.error(err);
        });
    };

    listenEvents();

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
      listData,
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
</route>
