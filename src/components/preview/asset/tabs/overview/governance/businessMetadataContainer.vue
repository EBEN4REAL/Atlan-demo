<template>
  <div class="flex items-center content-between">
    <p class="mb-0 text-muted text-uppercase font-size-xs">
      Business Metadata
      <span
        v-if="
          attributesList.length &&
            attributesList.filter(bmCol => bmCol.attributes && bmCol.attributes.length)
              .length
        "
        >({{ attributesList.length }})
      </span>
      <i
        class="ml-1"
        :class="{
          'far circle-notch spin fast text-gray-500':
            updateBmAttributesStatus === 'loading',
          'far fa-times text-danger': updateBmAttributesStatus === 'failed',
          'far fa-check text-success': updateBmAttributesStatus === 'success',
        }"
      ></i>
    </p>
    <p
      v-if="!isEditBusinessMetadata && accessLevel === 'editor'"
      class="mb-0 text-gray-500 cursor-pointer font-size-xs text-hover-primary hover-underline"
      @click="onEditBusinessMetadataAttributes"
    >
      {{ attributesList.length ? "Edit" : "Add" }}
    </p>
    <div
      v-else-if="accessLevel === 'editor'"
      class="flex items-center justify-content-end"
    >
      <p
        class="mb-0 mr-3 cursor-pointer text-danger font-size-xs hover-underline"
        @click="onDiscardBmAttributeChanges"
      >
        Discard
      </p>
      <p
        class="mb-0 cursor-pointer text-primary font-size-xs hover-underline"
        @click="onSaveBmAttributeChanges"
      >
        Update
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed, nextTick, watch, onMounted } from "vue";
import { useBusinessMetadata } from "@/admin/business-metadata/composables/useBusinessMetadata";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props, context) {
    const attributesList = ref([]);
    const originalBmAttributesList = ref([]);
    const updateBmAttributesStatus = ref([]);
    const isEditBusinessMetadata = ref(false);
    const accessLevel = ref("subscriber");

    const {
      data: bmResponse,
      error,
      isLoading: loading,
    } = useBusinessMetadata.getBMList();

    // * Computed
    const businessMetadataList = computed(() => {
      if (bmResponse?.value?.businessMetadataDefs)
        return bmResponse.value.businessMetadataDefs.map(
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
      return [];
    });

    // Methods
    const handleMissingDisplayNameKey = BMlist => {
      return BMlist.map((bm: { attributeDefs: any[] }) => {
        return {
          ...bm,
          attributeDefs: bm.attributeDefs.map(a => {
            return {
              ...a,
              // displayName: a.options.displayName || a.name,
              options: {
                ...a.options,
                displayName: a.options.displayName || a.name,
              },
            };
          }),
        };
      });
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
                    attr => attr.name === attributeKey.split(".")[1]
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
                    attr => attr.name === attributeKey.split(".")[1]
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

    onMounted(() => {
      setAttributesList();
    });

    return {
      attributesList,
      originalBmAttributesList,
      updateBmAttributesStatus,
      isEditBusinessMetadata,
      accessLevel,
    };
  },
});
</script>

<style scoped></style>
