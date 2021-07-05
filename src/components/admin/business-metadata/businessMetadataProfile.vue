<template>
  <div class="bg-white border rounded">
    <ArchiveMetadataModal
      v-if="showArchiveMetadataModal"
      @close="showArchiveMetadataModal = false"
      :businessMetadata="localBm"
      @afterArchive="handleAfterArchive"
      @updateBusinessMetadataList="updateBusinessMetadata"
      :visible="showArchiveMetadataModal"
    />
    <div class="flex items-center justify-between px-4 py-3 border-b">
      <div>
        <div class="font-bold font-size-h5">
          {{ (localBm.options && localBm.options.displayName) || localBm.name }}
        </div>
        <div>
          <CreateUpdateInfo
            :createdAt="localBm.createTime"
            :updatedAt="localBm.updateTime"
            :createdBy="localBm.createdBy"
            :updatedBy="localBm.updatedBy"
            :entityType="`bm-localBm-${localBm.guid}`"
          />
        </div>
      </div>
      <div class="flex items-center">
        <a-popover title="Error">
          <template #content>
            <span>
              {{
                `Unable to ${
                  localBm.guid !== "new" ? "update" : "create"
                } business metadata, please check your config. ${(error &&
                  error.data &&
                  error.data.errorMessage) ||
                  ""}`
              }}
            </span></template
          >
          <span type="primary">
            <fa v-if="error" icon="fal info-circle" class="mr-3 text-red"></fa>
          </span>
        </a-popover>

        <a-button
          v-if="isUpdated"
          variant="link-danger mr-3"
          class="mr-2"
          @keyup="handleDiscardChanges"
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
        <a-dropdown
          trigger="click"
          v-if="localBm.guid !== 'new'"
          dropdownMenuClass="mt-1 ml-4"
        >
          <span><fa icon="fal ellipsis-v" class="ml-1 text-xl"></fa></span>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="(d, x) in dropdownOptions" :key="x">
                <a-button @click="d.handleClick">
                  <fa :icon="d.icon" />
                  {{ d.title }}
                </a-button>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div class="px-4 py-3 overflow-y-auto" style="height: calc(100% - 4.3rem)">
      <div class="pb-4 mb-3 border-b">
        <div class="w-1/2 px-0 mb-4">
          <label for="name" class="mb-1"
            >Name
            <sup class="text-red">*</sup>
          </label>
          <input
            type="text"
            class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white border rounded appearance-none text-grey-darker border-grey"
            id="name"
            name="Name"
            v-model="localBm.options.displayName"
            @input="onUpdate"
          />
        </div>
        <div>
          <label for="description" class="mb-1">Description</label>
          <textarea
            placeholder="Add some details about this metadata."
            class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white border rounded appearance-none text-grey-darker border-grey"
            id="description"
            name="Description"
            v-model="localBm.description"
            @input="onUpdate"
            :rows="2"
          ></textarea>
        </div>
      </div>
      <label class="block mb-2">Attributes ({{ localBm.attributeDefs.length }})</label>
      <div class="flex items-center mb-4">
        <div class="mr-4">
          <div class="relative flex items-stretch w-full overflow-hidden border rounded">
            <input
              ref="searchinput"
              v-model="attrsearchText"
              type="text"
              class="w-full h-8 px-2 pl-2 font-size-h6"
              :placeholder="'Search attribute'"
            />
            <!-- <div class="input-group-append">
              <span
                v-if="!attrsearchText"
                class="pr-4 bg-white border-0 input-group-text roundehidden"
              >
                <i class="fal fa-search font-size-h4"></i>
              </span>
              <span
                v-else
                @click="clearSearchText"
                class="pr-4 bg-white border-0 cursor-pointer input-group-text text-red roundehidden"
              >
                <i class="far fa-times-circle font-size-h4"></i>
              </span>
            </div> -->
          </div>
        </div>
        <a-button
          variant="alt-primary"
          class="flex items-center text-sm leading-tight"
          @click="handleAddNewAttribute"
        >
          New attribute
        </a-button>
      </div>

      <a-collapse
        v-if="attrsearchText ? searchedAttributes.length : localBm.attributeDefs.length"
        :accordion="true"
        :defaultActiveKey="1"
      >
        <a-collapse-panel
          v-for="(attribute, index) in attrsearchText
            ? searchedAttributes
            : localBm.attributeDefs"
          :key="index"
          :header="attribute.options.displayName || 'New attribute'"
          class="advanceConfigCollapse"
        >
          <template #extra>
            <span
              v-if="attribute.isNew"
              class="cursor-pointer text-red hover-underline font-size-sm"
              @click.prevent.stop="handleRemoveAttribute(index)"
            >
              <i class="mr-1 fa-trash-alt far font-size-xs"></i> Remove
            </span>
          </template>
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
import { reactive, ref, toRefs, computed, onMounted, nextTick, watch } from "vue";
// * Utils
import { generateUUID } from "~/utils/generator";
import { DEFAULT_ATTRIBUTE } from "~/constant/business_metadata";
import { DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from "~/constant/search";
import AddAttributeCard from "@/admin/business-metadata/addAttributeCard.vue";
import CreateUpdateInfo from "@/shared/createUpdateInfo.vue";
import ArchiveMetadataModal from "@/admin/business-metadata/archiveMetadataModal.vue";

// ? composables
import { useBusinessMetadata } from "@/admin/business-metadata/composables/useBusinessMetadata";

export default defineComponent({
  props: {
    selectedBm: {
      type: Object,
      required: true,
    },
  },
  components: { AddAttributeCard, CreateUpdateInfo, ArchiveMetadataModal },
  setup(props, context) {
    // * Data
    let localBm = ref({
      name: "",
      description: "",
      options: { displayName: "" },
      guid: "",
      attributeDefs: <any>[],
    });
    let attrsearchText = ref("");
    let isUpdated = ref(false);
    let showArchiveMetadataModal = ref(false);
    let loading = ref(false);
    let error = ref(null);
    // * Methods
    const { addNewBusinessMetadata, updateNewBusinessMetadata } = useBusinessMetadata;

    //TODO avoid event bus
    const updateBusinessMetadata = (data: any) => {
      context.emit("updateBusinessMetadataInList", data);
    };

    const handleAfterArchive = () => {
      context.emit("afterArchive");
      // fetchAssets();
    };
    const getDefaultAttributeTemplate = () => {
      const uuid4 = generateUUID();
      // TODO changes when UUID4 support
      return { ...DEFAULT_ATTRIBUTE };
      // return { ...DEFAULT_ATTRIBUTE, name: uuid4 };
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
      context.emit("update", JSON.parse(JSON.stringify(localBm.value)));
    };
    const handleDiscardChanges = () => {
      if (props.selectedBm && props.selectedBm.guid === "new")
        context.emit("removeNewBm");
      if (props.selectedBm && props.selectedBm.guid) {
        localBm.value = JSON.parse(JSON.stringify(props.selectedBm));
      }
      isUpdated.value = false;
      error.value = null;
      context.emit("clearUpdatedBm");
    };
    const handleAddBusinessMetadata = async () => {
      console.trace({ handleAddBusinessMetadata });
      error.value = null;
      let isInvalid = false;
      // ! turn this back to displayName
      if (!localBm.value.options.displayName) {
        isInvalid = true;
      }
      // * if creating new BM append displayName to name,
      if (!localBm.value.name) localBm.value.name = localBm.value.options.displayName;
      if (localBm.value && localBm.value.attributeDefs.length) {
        // eslint-disable-next-line
        for (let i = 0; i < localBm.value.attributeDefs.length; i++) {
          const attribute = localBm.value.attributeDefs[i];
          //TODO change back to displayName
          if (!attribute.options.displayName) {
            error.value = {
              data: { errorMessage: "Attribute names cannot be empty" },
            };
            isInvalid = true;
            break;
          } else if (!attribute.name) {
            // * if creating new BM attribtue <> append displayName to name,
            attribute.name = attribute.options.displayName;
          }
        }
      }
      if (isInvalid) {
        return;
      }
      const tempBm = JSON.parse(JSON.stringify(localBm.value));
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
      const payload = {
        businessMetadataDefs: [
          {
            ...(tempBm.guid === "new"
              ? {
                  category: "BUSINESS_METADATA",
                  typeVersion: "1.1",
                  version: 1,
                  attributeDefs: tempBm.attributeDefs,
                  description: tempBm.description,
                  name: tempBm.name,
                  options: tempBm.options,
                }
              : tempBm),
          },
        ],
        classificationDefs: [],
        entityDefs: [],
        enumDefs: [],
        structDefs: [],
      };
      let apiResponse = ref();

      if (tempBm.guid === "new") {
        apiResponse.value = addNewBusinessMetadata(ref(payload));
      } else apiResponse.value = updateNewBusinessMetadata(ref(payload));

      watch(
        () => apiResponse.value.data,
        (n, o) => {
          if (
            apiResponse.value.data &&
            apiResponse.value.data.businessMetadataDefs &&
            apiResponse.value.data.businessMetadataDefs.length
          ) {
            if (localBm.value.guid === "new") {
              context.emit(
                "businessMetadataAppendToList",
                apiResponse.value.data.businessMetadataDefs[0]
              );
              context.emit("clearNewBm");
              context.emit(
                "selectBm",
                JSON.parse(JSON.stringify(apiResponse.value.data.businessMetadataDefs[0]))
              );
            } else {
              context.emit(
                "updateBusinessMetadataInList",
                apiResponse.value.data.businessMetadataDefs[0]
              );
            }
            // eslint-disable-next-line
            localBm.value = JSON.parse(
              JSON.stringify(apiResponse.value.data.businessMetadataDefs[0])
            );
            context.emit("clearUpdatedBm");
          }
          // this.fetchAssets();
          // this.loading = false;
          // context.nextTick(() => {
          //   this.isUpdated = false;
          // });
          loading.value = false;
        }
      );

      watch(
        () => apiResponse.value.error,
        e => {
          loading.value = false;
          console.log(
            "🚀 ~ file: businessMetadataProfile.vue ~ handleAddBusinessMetadata ~ error",
            e
          );
          if (e?.response?.data?.errorMessage) {
            error.value = {
              data: { errorMessage: e.response.data.errorMessage },
            };
            console.log(error.value);
          }
        }
      );
    };

    const handleAddNewAttribute = () => {
      localBm.value.attributeDefs = [
        {
          ...JSON.parse(JSON.stringify(getDefaultAttributeTemplate())),
          id: Date.now(),
        },
        ...localBm.value.attributeDefs,
      ];
      onUpdate();
    };
    const onAttributeValuesChange = (_uAttribute: any, uIndex: number) => {
      localBm.value.attributeDefs = localBm.value.attributeDefs.map(
        (attribute: object, index: number) => {
          if (index === uIndex) {
            return {
              ...attribute,
              ..._uAttribute,
            };
          }
          return attribute;
        }
      );
      onUpdate();
    };
    const handleRemoveAttribute = index => {
      const tempAttributes = JSON.parse(JSON.stringify(localBm.value.attributeDefs));
      tempAttributes.splice(index, 1);
      localBm.value.attributeDefs = tempAttributes;
      onUpdate();
    };

    // const fetchAssets = async (isAppend = false) => {
    //   setAssetsStatus("loading");
    //   const paginateOptions = {
    //     filters: filters || {},
    //     limit: limit || 20,
    //     skip: skip || 0,
    //     searchText: searchText || "",
    //     sortBy: sortBy || DEFAULT_SORT_BY,
    //     sortOrder: sortOrder || DEFAULT_SORT_ORDER,
    //     showOwnedByMe: showOwnedByMe || false,
    //     showBookmarkedAssets: showBookmarkedAssets || false,
    //   };
    //   setAssetListPaginateOptions(paginateOptions);
    //   const options = {
    //     staticOptions: {
    //       searchType: "BASIC",
    //       typeName: "AtlanAsset",
    //       excludeDeletedEntities: true,
    //       includeClassificationAttributes: true,
    //       includeSubClassifications: true,
    //       includeSubTypes: true,
    //     },
    //     ...paginateOptions,
    //     isAppend,
    //   };
    //   console.log("fetchAssets -> options", options);
    //   getAssets(options);
    // };
    // * Computed
    const dropdownOptions = computed(() => {
      return [
        {
          title: `Archive metadata`,
          icon: "fal trash text-red",
          iconType: "far",
          handleClick: onShowArchiveMetadataModal,
        },
      ];
    });
    const searchedAttributes = computed(() => {
      if (attrsearchText.value) {
        return localBm.value.attributeDefs.filter(attr =>
          attr.name.toUpperCase().includes(attrsearchText.value.toUpperCase())
        );
      }
      return localBm.value.attributeDefs;
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
        localBm.value = JSON.parse(JSON.stringify(props.selectedBm));
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
      onUpdate,
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
      handleAddNewAttribute,
      updateBusinessMetadata,
    };
  },
});
</script>

<style lang="less">
.advanceConfigCollapse {
  .ant-collapse-header {
    background-color: #fff !important;
  }
  .ant-collapse-content-box {
    background-color: #f8f8fd !important;
  }
}
</style>
