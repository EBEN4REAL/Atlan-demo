<template>
  <div class="">
    <div class="mb-2 d-flex">
      <a-select placeholder="All Types" class="mr-2"></a-select>
      <a-select placeholder="All Connectors"></a-select>
    </div>
    <table class="table w-full table-report">
      <tbody>
        <template v-for="item in list" :key="item.metadata.uid">
          <ItemView :item="item"></ItemView>
        </template>
      </tbody>
    </table>
    <!-- <div class="flex flex-col space-y-2"> -->

    <!-- </div> -->
  </div>
</template>
          
<script lang="ts">
import { defineComponent } from "vue";
import { Workflows } from "~/api/argo/workflow";
import ItemView from "./item.vue";

export default defineComponent({
  components: {
    ItemView,
  },
  props: {},
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await Workflows.List({
          "listOptions.limit": 10,
          "listOptions.labelSelector": "bot-template-name=atlan-jdbc-crawler",
        });
        this.list = response.data.items;
        console.log(this.list);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>

<style lang="less" scoped>
.table-report {
  border-spacing: 0 10px;
  border-collapse: separate;
}
</style>