<template>
  <CreateGlossaryModal :eventContext="eventContext" :visible="createGlossaryModalVisble" @closeModal="handleCloseModal"/>
  <UpdateGlossaryModal :eventContext="eventContext" :visible="updateGlossaryModalVisble" @closeModal="handleCloseModal"/>
  <splitpanes class="h-full default-theme">
    <pane min-size="25" max-size="50" :size="25" class="px-3 bg-white">
      <a-input placeholder="Search" class="mt-3"></a-input>
      <GlossaryTree @showCreateGlossaryModal="handleOpenModal" @showUpdateGlossaryModal="handleOpenUpdateModal"></GlossaryTree>
    </pane>
    <pane :size="74"> </pane>
  </splitpanes>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import GlossaryTree from "@common/tree/glossary/index.vue";
import CreateGlossaryModal from "@common/tree/glossary/createGlossaryModal.vue";
import UpdateGlossaryModal from "@common/tree/glossary/updateGlossaryModal.vue";

export default defineComponent({
  components: { GlossaryTree, CreateGlossaryModal, UpdateGlossaryModal },
  setup(){
    const createGlossaryModalVisble = ref(false);
    const updateGlossaryModalVisble = ref(false);

    const eventContext = ref({});

    const handleOpenModal = (context: Record<string, string>) => {
      createGlossaryModalVisble.value = true;
      eventContext.value = context
    }

    const handleOpenUpdateModal = (context: Record<string, string>) => {
      updateGlossaryModalVisble.value = true;
      eventContext.value = context
    }

    const handleCloseModal = () => {
      createGlossaryModalVisble.value = false;
      updateGlossaryModalVisble.value = false;
      eventContext.value = {}      
    }
    
    return {
      handleOpenModal,
      handleCloseModal,
      handleOpenUpdateModal,
      createGlossaryModalVisble,
      updateGlossaryModalVisble,
      eventContext
    }
  }
});
</script>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>