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
        <p class="mb-0 text-2xl text-gray">Business Metadata</p>
        <p class="text-sm text-gray-400">
          Manage Business Metadata & it's attributes
        </p>
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
            class="rounded-md ant-btn ant-btn-primary"
            @click="onCreateNewBmClick"
            >New
          </a-button>
        </div>
        <div style="height: calc(100vh - 9rem); overflow-y: scroll">
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
          style="height: calc(100vh - 6rem); overflow: hidden"
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
import BusinessMetadataList from "@/admin/business-metadata/businessMetadataList.vue";
import BusinessMetadataProfile from "@/admin/business-metadata/businessMetadataProfile.vue";

// ? Store
import { useBusinessMetadataStore } from "~/pinia/businessMetadata";

// ? utils
import { generateUUID } from "~/utils/generator";

// ? Media
import EmptyBusinessMetadata from "~/assets/images/illustrations/empty_business_metadata.svg";

// ? Composables
import { useBusinessMetadata } from "@/admin/business-metadata/composables/useBusinessMetadata";

// ? Utils
import differenceWith from "lodash/differenceWith";

import { ref, defineComponent, computed, nextTick, watch } from "vue";
import { useHead } from "@vueuse/head";

const DEFAULT_BM = {
  // TODO changes when UUID4 support
  name: "",
  options: { displayName: "New Business Metadata" },
  description: "",
  guid: "new",
  attributeDefs: [],
};

export default defineComponent({
  components: { BusinessMetadataList, BusinessMetadataProfile },
  name: "businessMetadata",
  setup(props, context) {
    // * Get all available BMs and save on store
    const store = useBusinessMetadataStore();
    const {
      data: BMResponse,
      error: BMListError,
      isLoading: BMListLoading,
    } = useBusinessMetadata.getBMList();

    //FIXME debug this
    watch(
      [BMListLoading, BMListError],
      n => {
        console.log([BMListLoading, BMListError]);
        const error = toRaw(BMListError.value);
        console.log(error);
        store.setBusinessMetadataListLoading(n[0].value);
        store.setBusinessMetadataListError(error.response.data.errorMessage);
      },
      { deep: true }
    );

    watch(
      () => BMResponse?.value?.businessMetadataDefs,
      (n, o) => {
        if (n) {
          const list = n.map(
            (bm: { options: { displayName: any }; name: any; attributeDefs: any[] }) => ({
              ...bm,
              options: {
                ...bm?.options,
                displayName: bm?.options?.displayName ? bm.options.displayName : bm.name,
              },
              attributeDefs: bm.attributeDefs.map(a => {
                if (a.options?.displayName?.length) return a;
                return { ...a, options: { ...a.options, displayName: a.name } };
              }),
            })
          );
          store.setData(list);
        }
      }
    );

    useHead({
      title: computed(() => "Business Metadata"),
    });

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
      // TODO changes when UUID4 support
      // return { ...DEFAULT_BM, name: uuid4 };
      return { ...DEFAULT_BM };
    };
    const clearSearchText = () => {
      searchText.value = "";
    };
    const discardNewBm = () => {
      const reqIndex = finalBusinessMetadataList.value.findIndex(bm => bm.guid === "new");
      if (reqIndex !== -1) {
        newBm.value = null;
        selectedBm.value = finalBusinessMetadataList.value.length
          ? JSON.parse(JSON.stringify(finalBusinessMetadataList.value[0]))
          : null;
      }
    };
    /**
     * @desc if an existing bm is being updated, set updated bm to
     */
    const onUpdate = (bm: { guid: string } | null) => {
      if (bm.guid === "new") {
        newBm.value = bm;
      } else {
        updatedBm.value = bm;
      }
    };

    const handleAfterArchive = () => {
      nextTick(() => {
        if (finalBusinessMetadataList.value && finalBusinessMetadataList.value.length) {
          handleSelectBm(JSON.parse(JSON.stringify(finalBusinessMetadataList.value[0])));
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
    const businessMetadataList = computed(() => store.getBusinessMetadataList);

    const businessMetadataListLoading = computed(() => {
      return !businessMetadataList.value && !businessMetadataListError.value;
    });

    const businessMetadataListError = computed(() => {
      return store.businessMetadataListError;
    });

    const finalBusinessMetadataList = computed(() => [
      ...(newBm.value ? [newBm.value] : []),
      ...(businessMetadataList.value
        ? //TODO remove archive logic
          businessMetadataList.value.filter((bm: { isArchived: any }) => !bm.isArchived)
        : []),
    ]);

    const searchedBusinessMetadataList = computed(() => {
      if (searchText.value) {
        return finalBusinessMetadataList.value.filter((bm: { name: string }) =>
          bm.name.toUpperCase().includes(searchText.value.toUpperCase())
        );
      }
      return finalBusinessMetadataList;
    });

    //* Hooks

    watch(finalBusinessMetadataList, (n, o) => {
      if (n.length && !selectedBm.value) {
        selectedBm.value = JSON.parse(JSON.stringify(finalBusinessMetadataList.value[0]));
      }
    });

    return {
      businessMetadataList,
      finalBusinessMetadataList,
      businessMetadataListLoading,
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
