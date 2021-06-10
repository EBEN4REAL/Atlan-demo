<template>
  <div class="flex flex-col h-screen p-4">
    <AddEnumModal
      v-if="addModalVisible"
      @add="addToList"
      @close="() => (addModalVisible = false)"
    />
    <div class="mb-4">
      <div class="text-xl">Enumerations</div>
    </div>
    <div class="flex items-center justify-between">
      <p>Search Enumerations</p>
      <a-button @click="() => (addModalVisible = true)" type="primary">
        + New
      </a-button>
    </div>

    <div v-if="selectedId" class="flex flex-grow py-4 overflow-y-auto">
      <div class="flex-shrink-0 overflow-y-auto w-80">
        <EnumList :list="enumListData" v-model:selected="selectedId" />
      </div>
      <div class="flex-grow ml-4 overflow-y-auto">
        <EnumDetails
          v-model:selectedEnum="selectedEnum"
          v-if="selectedId"
          :key="selectedId"
        />
        <span v-else>No Enum Selected</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import useEnums from "@/admin/enums/composables/useEnums";
import EnumList from "@/admin/enums/enumList.vue";
import EnumDetails from "@/admin/enums/enumDetails.vue";
import AddEnumModal from "@/admin/enums/addEnumModal.vue";

export default defineComponent({
  components: { EnumList, EnumDetails, AddEnumModal },
  setup(props, context) {
    const { enumListData } = useEnums();
    const currentEnumId = ref("");
    const addModalVisible = ref(false);

    const selectedId = computed({
      get: () => currentEnumId.value || enumListData.value?.[0]?.guid,
      set: (val) => {
        currentEnumId.value = val;
      },
    });

    const selectedEnum = computed({
      get: () =>
        enumListData.value?.find(
          (enumObj) => enumObj.guid === selectedId.value
        ),
      set: (updatedEnum) => {
        const idx = enumListData.value.findIndex(
          (enumObj) => enumObj.guid === updatedEnum.guid
        );
        enumListData.value[idx] = updatedEnum;
      },
    });

    return { enumListData, addModalVisible, selectedId, selectedEnum };
  },
});
</script>
