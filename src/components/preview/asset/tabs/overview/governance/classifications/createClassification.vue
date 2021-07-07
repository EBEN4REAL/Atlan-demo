<template>
  <p class="pb-1 text-lg text-gray-500 border-b">Create Classification</p>
  <a-form
    ref="createClassificationFormRef"
    :model="formState"
    :rules="rules"
    layout="vertical"
  >
    <a-form-item ref="name" label="Name" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item ref="description" label="Description" name="description">
      <a-textarea v-model:value="formState.description" />
    </a-form-item>
  </a-form>
  <p v-if="createErrorText" class="mt-4 mb-0 text-sm text-red-500">
    {{ createErrorText }}
  </p>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  UnwrapRef,
  watch,
  computed,
} from "vue";
import { Classification } from "~/api/atlas/classification";

export default defineComponent({
  props: {},
  setup(props) {
    interface FormState {
      name: string;
      description: string;
    }
    const createClassificationStatus = ref("");
    const createErrorText = ref("");
    const createClassificationFormRef = ref();

    const formState: UnwrapRef<FormState> = reactive({
      name: "",
      description: "",
    });
    const rules = {
      name: [
        {
          required: true,
          message: "Please input Classification name",
          trigger: "blur",
        },
      ],
    };

    return {
      createErrorText,
      createClassificationStatus,
      rules,
      formState,
    };
  },
});
</script>

<style lang="less" module>
.borderless {
  @apply border-none shadow-none px-4 !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  &:global(.ant-input-affix-wrapper-focused) {
    @apply border-none shadow-none;
  }
}
:global(.ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
  @apply hidden;
}
// Aesterik in right side
:global(.ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
  display: inline-block;
  margin-left: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: "*";
}
</style>
