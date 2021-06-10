<template>
  <Loader v-if="loading"></Loader>
  <ErrorView v-else-if="!loading && error" :error="error"></ErrorView>
  <div class="flex flex-col w-full h-full" v-else>
    <div class="px-4 pt-3 bg-white">
      <div class="">
        <div class="flex items-center align-middle">
          <fa icon="fal chevron-left" class="mr-1" @click="handleBack"></fa>
          <img
            :src="logo(item?.attributes?.integrationName)"
            class="w-auto h-5 mr-2"
          />
          <div class="text-gray-900">{{ item?.attributes?.name }}</div>
        </div>
      </div>
      <div>
        <a-tabs :class="$style.topbar">
          <a-tab-pane key="1" tab="Overview"></a-tab-pane>
          <a-tab-pane key="2" tab="Jobs"></a-tab-pane>
          <a-tab-pane key="3" tab="Assets"></a-tab-pane>
          <a-tab-pane key="3" tab="Policies"></a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="flex-grow overflow-auto">
      <Overview :item="item" :credential="credential" :bot="bot"></Overview>
    </div>
  </div>
</template>
    
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { Components } from "~/api/atlas/client";

import Loader from "@common/loaders/page.vue";
import ErrorView from "@common/error/index.vue";
import SourceMixin from "~/mixins/source";

import Overview from "@/connection/overview/index.vue";
import fetchConnectionList from "~/composables/connection/fetchConnectionList";
import { useRoute } from "vue-router";
import fetchCredentialList from "~/composables/credential/fetchCredential";
import fetchBotsList from "~/composables/bots/fetchBotsList";

export default defineComponent({
  name: "HelloWorld",
  mixins: [SourceMixin],
  components: { Loader, ErrorView, Overview },
  data() {
    return {
      loading: false,
      error: "",
      cancelToken: null,
    };
  },
  setup(props, { emit }) {
    const route = useRoute();
    let now = ref(true);
    const entityFilters = {
      operator: <Components.Schemas.Operator>"eq",
      attributeName: "__guid",
      attributeValue: route.params.id as string,
    };
    const { item, mutate, body, state, STATES } = fetchConnectionList(
      now,
      "",
      entityFilters
    );

    let credentialNow = ref(false);
    const {
      item: credential,
      mutate: credentialMutate,
      body: credentialBody,
    } = fetchCredentialList(credentialNow, "");

    let botsNow = ref(false);
    const {
      item: bot,
      mutate: botMutate,
      body: botBody,
    } = fetchBotsList(botsNow, "");

    watch(item, () => {
      if ([STATES.SUCCESS].includes(state.value)) {
        credentialNow.value = true;
        credentialBody.value.entityFilters = {
          operator: <Components.Schemas.Operator>"eq",
          attributeName: "qualifiedName",
          attributeValue:
            item.value?.attributes.integrationCredentialQualifiedName,
        };
        credentialMutate();
        botsNow.value = true;
        botBody.value.entityFilters = {
          operator: <Components.Schemas.Operator>"eq",
          attributeName: "qualifiedName",
          attributeValue: item.value?.attributes.botQualifiedName,
        };
        botMutate();
      }
    });

    watch(
      () => route.params.id,
      () => {
        console.log("watch");
        body.value.entityFilters = {
          operator: <Components.Schemas.Operator>"eq",
          attributeName: "__guid",
          attributeValue: route.params.id as string,
        };
        mutate();
      }
    );

    return {
      bot,
      item,
      credential,
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