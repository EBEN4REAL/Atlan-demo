


<template>
  <Select
    :loading="loading"
    :list="list"
    mode="multiple"
    class="w-full"
    placeholder="Search Groups"
    optionLabelProp="id"
    :filter-option="false"
    :maxTagTextLength="15"
    :listAsync="handleSearch"
    @change="handleChange"
  >
    <template v-slot:default="slotProps">
      <template v-for="item in slotProps.list" :key="item.id">
        <a-select-option :value="item.id">
          <div class="flex flex-col">
            <div>{{ item.label }}</div>
            <div class="text-xs text-gray-500">{{ item.id }}</div>
          </div>
        </a-select-option>
      </template>
    </template>
  </Select>
</template>
    
<script lang="ts">
import { defineComponent } from "vue";
import Select from "@common/selector/index.vue";
import qs from "qs";

import { Group } from "~/api/auth/group";
import KeycloakMixin from "~/mixins/keycloak";
import { SelectArray } from "~/types";

export default defineComponent({
  name: "HelloWorld",
  mixins: [KeycloakMixin],
  components: {
    Select,
  },
  props: {},
  data() {
    return {
      loading: false,
      list: [] as SelectArray,
      cancelToken: null,
    };
  },
  emits: ["change"],
  mounted() {
    this.handleSearch("");
  },
  methods: {
    async handleSearch(value: any) {
      if (this.loading && this.cancelToken) {
        this.cancelToken.cancel("Operation canceled by the user.");
      } else {
        this.cancelToken = this.$axios.CancelToken.source();
      }
      try {
        let tempList: SelectArray = [];
        this.loading = true;
        let params = {};
        let options = {};

        console.log(this);

        if (value === "") {
          params = {
            limit: 5,
            sort: "name",
            columns: ["name"],
          };
          options = {
            cache: true,
            cancelToken: this.cancelToken.token,
            paramsSerializer: (p: any) =>
              qs.stringify(p, { arrayFormat: "repeat" }),
          };
        } else {
          params = {
            limit: 5,
            filter: {
              $or: [
                { name: { $ilike: `%${value}%` } },
                { alias: { $ilike: `%${value}%` } },
              ],
            },
          };
          options = {
            cache: true,
            cancelToken: this.cancelToken.token,
          };
        }
        const response = await Group.ListV2(params, options);
        if (response.data?.records) {
          response.data?.records.forEach((element: any) => {
            tempList.push({
              id: element.name,
              label: element.name,
            });
          });
        }
        this.list = [...tempList];
        this.loading = false;
      } catch (err) {
        console.log(err);
        this.loading = false;
      }
    },
    handleChange(value: any) {
      this.$emit("change", value);
    },
  },
});
</script>
    
    
    
  <style lang="less" module>
</style>
    