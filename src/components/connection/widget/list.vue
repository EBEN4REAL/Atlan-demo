<template>
  <div class="border rounded px-4 py-3 bg-white">
    <div class="d-flex mb-2">
      <a-select placeholder="All Types" class="mr-2"></a-select>
      <a-select placeholder="All Connectors"></a-select>
    </div>
    <template v-for="item in list" :key="item.metadata.uid">
      <ItemView :item="item"></ItemView>
    </template>
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