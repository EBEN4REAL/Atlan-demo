<template>
  <splitpanes class="h-full default-theme">
    <pane min-size="25" max-size="50" size="25" class="relative p-3 bg-white">
      <a-input
        ref="searchText"
        v-model:value="treeFilterText"
        @input="handleSearch"
        type="text"
        class="bg-white shadow-none form-control border-right-0"
        placeholder="Search classifications"
      >
        <template #suffix>
          <fa
            v-if="treeFilterText"
            @click="clearSearchText"
            icon="fal times-circle"
            class="ml-2 mr-1 text-red-600 "
          />
          <fa
            v-if="!treeFilterText"
            icon="fal search"
            class="ml-2 mr-1 text-gray-500 "
          />
        </template>
      </a-input>
      <div class="mt-2 overflow-y-auto treelist">
        <CreateClassificationTree
          :treeData="treeFilterText !== '' ? filteredData : treeData"
          @nodeEmit="nodeEmit"
        />
      </div>
      <div class="absolute flex justify-center w-full add-classification-btn">
        <a-button type="primary" @click="toggleModal"
          >Add Classification</a-button
        >
      </div>
    </pane>
    <pane size="74" class="flex flex-col">
      <ClassificationHeader
        :classification="selectedClassification"
        v-if="selectedClassification"
      />

      <!-- <AssetListWrapper
        class="px-0 col-10"
        :key="classificationName"
        :classificationName="classificationName"
        :assetListStyle="'height: calc(100vh - 20.3rem);'"
        style="height: calc(100% - 12.5rem);"
        :showTermsAssetToggle="true"
        :type="'classification'"
        :showLinkEntityButton="true"
        :selectedClassification="selectedClassification"
      /> -->
    </pane>

    <a-modal
      :visible="modalVisible"
      title="Add Classification"
      :onCancel="closeModal"
      :footer="null"
    >
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
        <div class="flex justify-between w-full">
          <a-button @click="closeModal">Cancel</a-button>
          <a-button
            type="primary"
            @click="createClassification"
            :loading="createClassificationStatus === 'loading' ? true : false"
            >Create</a-button
          >
        </div>
      </a-form>
      <p v-if="createErrorText" class="mt-4 mb-0 text-sm text-red-500">
        {{ createErrorText }}
      </p>
    </a-modal>
  </splitpanes>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRaw,
  UnwrapRef,
  watch,
  computed,
} from "vue";
import ConnectionTree from "@/connection/tree/index.vue";
import Loading from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import CreateClassificationTree from "@common/tree/classification/index.vue";
import ClassificationHeader from "~/components/admin/classifications/classificationHeader.vue";
import AssetListWrapper from "~/components/asset/assetListWrapper.vue";
import { useRouter } from "vue-router";
import { useClassificationStore } from "~/pinia/classifications";
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";

export default defineComponent({
  name: "ClassificationProfileWrapper",
  components: {
    ConnectionTree,
    Loading,
    ErrorView,
    CreateClassificationTree,
    ClassificationHeader,
    AssetListWrapper,
  },
  props: {
    classificationName: String,
  },
  setup(props, context) {
    const store = useClassificationStore();
    const router = useRouter();
    const createClassificationStatus = computed(
      () => store.createClassificationStatus
    );
    const modalVisible = ref(false);
    const treeFilterText = ref("");
    const createClassificationFormRef = ref();
    const classificationName = computed(() => props.classificationName);
    const createErrorText = ref("");
    interface FormState {
      name: string;
      description: string;
    }
    const treeData = computed(() => store.classificationTree);

    const filteredData = computed(() => store.filteredClassificationTree);
    const nodeEmit = (node) => {
      router.push(`/admin/classifications/${encodeURIComponent(node.name)}`);
    };
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

    const handleSearch = (e) => {
      treeFilterText.value = e.target.value;
      store.filterClassificationTree(treeFilterText.value);
    };

    const clearSearchText = () => {
      treeFilterText.value = "";
    };

    const closeModal = () => {
      modalVisible.value = false;
    };
    const resetRef = (ref, time) => {
      setTimeout(() => {
        ref.value = "";
      }, time);
    };
    const createClassification = () => {
      const payload = {
        classificationDefs: [],
      };
      const classificationObj = {
        attributeDefs: [],
        description: "",
        name: "",
        superTypes: [],
      };

      createClassificationFormRef.value
        .validate()
        .then(() => {
          classificationObj.name = formState.name;
          classificationObj.description = formState.description;
          payload.classificationDefs.push(classificationObj);
          const fromDispatch = store.createClassification(payload);
          fromDispatch
            .then((res) => {
              if (res) closeModal();
            })
            .catch((error: any) => {
              console.log("errormessage", error.response.data.errorMessage);
              createErrorText.value = error.response.data.errorMessage;
              resetRef(createErrorText, 6000);
            });
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log("error", error);
        });
    };

    const toggleModal = () => {
      modalVisible.value = !modalVisible.value;
    };
    store.getClassifications();

    const handleSelectNode = (node) => {
      console.log(node, "parent");
    };

    const classifications = computed(() => store.classifications);

    const selectedClassification: any = computed(() => {
      if (!props.classificationName) {
        return {};
      }
      if (classifications.length === 0) {
        return {};
      }
      return classifications.value.find(
        (classification) =>
          (classification.name || "") === decodeURI(props.classificationName)
      );
    });

    return {
      createErrorText,
      filteredData,
      treeData,
      clearSearchText,
      handleSearch,
      treeFilterText,
      modalVisible,
      classificationName,
      selectedClassification,
      nodeEmit,
      closeModal,
      createClassification,
      toggleModal,
      createClassificationFormRef,
      other: "",
      formState,
      rules,
      createClassificationStatus,
      handleSelectNode,
    };
  },
});
</script>
<style lang="less" scoped>
.treelist {
  height: calc(100vh - 11rem);
}
.classification-body {
  height: calc(100% - 12.5rem);
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
