

<template>
  <div class="flex flex-col space-y-2">
    <template v-for="(item, index) in list" :key="item.id">
      <div class="flex flex-col border-gray-200 space-y-1border-b">
        <div class="flex items-center mb-1">
          <a-cascader
            :options="options"
            placeholder="Please select"
            v-model:value="item.operator"
            @change="handleOperatorChange(index)"
          />
          <div
            class="ml-2 leading-none hover:text-red-500"
            @click="handleRemove(index)"
          >
            <fa icon="fal times-circle"></fa>
          </div>
        </div>
        <DynamicInput :dataType="item.type" v-if="item.isInput"></DynamicInput>
      </div>
    </template>
  </div>
  <a-button block size="small" @click="handleAdd" class="mt-2"
    ><fa icon="fal plus"></fa
  ></a-button>
</template>
    
<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";

import DynamicInput from "@common/input/dynamic.vue";

import {
  AdvancedAttributeList,
  OperatorList,
} from "~/constant/advancedAttributes";
import { Collapse } from "~/types";

export default defineComponent({
  components: {
    DynamicInput,
  },
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
    let list = ref([]);

    let options = ref([]);
    AdvancedAttributeList.forEach((item) => {
      let temp = item;
      temp.children = OperatorList.filter((op) =>
        op.allowedType.includes(item.type)
      );
      options.value.push(temp);
    });
    const handleAdd = () => {
      list.value.push({
        id: Date.now(),
      });
    };
    const handleRemove = (index) => {
      list.value.splice(index, 1);
    };

    const handleOperatorChange = (index) => {
      let selected = list.value[index].operator;
      console.log(selected);
      if (selected?.length > 0) {
        const found = options.value.find((op) => op.value === selected[0]);
        list.value[index].type = found?.type;
        const foundOperator = OperatorList.find(
          (op) => op.value === selected[1]
        );
        list.value[index].isInput = foundOperator?.isInput;
      }
    };
    // const attributeList = computed(() => {
    //   let temp = [];
    //   AdvancedAttributeList.forEach((item) => {
    //     item?.children = OperatorList.filter((op) =>
    //       op.allowedType.includes(item.typeName)
    //     );
    //   });
    //   return AdvancedAttributeList;
    // });

    // const checkedValues = ref([]);
    // checkedValues.value = props.modelValue;
    // const handleChange = (checkedValue: string) => {
    //   emit("update:modelValue", checkedValues.value);
    //   emit("change", {
    //     id: props.item.id,
    //     payload: [checkedValues.value],
    //   });
    // };
    return {
      options,
      list,
      handleAdd,
      handleRemove,
      handleOperatorChange,
    };
  },
});
</script>