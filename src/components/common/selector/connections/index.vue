<template>
  <a-select
    :value="modelValue"
    placeholder="Connections"
    :show-search="true"
    :autoClearSearchValue="true"
    @search="handleSearch"
    :allowClear="true"
    :filterOption="false"
    @change="handleChange"
  >
    <template v-for="item in filteredList" :key="item.guid">
      <a-select-option :value="item.guid">
        <div class="flex items-center">
          <img
            :src="logo(item?.attributes?.integrationName)"
            class="w-auto h-3 mr-1"
          />{{ item.attributes.name }}
        </div>
      </a-select-option>
    </template>
  </a-select>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Select from "@common/selector/index.vue";
import SourceMixin from "~/mixins/source";

import fetchConnectionList from "~/composables/connection/fetchConnectionList";

export default defineComponent({
  mixins: [SourceMixin],
  props: {
    modelValue: {
      type: String,
      required: false,
    },
  },
  components: {
    Select,
  },
  computed: {
    localList() {},
  },
  data() {
    return {
      localList: [] as any[],
    };
  },
  setup() {
    let now = ref(true);
    let searchValue = ref("");
    const { list } = fetchConnectionList(now);

    const filteredList = computed(() => {
      console.log(searchValue);
      return list?.value.filter((item) =>
        item?.attributes?.name
          ?.toLowerCase()
          .includes(searchValue.value.toLowerCase())
      );
    });

    const handleSearch = (inputValue) => {
      // update `props.user` to `user.value` to access the Reference value
      searchValue.value = inputValue;
    };

    console.log(filteredList);

    return {
      list,
      filteredList,
      handleSearch,
    };
  },
  // mounted() {
  //   this.list = WorkflowTypeList;
  // },
  emits: ["update:modelValue", "change"],
  methods: {
    handleChange(checkedValues: string) {
      console.log(checkedValues);
      this.$emit("update:modelValue", checkedValues);
      this.$emit("change", checkedValues);
    },
    clear() {},
  },
});
</script>
