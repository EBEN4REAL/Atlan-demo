<template>
  <div class="classification-body">
    <div class="pt-2 pb-3 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <div class="mb-0 overflow-hidden border rounded form-group w-30">
          <div class="input-group">
            <input
              type="text"
              class="pl-4 bg-white border-0 shadow-none search-assets form-control rounded-0 font-size-sm"
              :placeholder="placeholderString"
            />
            <div class="input-group-append">
              <span
                v-if="!state.searchText"
                class="pr-4 bg-white border-0 input-group-text rounded-0"
              >
                <i class="far fa-search"></i>
              </span>
              <span
                v-else
                @click="clearSearchText"
                class="pr-4 bg-white border-0 cursor-pointer input-group-text text-danger rounded-0"
              >
                <i class="far fa-times-circle"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="d-flex justify-content-end align-items-center">
        <asset-list-filters
          class="btn-sm"
          v-if="!isShowTermsList && !showTermsOnly"
          :filters="linkedAssetFilters"
          @change="onChangeFilters"
          :sources="sources"
        ></asset-list-filters>
        <toggle-button
          class="btn-sm"
          :toggleButtonSmall="true"
          v-if="showTermsAssetToggle"
          @rightSwitchActive="isShowTermsList = true"
          @leftSwitchActive="isShowTermsList = false"
        />
        <button
          v-if="showLinkEntityButton"
          type="button"
          class="px-2 py-0 mb-0 ml-3 btn btn-outline-primary btn-sm d-flex"
          @click="isLinkEntityModalActive = true"
        >
          <i class="mb-2 mr-1 align-self-end fa-plus fal"></i>
          <p data-v-60fadd2c="" class="mt-1 mb-1 pointer">
            Link
          </p>
        </button>
      </div> -->
    </div>
    <!-- <TermsList
      v-if="isShowTermsList || showTermsOnly"
      :listStyle="assetListStyle"
      :selectedClassificationName="classificationName"
      :type="type"
      :selectedGlossary="selectedGlossary"
      :selectedCategory="selectedCategory"
      :termsList="termsList"
      :loadingStatus="termLoadingStatus"
      :searchText="searchText"
      :onCardClick="onCardClick"
      :listComplete="isTermsListComplete"
      @loadMoreTerms="fetchTerms"
      :limit="termsLimit"
      @refresh="handleTermsRefresh"
    /> -->
    <AssetList
      :listStyle="assetListStyle"
      :assetList="state.assets"
      :loadingStatus="state.assetsStatus"
      @loadmore="setSkip(state.skip + state.limit)"
      v-show="!state.isShowTermsList"
      :listComplete="state.isEndOfPaginate"
      :onCardClick="onCardClick"
      :limit="state.limit"
      :fetchedAssetCountInOneBatch="0"
      @unlinkAsset="handleUnlinkAssets"
      :showAssetActionsDropdown="showAssetActionsDropdown"
      :unLinkAssetStatus="unLinkAssetStatus"
      :qualifiedNameCharacterCountToDisplay="50"
      :showDescription="true"
    >
      <div
        class="text-center"
        slot="emptyCopy"
        v-if="!assets.length && !searchText"
      >
        <p class="mb-2 font-w700">
          The {{ classificationName ? "classification" : "term" }} hasn't been
          assigned to any asset.
        </p>
        <span class="text-muted"
          >Link this {{ classificationName ? "classification" : "term" }} to
          assets in order to see linked assets here.</span
        >
      </div>
    </AssetList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from "vue";
import { Asset } from "~/api/atlas/asset";
import { useStore } from "~/store";
import {
  DEFAULT_ASSET_TYPES,
  SEARCH_RELEVANCE_MIN_SCORE,
} from "~/api/atlas/utils";

export default defineComponent({
  name: "AssetListWrapper",
  props: {
    selectedTerm: {
      type: Object,
      default: () => ({}),
    },
    classificationName: {
      type: String,
      default: "",
    },
    assetListStyle: {
      type: String,
      default: "",
    },
    showTermsAssetToggle: {
      type: Boolean,
      default: false,
    },
    selectedGlossary: {
      type: Object,
      default: () => ({}),
    },
    selectedCategory: {
      type: Object,
      default: () => ({}),
    },
    selectedCategoryId: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "glossary",
    },
    listType: {
      type: String,
      default: "assets", // value: terms/assets/""
    },
    onCardClick: {
      type: Boolean,
      default: true,
    },
    showTermsOnly: {
      type: Boolean,
      default: false,
    },
    showLinkEntityButton: {
      type: Boolean,
      default: false,
    },
    selectedClassification: {
      type: Object,
      default: () => {},
    },
    showAssetActionsDropdown: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const store = useStore();
    const state = ref({
      isShowTermsList: false,
      filters: {},
      searchText: "",
      showOwnedByMe: false,
      termsList: [],
      termLoadingStatus: "",
      assets: [],
      assetsStatus: "",
      isEndOfPaginate: false,
      limit: 20,
      skip: 0,
      termsLimit: 10,
      termsSkip: 0,
      isTermsListComplete: false,
      isLinkEntityModalActive: false,
      assetCount: -1,
      termCount: -1,
      isUnLinkAssetModalActive: false,
      assetToUnlink: {},
      unLinkAssetStatus: {},
      currentAttemptId: "",
      fetchAttempts: {},
      assetListFilters: {},
    });

    const selectedTerm = props.selectedTerm;
    const classificationName = computed(() => props.classificationName);
    const placeholderString = () => {
      if (state.value.isShowTermsList || props.showTermsOnly) {
        if (props.type === "classification") {
          if (state.value.termCount === -1 || state.value.termCount === 0) {
            return state.value.termsList.length
              ? `Search ${state.value.termsList.length}${
                  !state.value.isTermsListComplete ? "+" : ""
                } linked glossary terms...`
              : `Search linked glossary terms...`;
          }
          return `Search ${state.value.termCount} linked glossary terms...`;
        }
        return state.value.termsList.length
          ? `Search ${state.value.termsList.length}${
              !state.value.isTermsListComplete ? "+" : ""
            } glossary terms...`
          : `Search glossary terms...`;
      }
      if (state.value.assetCount === -1 || state.value.assetCount === 0) {
        return state.value.assets.length
          ? `Search ${state.value.assets.length}${
              !state.value.isEndOfPaginate ? "+" : ""
            } linked assets... `
          : `Search linked assets...`;
      }
      return `Search ${state.value.assetCount} linked assets...`;
    };

    const clearSearchText = () => {
      state.value.searchText = "";
    };

    // const linkedAssetFilters = computed(() => {
    //   const options = [
    //     {
    //       name: "Type",
    //       alias: "typeName",
    //       type: "assettype",
    //       isCollapsed: false,
    //       config: {
    //         options: state.assetTypeFilterItems,
    //       },
    //     },
    //     {
    //       name: "Integrations",
    //       alias: "integrationType",
    //       type: "integrations",
    //       isCollapsed: true,
    //       config: {
    //         isAsync: true,
    //         isSearchable: true,
    //         hideIfEmpty: true,
    //         options: state.sources,
    //         status: state.sourcesStatus,
    //         totalCount: state.sources.length,
    //       },
    //     },
    //     {
    //       name: "Status",
    //       alias: "status",
    //       type: "choice",
    //       isCollapsed: true,
    //       config: {
    //         options: [
    //           {
    //             name: "Verified",
    //             alias: "VERIFIED",
    //             iconClass: "fa fa-badge-check table-ready",
    //           },
    //           {
    //             name: "Work In Progress",
    //             alias: "WORK_IN_PROGRESS",
    //             iconClass: "fas fa-exclamation-triangle text-warning",
    //           },
    //           {
    //             name: "Issues",
    //             alias: "ISSUE",
    //             iconClass: "fas fa-exclamation-triangle text-danger",
    //           },
    //           {
    //             name: "Deprecated",
    //             alias: "DEPRECATED",
    //             iconClass: "fas fa-archive text-muted",
    //           },
    //           {
    //             name: "No Status",
    //             alias: "NO_STATUS",
    //             iconClass: "far fa-minus-circle text-gray-500",
    //           },
    //         ],
    //       },
    //     },
    //   ];
    //   return options;
    // });

    // const placeholderString = computed(() => {
    //   if (state.isShowTermsList || state.showTermsOnly) {
    //     if (state.type === "classification") {
    //       if (state.termCount === -1 || state.termCount === 0) {
    //         return state.termsList.length
    //           ? `Search ${state.termsList.length}${
    //               !state.isTermsListComplete ? "+" : ""
    //             } linked glossary terms...`
    //           : `Search linked glossary terms...`;
    //       }
    //       return `Search ${state.termCount} linked glossary terms...`;
    //     }
    //     return state.termsList.length
    //       ? `Search ${state.termsList.length}${
    //           !state.isTermsListComplete ? "+" : ""
    //         } glossary terms...`
    //       : `Search glossary terms...`;
    //   }
    //   if (state.assetCount === -1 || state.assetCount === 0) {
    //     return state.assets.length
    //       ? `Search ${state.assets.length}${
    //           !state.isEndOfPaginate ? "+" : ""
    //         } linked assets... `
    //       : `Search linked assets...`;
    //   }
    //   return `Search ${state.assetCount} linked assets...`;
    // });

    const fetchAssets = (isAppend = false, filters = {}) => {
      state.value.assetsStatus = "loading";
      //   if (state.currentAttemptId) {
      //     await state.cancelSearchApiCallForAttempt(
      //       JSON.parse(JSON.stringify(state.currentAttemptId))
      //     );
      //   }

      const assetFilters = JSON.parse(JSON.stringify(filters));
      if (!assetFilters.typeName || assetFilters.typeName.length === 0) {
        // eslint-disable-next-line
        assetFilters.typeName = [...DEFAULT_ASSET_TYPES, "AtlanSavedQuery"];
      }

      //   state.currentAttemptId = generateUUID();
      const options = {
        staticOptions: {
          searchType: "BASIC",
          typeName: "AtlanAsset",
          excludeDeletedEntities: true,
          includeClassificationAttributes: true,
          includeSubClassifications: true,
          includeSubTypes: true,
          termName: selectedTerm.qualifiedName || null,
        },
        ...(selectedTerm.qualifiedName || classificationName
          ? {
              filters: {
                ...assetFilters, // {integrationType:[],status:[],typeName:[]}
                ...(selectedTerm.qualifiedName
                  ? {
                      termName: [selectedTerm.qualifiedName],
                    }
                  : {}),
                ...(classificationName
                  ? { classification: [classificationName] }
                  : {}),
              },
            }
          : {}),
        limit: state.value.limit || 20,
        skip: state.value.skip || 0,
        searchText: state.value.searchText || "",
        attributes: [
          "createTime",
          "db",
          "lastAccessTime",
          "integrationType",
          "tableType",
          "term",
          "rowCount",
          "classifications",
          "classificationNames",
          "bytes",
          "schema",
          "description",
          "userDescription",
          "customDescription",
          "updatedAt",
          "clustering_key",
          "dataType",
          "meanings",
          "table",
          "colCount",
          "displayName",
          // saved query
          "status",
          "queryString",
          "createdBy",
          "tableQualifiedName",
          "lastSyncedAt",
        ],
      };

      //   state.setAssetFetchAttempts({
      //     attemptId: JSON.parse(JSON.stringify(state.currentAttemptId)),
      //     params: {
      //       isActive: true,
      //       cancelTokenSource
      //     }
      //   });

      try {
        const { data: assetsData, error: assetsError } = Asset.basicSearch({
          cache: false,
          options: {
            ...options,
            filters: store.getters.getActualFilters(options.filters) || {},
          },
        });
        watch([assetsData, assetsError], () => {
          if (assetsData.value) {
            state.value.assetCount = assetsData.value.approximateCount;
            const tempEntities = assetsData.value.entities || [];
            if (
              !tempEntities.length ||
              tempEntities.length < state.value.limit
            ) {
              state.value.isEndOfPaginate = true;
            }
            if (isAppend) {
              state.value.assets = [...state.value.assets, ...tempEntities];
            } else {
              state.value.assets = tempEntities;
            }
            state.value.assetsStatus = "success";
          } else if (assetsError.value) {
            console.log(assetsError.value.message, assetsError);
            state.value.assetsStatus = "error";
          }
        });
      } catch (error) {
        console.log("fetchAssets -> error", error);
        state.value.assetsStatus = "error";
        // if (state.value.fetchAttempts[state.value.currentAttemptId].isActive) {
        //   state.setAssetFetchAttempts({
        //     attemptId: JSON.parse(JSON.stringify(state.currentAttemptId)),
        //     params: {
        //       isActive: false,
        //     },
        //   });
        // }
      }
    };

    const setSkip = async (skip = 0) => {
      if (state.value.skip <= 0) {
        state.value.skip = 0;
        fetchAssets(false, state.value.assetListFilters);
      } else {
        state.value.skip = skip;
        fetchAssets(true, state.value.assetListFilters);
      }
    };

    const handleUnlinkAssets = () => {};

    const unLinkAssetStatus = () => {};

    return {
      placeholderString,
      clearSearchText,
      handleUnlinkAssets,
      unLinkAssetStatus,
      setSkip,
      state,
    };
  },
});
</script>
<style lang="less" scoped></style>
