<template>
  <a-select
    :value="modelValue"
    :show-search="true"
    :filterOption="true"
    style="width: 100%"
    :allowClear="true"
    @change="handleChange"
    @search="handleSearch"
  >
    <a-select-opt-group key="me" label="Me">
      <a-select-option :value="username">
        <div class="flex flex-col">
          <div>{{ name }}</div>
          <div class="text-xs text-gray-500">{{ username }}</div>
        </div>
      </a-select-option>
    </a-select-opt-group>
    <a-select-opt-group key="Users" label="Users">
      <template v-for="options in list" :key="options.username">
        <a-select-option :value="options.username">
          <div class="flex flex-col">
            <div>{{ options.first_name }} {{ options.last_name }}</div>
            <div class="text-xs text-gray-500">{{ options.username }}</div>
          </div>
        </a-select-option>
      </template>
    </a-select-opt-group>
  </a-select>
</template>
      
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import fetchUserList from "~/composables/user/fetchUserList";
import whoami from "~/composables/user/whoami";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    let now = ref(true);
    let params = ref({});
    let debounce: any = null;

    // this is needed as there are multiple keys with the same param name
    const urlparam = new URLSearchParams();
    urlparam.append("limit", "10");
    urlparam.append("sort", "first_name");
    urlparam.append("columns", "first_name");
    urlparam.append("columns", "last_name");
    urlparam.append("columns", "username");

    params.value = urlparam;
    const { list, mutate } = fetchUserList(now, params);
    const { username, name } = whoami();

    const handleSearch = (val: string) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        params.value.set(
          "filter",
          JSON.stringify({
            $or: [
              { first_name: { $ilike: `%${val}%` } },
              { last_name: { $ilike: `%${val}%` } },
              { username: { $ilike: `%${val}%` } },
            ],
          })
        );
        mutate();
      }, 200);
    };
    const handleChange = (checkedValues: string) => {
      emit("update:modelValue", checkedValues);
      emit("change", checkedValues);
    };

    return {
      list,
      username,
      name,
      handleSearch,
      handleChange,
    };
  },
  methods: {
    // handleSearch(value: any) {
    //   if (this.listAsync) {
    //     clearTimeout(this.debounce);
    //     this.debounce = setTimeout(() => {
    //       this.listAsync(value);
    //     }, 100);
    //   }
    // },
    // handleChange(values: any) {
    //   if (!this.forceClear) {
    //     this.$emit("change", values);
    //   } else {
    //     this.forceClear = false;
    //   }
    // },
    // clear() {
    //   this.forceClear = true;
    //   this.selected = null;
    // },
  },
});
</script>
      
<style lang="less" module>
</style>

   