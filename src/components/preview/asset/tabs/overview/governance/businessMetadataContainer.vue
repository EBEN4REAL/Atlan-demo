<template>
  <div class="px-2 py-1">
    <p class="flex mb-1 text-sm tracking-wide text-gray-400">
      Business Metadata&nbsp;
      <span
        v-if="
          attributesList.length &&
            attributesList.filter(bmCol => bmCol.attributes && bmCol.attributes.length)
              .length
        "
      >
        ({{ attributesList.length }})
      </span>
      <fa
        icon="fal circle-notch spin"
        class="ml-2 mr-1 animate-spin text-grey-600"
        v-if="updateBmAttributesStatus === 'loading'"
      />
      <fa
        icon="fal times"
        class="ml-2 mr-1 text-red-600"
        v-else-if="updateBmAttributesStatus === 'failed'"
      />
      <fa
        icon="fal check"
        class="ml-2 mr-1 text-green-600"
        v-else-if="updateBmAttributesStatus === 'success'"
      />
    </p>
    <BusinessMetadataWidget
      @updateAttribute="handleUpdateAttribute"
      :class="x !== attributesList.length ? 'mb-2' : ''"
      v-for="(bm, x) in attributesList"
      :key="x"
      :bm="bm"
      :originalBM="getBMbyName(bm.bm)"
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, nextTick, watch, onMounted } from "vue";
import { BusinessMetadata } from "~/api/atlas/businessMetadata";
import BusinessMetadataWidget from "@/shared/businessMetadataWidget.vue";

// ? Store
import { useBusinessMetadataStore } from "~/pinia/businessMetadata";
import { State } from "~/pinia/businessMetadata/state";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
      default(): any {
        return {};
      },
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

    // * Computed
    const businessMetadataList = computed(() => store.getBusinessMetadataList);

    // ? Methods
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
                displayName: foundBmFromList.displayName,
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
      handleUpdateAttribute,
      getBMbyName,
    };
  },
});
</script>

<style scoped></style>
