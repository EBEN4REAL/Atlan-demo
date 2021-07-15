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
        <DynamicInput
          :dataType="item.type"
          v-if="item.isInput"
          v-model="item.operand"
          @change="handleOperandChange(index)"
        ></DynamicInput>
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
import { Components } from "~/api/atlas/client";

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
    data: {
      type: Object,
      required: false,
      default() {
        return [];
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
    let list = ref([...props.data.list]);

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
      handleChange();
    };

    const handleOperatorChange = (index) => {
      let selected = list.value[index].operator;

      if (selected?.length > 0) {
        const found = options.value.find((op) => op.value === selected[0]);
        list.value[index].type = found?.type;
        const foundOperator = OperatorList.find(
          (op) => op.value === selected[1]
        );
        list.value[index].isInput = foundOperator?.isInput;
        if (!list.value[index].isInput) {
          handleChange();
        }
      }
    };

    const handleOperandChange = (index) => {
      console.log(list.value[index]);
      let selected = list.value[index].operand;
      console.log(selected);
      handleChange();
    };

    const handleChange = () => {
      let criterion: Components.Schemas.FilterCriteria[] = [];
      console.log(list.value, "listt");

      list.value.forEach((element) => {
        console.log(element);
        if (!element.isInput) {
          criterion.push({
            attributeName: element.operator[0],
            operator: element.operator[1],
          });
        } else {
          if (element.operand !== "") {
            criterion.push({
              attributeName: element.operator[0],
              operator: element.operator[1],
              attributeValue: element.operand,
            });
          }
        }
      });

      emit("change", {
        id: props.item.id,
        payload: {
          condition: "AND",
          criterion: criterion,
        } as Components.Schemas.FilterCriteria,
      });
    };

    const clear = () => {
      list.value = [];
      handleChange();
    };

    return {
      options,
      list,
      handleAdd,
      handleRemove,
      handleOperatorChange,
      handleOperandChange,
      clear,
    };
  },
});
</script>
