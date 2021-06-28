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
              <Editor @run="runQuery"></Editor>
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
import { defineComponent, ref, inject } from "vue";
import { useRouter } from "vue-router";
import Editor from "@/editor/index.vue";
import queryData from "@/editor/monaco/queryData.json";
import { sse } from "~/utils/sse";
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
    const columnList = ref([]);
    let dataList = [];

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

    const handleBack = () => {
      router.push("assets");
    };

    const queryResponse = ref({});

    const runQuery = () => {
      console.log("run project");
      let query = btoa('select * from "WEB_SALES" limit 100');
      let URL =
        "https://alpha.atlan.com/heka/api/query/tenants/default/sql/stream?sql=" +
        query +
        "&defaultSchema=SNOWFLAKE_SAMPLE_DATA.TPCDS_SF10TCL&dataSourceName=default%2Fsnowflake%2Fp1sj4mk7g&length=16";

      sse(URL, {}, $keycloak.token, {})
        .then((sse) => {
          sse.onError((e) => {
            console.error("lost connection; giving up!", e);
            sse.close();
          });
          sse.subscribe("", (message) => {
            queryResponse.value = message;
            if (message.columns) {
              console.log(message.columns);
              message.columns.map((col, index) => {
                columnList.value.push({
                  title: col.columnName.split("_").join(" "),
                  dataIndex: col.columnName,
                  width: "9vw",
                  key: col.columnName,
                });
              });

              console.log(message.results);

              message.results.map((result, index) => {
                let tmp = {};
                result.map((row, rowindex) => {
                  tmp = {
                    ...tmp,
                    ...{
                      [message.columns[rowindex].columnName]: row,
                      key: rowindex,
                    },
                  };
                });
                dataList.push(tmp);
              });
              console.log(dataList);
              //columnList.value = message.columns;
            }

            //message.queryId
            //message.columns
            //message.results
          });
        })
        .catch((err) => {
          console.error("Failed to connect to server");
          console.error(err);
        });
    };

    return {
      runQuery,
      listData,
      dataSource,
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
