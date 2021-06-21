import { TreeDataItem } from "ant-design-vue/lib/tree/Tree";
import { computed, ComputedRef, ref, Ref, toRefs, watch } from "vue";
import { Components } from "~/api/atlas/client";
import { Glossary } from "~/api/atlas/glossary";
import { Search } from "~/api/atlas/search";

import BasicSearch from "~/composables/common/basicsearch";
import { BaseAttributes, GlossaryAttributes } from "~/constant/projection";
import { GlossaryType } from "~/types/atlas/glossary";
import axios from "axios";

export default function useClassificationTree(
  list: ComputedRef<GlossaryType[] | undefined>
) {
  const treeData = ref<TreeDataItem[]>([]);
  watch(list, (newValue, oldValue) => {
    treeData.value = list.value?.map((item) => {
      return {
        key: item.guid,
        title: item.name,
        type: "classification",
        isRoot: true,
      };
    }) as TreeDataItem[];
  });

  return {
    treeData,
  };
}
