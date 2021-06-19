<template>
  <div>
    <div class="flex flex-col ">
      <div class="grid grid-cols-2 gap-4 mb-3">
        <div class="">
          <label class="mb-0 font-normal font-size-sm"
            >Name<sup class="text-red">*</sup></label
          >
          <input
            type="text"
            v-model="attributeInput.data.options.displayName"
            class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white border rounded appearance-none text-grey-darker border-grey"
          />
        </div>
        <div class="">
          <label class="mb-0 font-normal font-size-sm">Search Weight </label>
          <a-popover>
            <template #content>
              <div class="flex flex-col items-center">
                <div class="mb-2 font-size-14">
                  <fa icon="fal arrow-up" class="mr-1"></fa>
                  the search weight for the attribute,
                  <fa icon="fal arrow-up" class="mx-1"></fa>
                  the entity in the topmost
                  <br />
                  search results when searched for by that attribute
                </div>
                <div class="mb-1 font-bold font-size-14 text-underline">
                  Applicable Ranges
                </div>
                <div class="font-size-14">Quick search: <b>0 - 10</b></div>
                <div class="font-size-14">Suggestion: <b>8 - 10</b></div>
              </div>
            </template>
            <fa
              icon="fal question-circle"
              class="ml-2 text-xs"
              id="search-weight-tooltip"
            ></fa>
          </a-popover>

          <select
            id="search-weight"
            class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white border rounded appearance-none text-grey-darker border-grey"
            v-model="attributeInput.data.searchWeight"
          >
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-around w-full gap-4 mb-3">
        <div class="w-full">
          <label class="mb-0 font-normal font-size-sm">Type</label>
          <select
            id="typeName"
            show-search
            class="block w-full px-2 py-1 mb-1 text-base leading-normal bg-white border rounded appearance-none text-grey-darker border-grey"
            v-model="attributeInput.data.typeName"
            :disabled="isEdit"
          >
            <option v-for="type in attributesTypes" :key="type.id" :value="type.id">
              {{ type.label }}
            </option>
          </select>
        </div>
        <div class="w-full" v-if="attributeInput.data.typeName !== 'boolean'">
          <label class="mb-0 font-normal font-size-sm">Multivalues</label>
          <div class="pt-2 mb-1">
            <a-checkbox
              class=""
              :id="`${attributeInput.data.name}-multiValueSelect`"
              :disabled="isEdit"
              :name="`${attributeInput.data.name}-multiValueSelect`"
              v-model="attributeInput.data.multiValueSelect"
            />
            <label class="ml-1" :for="`${attributeInput.data.name}-multiValueSelect`">{{
              attributeInput.data.multiValueSelect ? "Enabled" : "Disabled"
            }}</label>
          </div>
        </div>
      </div>

      <div class="mb-3" v-if="attributeInput.data.typeName === 'string'">
        <label class="mb-0 font-normal font-size-sm">Max. String Length</label>
        <input
          type="number"
          class="block w-full px-2 py-1 mb-3 text-base leading-normal bg-white border rounded appearance-none text-grey-darker border-grey"
          v-model="attributeInput.data.options.maxStrLength"
          :min="1"
        />
      </div>
      <div class="flex flex-wrap" v-if="attributeInput.data.typeName === 'enum'">
        <div class="">
          <label class="mb-0 font-normal font-size-sm"
            >Choose Enum<sup class="text-red">*</sup></label
          >
          <Treeselect
            v-model="enumType"
            noResultsText="No enum found"
            :options="finalEnumsList"
            :multiple="false"
            :async="false"
            placeholder="Select enum"
            :disabled="isEdit"
          >
          </Treeselect>
        </div>
        <div class="pl-3">
          <label class="mb-0 font-normal font-size-sm">Options</label>
          <Treeselect
            :value="selectedEnumOptions ? selectedEnumOptions.map(item => item.id) : null"
            :options="selectedEnumOptions"
            :multiple="true"
            :async="false"
            :disabled="true"
          >
          </Treeselect>
        </div>
      </div>
      <div class="flex">
        <div class="">
          <label class="mb-0 font-normal font-size-sm">Applicable Entities</label>
          <Treeselect
            v-model="attributeInput.data.options.applicableEntityTypes"
            noResultsText="No entities found"
            :options="finalApplicableTypeNamesOptions"
            :multiple="true"
            :async="false"
            placeholder="Select entity types"
          >
          </Treeselect>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { reactive, ref, toRefs, computed, onMounted, nextTick, watch } from "vue";
import {
  DEFAULT_ATTRIBUTE,
  ATTRIBUTE_INPUT_VALIDATION_RULES,
  ATTRIBUTE_TYPES,
} from "~/constant/business_metadata";
// * Plugins
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";

// * Utils
import { generateUUID } from "~/utils/generator";
// * Composables
import useEnums from "@/admin/enums/composables/useEnums";
import useAssetQualifiedName from "~/composables/asset/useAssetQualifiedName";
export default defineComponent({
  props: {
    attribute: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: { Treeselect },
  setup(props, context) {
    // * Methods
    const getDefaultAttributeTemplate = () => {
      const uuid4 = generateUUID();
      return { ...DEFAULT_ATTRIBUTE, name: uuid4 };
    };
    // * Data
    // !!!!!
    // const { isEdit, attribute } = toRefs(props);
    let attributeInput = reactive({
      data: JSON.parse(JSON.stringify(getDefaultAttributeTemplate())),
    });
    let rules = reactive(JSON.parse(JSON.stringify(ATTRIBUTE_INPUT_VALIDATION_RULES)));
    let attributesTypes = reactive(JSON.parse(JSON.stringify(ATTRIBUTE_TYPES)));
    let enumType = ref(null);
    // * Composables
    const { enumListData: enumsList } = useEnums();
    const { getApplicableEntitiesForBmAttributes } = useAssetQualifiedName();
    // * Computed
    const finalEnumsList = computed(() => {
      if (enumsList && enumsList.value.length) {
        return enumsList.value.map(item => ({
          ...item,
          id: item.name,
          label: item.name,
        }));
      }
      return [];
    });
    const finalApplicableTypeNamesOptions = computed(() => {
      let options = getApplicableEntitiesForBmAttributes();
      if (
        props.isEdit &&
        props.attribute.options &&
        props.attribute.options.applicableEntityTypes
      ) {
        const selectedOptions = JSON.parse(
          props.attribute.options.applicableEntityTypes || "[]"
        );
        options = options.map((option: { id: any }) => ({
          ...option,
          isDisabled: selectedOptions.includes(option.id),
        }));
      }
      return options.filter(t => t.id !== "AtlanSavedQuery");
    });
    const selectedEnumOptions = computed(() => {
      if (enumType.value) {
        const reqIndex = enumsList.value.findIndex(item => item.name === enumType.value);
        if (
          reqIndex > -1 &&
          enumsList.value[reqIndex].elementDefs &&
          enumsList.value[reqIndex].elementDefs.length
        ) {
          return enumsList.value[reqIndex].elementDefs.map((item: { value: any }) => ({
            id: item.value,
            label: item.value,
          }));
        }
      }
      return null;
    });
    // * Methods
    const normalize = (attribute: {
      typeName: string;
      multiValueSelect: any;
      options: { applicableEntityTypes: any };
    }) => {
      if (attribute) {
        return {
          ...attribute,
          // eslint-disable-next-line
          ...(attribute.typeName === "enum" && enumType.value
            ? {
                typeName: attribute.multiValueSelect
                  ? `array<${enumType.value}>`
                  : enumType.value,
              }
            : attribute.multiValueSelect
            ? {
                typeName:
                  typeof ATTRIBUTE_TYPES.find(
                    (type: { id: string }) => type.id === attribute.typeName
                  ) !== "undefined"
                    ? ATTRIBUTE_TYPES.find(
                        (type: { id: string }) => type.id === attribute.typeName
                      ).multiValueType
                    : attribute.typeName,
              }
            : {}),
          options: {
            ...attribute.options,
            applicableEntityTypes: JSON.stringify(
              attribute.options.applicableEntityTypes
            ),
          },
        };
      }
      return attribute;
    };
    // * hooks
    onMounted(() => {
      if (props.attribute) {
        attributeInput.data = JSON.parse(
          JSON.stringify({
            ...props.attribute,
            multiValueSelect:
              props.attribute.typeName && props.attribute.typeName.includes("array"),
          })
        );
        if (props.attribute.typeName && props.attribute.typeName.includes("array")) {
          // eslint-disable-next-line
          const tempTypename = props.attribute.typeName.substring(6).split(">")[0];
          if (
            ATTRIBUTE_TYPES.map((item: { id: any }) => item.id).includes(tempTypename)
          ) {
            attributeInput.data.typeName = tempTypename;
          } else {
            attributeInput.data.typeName = "enum";
            enumType.value = tempTypename;
          }
        } else if (
          !ATTRIBUTE_TYPES.map((item: { id: any }) => item.id).includes(
            props.attribute.typeName
          )
        ) {
          enumType.value = JSON.parse(JSON.stringify(props.attribute.typeName));
          attributeInput.data.typeName = "enum";
        }
      }
      attributeInput.data.options = {
        ...attributeInput.data.options,
        applicableEntityTypes: props.isEdit.value
          ? JSON.parse(attributeInput.data.options.applicableEntityTypes || "[]")
          : getApplicableEntitiesForBmAttributes()
              .map(type => type.id)
              .filter(t => t.id !== "AtlanSavedQuery"),
      };
    });
    // watch(
    //   [
    //     attributeInput.data.searchWeight,
    //     attributeInput.data.options.applicableEntityTypes,
    //     attributeInput.data.options.maxStrLength,
    //     attributeInput.data.options.displayName,
    //     attributeInput.data.typeName,
    //   ],
    //   (
    //     [oldVal, newVal],
    //     [oldVal1, newVal1],
    //     [oldVal2, newVal2],
    //     [oldVal3, newVal3],
    //     [oldVal4, newVal4]
    //   ) => {
    //     if (oldVal !== newVal) {
    //       context.emit(
    //         "updateAttribute",
    //         normalize(JSON.parse(JSON.stringify(attributeInput.data)))
    //       );
    //     }
    //     if (oldVal1.length !== newVal1.length && oldVal1.length >= 1) {
    //       context.emit(
    //         "updateAttribute",
    //         normalize(JSON.parse(JSON.stringify(attributeInput.data)))
    //       );
    //     }
    //     if (oldVal2 !== newVal2 && oldVal2 !== undefined) {
    //       context.emit(
    //         "updateAttribute",
    //         normalize(JSON.parse(JSON.stringify(attributeInput.data)))
    //       );
    //     }
    //     if (oldVal3 !== newVal3 && oldVal3 !== undefined) {
    //       context.emit(
    //         "updateAttribute",
    //         normalize(JSON.parse(JSON.stringify(attributeInput.data)))
    //       );
    //     }
    //     if (oldVal4) {
    //       const reqIndexOld = ATTRIBUTE_TYPES.findIndex(type => type.id === oldVal4);
    //       if (reqIndexOld > -1 && ATTRIBUTE_TYPES[reqIndexOld].extraAttributeOptions) {
    //         Object.keys(ATTRIBUTE_TYPES[reqIndexOld].extraAttributeOptions).forEach(
    //           key => {
    //             delete attributeInput.data.options[key];
    //           }
    //         );
    //       }
    //     }
    //     if (newVal4) {
    //       const reqIndexNew = ATTRIBUTE_TYPES.findIndex(type => type.id === newVal4);
    //       if (reqIndexNew > -1 && ATTRIBUTE_TYPES[reqIndexNew].extraAttributeOptions) {
    //         attributeInput.data = {
    //           ...attributeInput.data,
    //           options: {
    //             ...attributeInput.data.options,
    //             ...ATTRIBUTE_TYPES[reqIndexNew].extraAttributeOptions,
    //           },
    //           ...(newVal4 === "boolean"
    //             ? {
    //                 multiValueSelect: false,
    //               }
    //             : {}),
    //         };
    //       } else if (newVal4 === "boolean") {
    //         attributeInput.data = {
    //           ...attributeInput.data,
    //           multiValueSelect: false,
    //         };
    //       }
    //     }
    //   }
    // );
    return {
      attributeInput,
      rules,
      attributesTypes,
      finalEnumsList,
      enumType,
      enumsList,
      finalApplicableTypeNamesOptions,
      selectedEnumOptions,
    };
  },
});
</script>
<style scoped></style>
