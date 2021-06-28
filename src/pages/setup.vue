<template>
  <div class="h-full">
    <div
      class="flex items-center justify-center w-full h-full align-middle bg-white "
      v-if="current === 3"
    >
      <StatusView
        :item="selectedConnector"
        :job="selectedJob"
        :credential="selectedCredential"
        @back="handleError"
      ></StatusView>
    </div>
    <div class="flex w-full h-full">
      <div
        class="flex flex-col hidden p-6 bg-white border-r border-gray-200  sm:block"
      >
        <p
          class="mb-2 text-xs tracking-wide text-gray-500 uppercase cursor-pointer "
          @click="handleBack"
        >
          <fa icon="fal chevron-left" class="mr-1 leading-none pushtop"></fa>All
          Connections
        </p>
        <p class="text-2xl font-medium tracking-tight">New Connection</p>
        <a-steps
          size="default"
          v-model:current="current"
          direction="vertical"
          progress-dot
          class="flex-grow"
        >
          <a-step
            class
            disabled
            @click="handleStepClick(0)"
            description="Select your connector"
          >
            <template #title>
              <div class="text-tight">Connectors</div>
            </template>
          </a-step>
          <a-step
            disabled
            @click="handleStepClick(1)"
            description="Enter your credentials"
          >
            <template #title>
              <div class="text-tight">Credential</div>
            </template>
          </a-step>
          <a-step
            disabled
            @click="handleStepClick(2)"
            description="One last step"
          >
            <template #title>
              <div class="text-tight">Settings</div>
            </template>
          </a-step>
        </a-steps>
        <div class="p-4 mt-4 bg-gray-100 border rounded-lg">
          <p class="mb-1 font-semibold tracking-tight">
            Can't find your favourite connector?
          </p>
          <p class="mb-0">Reach us at support@atlan.com.</p>
        </div>
      </div>
      <div class="flex flex-col w-full h-full shadow-md">
        <div class="px-6 py-4 bg-transparent border-b" v-if="current !== 0">
          <div class="flex items-center justify-between align-middle">
            <div class="flex items-center align-middle">
              <div class="flex items-center align-middle">
                <p @click="handlePrevious" class="px-1 mb-0 mr-2 leading-none">
                  <fa icon="fal chevron-left"></fa>
                </p>
                <img :src="logo(selectedConnector)" class="w-auto h-8 mr-2" />
              </div>

              <div class="flex flex-col">
                <div class="text-base tracking-wide text-dark-400">
                  {{ title(selectedConnector) }}
                </div>
              </div>
            </div>
            <a :href="supportLink(selectedConnector)" target="_blank"
              >Need Help?</a
            >
          </div>
        </div>

        <div class="h-full overflow-y-auto flew-grow">
          <keep-alive class="">
            <ConnectorList
              v-if="current === 0"
              @select="handleConnectorSelect"
            ></ConnectorList>
            <CredentialView
              class="px-8 py-4"
              ref="credentialView"
              :key="selectedConnector.guid"
              :item="selectedConnector"
              v-else-if="current === 1"
            ></CredentialView>
            <Settings
              class="px-8 py-4"
              ref="settingsView"
              v-else-if="current === 2"
              :item="selectedConnector"
              :credential="selectedCredential"
            ></Settings>
          </keep-alive>
        </div>

        <div
          class="flex justify-between px-4 py-5 align-middle bg-white border-t"
          v-if="current !== 0"
        >
          <a-button
            :type="nextType"
            @click="handleNext"
            :loading="loadingNext"
            class="px-8"
          >
            {{ nextTitle }}
            <fa icon="fal chevron-right" class="ml-1"></fa>
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
        
        
  <script lang="ts">
import { defineComponent } from "vue";
import CredentialView from "@/setup/credential/index.vue";
import ConnectorList from "@/setup/connectors/list.vue";
import StatusView from "@/setup/status/index.vue";
import Settings from "@/setup/settings/index.vue";
import ConnectorMixin from "~/mixins/connector";

export default defineComponent({
  mixins: [ConnectorMixin],
  components: { ConnectorList, CredentialView, Settings, StatusView },
  data() {
    return {
      current: 0,
      selectedConnector: null,
      selectedCredential: null,
      selectedJob: null,
      loadingNext: false,
      nextTitle: "Test & Continue",
      nextType: "default",
      loading: false,
      error: "",
    };
  },
  mounted() {},
  methods: {
    handleError() {
      this.current = 2;
    },
    handleBack() {
      this.$router.push("/connections");
    },
    handleStepClick(value: number) {
      if (value > this.current) {
        if (value === 2) {
          this.handleNext();
        }
      } else if (value < this.current) {
        this.current = value;
      }
    },
    handleConnectorSelect(item: any) {
      this.selectedConnector = item;
      this.current = this.current + 1;
    },
    handlePrevious() {
      this.current = this.current - 1;
      if (this.current === 0) {
        const query = {};
        this.$router.replace({ query });
      } else if (this.current === 1) {
        this.nextTitle = "Test & Continue";
        this.nextType = "default";
      } else if (this.current === 2) {
        this.nextTitle = "Setup & Run";
        this.nextType = "primary";
      }
    },
    async handleNext() {
      try {
        this.loadingNext = true;
        if (this.current === 1) {
          if (this.$refs.credentialView) {
            this.selectedCredential =
              await this.$refs.credentialView.getCredential();
            if (this.selectedCredential) {
              this.current = this.current + 1;
              this.nextTitle = "Setup & Run";
              this.nextType = "primary";
            }
          }
        }
        if (this.current === 2) {
          if (this.$refs.settingsView) {
            this.selectedJob = this.$refs.settingsView.getJob();
            console.log(this.selectedJob);
            this.current = this.current + 1;
          }
        }
        this.loadingNext = false;
      } catch (err) {
        this.loadingNext = false;
      }
    },
    async handleConnectionSetup() {},
  },
});
</script>
        
              
<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>