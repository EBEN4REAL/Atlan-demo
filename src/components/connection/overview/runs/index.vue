<template>
  <div class="">
    <table class="table w-full table-report">
      <tbody>
        <template v-for="item in list" :key="item.metadata.uid">
          <ItemView :item="item"></ItemView>
        </template>
      </tbody>
    </table>
  </div>
</template>
          
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Workflows } from "~/api/argo/workflow";
import { ConnectionType } from "~/types/atlas/connection";
import ItemView from "./item.vue";

export default defineComponent({
  components: {
    ItemView,
  },
  props: {
    item: {
      type: Object as PropType<ConnectionType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  data() {
    return {
      list: [],
    };
  },
  watch: {
    "item.guid": function() {
      this.fetchData();
    },
  },
  mounted() {},
  methods: {
    async fetchData() {
      console.log("fetch dad");
      try {
        const qf = this.item.attributes.qualifiedName.split("/").join("..");
        console.log(this.item.attributes.qualifiedName);
        const response = await Workflows.List({
          "listOptions.limit": 10,
          "listOptions.labelSelector": `connection-qualified-name=${qf}`,
        });
        this.list = response.items;
      } catch (error) {}
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