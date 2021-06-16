<template>
  <!-- <BusinessMetadataList
    :finalList="searchText ? searchedBusinessMetadataList : finalBusinessMetadataList"
    :updatedBm="updatedBm"
    :selectedBm="selectedBm"
    @selectBm="handleSelectBm"
    style="max-height: calc(100vh - 15.7rem)"
  /> -->
  <div class="px-6 pt-4">
    <!-- <div
      v-if="loading"
      class="d-flex flex-column align-items-center justify-content-center font-size-h4"
      style="min-height: 30rem"
    >
      <loader loadingText="Fetching Business Metadata..." textLarge></loader>
    </div> -->
    <div
      class="row no-gutters"
      v-if="finalBusinessMetadataList && finalBusinessMetadataList.length"
    >
      <div class="pr-4 col-4">
        <div class="mb-4 d-flex align-items-center">
          <div class="mb-0 mr-4 form-group">
            <div class="overflow-hidden border rounded input-group">
              <input
                ref="searchinput"
                v-model="searchText"
                type="text"
                class="py-2 pl-3 bg-white border-0 shadow-none search-assets form-control rounded-0 font-size-h6"
                :placeholder="'Search Metadata'"
              />
              <div class="input-group-append">
                <span
                  v-if="!searchText"
                  class="pr-4 bg-white border-0 input-group-text rounded-0"
                >
                  <i class="fal fa-search font-size-h4"></i>
                </span>
                <span
                  v-else
                  @click="clearSearchText"
                  class="pr-4 bg-white border-0 cursor-pointer input-group-text text-danger rounded-0"
                >
                  <i class="far fa-times-circle font-size-h4"></i>
                </span>
              </div>
            </div>
          </div>
          <a-btn
            variant="primary"
            class="px-3 py-2 btn-sm d-flex align-items-center"
            iconType="far"
            icon="plus"
            @click="onCreateNewBmClick"
          >
            New
          </a-btn>
        </div>
        <BusinessMetadataList
          :finalList="
            searchText ? searchedBusinessMetadataList : finalBusinessMetadataList
          "
          :updatedBm="updatedBm"
          :selectedBm="selectedBm"
          @selectBm="handleSelectBm"
          style="max-height: calc(100vh - 15.7rem)"
        />
      </div>
      <div class="col-8">
        <BusinessMetadataProfile
          v-if="selectedBm"
          :key="selectedBm && selectedBm.guid"
          :selectedBm="selectedBm"
          @selectBm="handleSelectBm"
          @update="onUpdate"
          @clearUpdatedBm="updatedBm = null"
          @removeNewBm="discardNewBm"
          @afterArchive="handleAfterArchive"
          @clearNewBm="newBm = null"
          style="height: calc(100vh - 12rem); overflow: hidden;"
        />
      </div>
    </div>
    <div
      v-else
      class="d-flex flex-column align-items-center justify-content-center"
      style="min-height: 30rem"
    >
      <img :src="EmptyBusinessMetadata" alt="Business Metadata Empty" class="mb-3" />
      <div class="font-weight-bold">No business metadata created yet! 💼</div>
      <span class="mb-3 font-size-14"
        >Business metadata helps to power asset discovery and access control.</span
      >
      <a-btn
        class="px-4 d-flex align-items-center font-weight-bold border-primary text-primary"
        @click="onCreateNewBmClick"
      >
        <i class="mr-2 far fa-plus"></i>Add Business Metadata
      </a-btn>
    </div>
  </div>
</template>

<script lang="ts">
// ? components
import BusinessMetadataList from "@/admin/business-metadata/businessMetadataList.vue";
import BusinessMetadataProfile from "@/admin/business-metadata/businessMetadataProfile.vue";

// ? composables
import useBusinessMetadata from "@/admin/business-metadata/composables/useBusinessMetadata";

// ? utils
import { generateUUID } from "~/utils/generator";

// ? Media
import EmptyBusinessMetadata from "~/assets/images/illustrations/empty_business_metadata.svg";

import { reactive, ref, toRefs, defineComponent, computed, nextTick } from "vue";

const DEFAULT_BM = {
  displayName: "New Business Metadata",
  description: "",
  guid: "new",
  attributeDefs: [],
};

export default defineComponent({
  components: { BusinessMetadataList, BusinessMetadataProfile },
  name: "businessMetadata",
  setup(props, context) {
    const { bmResponse, error, loading } = useBusinessMetadata();
    console.log({ xx: bmResponse.value, yy: error.value, loading });
    // * Data
    let selectedBm = ref(null);
    let searchText = ref("");
    let newBm = ref(null);
    let updatedBm = ref(null);

    // * Methods
    const handleSelectBm = (item: any) => {
      selectedBm.value = item;
      updatedBm.value = null;
    };

    const getNewBmTemplate = () => {
      const uuid4 = generateUUID();
      return { ...DEFAULT_BM, name: uuid4 };
    };

    const clearSearchText = () => {
      searchText.value = "";
    };

    const discardNewBm = () => {
      const reqIndex = finalBusinessMetadataList.findIndex(bm => bm.guid === "new");
      if (reqIndex !== -1) {
        newBm = undefined;
        selectedBm = finalBusinessMetadataList.length
          ? JSON.parse(JSON.stringify(finalBusinessMetadataList[0]))
          : undefined;
      }
    };

    const onUpdate = bm => {
      if (bm.guid === "new") {
        newBm = bm;
      } else {
        updatedBm = bm;
      }
    };

    const handleAfterArchive = () => {
      nextTick(() => {
        if (finalBusinessMetadataList && finalBusinessMetadataList.length) {
          handleSelectBm(JSON.parse(JSON.stringify(finalBusinessMetadataList[0])));
        } else {
          handleSelectBm(null);
        }
      });
    };

    const onCreateNewBmClick = () => {
      const reqIndex = finalBusinessMetadataList.findIndex(bm => bm.guid === "new");
      if (reqIndex === -1) {
        const newBmTemplate = getNewBmTemplate();
        newBm = JSON.parse(JSON.stringify(newBmTemplate));
        selectedBm = JSON.parse(JSON.stringify(newBmTemplate));
      } else {
        selectedBm = JSON.parse(JSON.stringify(finalBusinessMetadataList[reqIndex]));
      }
    };
    // * Computed
    const businessMetadataList = computed(() => {
      if (bmResponse?.value?.businessMetadataDefs)
        return bmResponse.value.businessMetadataDefs;
      return [];
    });

    const businessMetadataListLoading = computed(() => {
      return !businessMetadataList && !businessMetadataListError;
    });

    const businessMetadataListError = computed(() => {
      if (error) return error.value;
      return null;
    });

    const finalBusinessMetadataList = computed(() => [
      ...(newBm?.name ? [newBm] : []),
      ...(businessMetadataList
        ? businessMetadataList.value.filter((bm: { isArchived: any }) => !bm.isArchived)
        : []),
    ]);

    const searchedBusinessMetadataList = computed(() => {
      if (searchText) {
        return finalBusinessMetadataList.value.filter((bm: { name: string }) =>
          bm.name.toUpperCase().includes(searchText.value.toUpperCase())
        );
      }
      return finalBusinessMetadataList;
    });

    return {
      businessMetadataList,
      finalBusinessMetadataList,
      loading: businessMetadataListLoading,
      businessMetadataListError,
      searchedBusinessMetadataList,
      selectedBm,
      searchText,
      newBm,
      updatedBm,
      handleSelectBm,
      onCreateNewBmClick,
      clearSearchText,
      onUpdate,
      handleAfterArchive,
      discardNewBm,
      EmptyBusinessMetadata,
    };
  },
});
</script>

<style scoped></style>
