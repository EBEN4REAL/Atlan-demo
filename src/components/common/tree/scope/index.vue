<template>
  <a-tree-select
    tree-checkable
    style="width: 100%"
    showCheckedStrategy="SHOW_PARENT"
    :treeData="treeData"
    :maxTagCount="10"
    @change="handleChange"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="Please select"
  >
    <template #title="{ title, image, isLeaf }" class="flex">
      <span v-if="!isLeaf"
        ><img :src="image" class="float-left w-auto h-4 mr-1"
      /></span>
      <span class="text-base leading-none text-dark-400" v-if="!isLeaf">{{
        title
      }}</span>
      <span class="text-sm leading-none text-dark-400" v-if="isLeaf">{{
        title
      }}</span>
    </template>
  </a-tree-select>
</template>
  
  
<script lang="ts">
import { defineComponent } from "vue";
import TreeView from "@common/tree/index.vue";
import ConnectionMixin from "~/mixins/connection";
import { Metadata } from "~/api/heka/metadata";

export default defineComponent({
  mixins: [ConnectionMixin],
  components: {
    TreeView,
  },
  props: {
    modelValue: {
      required: false,
      type: Array,
    },
    credential: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  data() {
    return { treeData: [] };
  },
  watch: {
    credential() {
      this.getTreeData();
    },
  },

  mounted() {
    this.getTreeData();
  },
  emits: ["update:modelValue", "change"],
  methods: {
    handleLoadData() {
      console.log("load data");
    },
    handleChange(e) {
      console.log(e);
      this.$emit("update:modelValue", e);
      // this.$emit("change", e);
    },
    async getTreeData() {
      this.treeData = [];
      const temp = [];
      try {
        const res = await Metadata.List({ ...this.credential });
        if (res.data) {
          const list = res.data.result.reduce((r, obj) => {
            const { TABLE_CATALOG, TABLE_SCHEM } = obj;
            r[TABLE_CATALOG] = [
              ...(r[TABLE_CATALOG] || []),
              {
                TABLE_SCHEM,
              },
            ];
            return r;
          }, {});

          if (list) {
            Object.keys(list).forEach((key) => {
              let children = [];

              list[key].forEach((element, index) => {
                children.push({
                  key: `${key}_${element.TABLE_SCHEM}`,
                  title: element.TABLE_SCHEM,
                  value: `AtlanSchema$${key}$${element.TABLE_SCHEM}`,
                  type: "AtlanSchema",
                  isLeaf: true,
                  children: null,
                });
              });
              temp.push({
                key: key,
                value: `${key}`,
                title: key,
                type: "AtlanDatabase",
                children: children,
              });
            });
          }
        }
        this.treeData = [
          {
            key: "all",
            value: "all",
            title: "All Databases & Schemas",
            children: temp,
          },
        ];

        // this.treeData = [...this.treeData];
        // console.log(this.treeData);
      } catch (err) {
        console.log(err);
      }

      // const data: any[] = [];

      // const map: any = {};
      // this.connectionList().forEach((conn) => {
      //   if (!map[this.integrationName(conn)]) {
      //     map[this.integrationName(conn)] = [];
      //   }
      //   map[this.integrationName(conn)].push(conn);
      // });
      // Object.keys(map).forEach((src) => {
      //   const children = [];
      //   map[src].forEach((connection: any) => {
      //     children.push({
      //       key: connection.guid,
      //       title: this.title(connection),
      //       isLeaf: true,
      //     });
      //   });
      //   let found = SourceList.find((src) => src.id);
      //   let title = src;
      //   if (found) {
      //     title = found.label;
      //   }
      //   data.push({
      //     key: src,
      //     title: title,
      //     image: found.image,
      //     selectable: true,
      //     children: children,
      //   });
      // });

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
    },
  },
});
</script>


<!-- <template>
  <div class="">
    <treeselect
      v-model="selected"
      placeholder="DB/Schemas"
      :append-to-body="true"
      :clearable="true"
      value-format="object"
      :disabled="disabled"
      :options="list"
      :default-options="true"
      :multiple="true"
      @input="handleChange"
    >
      <template slot="value-label" slot-scope="{ node }">
        <div class="flex">
          <img :src="getAssetTypeImage(node.raw.type)" class="mr-1" /><span
            v-if="node.raw.root"
            >{{ node.raw.root }}/</span
          >{{ node.label }}
        </div></template
      >
    </treeselect>
  </div>
</template>

<script>
import { Metadata } from "~/services/query";

import Images from "~/mixins/source";

export default {
  mixins: [Images],
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    auth: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    isDefaultAll: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      cancelToken: null,
      selected: null,
      list: [],
      loading: false,
      configType: "include",
      config: "",
    };
  },
  fetch() {
    this.fetch();
    // if (!this.selected) {
    //   this.selected = {
    //     id: "all",
    //     label: `All Databases`,
    //     type: "AtlanDatabase",
    //   };
    // }
    return;
  },
  fetchOnServer: false,
  methods: {
    handleChange() {
      console.log(this.selected);

      if (this.selected.length == 1) {
        if (this.selected[0].id === "__all__") {
          this.$emit("change", {});
          return;
        }
      }

      let databases = this.selected.map((o) => {
        if (o.type === "AtlanDatabase") {
          return o["label"];
        }
        if (o.type === "AtlanSchema") {
          return o["root"];
        }
      });
      let result = {};
      databases.forEach((db) => {
        result[db] = [];
        console.log(db);
        this.selected.forEach((schema) => {
          if (schema.type == "AtlanSchema" && schema.root == db) {
            result[db].push(schema.label);
          }
        });
      });
      this.$emit("change", result);
    },
    async fetch() {
      const body = this.auth;
      try {
        this.loading = true;
        if (this.cancelToken) {
          this.cancelToken.cancel("Operation canceled by the user.");
        }
        this.cancelToken = this.$axios.CancelToken.source();
        var response = {};
        response = await Metadata.List(
          this.$axios,
          this.cancelToken.token,
          body
        );
        this.loading = false;
        let temp = [];
        if (response.result) {
          const list = response.result.reduce((r, obj) => {
            const { TABLE_CATALOG, TABLE_SCHEM } = obj;
            r[TABLE_CATALOG] = [
              ...(r[TABLE_CATALOG] || []),
              {
                TABLE_SCHEM,
              },
            ];
            return r;
          }, {});

          if (list) {
            Object.keys(list).forEach((key) => {
              let children = [];

              list[key].forEach((element) => {
                children.push({
                  id: `${key}_${element.TABLE_SCHEM}`,
                  label: element.TABLE_SCHEM,
                  root: key,
                  type: "AtlanSchema",
                });
              });

              temp.push({
                id: key,
                label: key,
                type: "AtlanDatabase",
                children: children,
              });
            });
          }
        }

        const count = temp.length;
        const globalObject = {
          id: "__all__",
          label: `All Databases (${count})`,
          type: "AtlanDatabase",
          children: temp,
        };
        this.list.push(globalObject);

        if (this.isDefaultAll) {
          this.selected = [globalObject];
        }

        // this.list = temp;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
  },
};
</script> -->
