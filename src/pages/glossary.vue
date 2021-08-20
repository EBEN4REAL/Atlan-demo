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
    <pane min-size="25" max-size="50" :size="18" class="bg-white">
      <div v-if="!currentGuid" class="px-2 py-4">
        <div class="px-2 pb-2">
          <a-input-search placeholder="Search accross Glossaries"></a-input-search>
        </div>
        <HomeTree />
      </div>
      <div v-else-if="currentGuid && parentGlossaryGuid">
        <div class="flex text-sm leading-5 text-gray-500 cursor-pointer py-2 pl-4 mb-4 bg-gray-100" type="link" 
          @click="backToHome"
        >
          <fa icon="fas chevron-left" class="mr-2"/>
          <span>Back to Glossary Home</span>
        </div>
        <div class="px-4 pb-4">
          <a-input-search placeholder="Search accross Glossaries"></a-input-search>
        </div>
        <div v-if="entity" class="flex space-x-2 px-4">
          <a-button class="text-sm leading-5 bg-primary-light text-primary font-bold w-full border-none">
            <span v-if="entity?.typeName === 'AtlasGlossary'">
              {{ entity?.displayText }}
            </span>
            <span v-else>{{ entity?.attributes?.anchor?.uniqueAttributes?.qualifiedName }}</span>
          </a-button>
          <a-button class="p-2 px-2.5 flex flex-col justify-center bg-primary-light text-primary border-none">
            <fa icon="fal plus" />
          </a-button>
        </div>
        <div class="py-2 px-2.5">
          <GlossaryTree
            :parentGuid="parentGlossaryGuid"
            ref="glossaryTreeRef"
            @success="handleSuccess"
            @showCreateGlossaryModal="handleOpenModal"
            @showUpdateGlossaryModal="handleOpenUpdateModal"
          ></GlossaryTree>

        </div>
      </div>
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

import useGTCEntity from '~/composables/glossary/useGtcEntity'

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'

export default defineComponent({
  components: { GlossaryTree, HomeTree, CreateGlossaryModal, UpdateGlossaryModal },
  props:['id', 'class'],
  setup() {
    useHead({
      title: "Glossary",
    });
    const route = useRoute();
    const router = useRouter();

    const currentGuid = ref<string>(route.params.id as string);
    const type = route.fullPath.split('/')[2];
    const parentGlossaryGuid = ref<string | undefined>('')
    const {
      entity,
      error,
      isLoading,
      refetch
      } = useGTCEntity<Glossary | Term | Category>(type === 'term' || type === 'category' ? type : 'glossary', currentGuid, currentGuid)


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

    const backToHome = () => router.push('/glossary')

    watch(
      () => route.params.id,
      newId => {
        currentGuid.value = newId;
        refetch()
      }
    );

    watch(entity, (newEntity) => {
      if(newEntity?.typeName === 'AtlasGlossary'){
        parentGlossaryGuid.value = newEntity?.guid
      }
      if(newEntity?.typeName === 'AtlasGlossaryCategory'){
        parentGlossaryGuid.value = newEntity?.attributes?.anchor?.guid
      }
      if(newEntity?.typeName === 'AtlasGlossaryTerm'){
        parentGlossaryGuid.value = newEntity?.attributes?.anchor?.guid
      }
    });

    return {
      handleOpenModal,
      handleCloseModal,
      handleOpenUpdateModal,
      handleSuccess,
      backToHome,
      createGlossaryModalVisble,
      updateGlossaryModalVisble,
      eventContext,
      glossaryTreeRef,
      currentGuid,
      parentGlossaryGuid,
      entity,
      type,
      route
    };
  },
});
</script>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
