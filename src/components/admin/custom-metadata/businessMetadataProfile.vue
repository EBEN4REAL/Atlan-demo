<template>
  <div class="bg-white border rounded">
    <!-- <ArchiveMetadataModal
      v-if="showArchiveMetadataModal"
      @close="showArchiveMetadataModal = false"
      :businessMetadata="localBm"
      @afterArchive="handleAfterArchive"
      @updateBusinessMetadataList="updateBusinessMetadata"
      :visible="showArchiveMetadataModal"
    /> -->
    <div class="flex items-center justify-between px-4 py-3 border-b">
      <div>
        <div class="text-2xl text-primary">
          {{ localBm.options && localBm.options.displayName }}
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
        <a-popover title="Error" placement="left">
          <template #content>
            <div style="max-width:450px">
              {{
                `Unable to ${
                  localBm.guid !== "new" ? "update" : "create"
                } custom metadata, please check your config. ${(error &&
                  error.data &&
                  error.data.errorMessage) ||
                  ""}`
              }}
            </div>
          </template>
          <span type="primary" class="text-warning">
            <fa v-if="error" icon="fal info-circle" class="mr-3"></fa>
          </span>
        </a-popover>

        <a-button
          v-if="isUpdated"
          class="mr-2 rounded-md ant-btn"
          @click="handleDiscardChanges"
        >
          Discard
        </a-button>
        <a-button
          v-if="isUpdated || localBm.guid === 'new'"
          class="rounded-md ant-btn ant-btn-primary"
          @click="handleAddBusinessMetadata"
          :loading="loading"
          :loadingText="'Saving...'"
        >
          Save
        </a-button>
        <a-button v-else variant="alt-primary px-3"> Saved </a-button>
        <a-dropdown
          trigger="click"
          v-if="localBm.guid !== 'new' && dropdownOptions.length"
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
          <div class="relative flex items-stretch w-full overflow-hidden ">
            <a-input
              v-model:value="attrsearchText"
              class="w-full h-8 px-2 pl-2"
              :placeholder="'Search attribute'"
            >
              <template #suffix>
                <fa v-if="!attrsearchText" icon="fal search" class="text-gray-500"></fa>
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
          variant="alt-primary"
          class="rounded-md ant-btn ant-btn-primary"
          @click="handleAddNewAttribute"
        >
          New attribute
        </a-button>
      </div>

      <a-collapse
        v-if="attrsearchText ? searchedAttributes.length : localBm.attributeDefs.length"
        :accordion="true"
      >
        <a-collapse-panel
          v-for="(attribute, index) in attrsearchText
            ? searchedAttributes
            : localBm.attributeDefs"
          :key="index + 1"
          :header="attribute.options.displayName || 'New attribute'"
          class="advanceConfigCollapse"
        >
          <template #extra>
            <span
              v-if="attribute.isNew"
              class="text-gray-400 hover:text-red-600 cursor"
              @click.prevent.stop="handleRemoveAttribute(index)"
            >
              Remove
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
import { ref, computed, onMounted, watch, Ref } from "vue";
import { cloneDeep } from "lodash";

// ? Components
import AddAttributeCard from "@/admin/custom-metadata/addAttributeCard.vue";
import CreateUpdateInfo from "@/common/createUpdateInfo.vue";
import ArchiveMetadataModal from "@/admin/custom-metadata/archiveMetadataModal.vue";
import { BusinessMetadataService } from "~/api/atlas/businessMetadata";

// ? Store
import { useBusinessMetadataStore } from "~/store/businessMetadata";

// ? composables
import useBusinessMetadata from "@/admin/custom-metadata/composables/useBusinessMetadata";

interface attributeDefs {
  name: string;
  options: { displayName: string };
}

export default defineComponent({
  props: {
    selectedBm: {
      type: Object,
      required: true,
    },
  },
  components: { AddAttributeCard, CreateUpdateInfo, ArchiveMetadataModal },
  setup(props, context) {
    const store = useBusinessMetadataStore();
    // * Data
    let localBm = ref({
      name: "",
      description: "",
      options: { displayName: "" },
      guid: "",
      attributeDefs: <attributeDefs[]>[],
    });

    let attrsearchText = ref("");
    let panelModel = ref(1);
    let isUpdated = ref(false);
    let showArchiveMetadataModal = ref(false);
    let loading = ref(false);
    let error = ref("");

    const {
      getDefaultAttributeTemplate,
      getUpdatePayload,
      validatePayload,
    } = useBusinessMetadata();

    const clearSearchText = () => {
      attrsearchText.value = "";
    };

    const onUpdate = () => {
      isUpdated.value = true;
      context.emit("update", cloneDeep(localBm.value));
    };

    /**
     * @desc resets all local state to before edit
     */
    const handleDiscardChanges = () => {
      if (props.selectedBm && props.selectedBm.guid === "new")
        context.emit("removeNewBm");
      else if (props.selectedBm && props.selectedBm.guid) {
        localBm.value = cloneDeep(props.selectedBm);
      }
      isUpdated.value = false;
      error.value = null;
      context.emit("clearUpdatedBm");
    };

    /**
     * @param {Array} serviceResponse - BM data return after successfull create/update BM
     * @desc update stale BM in store
     */
    const handleBmUpdateSuccess = (serviceResponse: any[]) => {
      if (localBm.value.guid === "new") {
        store.businessMetadataAppendToList(serviceResponse[0]);
        context.emit("clearNewBm");
        context.emit("selectBm", cloneDeep(serviceResponse[0]));
      } else {
        store.updateBusinessMetadataInList(serviceResponse[0]);
      }
      // eslint-disable-next-line
      localBm.value = cloneDeep(serviceResponse[0]);
      context.emit("clearUpdatedBm");
    };

    /**
     * @desc action for @save event, validates the data and/or makes the api call,
     *       Also updates the BM Store with the updated data
     */
    const handleAddBusinessMetadata = async () => {
      error.value = null;
      const validatedBm = validatePayload(localBm.value);

      if (validatedBm.error) {
        error.value = validatedBm.error;
        return;
      }

      loading.value = true;
      let apiResponse = ref();
      if (validatedBm.guid === "new")
        apiResponse.value = BusinessMetadataService.addNewBusinessMetadata(
          getUpdatePayload(validatedBm.data)
        );
      else
        apiResponse.value = BusinessMetadataService.updateNewBusinessMetadata(
          getUpdatePayload(validatedBm.data)
        );

      handleUpdateBMResponse(apiResponse);
    };
    /**
     * @param {Object} apiResponse - object return from update api call
     * @desc - handles success and error for update
     */
    const handleUpdateBMResponse = (apiResponse: Ref) => {
      watch(
        () => apiResponse.value.data,
        (n, o) => {
          if (apiResponse.value?.data?.businessMetadataDefs.length) {
            handleBmUpdateSuccess(apiResponse.value.data.businessMetadataDefs);
          }

          loading.value = false;
          isUpdated.value = false;
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
          ...cloneDeep(getDefaultAttributeTemplate()),
          id: Date.now(),
        },
        ...localBm.value.attributeDefs,
      ];
      onUpdate();
    };

    /**
     * @desc watchers from add attribute card is emitting this which updates the local BM attributes
     *
     */
    const onAttributeValuesChange = (_uAttribute: {}, uIndex: number) => {
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

    /**
     * @param {Number} index - index of the newly added attribute
     * @desc removes newly added attribute if not saved
     */
    const handleRemoveAttribute = (index: number) => {
      const tempAttributes = cloneDeep(localBm.value.attributeDefs);
      tempAttributes.splice(index, 1);
      localBm.value.attributeDefs = tempAttributes;
      onUpdate();
    };

    // * Computed
    const dropdownOptions = computed(() => {
      return [
        // {
        //   title: `Archive metadata`,
        //   icon: "fal trash text-red",
        //   iconType: "far",
        //   handleClick: onShowArchiveMetadataModal,
        // },
      ];
    });

    const searchedAttributes = computed(() => {
      if (attrsearchText.value) {
        return localBm.value.attributeDefs.filter((attr: { name: string }) =>
          attr.name.toUpperCase().includes(attrsearchText.value.toUpperCase())
        );
      }
      return localBm.value.attributeDefs;
    });

    // * Lifecycle hooks
    /**
     * @desc if a BM is select on the BM list, make a local copy
     *       is Selected BM is a new template, enable editMode
     *       also add an empty attribute for the new BM
     */
    onMounted(() => {
      if (props.selectedBm && props.selectedBm.guid) {
        localBm.value = cloneDeep(props.selectedBm);
        if (props.selectedBm.guid === "new") {
          isUpdated.value = true;
          if (!props.selectedBm.attributeDefs.length) {
            handleAddNewAttribute();
          }
        }
      }
    });
    return {
      attrsearchText,
      clearSearchText,
      dropdownOptions,
      error,
      handleAddBusinessMetadata,
      handleAddNewAttribute,
      handleDiscardChanges,
      handleRemoveAttribute,
      isUpdated,
      loading,
      localBm,
      onAttributeValuesChange,
      onUpdate,
      panelModel,
      searchedAttributes,
      showArchiveMetadataModal,
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
