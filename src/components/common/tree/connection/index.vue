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

      // console.log(value);
      // const getParentKey = (
      //   key: string,
      //   tree: TreeDataItem[]
      // ): string | number | undefined => {
      //   let parentKey;
      //   for (let i = 0; i < tree.length; i++) {
      //     const node = tree[i];
      //     if (node.children) {
      //       if (node.children.some((item) => item.key === key)) {
      //         parentKey = node.key;
      //       } else if (getParentKey(key, node.children)) {
      //         parentKey = getParentKey(key, node.children);
      //       }
      //     }
      //   }
      //   return parentKey;
      // };

      // const expanded = this.list
      //   .map((item: TreeDataItem) => {
      //     console.log(item);
      //     if ((item.title as string).indexOf(value) > -1) {
      //       return getParentKey(item.key as string, this.list);
      //     }
      //     return null;
      //   })
      //   .filter((item) => {
      //     console.log(item);
      //     return item && item.title.includes(value);
      //   });

      // console.log(expanded);
      // this.expandedKeys = expanded as string[];
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