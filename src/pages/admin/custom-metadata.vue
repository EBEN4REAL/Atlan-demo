<template>
  <div class="">
    <!-- <div
      v-if="isLoading"
      class="flex items-center place-content-center"
      style="min-height: 40rem"
    >
      <div class="">
        <span class=""
          >Loading...
          <i class="fal circle-notch spin 5x"></i>
        </span>
      </div>
    </div> -->
    <!-- <div
      class="grid grid-cols-3 gap-7"
      v-else-if="finalBusinessMetadataList && finalBusinessMetadataList.length"
    > -->
    <div class="grid grid-cols-3 gap-7">
      <div class="col-span-3">
        <p class="mb-0 text-2xl text-gray">Custom Metadata</p>
        <p class="text-sm text-gray">
          Manage Custom Metadata & it's attributes
        </p>
      </div>
      <div class="col-span-1">
        <div class="flex justify-between gap-5 mb-5">
          <div class="w-full h-8">
            <div class="w-full h-8">
              <a-input
                v-model:value="searchText"
                class="w-full h-full pl-2 border border-1"
                :placeholder="'Search Metadata'"
              >
                <template #suffix>
                  <fa v-if="!searchText" icon="fal search" class="text-gray-500"></fa>
                  <fa
                    v-else
                    icon="fal times-circle"
                    class="text-red-600 cursor-pointer"
                    @click="clearSearchText"
                  ></fa>
                </template>
              </a-input>
            </div>
          </div>
          <a-button
            variant="primary"
            class="rounded-md ant-btn ant-btn-primary"
            @click="onCreateNewBmClick"
            >New
          </a-button>
        </div>
        <div style="height: calc(100vh - 9rem); overflow-y: scroll">
          <BusinessMetadataList
            :final-list="
              searchText ? searchedBusinessMetadataList : finalBusinessMetadataList
            "
            :updated-bm="updatedBm"
            :selected-bm="selectedBm"
            @selectBm="handleSelectBm"
          />
        </div>
      </div>

      <div class="col-span-2">
        <BusinessMetadataProfile
          v-if="selectedBm"
          :key="selectedBm && selectedBm.guid"
          :selected-bm="selectedBm"
          style="height: calc(100vh - 6rem); overflow: hidden"
          @selectBm="handleSelectBm"
          @update="onUpdate"
          @clearUpdatedBm="updatedBm = null"
          @removeNewBm="discardNewBm"
          @afterArchive="handleAfterArchive"
          @clearNewBm="newBm = null"
        />
      </div>
    </div>
    <!-- <div
      class="flex flex-col items-center place-content-center"
      style="min-height: 50rem"
    >
      <img :src="EmptyBusinessMetadata" alt="Business Metadata Empty" class="mb-3" />
      <div class="font-bold">No business metadata created yet! 💼</div>
      <span class="mb-3 font-size-14"
        >Business metadata helps to power asset discovery and access control.</span
      >
      <a-button
        class="flex items-center font-bold border-blue text-blue"
        @click="onCreateNewBmClick"
      >
        <i class="far fa-plus"></i>Add Business Metadata
      </a-button>
    </div> -->
  </div>
</template>
<script lang="ts">
// ? components
import BusinessMetadataList from "@/admin/custom-metadata/businessMetadataList.vue";
import BusinessMetadataProfile from "@/admin/custom-metadata/businessMetadataProfile.vue";

// ? Media

// ? Composables
import useBusinessMetadata from "@/admin/custom-metadata/composables/useBusinessMetadata";

import { defineComponent, computed, onMounted } from "vue";
import { useHead } from "@vueuse/head";
import EmptyBusinessMetadata from "~/assets/images/illustrations/empty_business_metadata.svg";

export default defineComponent({
  name: "BusinessMetadata",
  components: { BusinessMetadataList, BusinessMetadataProfile },
  setup() {
    useHead({
      title: computed(() => "Custom Metadata"),
    });

    const {
      fetchBMonStore,
      selectedBm,
      discardNewBm,
      searchText,
      handleSelectBm,
      clearSearchText,
      newBm,
      updatedBm,
      onUpdate,
      handleAfterArchive,
      onCreateNewBmClick,
      businessMetadataList,
      businessMetadataListError,
      searchedBusinessMetadataList,
      finalBusinessMetadataList,
    } = useBusinessMetadata();

    onMounted(() => {
      fetchBMonStore();
    });

    return {
      EmptyBusinessMetadata,
      businessMetadataList,
      businessMetadataListError,
      clearSearchText,
      discardNewBm,
      finalBusinessMetadataList,
      handleAfterArchive,
      handleSelectBm,
      newBm,
      onCreateNewBmClick,
      onUpdate,
      searchText,
      searchedBusinessMetadataList,
      selectedBm,
      updatedBm,
    };
  },
});
</script>
<style scoped></style>
