<template>
  <a-modal
    :visible="showEditModal"
    :destroyOnClose="true"
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
      <p
        v-if="updateClassificationError"
        class="mt-4 mb-0 text-sm text-red-500"
      >
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
  watch,
  toRaw,
} from "vue";
import { useClassificationStore } from "~/pinia/classifications";

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
    const updateClassificationStatus = computed(
      () => store.updateClassificationStatus
    );

    const selectedClassification = computed(() => {
      return props.classification;
    });
    const showEditModal = computed(() => props.open);

    //edit modal
    const updateClassificationError = ref("");
    const editClassificationFormRef = ref(null);

    // let editFormState: UnwrapRef<FormState> = computed(() => {
    //   return {
    //     displayName:
    //       selectedClassification.value.displayName ||
    //       selectedClassification.value.name,
    //     description: selectedClassification.value.description,
    //   };
    // });

    let editFormState: UnwrapRef<FormState> = ref({
      displayName:
        selectedClassification.value.displayName ||
        selectedClassification.value.name,
      description: selectedClassification.value.description,
    });

    watch(selectedClassification, () => {
      editFormState.value.displayName =
        selectedClassification.value.displayName;
      editFormState.value.description =
        selectedClassification.value.description;
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
      editClassificationFormRef.value
        .validate()
        .then(() => {
          let params = {
            description: editFormState.value.description || "-",
            attributeDefs: selectedClassification.value.attributeDefs,
            superTypes: selectedClassification.value.superTypes,
            displayName: editFormState.value.displayName,
            name: selectedClassification.value.name,
          };
          store.updateClassificationListById(params).then(
            (resolve) => {
              context.emit("close");
            },
            (error) => {
              updateClassificationError.value =
                error.response.data.errorMessage;
              resetRef(updateClassificationError, 6000);
              console.log("WTF: handleUpdateDescription -> error", error);
            }
          );
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
