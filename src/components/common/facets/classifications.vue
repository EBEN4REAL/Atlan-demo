<template>
  <div>
    <div class="flex mt-1.5">
      <a-input
        ref="searchText"
        v-model:value="classificationSearchText"
        type="text"
        class="bg-white shadow-none form-control border-right-0"
        placeholder="Search classifications"
        @change="handleClassificationsSearch"
      >
        <template #suffix>
          <fa
            v-if="classificationSearchText"
            icon="fal times-circle"
            class="ml-2 mr-1 text-red-600"
            @click="clearSearchText"
          />
          <fa
            v-if="!classificationSearchText"
            icon="fal search"
            class="ml-2 mr-1 text-gray-500"
          />
        </template>
      </a-input>
      <a-popover trigger="click" placement="rightTop">
        <template #content>
          <div class="flex justify-between mb-2 border-b">
            <p class="mb-0 text-gray-500 ">Sort by</p>
          </div>
          <a-radio-group
            v-model:value="classificationFilterOptionsData"
            class="flex flex-col"
            @change="handleClassificationFilterChange"
          >
            <template
              v-for="item in classificationFilterCheckboxes"
              :key="item?.value"
              class="flex flex-col"
            >
              <a-radio :value="item.value"
                ><span class="mb-0 ml-1 text-gray-500 ">
                  {{ item?.title }}
                </span></a-radio
              >
            </template>
          </a-radio-group>
        </template>
        <div v-if="classificationFilterOptionsData !== null" class="mr-1">
          <a-badge :dot="classificationFilterOptionsData !== null">
            <a-button class="px-2 py-1 ml-2 ">
              <span class="flex items-center justify-center">
                <fa icon="fal filter" class="hover:text-primary-focus" />
              </span>
            </a-button>
          </a-badge>
        </div>
        <div v-else class="mr-1">
          <a-button class="px-2 py-1 ml-2 ">
            <span class="flex items-center justify-center">
              <fa icon="fal filter" class="hover:text-primary-focus" />
            </span>
          </a-button>
        </div>
      </a-popover>
    </div>

    <div class="mt-3">
      <a-checkbox-group
        v-if="classificationsList.length > 0"
        v-model:value="checkedValues"
        class="w-full"
        @change="handleChange"
      >
        <div class="flex flex-col w-full ">
          <div
            v-if="classificationSearchText === ''"
            ref="classificationsScrollContainer"
            class="overflow-y-scroll h-36"
          >
            <template
              v-for="item in !hideClassifications
                ? classificationsList
                : classificationsList?.slice(0, 5)"
              :key="item?.guid + classificationFilterOptionsData"
            >
              <a-checkbox
                v-if="item?.displayName"
                :value="item.name"
                class="w-full mb-2"
              >
                <span class="mb-0 ml-1 text-gray-500 truncated">
                  {{ item?.displayName }}
                </span>
              </a-checkbox>
            </template>
          </div>
          <div
            v-else
            ref="classificationsScrollContainer"
            class="overflow-y-scroll h-36"
          >
            <template
              v-for="item in filteredClassificationList"
              :key="item?.guid + classificationFilterOptionsData"
            >
              <a-checkbox
                v-if="item?.displayName"
                :value="item.guid"
                class="w-full mb-2"
              >
                <span class="mb-0 ml-1 text-gray-500 truncated">
                  {{ item?.displayName }}
                </span>
              </a-checkbox>
            </template>
          </div>

          <div
            v-if="
              hideClassifications &&
                classificationSearchText === '' &&
                classificationsList.length > 5
            "
            class="flex items-center justify-center w-auto px-2 mt-1 mb-0 font-bold text-center cursor-pointer select-none outlined hover:text-primary-focus"
            @click="toggleClassifications"
          >
            <fa icon="fal chevron-down" class="mr-1" />
            {{ `Show more + ${classificationsList.length - 5}` }}
          </div>
          <div
            v-else-if="!hideClassifications && classificationSearchText === ''"
            class="flex items-center justify-center w-auto px-2 mt-1 mb-0 font-bold text-center cursor-pointer select-none outlined hover:text-primary-focus"
            @click="toggleClassifications"
          >
            <fa icon="fal chevron-up" class="mr-1 " />
            {{ `Show less` }}
          </div>
        </div>
      </a-checkbox-group>
      <p v-else class="text-center text-gray ">No Classifications</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  watch,
  computed,
  toRaw,
  watchEffect,
} from "vue";
import { Collapse } from "~/types";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  name: "Classifications",
  components: {},
  props: {
    item: {
      type: Object as PropType<Collapse>,
      required: false,
      default() {
        return {};
      },
    },
    data: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    modelValue: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const classificationsList = ref([]);
    const filteredClassificationList = ref([]);
    const checkedValues = ref([]);
    checkedValues.value = [...props.modelValue, ...props.data.checked];
    console.log(checkedValues.value, "classificaitons checked");
    const hideClassifications = ref(true);
    const classificationFilterOptionsData = ref("asc");
    const classificationFilterCheckboxes = [
      {
        title: "A-Z",
        value: "asc",
      },
      {
        title: "Z-A",
        value: "dsc",
      },
    ];

    const handleChange = (checkedValue: string) => {
      emit("update:modelValue", checkedValues.value);
      console.log(checkedValues.value, "checked");

      const criterion: Components.Schemas.FilterCriteria[] = [];
      checkedValues.value.forEach((val) => {
        criterion.push({
          attributeName: "__classificationNames",
          attributeValue: val,
          operator: "eq",
        });
        criterion.push({
          attributeName: "__propagatedClassificationNames",
          attributeValue: val,
          operator: "eq",
        });
      });

      emit("change", {
        id: props.item.id,
        payload: {
          condition: "OR",
          criterion,
        } as Components.Schemas.FilterCriteria,
      });
    };
    const sortClassificationsByOrder = (
      sortingOrder: string | null,
      data: any
    ) => {
      console.log(toRaw(data), "hello");
      let classifications = [];
      switch (sortingOrder) {
        case "asc": {
          classifications = toRaw(data).sort((
            classificationA,
            classificationB
          ) => {
            const a = classificationA.displayName;
            const b = classificationB.displayName;
            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          });
          break;
        }
        case "dsc": {
          classifications = toRaw(data).sort((
            classificationA,
            classificationB
          ) => {
            const a = classificationA.displayName;
            const b = classificationB.displayName;
            if (a < b) {
              return 1;
            }
            if (a > b) {
              return -1;
            }
            return 0;
          });
          break;
        }
        default: {
          break;
        }
      }
      console.log("classifications", classifications);
      return classifications;
    };

    watchEffect(() => {
      console.log(filteredClassificationList.value.length, "outbox");
      classificationsList.value = sortClassificationsByOrder(
        classificationFilterOptionsData.value,
        props.data.classifications
      );
      if (filteredClassificationList.value.length > 0) {
        filteredClassificationList.value = sortClassificationsByOrder(
          classificationFilterOptionsData.value,
          filteredClassificationList.value
        );
      }
    });

    // will be called from parent to clear the filter
    const clear = () => {
      checkedValues.value = [];
      handleChange("");
    };

    // classification Search
    const classificationSearchText = ref("");
    const handleClassificationsSearch = (e: any) => {
      const searchText = e.target.value;
      filteredClassificationList.value = classificationsList.value.filter(
        (classification) =>
          classification.displayName.toLowerCase().includes(searchText)
      );
    };

    const clearSearchText = () => {
      classificationSearchText.value = "";
    };

    const showScrollBar = (el) => {
      el.value.scrollTop = 1;
      el.value.scrollTop = 0;
    };

    const toggleClassifications = () => {
      hideClassifications.value = !hideClassifications.value;
      if (hideClassifications.value) {
        showScrollBar(classificationsScrollContainer);
      } else {
        showScrollBar(classificationsScrollContainer);
      }
    };

    const classificationsScrollContainer = ref(null);

    const handleClassificationFilterChange = (e) => {
      const filterValue = e.target.value;
    };

    return {
      clear,
      filteredClassificationList,
      classificationsList,
      checkedValues,
      classificationSearchText,
      clearSearchText,
      handleChange,
      handleClassificationsSearch,
      hideClassifications,
      classificationFilterCheckboxes,
      classificationFilterOptionsData,
      toggleClassifications,
      classificationsScrollContainer,
      handleClassificationFilterChange,
    };
  },
  mounted() {},
});
</script>

<style lang="less" module></style>
