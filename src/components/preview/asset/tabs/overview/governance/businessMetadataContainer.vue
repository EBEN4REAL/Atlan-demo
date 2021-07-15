<template>
  <a-popover
    placement="left"
    v-model:visible="visibility"
    trigger="none"
    title="Create Business Metadata Widget"
  >
    <template #content>
      <div class="flex flex-col p-2 overflow-y-auto" style="width: 280px; height: 200px">
        <p class="mb-1 text-sm text-gray-400">Select Business Metadata</p>
        <a-select
          placeholder="Business Metadata"
          v-model:value="addBusinessMetadata"
          allowClear
          :options="addBMSelectOptions"
        />
        <p class="mt-2 text-xs text-gray-400">
          Can't find the right Business Metadata to add, create a new Business Metadata
          from
          <router-link to="/admin/business-metadata">here</router-link>
        </p>
        <div
          class="absolute flex p-2 space-x-2 border-t border-gray-100 bottom-1 right-3"
        >
          <a-button size="small" @click="visibility = false">Cancel</a-button>
          <a-button type="primary" size="small" @click="handleAddWidget">Done</a-button>
        </div>
      </div>
    </template>
    <div class="px-2 py-1">
      <p class="flex justify-between mb-2 text-sm tracking-wide text-gray-400">
        <span
          >Business Metadata&nbsp;
          <span
            v-if="
              attributesList.length &&
                attributesList.filter(
                  bmCol => bmCol.attributes && bmCol.attributes.length
                ).length
            "
          >
            ({{ attributesList.length }})
          </span>
          <fa
            icon="fal circle-notch spin"
            class="ml-2 mr-1 animate-spin text-grey-600"
            v-if="updateBmAttributesStatus === 'loading'"/>
          <fa
            icon="fal times"
            class="ml-2 mr-1 text-red-600"
            v-else-if="updateBmAttributesStatus === 'failed'"/>
          <fa
            icon="fal check"
            class="ml-2 mr-1 text-green-600"
            v-else-if="updateBmAttributesStatus === 'success'"
        /></span>
        <span
          class="pr-2 mr-1 text-xs cursor-pointer hover:text-blue-900"
          @click.stop.prevent="visibility = true"
          >+ Add</span
        >
      </p>
      <p v-if="!attributesList.length" class="text-sm text-gray-500">
        No Business Metadata Added.
      </p>
      <div style="max-height: 300px" class="pr-2 overflow-auto">
        <BusinessMetadataWidget
          @updateAttribute="handleUpdateAttribute"
          :class="x !== attributesList.length ? 'mb-2' : ''"
          v-for="(bm, x) in attributesList"
          :key="x"
          :bm="bm"
          :originalBM="getBMbyName(bm.bm)"
          :assetType="item.typeName"
        />
      </div>
    </div>
  </a-popover>
</template>

<script lang="ts">
import { ref, defineComponent, computed, watch, onMounted } from "vue";
import { BusinessMetadata } from "~/api/atlas/businessMetadata";
import BusinessMetadataWidget from "@/common/businessMetadataWidget.vue";

// ? Store
import { useBusinessMetadataStore } from "~/pinia/businessMetadata";
import { State } from "~/pinia/businessMetadata/state";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: { BusinessMetadataWidget },
  setup(props, context) {
    const store = useBusinessMetadataStore();
    const attributesList = ref([]);
    const originalBmAttributesList = ref([]);
    const updateBmAttributesStatus = ref("");
    const isEditBusinessMetadata = ref(false);
    const accessLevel = ref("editor");
    const visibility = ref(false);
    const addBusinessMetadata = ref([]);

    // * Computed
    const businessMetadataList = computed(() => store.getBusinessMetadataList);

    const availableBM = computed(() => {
      if (businessMetadataList.value) {
        return businessMetadataList.value.filter(bm => {
          if (attributesList.value.find(b => bm.name === b.bm)) {
            return false;
          }
          return true;
        });
      }
    });

    const addBMSelectOptions = computed(() => {
      return availableBM.value.map(b => ({
        value: b.name,
        title: b.options.displayName,
      }));
    });

    // ? Methods
    // ! NO longer need
    const handleMissingDisplayNameKey = (
      BMlist:
        | (object[] & ((state: State) => object[] | null))
        | { attributeDefs: object[] }[]
    ) => {
      return BMlist.map(bm => {
        return {
          ...bm,
          attributeDefs: bm.attributeDefs.map(
            (a: { options: { displayName: string }; name: string }) => {
              return {
                ...a,
                options: {
                  ...a.options,
                  displayName: a.options.displayName || a.name,
                },
              };
            }
          ),
        };
      });
    };

    const getUpdatePayload = (updateBM: { bm: string }) => {
      let mappedBM = {};
      let finalBM = attributesList.value.map(bm => {
        if (bm.bm === updateBM.bm) return updateBM;
        return bm;
      });

      finalBM.forEach(bm => {
        mappedBM = {
          ...mappedBM,
          [bm.bm]: {},
        };
        bm.attributes.forEach(
          (attr: { name: string; typeName: string; value: string }) => {
            mappedBM[bm.bm] = {
              ...mappedBM[bm.bm],
              [attr.name]:
                attr.typeName === "date" ? parseInt(attr.value, 10) : attr.value,
            };
          }
        );
      });
      return mappedBM;
    };

    const setAttributesList = () => {
      // Setting attributesList
      if (props.item && props.item.attributes) {
        Object.keys(props.item.attributes).forEach(attributeKey => {
          if (attributeKey.split(".").length > 1) {
            const foundBmFromList = handleMissingDisplayNameKey(
              businessMetadataList.value
            ).find(bm => bm.name === attributeKey.split(".")[0]);
            const foundAttributeFromList =
              foundBmFromList && foundBmFromList.attributeDefs
                ? foundBmFromList.attributeDefs.find(
                    (attr: { name: string }) => attr.name === attributeKey.split(".")[1]
                  )
                : null;
            if (
              foundBmFromList &&
              attributesList.value &&
              attributesList.value.find(attr => attr.bm === foundBmFromList.name)
            ) {
              if (
                attributesList.value.length &&
                attributesList.value.findIndex(a => a.bm === attributeKey.split(".")[0]) >
                  -1
              ) {
                const foundAttributeIndex = attributesList.value.findIndex(
                  a => a.bm === attributeKey.split(".")[0]
                );
                if (
                  attributesList.value[foundAttributeIndex].attributes &&
                  !attributesList.value[foundAttributeIndex].attributes.find(
                    (attr: { name: string }) => attr.name === attributeKey.split(".")[1]
                  )
                ) {
                  // eslint-disable-next-line
                  attributesList.value[foundAttributeIndex].attributes.push({
                    ...(foundAttributeFromList || {}),
                    name: attributeKey.split(".")[1],
                    value:
                      foundAttributeFromList && foundAttributeFromList.typeName === "date"
                        ? parseInt(props.item.attributes[attributeKey], 10)
                        : props.item.attributes[attributeKey],
                  });
                }
              }
            } else {
              // eslint-disable-next-line
              attributesList.value.push({
                bm: attributeKey.split(".")[0],
                displayName: foundBmFromList.options.displayName,
                isNew: false,
                attributes: [
                  {
                    ...(foundAttributeFromList || {}),
                    name: attributeKey.split(".")[1],
                    options: {
                      ...foundAttributeFromList.options,
                      displayName:
                        foundAttributeFromList.options.displayName ||
                        attributeKey.split(".")[1],
                    },
                    value:
                      foundAttributeFromList && foundAttributeFromList.typeName === "date"
                        ? parseInt(props.item.attributes[attributeKey], 10)
                        : props.item.attributes[attributeKey],
                  },
                ],
              });
            }
          }
        });
      }
    };

    const handleAddWidget = () => {
      // FIXME make this multiple,
      // addBusinessMetadata.value.forEach(b => {
      attributesList.value.push({
        attributes: [],
        bm: addBusinessMetadata.value,
        isNew: true,
      });
      // });
      visibility.value = false;
      addBusinessMetadata.value = [];
    };

    /**
     * Find the required from the BM List and return
     * @param  {String} name Name of the required BM
     * @return {Object}  The required BM or null
     */
    const getBMbyName = (name: string) => {
      const requiredBM = businessMetadataList.value.find(
        (bm: object) => name === bm.name
      );
      return requiredBM || null;
    };

    const handleUpdateAttribute = (value: object) => {
      // ? compute the payload
      updateBmAttributesStatus.value = "loading";
      const { error, isReady, isLoading } = BusinessMetadata.saveAssetBMUpdateChanges(
        props.item.guid,
        ref(getUpdatePayload(value))
      );

      watch([() => isLoading.value, error, isReady], n => {
        if (isLoading.value) {
          updateBmAttributesStatus.value = "loading";
        } else if (error.value) {
          updateBmAttributesStatus.value = "failed";
        } else if (isReady.value) {
          updateBmAttributesStatus.value = "success";
          // ? remove empty attributes on update // add new value of the attribute to state if success update
          const index = attributesList.value.findIndex(a => a.bm === value.bm);
          if (index > -1) {
            attributesList.value[index] = value;
          }
          attributesList.value = attributesList.value.filter(b => b.attributes.length);
          setTimeout(async () => {
            // await this.refreshAssetInAssetsList(this.asset.guid);
            updateBmAttributesStatus.value = "";
            // this.originalBmAttributesList = JSON.parse(
            //   JSON.stringify(this.attributesList)
            // );
          }, 1000);
        }
      });

      // watch([isReady, error], (n, o) => {
      //   console.log("watching is ready");
      //   console.log(n);
      // });
    };

    onMounted(() => {
      setAttributesList();
    });

    return {
      attributesList,
      originalBmAttributesList,
      updateBmAttributesStatus,
      isEditBusinessMetadata,
      accessLevel,
      availableBM,
      handleUpdateAttribute,
      getBMbyName,
      handleAddWidget,
      visibility,
      addBMSelectOptions,
      addBusinessMetadata,
    };
  },
});
</script>

<style scoped></style>
