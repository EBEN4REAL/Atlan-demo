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
  mounted() {},
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
        const children = [];
        map[src].forEach((connection: any) => {
          children.push({
            key: connection.guid,
            title: this.title(connection),
            isLeaf: true,
          });
        });
        let found = SourceList.find((src) => src.id);
        let title = src;
        if (found) {
          title = found.label;
        }
        data.push({
          key: src,
          title: title,
          image: found.image,
          selectable: true,
          children: children,
        });
      });

      //   this.sourceList().forEach((source) => {
      //     let found = SourceList.find((src) => src.id);

      //     let children = [];

      //     this.connectionList()
      //       .filter((item) => this.integrationName(item) === source)
      //       .forEach((conn) => {});

      //     data.push({
      //       key: source,
      //       title: source,
      //       image: found.image,
      //       children: [],
      //     });
      //   });
      return data;
    },
  },
});
</script>