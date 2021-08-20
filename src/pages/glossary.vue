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
    <pane min-size="25" max-size="50" :size="18" class="p-4 bg-white">
      <a-button class="text-sm leading-5 text-primary font-bold bg-primary-light w-full border-none">+ Create New Glossary</a-button>
      <a-input-search placeholder="Search accross Glossaries" class="my-4"></a-input-search>
      <!-- <HomeTree /> -->
      <GlossaryTree
        ref="glossaryTreeRef"
        @success="handleSuccess"
        @showCreateGlossaryModal="handleOpenModal"
        @showUpdateGlossaryModal="handleOpenUpdateModal"
      ></GlossaryTree>
    </pane>
    <pane :size="82" class="bg-white">
        <router-view  />
    </pane>
  </splitpanes>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useHead } from "@vueuse/head";
import { useRouter, useRoute } from 'vue-router'

import GlossaryTree from "@common/tree/glossary/index.vue";
import HomeTree from "@common/tree/glossary/home.vue";
import CreateGlossaryModal from "@common/tree/glossary/createGlossaryModal.vue";
import UpdateGlossaryModal from "@common/tree/glossary/updateGlossaryModal.vue";

export default defineComponent({
  components: { GlossaryTree, HomeTree, CreateGlossaryModal, UpdateGlossaryModal },
  props:['id', 'class'],
  setup() {
    useHead({
      title: "Glossary",
    });
    const route = useRoute();

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

    watch(
      () => route.params.id,
      async newId => {
        // console.log(newId)
      }
    )
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
