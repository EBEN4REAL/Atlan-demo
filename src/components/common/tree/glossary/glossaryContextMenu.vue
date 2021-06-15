<template>
  <a-menu @click="handleMenuClick">
    <a-menu-item v-if="showGlossary" key="Glossary">
      Add new glossary
    </a-menu-item>
    <a-menu-item v-if="showCategoryTerm" key="Category">
      Add new category
    </a-menu-item>
    <a-menu-item v-if="showCategoryTerm" key="Term"> Add new term </a-menu-item>
    <a-menu-item v-if="!showGlossary" key="Update">
      Update {{ type }}
    </a-menu-item>
    <a-menu-item v-if="!showGlossary" key="Term">
      <span class="text-red-500"> Delete {{ type }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts">
import { MenuClickEventHandler } from "ant-design-vue/lib/menu/src/interface";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: ["type"],
  emits: ["glossarContextMenuClick"],
  setup(props, {emit}) {
    const showGlossary = computed(() => props.type === "root");
    const showCategoryTerm = computed(
      () => props.type === "glossary" || props.type === "category"
    );

    const handleMenuClick:MenuClickEventHandler = (e) => {
      emit('glossarContextMenuClick', e.key);
    }

    return {
      showGlossary,
      showCategoryTerm,
      handleMenuClick
    };
  },
});
</script>