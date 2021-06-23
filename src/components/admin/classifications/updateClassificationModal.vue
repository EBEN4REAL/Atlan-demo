<template>
  <a-modal
    :visible="showEditModal"
    title="Edit Classification"
    :onCancel="closeEditModal"
    :footer="null"
  >
    <a-form
      ref="editClassificationFormRef"
      :model="editFormState"
      :rules="editClassificationRules"
      layout="vertical"
    >
      <a-form-item label="Name" name="displayName">
        <a-input v-model:value="editFormState.displayName" />
      </a-form-item>
      <a-form-item ref="description" label="Description" name="description">
        <a-textarea v-model:value="editFormState.description" />
      </a-form-item>
      <div class="flex justify-between w-full">
        <a-button @click="closeEditModal">Cancel</a-button>
        <a-button
          type="primary"
          @click="updateClassification"
          :loading="updateClassificationStatus === 'loading' ? true : false"
          >Update</a-button
        >
      </div>
      <p v-if="updateClassificationError" class="text-red-500">
        {{ updateClassificationError }}
      </p>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  UnwrapRef,
  reactive,
  toRaw,
} from "vue";
import { ActionTypes } from "~/store/modules/classification/types-actions";
import { useClassificationStore } from "~/pinea";

export default defineComponent({
  name: "UpdateClassification",
  props: {
    open: {
      type: Boolean,
    },
    classification: {
      type: Object,
    },
  },

  setup(props, context) {
    interface FormState {
      displayName: string;
      description: string;
    }
    const store = useClassificationStore();

    const selectedClassification = computed(() => props.classification);
    console.log(selectedClassification);
    const showEditModal = computed(() => props.open);

    //edit modal
    const updateClassificationStatus = ref("");
    const updateClassificationError = ref("");
    const editClassificationFormRef = ref(null);
    const editFormState: UnwrapRef<FormState> = reactive({
      displayName: selectedClassification.value.alias,
      description: selectedClassification.value.description,
    });

    const editClassificationRules = {
      displayName: [
        {
          required: true,
          message: "Please input Classification name",
          trigger: "blur",
        },
      ],
    };

    const closeEditModal = () => {
      context.emit("close");
    };

    const resetRef = (ref, time) => {
      setTimeout(() => {
        ref.value = "";
      }, time);
    };
    const updateClassification = () => {
      updateClassificationStatus.value = "loading";
      editClassificationFormRef.value
        .validate()
        .then(() => {
          const formState = toRaw(editFormState);

          console.log(formState, formState.description);
          let params = {
            description: formState.description || "-",
            attributeDefs: selectedClassification.value.attributeDefs,
            superTypes: selectedClassification.value.superTypes,
            displayName: formState.displayName,
            name: selectedClassification.value.name,
          };
          updateClassificationStatus.value = "loading";
          try {
            store.updateClassificationListById(params);
            updateClassificationStatus.value = "success";
            context.emit("close");
          } catch (error) {
            updateClassificationStatus.value = "error";
            updateClassificationError.value = error.message;
            resetRef(updateClassificationError, 3000);
            console.log("WTF: handleUpdateDescription -> error", error);
          }
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log("error", error);
        });
    };

    return {
      updateClassificationError,
      editClassificationFormRef,
      updateClassification,
      showEditModal,
      updateClassificationStatus,
      editFormState,
      editClassificationRules,
      closeEditModal,
      selectedClassification,
    };
  },
});
</script>
<style lang="less" scoped></style>
