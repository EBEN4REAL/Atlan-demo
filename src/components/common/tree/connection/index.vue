<template>
  <TreeView :list="getTreeData()"></TreeView>
</template>
  
  
<script lang="ts">
import { defineComponent } from "vue";
import TreeView from "@common/tree/index.vue";
import ConnectionMixin from "~/mixins/connection";
import { SourceList } from "~/constant/source";

export default defineComponent({
  mixins: [ConnectionMixin],
  components: {
    TreeView,
  },
  props: {
    searchText: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
  },
  mounted() {},
  watch: {
    searchText(value) {
      console.log("watch");
    },
  },
  methods: {
    getTreeData() {
      const data: any[] = [];
      const map: any = {};
      this.connectionList().forEach((conn) => {
        if (!map[this.integrationName(conn)]) {
          map[this.integrationName(conn)] = [];
        }
        map[this.integrationName(conn)].push(conn);
      });

      Object.keys(map).forEach((src) => {
        console.log(src);
        const children = [];
        map[src].forEach((connection: any) => {
          children.push({
            key: connection.guid,
            title: this.title(connection),
            isLeaf: true,
          });
        });
        console.log(src);
        let found = SourceList.find((item) => item.id == src);

        let title = src;
        if (found) {
          title = found.label;
        }
        data.push({
          key: src,
          title: title,
          image: found?.image,
          selectable: true,
          children: children,
        });
      });
      return data;
    },
  },
});
</script>