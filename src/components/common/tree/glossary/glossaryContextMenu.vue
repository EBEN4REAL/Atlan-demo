<template>
  <a-menu @click="handleMenuClick">
    <a-menu-item v-if="showGlossary" key="glossary">
      Add new glossary
    </a-menu-item>
    <a-menu-item v-if="showCategoryTerm" key="category">
      Add new category
    </a-menu-item>
    <a-menu-item v-if="showCategoryTerm" key="term"> Add new term </a-menu-item>
    <a-menu-item v-if="!showGlossary" key="update">
      Update {{ type }}
    </a-menu-item>
    <a-menu-item v-if="!showGlossary" key="delete">
      <span class="text-red-500"> Delete {{ type }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts">
import { MenuInfo } from "ant-design-vue/lib/menu/src/interface";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
      default: "",
    },
    guid: {
      type: String,
      required: true,
      default: "",
    },
  },
  emits: ["glossarContextMenuClick"],
  setup(props, { emit }) {
    const showGlossary = computed(() => props.type === "root");
    const showCategoryTerm = computed(
      () => props.type === "glossary" || props.type === "category"
    );

    const handleMenuClick = (e: MenuInfo) => {
      emit("glossarContextMenuClick", {
        parentGuid: props.guid,
        parentType: props.type,
        entity: ["glossary", "term", "category"].includes(e.key.toString())
          ? e.key: props.type,

        action: ["glossary", "term", "category"].includes(e.key.toString())
          ? "create" : e.key,
      });
    };

    return {
      showGlossary,
      showCategoryTerm,
      handleMenuClick,
    };
  },
});
</script>