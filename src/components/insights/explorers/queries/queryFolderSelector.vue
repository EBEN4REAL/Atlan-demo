<template>
    <a-tree-select
        tree-data-simple-mode
        placeholder="Select folder"
        v-model:value="selectedFolder"
        :tree-data="treeData"
        :treeCheckStrictly="true"
        :dropdown-style="{ overflow: 'auto', maxHeight: '256px', maxWidth: '220px', position: 'relative', boxShadow: 'none' }"
        size="small"
        @select="onSelect"
    />
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch, PropType, Ref, onBeforeMount } from "vue";
import { TreeDataItem } from "ant-design-vue/lib/tree/Tree";

import { Folder } from "~/types/insights/savedQuery.interface";

import useLoadQueryData from '@/insights/explorers/queries/composables/useLoadQueryData'

export default defineComponent({
  props: {
    selectedFolderQF: {
      type: String,
      required: false,
      default: '',
    },
    connector: {
      type: String as PropType<string | undefined>,
      required: true,
      default: '',
    },
    savedQueryType: {
        type: String as PropType<'personal' | 'all'>,
        required: true,
        default: 'personal'
    }
  },
  emits: ['folderChange'],
  setup(props, { emit }) {
    const { selectedFolderQF, connector, savedQueryType } = toRefs(props);

    const { getAllQueryFolders } = useLoadQueryData({connector, savedQueryType});

    const allFolders = ref<Folder[]>([]);
    const treeData = ref<TreeDataItem[]>([{
        id: 'root',
        pId: 0,
        value: 'root',
        title: 'Root Level',
    }]);
    const selectedFolder = ref('root')

    const onSelect = (value, node) => {
        emit('folderChange', node.dataRef.item)
    }
    
    watch([savedQueryType, connector, props], async () => {
        const foldersResponse = await getAllQueryFolders();

        if(foldersResponse.entities){
            allFolders.value = foldersResponse.entities
        }
    })

    getAllQueryFolders().then((foldersResponse) => {
        if(foldersResponse.entities){
            allFolders.value = foldersResponse.entities
        }
    })

    // onBeforeMount(async () => {
    // })

    watch(allFolders, (newAllFolders) => {
        treeData.value = [{
            id: 'root',
            pId: 0,
            value: 'root',
            title: 'Root Level',
        }]
        newAllFolders.map((folder) => {
            treeData.value.push({
                id: folder.attributes.qualifiedName ?? '',
                pId: folder.attributes.parentFolderQualifiedName ?? 0,
                value: folder.attributes.qualifiedName,
                title: folder.displayText ?? '',
                item: folder
                // isLeaf: folder.attributes.columns,
            })
        });

        selectedFolder.value = selectedFolderQF.value ?? 'root'
    })
    watch(selectedFolderQF, (newSlectedFolderQF) => {
        selectedFolder.value = newSlectedFolderQF
    })
    return {
        onSelect,
        selectedFolder,
        treeData
    };
  },
});
</script>