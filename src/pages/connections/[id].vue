<template>
  <Loader v-if="loading"></Loader>
  <ErrorView v-else-if="!loading && error" :error="error"></ErrorView>
  <div class="flex flex-col w-full h-full" v-else>
    <div class="px-4 pt-3 bg-white">
      <div class="">
        <div class="flex items-center align-middle">
          <fa
            icon="fal chevron-left"
            class="mr-1 text-xl text-gray-400"
            @click="handleBack"
          ></fa>
          <img
            :src="logo(item?.attributes?.integrationName)"
            class="w-auto h-5 mr-2"
          />
          <div class="text-lg text-gray-900">
            {{ item?.attributes?.displayName }}
          </div>
        </div>
      </div>
      <div>
        <a-tabs :class="$style.topbar" v-model:activeKey="selectedTab">
          <a-tab-pane key="overview" tab="Overview"></a-tab-pane>
          <a-tab-pane key="workflows" tab="Workflows"></a-tab-pane>
          <a-tab-pane key="assets" tab="Assets"></a-tab-pane>
          <a-tab-pane key="policies" tab="Policies"></a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="flex-grow overflow-auto">
      <component
        :is="selectedTab"
        :item="item"
        :bot="bot"
        :credential="credential"
        :loading="isLoading"
        :syncing="isValidating"
      ></component>
      <!-- <Overview :item="item" :credential="credential" :bot="bot"></Overview> -->
    </div>
  </div>
</template>
    
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import Loader from "@common/loaders/page.vue";
import ErrorView from "@common/error/index.vue";
import SourceMixin from "~/mixins/source";

import Overview from "@/connection/overview/index.vue";
import Workflows from "@/connection/workflows/index.vue";
import Assets from "@/connection/assets/index.vue";
import Policies from "@/connection/policies/index.vue";

import { useRoute } from "vue-router";

import useBotList from "~/composables/bots/useBotList";
import useCredentialList from "~/composables/bots/useCredentialList";

import useBotCredentialList from "~/composables/bots/useBotCredentialList";

import { useConnectionsStore } from "~/pinia/connections";
import { Components } from "~/api/atlas/client";
import useConnectionsList from "~/composables/bots/useConnectionList";
import useConnectionRefresh from "~/composables/bots/useConnectionRefresh";

export default defineComponent({
  mixins: [SourceMixin],
  components: { Loader, ErrorView, Overview, Workflows, Assets, Policies },
  data() {
    return {
      loading: false,
      error: "",
      selectedTab: "overview",
      cancelToken: null,
    };
  },
  setup(props, { emit }) {
    const route = useRoute();
    const store = useConnectionsStore();
    const item = computed(() => {
      return store.getList?.find((item) => item.guid === route.params.id);
    });

    const now = ref(false);
    let defaultBody = reactive({});
    const { list, replaceFilters, isLoading, isValidating } =
      useBotCredentialList(now, defaultBody, "FETCH_BOTS_ITEM");

    watch(
      () => route.params.id,
      () => {
        replaceFilters({
          condition: "OR",
          criterion: [
            {
              operator: <Components.Schemas.Operator>"eq",
              attributeName: "qualifiedName",
              attributeValue: item.value?.attributes.botQualifiedName,
            },
            {
              operator: <Components.Schemas.Operator>"eq",
              attributeName: "qualifiedName",
              attributeValue:
                item.value?.attributes.integrationCredentialQualifiedName,
            },
          ],
        });
        if (!now.value) {
          now.value = true;
        }
      },
      { immediate: true }
    );

    const bot = computed(() => {
      return list.value.find((item) => item.typeName === "Bot");
    });

    const credential = computed(() => {
      return list.value.find((item) => item.typeName === "Credential");
    });

    return {
      item,
      defaultBody,
      credential,
      bot,
      store,
      list,
      isLoading,
      isValidating,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    handleBack() {
      this.$router.push("/connections");
    },
    handlePreview(selectedItem: any) {},
  },
});
</script>
    
<style lang="less" module>
.topbar {
  :global(.ant-tabs-top-bar) {
    @apply mb-0 !important;
  }
}
</style>
        
    
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>