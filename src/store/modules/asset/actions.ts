import { Action } from "./../../../api/auth/client.d";
import { watch } from "vue";
import { ActionTree, ActionContext } from "vuex";
import { Classification } from "~/api/atlas/classification";
import { RootState } from "~/store";
import { Asset } from "~/api/atlas/asset";
import { BUSINESS_METADATA_GET_ATTRIBUTE_PROJECTION } from "~/store/types";

// import { getAxiosClient } from "~/api";

import { State } from "./state";
import { Mutations } from "./mutations";
import { MutationTypes } from "./types-mutations";
import { ActionTypes } from "./types-actions";
import { projection } from "~/api/atlas/utils";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
  [ActionTypes.RESET_ASSETS]({ commit }: AugmentedActionContext): void;
  [ActionTypes.GET_ASSETS](
    { commit, dispatch, state, getters, rootGetters }: AugmentedActionContext,
    options: any
  ): void;
  [ActionTypes.SET_ASSETS_STATUS](
    { commit }: AugmentedActionContext,
    value: any
  ): void;
  [ActionTypes.SET_ASSETS_FETCH_ATTEMPTS](
    { commit }: AugmentedActionContext,
    value: any
  ): void;
  [ActionTypes.CANCEL_SEARCH_API_CALL_FOR_ATTEMPT](
    { commit }: AugmentedActionContext,
    attemptId: any
  ): void;
  [ActionTypes.SET_ASSETS_LIST_PAGINATION_OPTIONS](
    { commit }: AugmentedActionContext,
    value: any
  ): void;
  [ActionTypes.UPDATE_ASSET_IN_ASSETS_LIST](
    { commit }: AugmentedActionContext,
    options: any
  ): void;
  [ActionTypes.REFRESH_ASSET_IN_ASSETS_LIST](
    { commit, rootGetters }: AugmentedActionContext,
    assetId: any
  ): void;
  [ActionTypes.UPDATE_ASSET_CLASSIFICATIONS_IN_ASSETS_LIST](
    { commit }: AugmentedActionContext,
    options: any
  ): void;
  [ActionTypes.UPDATE_ASSET_TERMS_IN_ASSETS_LIST](
    { commit }: AugmentedActionContext,
    options: any
  ): void;
  [ActionTypes.GET_SAVED_FILTERS]({ commit }: AugmentedActionContext): void;
  [ActionTypes.ARCHIVED_SAVED_FILTERS](
    { commit, state }: AugmentedActionContext,
    guid: any
  ): void;
  [ActionTypes.FETCH_ASSET_FREQUENT_USERS](
    { commit, state }: AugmentedActionContext,
    { entityId, params }: any
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.RESET_ASSETS]({ commit }) {
    commit(MutationTypes.SET_ASSETS, {
      assets: {},
      options: {},
    });
    commit(MutationTypes.SET_ASSETS_STATUS, "");
    commit(MutationTypes.SET_ASSET_LIST_PAGINATE_OPTIONS, null);
    commit(MutationTypes.SET_ASSET_FETCH_ATTEMPTS, {});
    commit(MutationTypes.SET_FETCHED_ASSET_COUNT, { value: 0 });
  },
  [ActionTypes.GET_ASSETS](
    { commit, dispatch, state, getters, rootGetters },
    options
  ) {
    commit(MutationTypes.SET_ASSETS_STATUS, "loading");
    if (state.isEndOfPaginate) {
      commit(MutationTypes.SET_END_OF_PAGINATE, false);
    }
    if (!options.isAppend) {
      commit(MutationTypes.SET_FETCHED_ASSET_COUNT, { value: 0 });
      commit(MutationTypes.SET_ASSETS, {
        assets: {},
        options: {},
      });
    }
    // const cancelTokenSource = this.$axios.CancelToken.source();
    // commit(MutationTypes.SET_ASSET_FETCH_ATTEMPTS, {
    //   attemptId: options.attemptId,
    //   params: {
    //     isActive: true,
    //     cancelTokenSource
    //   }
    // });

    try {
      const { data: assetsData, error: assetsError } = Asset.basicSearch({
        cache: false,
        options: {
          ...options,
          filters: getters.getActualFilters(options.filters) || {},
          businessMetadataAttributesProjection:
            rootGetters[BUSINESS_METADATA_GET_ATTRIBUTE_PROJECTION],
        },
      });

      watch([assetsData, assetsError], async () => {
        console.log(assetsData, assetsError);
        if (assetsData.value) {
          if (
            assetsData.value &&
            !assetsData.value.entities &&
            assetsData.value.attributes
          ) {
            const labels = assetsData.value.attributes.name;
            const newAssets = assets.attributes.values.forEach(
              (value, valueIndex) => {
                const row = {
                  guid: valueIndex + 1,
                  attributes: {},
                };
                labels.forEach((label, labelIndex) => {
                  row.attributes[label] = value[labelIndex];
                });
                row.typeName = row.attributes.typeName || "";
                return row;
              }
            );
            commit(MutationTypes.SET_ASSETS, {
              assets: newAssets,
              options,
              approximateTotalCount: assetsData.value.approximateCount || 0,
            });
          } else {
            const tempEntities = assetsData.value.entities || [];
            await commit(MutationTypes.SET_FETCHED_ASSET_COUNT, {
              value: tempEntities.length,
              isAppend: true,
            });
            if (
              tempEntities.length &&
              state.fetchAttemptsState[options.attemptId].isActive
            ) {
              await commit(MutationTypes.SET_ASSETS, {
                assets: { entities: tempEntities },
                options,
                approximateTotalCount: assetsData.value.approximateCount || 0,
              });
            }
            if (
              assetsData.value.entities &&
              assetsData.value.entities.length &&
              state.fetchedAssetCountInOneBatch < state.paginateOptions.limit &&
              state.fetchAttemptsState[options.attemptId].isActive
            ) {
              commit(MutationTypes.SET_ASSET_LIST_PAGINATE_OPTIONS, {
                ...state.paginateOptions,
                skip: state.paginateOptions.skip + options.limit,
              });

              dispatch(ActionTypes.GET_ASSETS, {
                ...options,
                skip: options.skip + options.limit,
                isAppend: true,
              });
            } else {
              // dispatch(ActionTypes.CANCEL_SEARCH_API_CALL_FOR_ATTEMPT,options.attemptId); /////////////

              await commit(MutationTypes.SET_FETCHED_ASSET_COUNT, { value: 0 });
              commit(MutationTypes.SET_ASSETS_STATUS, "success");
              if (!assetsData.value.entities) {
                commit(MutationTypes.SET_END_OF_PAGINATE, true);
              }
            }
          }
        } else if (!assetsData.value && assetsError.value) {
          if (state.fetchAttemptsState[options.attemptId].isActive) {
            commit(MutationTypes.SET_ASSETS_STATUS, "error");
            commit(MutationTypes.SET_ASSET_FETCH_ATTEMPTS, {
              attemptId: options.attemptId,
              params: {
                isActive: false,
              },
            });
          } else {
            commit(MutationTypes.SET_ASSETS_STATUS, "error");
          }
        }
      });
    } catch (err) {
      console.log("getAssets -> e", err);
      commit(MutationTypes.SET_ASSETS_STATUS, "error");
    }
  },
  [ActionTypes.SET_ASSETS_FETCH_ATTEMPTS]({ commit }, value) {
    commit(MutationTypes.SET_ASSET_FETCH_ATTEMPTS, value);
  },
  [ActionTypes.SET_ASSETS_STATUS]({ commit }, value) {
    commit(MutationTypes.SET_ASSET_FETCH_ATTEMPTS, value);
  },
  [ActionTypes.SET_ASSETS_LIST_PAGINATION_OPTIONS]({ commit }, value) {
    commit(MutationTypes.SET_ASSET_LIST_PAGINATE_OPTIONS, value);
  },
  [ActionTypes.UPDATE_ASSET_IN_ASSETS_LIST]({ commit }, options) {
    // try {
    //   await AtlasService.updateEntity(this.$axios, options);
    //   commit(MutationTypes.UPDATE_ASSET_IN_ASSETS_LIST, options);
    // } catch (error) {
    //   throw error.response;
    // }
  },

  [ActionTypes.REFRESH_ASSET_IN_ASSETS_LIST]({ commit, rootGetters }, assetId) {
    try {
      const entityFilters = {
        condition: "AND",
        criterion: [
          {
            attributeName: "__guid",
            attributeValue: assetId,
            operator: "eq",
          },
        ],
      };

      const options = {
        typeName: "AtlanAsset",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        attributes: rootGetters[BUSINESS_METADATA_GET_ATTRIBUTE_PROJECTION]
          ? [
              ...projection,
              ...rootGetters[BUSINESS_METADATA_GET_ATTRIBUTE_PROJECTION],
            ]
          : projection,
        entityFilters,
      };
      const {
        data: basicSearchData,
        error: basicSearchError,
      } = Asset.basicSearch({
        cache: false,
        options: options,
      });

      watch([basicSearchData, basicSearchError], () => {
        console.log(basicSearchData, basicSearchError);
        if (basicSearchData.value) {
          if (
            basicSearchData.value.entities &&
            basicSearchData.value.entities.length
          ) {
            commit(
              MutationTypes.UPDATE_ASSET_IN_ASSETS_LIST,
              basicSearchData.value.entities[0]
            );
          }
        }
      });
    } catch (error) {
      throw error.response;
    }
  },
  [ActionTypes.UPDATE_ASSET_CLASSIFICATIONS_IN_ASSETS_LIST](
    { commit },
    options
  ) {},
  [ActionTypes.UPDATE_ASSET_TERMS_IN_ASSETS_LIST]({ commit }, options) {},
  [ActionTypes.GET_SAVED_FILTERS]({ commit }) {},
  [ActionTypes.ARCHIVED_SAVED_FILTERS]({ commit, state }, guid) {},
  [ActionTypes.FETCH_ASSET_FREQUENT_USERS](
    { commit, state },
    { entityId, params }
  ) {},
};

// const actions = {
//   async updateAssetInAssetsList({ commit }, options) {
//     try {
//       await AtlasService.updateEntity(this.$axios, options);
//       commit(UPDATE_ASSET_IN_ASSETS_LIST, options);
//     } catch (error) {
//       throw error.response;
//     }
//   },

//   async updateAssetClassificationsInAssetsList({ commit }, options) {
//     try {
//       const addClassifications = options.editedClassifications.filter((c) => {
//         const ind = options.originalClassifications.findIndex(
//           (cc) => cc.typeName === c.typeName
//         );
//         return ind < 0;
//       });
//       console.log(
//         "updateAssetClassificationsInAssetsList -> addClassifications",
//         addClassifications
//       );
//       const removeClassifications = options.originalClassifications.filter(
//         (c) => {
//           const ind = options.editedClassifications.findIndex(
//             (cc) => cc.typeName === c.typeName
//           );
//           return ind < 0;
//         }
//       );
//       console.log(
//         "updateAssetClassificationsInAssetsList -> removeClassifications",
//         removeClassifications
//       );
//       if (addClassifications.length) {
//         const newOptions = {
//           params: {
//             classifications: addClassifications,
//           },
//           entityId: options.entityId,
//         };
//         await AtlasService.bulkAddClassificationToEntities(
//           this.$axios,
//           newOptions
//         );
//         this.$analytics.trackEvent(EVENT_CLASSIFICATION_LINKED);
//       }
//       if (removeClassifications.length) {
//         const forEachLoop = async () => {
//           (removeClassifications || []).forEach(async (classification) => {
//             console.log("forEachLoop -> classification", classification);
//             const newOptions = {
//               classificationName: classification.typeName,
//               entityId: options.entityId,
//             };
//             console.log("forEachLoop -> newOptions", newOptions);
//             await AtlasService.bulkRemoveClassificationFromEntities(
//               this.$axios,
//               {
//                 params: newOptions,
//               }
//             );
//           });
//         };
//         await forEachLoop();
//       }
//       commit(UPDATE_ASSET_IN_ASSETS_LIST, options.asset);
//     } catch (error) {
//       throw error.response;
//       // console.error("updateEntity -> error", error);
//     }
//   },
//   async updateAssetTermsInAssetsList({ commit }, options) {
//     console.log("updateAssetTermsInAssetsList -> options", options);
//     const requests = [];
//     if (options.newlyAddedTerms.length) {
//       const forEachLoopAdd = async () => {
//         (options.newlyAddedTerms || []).forEach(async (term) => {
//           console.log("forEachLoop -> term", term);
//           const newOptions = {
//             termId: term.termGuid,
//             params: {
//               entities: [
//                 {
//                   guid: options.entityId,
//                 },
//               ],
//             },
//           };
//           console.log("forEachLoop -> newOptions", newOptions);

//           requests.push(
//             new Promise(async (resolve) => {
//               await AtlasService.addTermToEntites(this.$axios, newOptions);
//               resolve();
//             })
//           );
//         });
//       };
//       forEachLoopAdd();
//     }
//     if (options.removedTerms.length) {
//       const forEachLoopRemove = async () => {
//         (options.removedTerms || []).forEach(async (term) => {
//           console.log("forEachLoop -> term", term);
//           const newOptions = {
//             termId: term.termGuid,
//             params: {
//               entities: [
//                 {
//                   relationshipGuid: term.relationGuid,
//                   guid: options.entityId,
//                 },
//               ],
//             },
//           };
//           console.log("forEachLoop -> newOptions", newOptions);
//           requests.push(
//             new Promise(async (resolve) => {
//               await AtlasService.removeTermToEntites(this.$axios, newOptions);
//               resolve();
//             })
//           );
//         });
//       };
//       forEachLoopRemove();
//     }
//     if (requests.length) {
//       const response = await Promise.all(requests);
//       this.$analytics.trackEvent(EVENT_GLOSSARY_TERM_LINKED);
//       console.log("updateAssetTermsInAssetsList -> response", response);
//     }
//     await commit(UPDATE_ASSET_IN_ASSETS_LIST, options.asset);
//   },
//   async getSavedFilters({ commit }) {
//     commit(SET_SAVED_FILTERS_STATUS, "loading");
//     try {
//       const savedFiltersList = await AtlasService.getSavedSearchesList(
//         this.$axios
//       );
//       const savedFilters = savedFiltersList.map((savedFilter) => ({
//         ...savedFilter,
//         alias: savedFilter.name || "",
//         value: savedFilter.searchParameters || {},
//       }));
//       commit(SET_SAVED_FILTERS, savedFilters);
//       commit(SET_SAVED_FILTERS_STATUS, "success");
//     } catch (e) {
//       commit(SET_SAVED_FILTERS, []);
//       commit(SET_SAVED_FILTERS_STATUS, "success");
//     }
//   },
//   async archiveSavedFilter({ commit, state }, guid) {
//     commit(SET_SAVED_FILTER_ARCHIVE_LOADING, true);
//     try {
//       await AtlasService.deleteSavedSearch(this.$axios, guid);
//       const savedFilters = state.savedFilters.filter(
//         (savedFilter) => savedFilter.guid !== guid
//       );
//       if (
//         state.paginateOptions &&
//         state.paginateOptions.filters &&
//         state.paginateOptions.filters.savedFilters
//       ) {
//         delete state.paginateOptions.filters.savedFilters;
//       }
//       commit(SET_SAVED_FILTERS, savedFilters);
//       commit(SET_SAVED_FILTER_ARCHIVE_LOADING, false);
//     } catch (error) {
//       commit(SET_SAVED_FILTER_ARCHIVE_LOADING, false);
//       console.log("archiveSavedFilter -> error", error);
//       if (error.response) {
//         commit(SET_SAVED_FILTER_ARCHIVE_ERROR, error.response.data);
//       }
//     }
//   },
//   async fetchAssetFrequentUsers({ commit, state }, { entityId, params }) {
//     if (state.frequentUsersLoading && state.frequentUsersCancelToken) {
//       state.frequentUsersCancelToken.cancel("Operation canceled by the user.");
//     }
//     if (
//       state.frequentUsers &&
//       typeof state.frequentUsers[entityId] &&
//       typeof state.frequentUsers[entityId] !== "undefined" &&
//       state.frequentUsers[entityId].length
//     ) {
//       return;
//     }
//     try {
//       commit(ASSET_FREQUENT_USERS_SET_LOADING, true);
//       commit(
//         ASSET_FREQUENT_USERS_NEW_CANCEL_TOKEN,
//         this.$axios.CancelToken.source()
//       );
//       const response = await PolicyService.getAssetTopUsers(
//         this.$axios,
//         params,
//         state.frequentUsersCancelToken.token
//       );
//       let frequentUsers = [];
//       if (
//         response &&
//         response.aggregations &&
//         response.aggregations.queryResults &&
//         response.aggregations.queryResults.topUsers &&
//         response.aggregations.queryResults.topUsers.buckets
//       ) {
//         frequentUsers =
//           response.aggregations.queryResults.topUsers.buckets || [];
//       }
//       commit(ASSET_FREQUENT_USERS_SET, {
//         entityId,
//         list: frequentUsers,
//       });
//       commit(ASSET_FREQUENT_USERS_SET_LOADING, false);
//     } catch (error) {
//       commit(ASSET_FREQUENT_USERS_SET_LOADING, false);
//       console.log(error);
//       if (error.response) {
//         commit(ASSET_FREQUENT_USERS_SET_ERROR, error.response.data);
//       }
//     }
//   },
// };
