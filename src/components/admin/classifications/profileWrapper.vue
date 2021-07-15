<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import ConnectionTree from "@/connection/tree/index.vue";
import Loading from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import CreateClassificationTree from "@common/tree/classification/index.vue";
import ClassificationHeader from "~/components/admin/classifications/classificationHeader.vue";
import AssetListWrapper from "~/components/asset/assetListWrapper.vue";
import { useRouter } from "vue-router";
import { useClassificationStore } from "./_store";

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
    const modalVisible = ref(false);
    const createClassificationStatus = ref("");
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

    const toggleModal = () => {
      modalVisible.value = !modalVisible.value;
    };

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
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      handleClickUser,
      createClassificationStatus,
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
      handleSelectNode,
    };
  },
});
</script>
<style lang="less" scoped>
.treelist {
  height: calc(100vh - 18rem);
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
