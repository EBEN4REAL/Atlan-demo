<template>
  <div>
    <a-input
      ref="searchText"
      v-model:value="classificationSearchText"
      @input="handleClassificationsSearch"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { Collapse } from "~/types";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  name: "HelloWorld",
  components: {},
  props: {
    item: {
      type: Object as PropType<Collapse>,
      required: false,
      default() {
        return {};
      },
    },
    user: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    group: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
  },
  mounted() {},
  emits: ["change"],
  setup(props, { emit }) {
    const userValue = ref("");
    userValue.value = props.user;

    const groupValue = ref("");
    groupValue.value = props.group;

    const handleUsersChange = (selectedValues: string) => {
      emit("update:user", selectedValues);
      handleChange();
    };
    const handleGroupsChange = (selectedValues: string) => {
      emit("update:group", selectedValues);
      handleChange();
    };
    const handleChange = () => {
      let criterion: Components.Schemas.FilterCriteria[] = [];

      if (userValue.value) {
        criterion.push({
          attributeName: "ownerUsers",
          attributeValue: userValue.value,
          operator: "contains",
        });
      }
      if (groupValue.value) {
        criterion.push({
          attributeName: "ownerGroups",
          attributeValue: groupValue.value,
          operator: "contains",
        });
      }
      emit("change", {
        id: props.item.id,
        payload: {
          condition: "OR",
          criterion: criterion,
        } as Components.Schemas.FilterCriteria,
      });
    };

    const clear = () => {
      userValue.value = "";
      groupValue.value = "";
      handleChange();
    };

    // classification Search
    const classificationSearchText = ref("");
    const handleClassificationsSearch = (searchText: string) => {};
    const clearSearchText = () => {
      classificationSearchText.value = "";
    };

    return {
      clearSearchText,
      classificationSearchText,
      handleClassificationsSearch,
      handleChange,
      handleUsersChange,
      handleGroupsChange,
      userValue,
      groupValue,
      clear,
    };
  },
});
</script>

<style lang="less" module></style>
