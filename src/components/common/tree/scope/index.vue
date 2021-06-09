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
      } catch (err) {
        console.log(err);
      }
    },
  },
});
</script>


