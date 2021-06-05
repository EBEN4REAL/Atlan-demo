


<template>
  <Select
    :loading="loading"
    :list="list"
    mode="multiple"
    class="w-full"
    placeholder="Search Users"
    optionLabelProp="id"
    :filter-option="false"
    :maxTagTextLength="15"
    :listAsync="handleSearch"
    @change="handleChange"
  >
    <template v-slot:default="slotProps">
      <a-select-opt-group
        v-for="item in slotProps.list"
        :key="item.label"
        :label="item.label"
      >
        <template v-for="options in item.list" :key="options.id">
          <a-select-option :value="options.id">
            <div class="flex flex-col">
              <div>{{ options.label }}</div>
              <div class="text-xs text-gray-500">{{ options.id }}</div>
            </div>
          </a-select-option>
        </template>
      </a-select-opt-group>
    </template>
  </Select>
</template>
    
<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import Select from "@common/selector/index.vue";
import qs from "qs";

import { User } from "~/api/auth/user";
import KeycloakMixin from "~/mixins/keycloak";
import { SelectArray } from "~/types";
import { getAxiosClient } from "~/api";

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
      cancelToken: null as any,
    };
  },
  mounted() {
    this.handleSearch("");
  },
  emits: ["change"],
  methods: {
    async handleSearch(value: any) {
      if (this.loading && this.cancelToken) {
        this.cancelToken.cancel("Operation canceled by the user.");
      } else {
        this.cancelToken = this.$axios.CancelToken.source();
      }

      try {
        this.loading = true;
        let tempList: SelectArray = [];
        let params = {};
        let options = {};
        if (value == "") {
          tempList.push({
            id: "me",
            label: "Me",
            list: [
              {
                id: this.username,
                label: this.name,
              },
            ],
          });
          params = {
            limit: 5,
            sort: "first_name",
            columns: ["first_name", "last_name", "username"],
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
                { first_name: { $ilike: `%${value}%` } },
                { last_name: { $ilike: `%${value}%` } },
                { username: { $ilike: `%${value}%` } },
              ],
            },
          };
          options = {
            cache: true,
            cancelToken: this.cancelToken.token,
          };
        }

        const resp = await User.ListV2(params, options);
        if (resp.data?.records) {
          const users: SelectArray = [];
          resp.data?.records.forEach((element: any) => {
            users.push({
              id: element.username,
              label: `${element.first_name} ${element.last_name}`,
            });
          });
          tempList.push({
            id: "users",
            label: "Users",
            list: users,
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
    