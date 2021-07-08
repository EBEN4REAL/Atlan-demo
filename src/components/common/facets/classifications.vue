<template>
  <div>
    <a-input
      ref="searchText"
      v-model:value="classificationSearchText"
      @change="handleClassificationsSearch"
      type="text"
      class="bg-white shadow-none form-control border-right-0"
      placeholder="Search classifications"
    >
      <template #suffix>
        <fa
          v-if="classificationSearchText"
          @click="clearSearchText"
          icon="fal times-circle"
          class="ml-2 mr-1 text-red-600"
        />
        <fa
          v-if="!classificationSearchText"
          icon="fal search"
          class="ml-2 mr-1 text-gray-500"
        />
      </template>
    </a-input>
    <div class="mt-3">
      <a-checkbox-group
        v-model:value="checkedValues"
        @change="handleChange"
        class="w-full"
      >
        <div class="flex flex-col w-full " v-if="classificationsList">
          <div v-if="classificationSearchText === ''">
            <template v-for="item in classificationsList" :key="item?.name">
              <a-checkbox
                :value="item.name"
                class="w-full mb-2"
                v-if="item?.displayName"
              >
                <span class="mb-0 ml-1 text-gray-500 truncated">
                  {{ item?.displayName }}
                </span>
              </a-checkbox>
            </template>
          </div>
          <div v-else>
            <template
              v-for="item in filteredClassificationList"
              :key="item?.guid"
            >
              <a-checkbox
                :value="item.guid"
                class="w-full mb-2"
                v-if="item?.displayName"
              >
                <span class="mb-0 ml-1 text-gray-500 truncated">
                  {{ item?.displayName }}
                </span>
              </a-checkbox>
            </template>
          </div>
        </div>
        <div v-else class="w-full h-4">
          <p class="text-center text-gray-500">{{ ShowFetchStatusString }}</p>
        </div>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from "vue";
import { Collapse } from "~/types";
import { Components } from "~/api/atlas/client";
import { Classification } from "~/api/atlas/classification";
import { useDiscoveryStore } from "~/pinia/discovery";

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
    modelValue: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  mounted() {},
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const store = useDiscoveryStore();
    let classificationsList = computed(() => store.classifications);
    const filteredClassificationList = ref([]);
    const fetchClassificationStatus = ref("");

    // classification Fetch Status
    const ShowFetchStatusString = computed(() => {
      switch (fetchClassificationStatus.value) {
        case "success": {
          return "success";
        }
        case "error": {
          return "Something went wrong!";
        }
        default: {
          return "Loading...";
        }
      }
    });

    const checkedValues = ref([]);
    checkedValues.value = props.modelValue;
    const handleChange = (checkedValue: string) => {
      emit("update:modelValue", checkedValues.value);
      console.log(checkedValues.value, "checked");

      let criterion: Components.Schemas.FilterCriteria[] = [];
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
          criterion: criterion,
        } as Components.Schemas.FilterCriteria,
      });
    };

    // will be called from parent to clear the filter
    const clear = () => {
      checkedValues.value = [];
      handleChange("");
    };

    // classification Search
    const classificationSearchText = ref("");
    const handleClassificationsSearch = (e: any) => {
      let searchText = e.target.value;
      filteredClassificationList.value = classificationsList.value.filter(
        (classification) =>
          classification.displayName.toLowerCase().includes(searchText)
      );
    };

    const clearSearchText = () => {
      classificationSearchText.value = "";
    };

    return {
      clear,
      filteredClassificationList,
      ShowFetchStatusString,
      fetchClassificationStatus,
      classificationsList,
      checkedValues,
      classificationSearchText,
      clearSearchText,
      handleChange,
      handleClassificationsSearch,
    };
  },
});
</script>

<style lang="less" module></style>
