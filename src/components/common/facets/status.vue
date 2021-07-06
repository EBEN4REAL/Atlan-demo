<template>
  <a-checkbox-group
    v-model:value="checkedValues"
    @change="handleChange"
    class="w-full"
  >
    <div class="flex flex-col w-full">
      <template v-for="item in list" :key="item.id">
        <a-tooltip placement="right">
          <template #title v-if="item.description">{{
            item.description
          }}</template>
          <a-checkbox :value="item.id" class="w-full">
            <span class="mb-0 ml-1 text-gray-700 truncated">
              <fa :icon="item.icon" class="mr-1" :class="item.iconClass" />{{
                item.label
              }}
            </span>
          </a-checkbox>
        </a-tooltip>
      </template>
    </div>
  </a-checkbox-group>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { Components } from "~/api/atlas/client";
import { List } from "~/constant/status";
import { Collapse } from "~/types";

export default defineComponent({
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
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const list = computed(() => {
      return List;
    });
    const checkedValues = ref([]);
    checkedValues.value = props.modelValue;
    console.log(checkedValues.value, "model");
    const handleChange = (checkedValue: string) => {
      emit("update:modelValue", checkedValues.value);

      let criterion: Components.Schemas.FilterCriteria[] = [];
      checkedValues.value.forEach((val) => {
        criterion.push({
          attributeName: "assetStatus",
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

    const clear = () => {
      checkedValues.value = [];
      handleChange("");
    };

    return {
      handleChange,
      list,
      checkedValues,
      clear,
    };
  },
});
</script>
