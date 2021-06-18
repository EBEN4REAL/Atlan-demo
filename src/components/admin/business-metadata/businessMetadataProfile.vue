<template>
  <div class="bg-white border rounded">
    <!-- <ArchiveMetadataModal
      v-if="showArchiveMetadataModal"
      @close="showArchiveMetadataModal = false"
      :businessMetadata="localBm"
      @afterArchive="handleAfterArchive"
    /> -->
    <div
      class="px-4 py-3 border-bottom d-flex align-items-center justify-content-between"
    >
      <div>
        <div class="font-weight-bold font-size-h5">
          {{ (localBm && localBm.displayName) || localBm.name }}
        </div>
        <createUpdateInfo
          :createdAt="localBm.createTime"
          :updatedAt="localBm.updateTime"
          :createdBy="localBm.createdBy"
          :updatedBy="localBm.updatedBy"
          :entityType="`bm-localBm-${localBm.guid}`"
        />
      </div>
      <div class="d-flex align-items-center">
        <i
          v-if="error"
          class="mr-3 far fa-exclamation-triangle text-danger"
          v-b-popover.hover.top="
            `Unable to ${
              localBm.guid !== 'new' ? 'update' : 'create'
            } business metadata, please check your config. ${(error &&
              error.data &&
              error.data.errorMessage) ||
              ''}`
          "
        ></i>
        <a-button
          v-if="isUpdated"
          variant="link-danger mr-3"
          @click="handleDiscardChanges"
        >
          Discard
        </a-button>
        <a-button
          v-if="isUpdated || localBm.guid === 'new'"
          variant="primary px-3"
          @click="handleAddBusinessMetadata"
          :loading="loading"
          :loadingText="'Saving...'"
        >
          Save
        </a-button>
        <a-button v-else variant="alt-primary px-3">
          Saved
        </a-button>
        <dropdown
          v-if="localBm.guid !== 'new'"
          dropdownMenuClass="mt-1 ml-4"
          :options="dropdownOptions"
          :isArrow="false"
          :variant="'link btn-no-focus text-dark border-0 pr-0 pl-3'"
          noCaret
          :no-caret="true"
          right
        >
          <i class="rounded far fa-ellipsis-h text-hover-primary font-size-lg"></i>
        </dropdown>
      </div>
    </div>
    <div class="px-4 py-3 overflow-y-auto" style="height: calc(100% - 4.3rem)">
      <div class="pb-4 mb-3 border-bottom">
        <div class="px-0 mb-4 col-6">
          <label for="name" class="mb-1"
            >Name
            <sup class="text-danger">*</sup>
          </label>
          <input
            type="text"
            class="form-control"
            id="name"
            name="Name"
            v-model="localBm.displayName"
            @keyup="onUpdate"
          />
        </div>
        <div>
          <label for="description" class="mb-1">Description</label>
          <textarea
            placeholder="Add some details about this metadata."
            class="form-control"
            id="description"
            name="Description"
            v-model="localBm.description"
            @keyup="onUpdate"
            :rows="2"
          ></textarea>
        </div>
      </div>
      <label class="">Attributes ({{ localBm.attributeDefs.length }})</label>
      <div class="mb-4 d-flex align-items-center">
        <div class="mb-0 mr-4 form-group">
          <div class="overflow-hidden border rounded input-group">
            <input
              ref="searchinput"
              v-model="attrsearchText"
              type="text"
              class="py-2 pl-3 bg-white border-0 shadow-none search-assets form-control rounded-0 font-size-h6"
              :placeholder="'Search attribute'"
            />
            <div class="input-group-append">
              <span
                v-if="!attrsearchText"
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
        <a-button
          variant="alt-primary"
          class="px-3 py-2 btn-sm d-flex align-items-center"
          iconType="far"
          icon="plus"
          @click="handleAddNewAttribute"
        >
          New attribute
        </a-button>
      </div>
      <a-collapse
        v-if="attrsearchText ? searchedAttributes.length : localBm.attributeDefs.length"
        :accordion="true"
        default-active-key="1"
        class="overflow-hidden"
      >
        <a-collapse-panel
          v-for="(attribute, index) in attrsearchText
            ? searchedAttributes
            : localBm.attributeDefs"
          :key="index + 1"
          :header="attribute.options.displayName || 'New attribute'"
          class="advanceConfigCollapse"
        >
          <span
            slot="extra"
            v-if="attribute.isNew"
            class="cursor-pointer text-danger hover-underline font-size-sm"
            @click.prevent.stop="handleRemoveAttribute(index)"
          >
            <i class="mr-1 fa-trash-alt far font-size-xs"></i> Remove
          </span>
          <AddAttributeCard
            :ref="`attribute-${index}`"
            :key="attribute.id"
            :attribute="attribute"
            :isEdit="!localBm.guid !== 'new' && !attribute.isNew"
            @remove="handleRemoveAttribute(index)"
            @updateAttribute="
              updatedAttribute => onAttributeValuesChange(updatedAttribute, index)
            "
          />
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { reactive, ref, toRefs, computed, onMounted, nextTick } from "vue";

// * Utils
import { generateUUID } from "~/utils/generator";
import { getErrorMessage } from "~/utils/error";
import { DEFAULT_ATTRIBUTE } from "~/constant/business_metadata";
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from "~/constant/search";
import AddAttributeCard from "@/admin/business-metadata/addAttributeCard.vue";

export default defineComponent({
  props: {
    selectedBm: {
      type: Object,
      required: true,
    },
  },
  components: { AddAttributeCard },
  setup(props, context) {
    // * Data
    let localBm = reactive({
      name: "New Business Metadata",
      description: "",
      guid: "",
      attributeDefs: [],
    });

    let attrsearchText = ref("");
    let isUpdated = ref(false);
    let showArchiveMetadataModal = ref(false);
    let loading = ref(false);
    let error = ref(null);

    // * Methods
    const handleAfterArchive = () => {
      context.emit("afterArchive");
      fetchAssets();
    };

    const getDefaultAttributeTemplate = () => {
      const uuid4 = generateUUID();
      return { ...DEFAULT_ATTRIBUTE, name: uuid4 };
    };

    const onShowArchiveMetadataModal = () => {
      showArchiveMetadataModal.value = true;
    };

    const clearSearchText = () => {
      attrsearchText.value = "";
    };
    const handleClose = () => {
      context.emit("close");
    };
    const onUpdate = () => {
      isUpdated.value = true;
      context.emit("update", JSON.parse(JSON.stringify(localBm)));
    };

    const handleDiscardChanges = () => {
      if (props.selectedBm && props.selectedBm.guid === "new")
        context.emit("removeNewBm");

      if (props.selectedBm && props.selectedBm.guid) {
        Object.assign(localBm, reactive(JSON.parse(JSON.stringify(props.selectedBm))));
      }
      isUpdated.value = false;
      error.value = null;
      context.emit("clearUpdatedBm");
    };

    const handleAddBusinessMetadata = async () => {
      error.value = null;
      let isInvalid = false;

      // ! turn this back to displayName
      if (!localBm.name) {
        isInvalid = true;
      }
      if (localBm && localBm.attributeDefs.length) {
        // eslint-disable-next-line
        for (let i = 0; i < localBm.attributeDefs.length; i++) {
          const attribute = localBm.attributeDefs[i];
          if (!attribute.options.displayName) {
            error.value = {
              data: { errorMessage: "Attribute names cannot be empty" },
            };
            isInvalid = true;
            break;
          }
        }
      }
      if (isInvalid) {
        return;
      }
      const tempBm = JSON.parse(JSON.stringify(localBm));
      if (!tempBm.description.length) tempBm.description = "-";
      if (tempBm && tempBm.attributeDefs.length) {
        tempBm.attributeDefs.forEach((attribute, index) => {
          delete tempBm.attributeDefs[index].id;
          // eslint-disable-next-line
          if (tempBm.attributeDefs[index].hasOwnProperty("isNew")) {
            delete tempBm.attributeDefs[index].isNew;
          }
        });
      }
      loading.value = true;
      // try {
      //   const apiResponse = await AtlasTypeDefService[
      //     tempBm.guid === "new" ? "Add" : "Update"
      //   ](this.$axios, {
      //     queryParams: { type: "BUSINESS_METADATA" },
      //     payload: {
      //       businessMetadataDefs: [
      //         {
      //           ...(tempBm.guid === "new"
      //             ? {
      //                 category: "BUSINESS_METADATA",
      //                 typeVersion: "1.1",
      //                 version: 1,
      //                 attributeDefs: tempBm.attributeDefs,
      //                 description: tempBm.description,
      //                 name: tempBm.name,
      //                 displayName: tempBm.displayName,
      //               }
      //             : tempBm),
      //         },
      //       ],
      //       classificationDefs: [],
      //       entityDefs: [],
      //       enumDefs: [],
      //       structDefs: [],
      //     },
      //   });
      //   if (
      //     apiResponse &&
      //     apiResponse.businessMetadataDefs &&
      //     apiResponse.businessMetadataDefs.length
      //   ) {
      //     if (this.localBm.guid === "new") {
      //       this.BUSINESS_METADATA_APPEND_TO_LIST(apiResponse.businessMetadataDefs[0]);
      //       this.$emit("clearNewBm");
      //       this.$emit(
      //         "selectBm",
      //         JSON.parse(JSON.stringify(apiResponse.businessMetadataDefs[0]))
      //       );
      //     } else {
      //       this.BUSINESS_METADATA_UPDATE_BUSINESS_METADATA_IN_LIST(
      //         apiResponse.businessMetadataDefs[0]
      //       );
      //     }
      //     // eslint-disable-next-line
      //     this.localBm = JSON.parse(JSON.stringify(apiResponse.businessMetadataDefs[0]));

      //     this.$emit("clearUpdatedBm");
      //   }
      //   this.fetchAssets();
      //   this.loading = false;
      //   this.$nextTick(() => {
      //     this.isUpdated = false;
      //   });
      // } catch (error) {
      //   this.loading = false;
      //   console.log(
      //     "🚀 ~ file: businessMetadataProfile.vue ~ line 323 ~ handleAddBusinessMetadata ~ error",
      //     error
      //   );
      //   if (error.response) {
      //     this.error = error.response;
      //   }
      // }
    };

    const handleAddNewAttribute = () => {
      localBm.attributeDefs = [
        {
          ...JSON.parse(JSON.stringify(getDefaultAttributeTemplate())),
          id: Date.now(),
        },
        ...localBm.attributeDefs,
      ];
      onUpdate();
    };

    const onAttributeValuesChange = (_uAttribute: any, uIndex: number) => {
      localBm.attributeDefs = localBm.attributeDefs.map((attribute: object, index) => {
        if (index === uIndex) {
          return {
            ...attribute,
            ..._uAttribute,
          };
        }
        return attribute;
      });
      onUpdate();
    };

    const handleRemoveAttribute = index => {
      const tempAttributes = JSON.parse(JSON.stringify(localBm.attributeDefs));
      tempAttributes.splice(index, 1);
      localBm.attributeDefs = tempAttributes;
      onUpdate();
    };
    const fetchAssets = async (isAppend = false) => {
      setAssetsStatus("loading");
      const paginateOptions = {
        filters: filters || {},
        limit: limit || 20,
        skip: skip || 0,
        searchText: searchText || "",
        sortBy: sortBy || DEFAULT_SORT_BY,
        sortOrder: sortOrder || DEFAULT_SORT_ORDER,
        showOwnedByMe: showOwnedByMe || false,
        showBookmarkedAssets: showBookmarkedAssets || false,
      };
      setAssetListPaginateOptions(paginateOptions);
      const options = {
        staticOptions: {
          searchType: "BASIC",
          typeName: "AtlanAsset",
          excludeDeletedEntities: true,
          includeClassificationAttributes: true,
          includeSubClassifications: true,
          includeSubTypes: true,
        },
        ...paginateOptions,
        isAppend,
      };
      console.log("fetchAssets -> options", options);
      getAssets(options);
    };
    // * Computed

    const dropdownOptions = computed(() => {
      return [
        {
          title: `Archive metadata`,
          icon: "trash text-danger",
          iconType: "far",
          handleClick: onShowArchiveMetadataModal,
        },
      ];
    });

    const searchedAttributes = computed(() => {
      if (attrsearchText.value) {
        return localBm.attributeDefs.filter(attr =>
          attr.name.toUpperCase().includes(attrsearchText.value.toUpperCase())
        );
      }
      return localBm.attributeDefs;
    });
    // ...mapState({
    //   bmList: state => state.businessMetadata.list,
    //   limit: state => state.asset.paginateOptions.limit,
    //   filters: state => state.asset.paginateOptions.filters,
    //   skip: state => state.asset.paginateOptions.skip,
    //   sortBy: state => state.asset.paginateOptions.sortBy,
    //   sortOrder: state => state.asset.paginateOptions.sortOrder,
    //   paginateOptions: state => state.asset.paginateOptions
    // });

    const keymap = computed(() => {
      return {
        esc: handleClose,
      };
    });

    // * Lifecycle hooks

    onMounted(() => {
      if (props.selectedBm && props.selectedBm.guid) {
        Object.assign(
          localBm,
          JSON.parse(
            JSON.stringify({
              ...props.selectedBm,
              attributeDefs: props.selectedBm.attributeDefs.map(a => {
                if (a.options?.displayName?.length) return a;
                return { ...a, options: { ...a.options, displayName: a.name } };
              }),
            })
          )
        );
        if (props.selectedBm.guid === "new") {
          isUpdated.value = true;
          if (!props.selectedBm.attributeDefs.length) {
            handleAddNewAttribute();
          }
        }
      }
    });

    return {
      localBm,
      searchedAttributes,
      dropdownOptions,
      attrsearchText,
      isUpdated,
      showArchiveMetadataModal,
      loading,
      error,
      keymap,
      handleAfterArchive,
      clearSearchText,
      handleDiscardChanges,
      handleAddBusinessMetadata,
      onAttributeValuesChange,
      handleRemoveAttribute,
    };
  },
});
</script>
