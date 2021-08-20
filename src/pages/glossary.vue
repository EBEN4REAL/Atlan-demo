<template>
  <CreateGlossaryModal
    :event-context="eventContext"
    :visible="createGlossaryModalVisble"
    @success="handleSuccess"
    @closeModal="handleCloseModal"
  />
  <UpdateGlossaryModal
    :event-context="eventContext"
    :visible="updateGlossaryModalVisble"
    @success="handleSuccess"
    @closeModal="handleCloseModal"
  />
  <splitpanes class="h-full default-theme">
    <pane min-size="25" max-size="50" :size="19" class="px-3 bg-white">
      <a-input placeholder="Search" class="my-3"></a-input>
      <GlossaryTree
        ref="glossaryTreeRef"
        @success="handleSuccess"
        @showCreateGlossaryModal="handleOpenModal"
        @showUpdateGlossaryModal="handleOpenUpdateModal"
      ></GlossaryTree>
    </pane>
    <pane :size="80" class="bg-white">
        <router-view  />
    </pane>
  </splitpanes>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import GlossaryTree from "@common/tree/glossary/index.vue";
import CreateGlossaryModal from "@common/tree/glossary/createGlossaryModal.vue";
import UpdateGlossaryModal from "@common/tree/glossary/updateGlossaryModal.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: { GlossaryTree, CreateGlossaryModal, UpdateGlossaryModal },
  props:['id', 'class'],
  setup() {
    useHead({
      title: "Glossary",
    });
    const createGlossaryModalVisble = ref(false);
    const updateGlossaryModalVisble = ref(false);
    const glossaryTreeRef = ref();

    const eventContext = ref({});

    const handleOpenModal = (context: Record<string, string>) => {
      createGlossaryModalVisble.value = true;
      eventContext.value = context;
    };

    const handleOpenUpdateModal = (context: Record<string, string>) => {
      updateGlossaryModalVisble.value = true;
      eventContext.value = context;
    };

    const handleCloseModal = () => {
      createGlossaryModalVisble.value = false;
      updateGlossaryModalVisble.value = false;
      eventContext.value = {};
    };

    const handleSuccess = () => {
      setTimeout(() => {
        glossaryTreeRef.value.refreshTree();
      }, 2000);
    };

    return {
      handleOpenModal,
      handleCloseModal,
      handleOpenUpdateModal,
      handleSuccess,
      createGlossaryModalVisble,
      updateGlossaryModalVisble,
      eventContext,
      glossaryTreeRef,
    };
  },
});
</script>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
