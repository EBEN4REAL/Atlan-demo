<template>
  <div class="flex flex-col w-full h-full">
    <Loader v-if="loading"></Loader>
    <ErrorView v-else-if="!loading && error" :error="error"></ErrorView>
    <div v-else class="h-full">
      <div class="px-4 py-3 bg-white border-b">
        <div class="flex items-center align-middle">
          <fa icon="fal chevron-left" class="mr-1" @click="handleBack"></fa>
          <img :src="logo(item)" class="w-auto h-5 mr-2" />
          <div class="text-gray-900">{{ title(item) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
import { defineComponent } from "vue";
import { Components } from "~/api/atlas/client";
import { Search } from "~/api/atlas/search";
import { ConnectionAttributes } from "~/constant/projection";
import Loader from "@common/loaders/page.vue";
import ErrorView from "@common/error/index.vue";
import ConnectionMixin from "~/mixins/connection";

export default defineComponent({
  name: "HelloWorld",
  mixins: [ConnectionMixin],
  components: { Loader, ErrorView },
  props: {
    selected: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      cancelToken: null,
      item: {},
    };
  },
  watch: {
    "$route.params.id": {
      handler: function (search) {
        this.handleSearch();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {},
  mounted() {},
  methods: {
    handleBack() {
      this.$router.push("/connections");
    },
    async handleSearch() {
      try {
        if (this.loading && this.cancelToken) {
          this.cancelToken?.cancel("CANCELLED");
        } else {
          this.loading = true;
          this.error = "";
          this.cancelToken = this.$axios.CancelToken.source();
        }
        const id = this.$route.params.id;
        console.log(id);
        let body: Components.Schemas.SearchParameters = {
          typeName: "AtlanConnection",
          excludeDeletedEntities: true,
          includeClassificationAttributes: true,
          includeSubClassifications: true,
          includeSubTypes: false,
          limit: 1,
          offset: 0,
          attributes: ConnectionAttributes,
          entityFilters: {
            condition: "AND",
            criterion: [
              {
                operator: "eq",
                attributeName: "__guid",
                attributeValue: id as string,
              },
            ],
          },
        };
        const res = await Search.Basic(body, {
          cache: true,
          cancelToken: this.cancelToken.token,
        });
        if (res?.data?.entities) {
          this.item = res.data.entities[0];
        } else {
          this.item = {};
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        if (error?.message === "CANCELLED") {
          this.error = "";
        } else {
          this.error = error;
        }
      }
    },
    handlePreview(selectedItem: any) {},
  },
});
</script>
    
<style lang="less" module>
</style>
        
    
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>