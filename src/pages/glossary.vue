<template>
  <CreateGlossaryModal :type="glossaryItemType" :visible="createGlossaryModalVisble" @closeModal="handleCloseModal"/>
  <splitpanes class="h-full default-theme">
    <pane min-size="25" max-size="50" :size="25" class="px-3 bg-white">
      <a-input placeholder="Search" class="mt-3"></a-input>
      <GlossaryTree @showCreateGlossaryModal="handleOpenModal"></GlossaryTree>
    </pane>
    <pane :size="74"> </pane>
  </splitpanes>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import GlossaryTree from "@common/tree/glossary/index.vue";
import CreateGlossaryModal from "@common/tree/glossary/createGlossaryModal.vue";

export default defineComponent({
  components: { GlossaryTree, CreateGlossaryModal },
  setup(){
    const createGlossaryModalVisble = ref(false);
    const glossaryItemType = ref("");

    const handleOpenModal = (type: string) => {
      createGlossaryModalVisble.value = true;
      glossaryItemType.value = type
    }

    const handleCloseModal = () => {
      createGlossaryModalVisble.value = false;
      glossaryItemType.value = ""      
    }
    
    return {
      handleOpenModal,
      handleCloseModal,
      createGlossaryModalVisble,
      glossaryItemType
    }
  }
});
</script>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>