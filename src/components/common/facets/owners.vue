<template>
  <div>
    <p class="mb-1 text-xs text-gray-500">Users</p>
    <Users v-model:value="userValue" @change="handleChange"></Users>
  </div>
  <div class="mt-2">
    <p class="mb-1 text-xs text-gray-500">Groups</p>
    <Groups v-model:value="groupValue" @change="handleGroupsChange"></Groups>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import Groups from "@common/selector/groups/index.vue";
import Users from "@common/selector/users/index.vue";
import { Collapse } from "~/types";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  name: "HelloWorld",
  components: {
    Groups,
    Users,
  },
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
    data: {
      type: Object,
      required: false,
      default() {
        return {};
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
  emits: ["change"],
  setup(props, { emit }) {
    const userValue = ref("");
    userValue.value = props.user || props.data.userValue;
    const groupValue = ref("");
    groupValue.value = props.group || props.data.groupValue;

    const handleUsersChange = (selectedValues: string) => {
      emit("update:user", selectedValues);
      handleChange();
    };
    const handleGroupsChange = (selectedValues: string) => {
      emit("update:group", selectedValues);
      handleChange();
    };
    const handleChange = () => {
      const criterion: Components.Schemas.FilterCriteria[] = [];

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
          criterion,
        } as Components.Schemas.FilterCriteria,
      });
    };

    const clear = () => {
      userValue.value = "";
      groupValue.value = "";
      handleChange();
    };

    return {
      handleChange,
      handleUsersChange,
      handleGroupsChange,
      userValue,
      groupValue,
      clear,
    };
  },
  mounted() {},
});
</script>

<style lang="less" module></style>
