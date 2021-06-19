<template>
  <div class="">
    <!-- <div
      v-if="loading"
      class="flex items-center flex-column justify-content-center font-size-h4"
      style="min-height: 30rem"
    >
      <loader loadingText="Fetching Business Metadata..." textLarge></loader>
    </div> -->
    <div
      class="grid grid-cols-3 gap-7"
      v-if="finalBusinessMetadataList && finalBusinessMetadataList.length"
    >
      <div class="col-span-3">
        Business Metadata
      </div>
      <div class="col-span-1">
        <div class="flex justify-between gap-5 mb-5">
          <div class="w-full h-8">
            <div class="w-full h-8">
              <input
                ref="searchinput"
                v-model="searchText"
                type="text"
                class="w-full h-full pl-2 border border-1"
                :placeholder="'Search Metadata'"
              />
              <div class="">
                <span
                  v-if="!searchText"
                  class="bg-white border-0 input-group-text roundehidden"
                >
                  <i class="fal fa-search font-size-h4"></i>
                </span>
                <span
                  v-else
                  @click="clearSearchText"
                  class="bg-white border-0 cursor-pointer input-group-text text-red roundehidden"
                >
                  <i class="far fa-times-circle font-size-h4"></i>
                </span>
              </div>
            </div>
          </div>
          <a-button
            variant="primary"
            class="flex items-center text-sm leading-tight"
            @click="onCreateNewBmClick"
            >New
          </a-button>
        </div>
        <div style="height: calc(100vh - 9rem); overflow-y: scroll;">
          <BusinessMetadataList
            :finalList="
              searchText ? searchedBusinessMetadataList : finalBusinessMetadataList
            "
            :updatedBm="updatedBm"
            :selectedBm="selectedBm"
            @selectBm="handleSelectBm"
          />
        </div>
      </div>

      <div class="col-span-2">
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
          style="height: calc(100vh - 6rem); overflow: hidden;"
        />
      </div>
    </div>
    <div v-else class="">
      <img :src="EmptyBusinessMetadata" alt="Business Metadata Empty" class="mb-3" />
      <div class="font-bold">No business metadata created yet! 💼</div>
      <span class="mb-3 font-size-14"
        >Business metadata helps to power asset discovery and access control.</span
      >
      <a-button
        class="flex items-center font-bold border-blue text-blue"
        @click="onCreateNewBmClick"
      >
        <i class=" far fa-plus"></i>Add Business Metadata
      </a-button>
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
      const reqIndex = finalBusinessMetadataList.value.findIndex(bm => bm.guid === "new");
      if (reqIndex === -1) {
        const newBmTemplate = getNewBmTemplate();
        newBm.value = JSON.parse(JSON.stringify(newBmTemplate));
        selectedBm.value = JSON.parse(JSON.stringify(newBmTemplate));
      } else {
        selectedBm.value = JSON.parse(
          JSON.stringify(finalBusinessMetadataList.value[reqIndex])
        );
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
