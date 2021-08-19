<template>
  <div class="grid grid-cols-12 p-6 bg-white border rounded shadow-sm">
    <a-modal
      v-if="visible"
      v-model:visible="visible"
      ok-text="Update"
      :width="600"
      :mask-closable="false"
      :centered="true"
      :closable="false"
      @ok="handleUpdate"
    >
      <div class="overflow-y-auto" style="height: 500px">
        <Credential
          ref="credentialView"
          :item="bot"
          :is-edit="true"
          :default-connection="item"
          :default-credential="credential"
        ></Credential>
      </div>
    </a-modal>

    <div class="col-span-9 pr-6">
      <div class="flex justify-between">
        <div class="flex items-center text-base align-middle">Details</div>
      </div>

      <div class="flex space-x-5">
        <div>
          <p class="mt-3 mb-0 text-sm text-gray">Display Name</p>
          <div class="flex items-center align-middle">
            <div class="text-gray-900">
              {{ item?.attributes?.displayName
              }}<span class="ml-1 text-gray-500"
                >({{ item?.attributes?.name }})</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col mt-4">
        <div class="flex space-x-5">
          <div class="">
            <p class="mb-0 text-sm text-gray">
              {{
                bot?.attributes?.config?.attributes?.credential?.attributes.host
                  .attributes.label
              }}
            </p>
            <div class="text-base text-gray-900">
              {{ item?.attributes?.host }}
            </div>
          </div>
          <div
            v-if="
              bot?.attributes?.config?.attributes?.credential?.attributes.port
                .attributes.isVisible
            "
            class=""
          >
            <p class="mb-0 text-sm text-gray">
              {{
                bot?.attributes?.config?.attributes?.credential?.attributes.port
                  .attributes.label
              }}
            </p>
            <div class="text-gray-900">{{ item?.attributes?.port }}</div>
          </div>
        </div>
        <div class="p-4 mt-4 border rounded bg-gray-100">
          <div
            class="flex items-center justify-between mb-3 text-sm align-middle"
          >
            Credential
            <div class="text-red-500">
              <i><fa icon="fal lock" class="mr-1"></fa>Secured & encrypted</i>
            </div>
          </div>

          <div v-if="syncing">
            <LoadingView style="min-height: 100px"></LoadingView>
          </div>

          <div v-if="!syncing && !loading">
            <div class="flex flex-wrap space-x-8">
              <div>
                <p class="mb-0 text-sm text-gray">Authentication</p>
                <div class="tracking-wider text-gray-900 uppercase">
                  {{ credential?.attributes?.authType }}
                </div>
              </div>
              <template v-for="attr in authAttributesLocal" :key="attr.id">
                <div>
                  <p class="mb-0 text-sm text-gray">{{ attr.label }}</p>
                  <div class="text-red-500">
                    <fa icon="fal lock" class="mr-1"></fa>Secured
                  </div>
                </div>
              </template>
            </div>
            <div class="mt-4">
              <div class="grid grid-cols-12 flex-nowrap">
                <template
                  v-for="extra in bot?.attributes?.config?.attributes
                    ?.credential?.attributes?.extra"
                  :key="extra.id"
                >
                  <div v-if="extra.attributes.isVisible" class="col-span-4">
                    <p class="mb-0 text-sm text-gray">
                      {{ extra.attributes.label }}
                    </p>
                    <div
                      v-if="credential?.attributes?.extra"
                      class="tracking-wider text-gray-900 uppercase"
                    >
                      <span
                        v-if="
                          credential?.attributes?.extra[extra.attributes.id]
                        "
                      >
                        {{
                          credential?.attributes?.extra[extra.attributes.id]
                        }}</span
                      >
                      <span v-else>N/A</span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="flex items-center mt-4 align-middle">
              <a-button
                class="mr-3 bg-green-500 border-green-500"
                type="primary"
                @click="handleTest"
              >
                Test Authentication</a-button
              >
              <div class="flex space-x-2">
                <div v-if="testingNetworkStatus" class="mr-1">
                  <a-alert
                    :type="testingNetworkStatus"
                    show-icon
                    class="leading-none"
                  >
                    <template #message>
                      <div class="flex items-center align-middle">
                        <div>Network</div>

                        <div class="">
                          <a-tooltip :title="testingNetworkError"
                            ><fa
                              icon="fal info-circle"
                              class="ml-1 pushtop"
                            ></fa
                          ></a-tooltip>
                        </div>
                      </div>
                      <!-- {{ testingNetworkMessage }} -->
                    </template>
                  </a-alert>
                </div>
                <div v-if="testCredStatus" class="">
                  <a-alert
                    :type="testCredStatus"
                    show-icon
                    class="leading-none"
                  >
                    <template #message>
                      <div class="flex items-center align-middle">
                        <div>Authentication</div>
                        <!-- <div v-html="testingNetworkMessage"></div> -->
                        <!-- <div class="hidden mr-2 md:block">{{ testCredMessage }}</div> -->

                        <div class="">
                          <a-tooltip :title="testCredError"
                            ><fa
                              icon="fal info-circle"
                              class="ml-1 pushtop"
                            ></fa
                          ></a-tooltip>
                        </div>
                      </div>
                      <!-- {{ testingNetworkMessage }} -->
                    </template>
                  </a-alert>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-5 align-middle">
          <div>
            <a-button @click="handleEdit">Edit</a-button>
          </div>

          <p class="mb-0 text-gray">
            updated
            <span>{{
              dayjs().from(
                credential?.attributes?.__modificationTimestamp,
                true
              )
            }}</span>
            ago by {{ credential?.attributes?.__modifiedBy }}
          </p>
        </div>
      </div>
    </div>
    <div class="col-span-3 pl-6 border-l border-dashed">
      <Lastrun :key="item.guid" :item="item"></Lastrun>
      <TotalView :key="item.guid" class="mt-6" :item="item"></TotalView>
    </div>
  </div>
  <div class="p-6 mt-4 bg-white border rounded shadow-sm">
    <QueryView :item="item"></QueryView>
  </div>
</template>
  
<script lang="ts">
import dayjs from "dayjs";
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, PropType, ref } from "vue";
import QueryView from "@/connection/overview/query.vue";
import TotalView from "@/connection/overview/analytics/total.vue";
import Lastrun from "@/connection/overview/lastrun/index.vue";

import LoadingView from "@/common/loaders/section.vue";

import Credential from "@/setup/credential/index.vue";
import { CredentialType } from "~/types/atlas/credential";
import { BotsType } from "~/types/atlas/bots";
import SourceMixin from "~/mixins/source";
import { ConnectionType } from "~/types/atlas/connection";
import useBotModel from "~/composables/connection/useBotModel";
import updateCredential from "~/composables/credential/updateCredential";
import { Connection } from "~/api/auth/connection";
import { Credential as CredentialService } from "~/api/auth/credential";

export default defineComponent({
  components: { Credential, TotalView, QueryView, Lastrun, LoadingView },
  mixins: [SourceMixin],
  props: {
    item: {
      type: Object as PropType<ConnectionType>,
      required: false,
      default(): any {
        return {};
      },
    },
    credential: {
      type: Object as PropType<CredentialType>,
      required: false,
      default(): any {
        return {};
      },
    },
    bot: {
      type: Object as PropType<BotsType>,
      required: false,
      default(): any {
        return {};
      },
    },
    loading: {
      type: Boolean,
    },
    syncing: {
      type: Boolean,
    },
  },
  setup(props) {
    const visible = ref(false);
    const defaultCredential = ref({});

    const { authAttributes: authAttributesLocal } = useBotModel(props.bot);

    const credentialView = ref();

    const credBody = ref({});
    const guid = ref("");


    const isUpdating = ref(false);

    const { execute } = updateCredential(guid, credBody, {
      immediate: false,
    });

    const handleUpdate = async () => {
      guid.value = props.credential.guid;
      try {
        const res = await credentialView.value.getCredential();
      } catch (err) {
        console.log("error");
      }
    };

    const handleTest = () => {
      handleNetworkTest();
      handleCredentialTest();
    };

    const testingNetworkStatus = ref("");
    const testingNetworkMessage = ref("");
    const testingNetworkError = ref("");
    const handleNetworkTest = async () => {
      try {
        testingNetworkStatus.value = "info";
        testingNetworkMessage.value = "Cheking network connection";
        testingNetworkError.value = "";
        await Connection.TestNetwork({
          host: props.item?.attributes?.host,
          port: 443,
        });
        testingNetworkStatus.value = "success";
        testingNetworkMessage.value = "Network connection is successful";
        testingNetworkError.value = "Network conenction is successful";
        return true;
      } catch (err) {
        testingNetworkStatus.value = "error";
        testingNetworkMessage.value = `Network connection failed`;

        if (err.response) {
          testingNetworkError.value = err.response.data.message;
        } else {
          testingNetworkError.value = "Something went wrong. Please try again.";
        }
        return false;
      }
    };

    const testCredStatus = ref("");
    const testCredMessage = ref("");
    const testCredError = ref("");

    const handleCredentialTest = async () => {
      try {
        testCredStatus.value = "info";
        testCredMessage.value = "Checking authentication";
        testCredError.value = "";
        await CredentialService.TestCredentialByID(props.credential.guid);
        testCredStatus.value = "success";
        testCredMessage.value = "Authentication is successful";
        testCredError.value = "Authentication is successful";
      } catch (err) {
        testCredStatus.value = "error";
        testCredMessage.value = `Network connection failed`;
        if (err.response) {
          testCredError.value = err.response.data.message;
        } else {
          testCredError.value = "Something went wrong. Please try again.";
        }
      }
    };

    const handleEdit = () => {
      visible.value = true;
    };
    return {
      handleEdit,
      handleUpdate,
      credentialView,
      visible,
      defaultCredential,
      authAttributesLocal,
      handleTest,
      testingNetworkStatus,
      testingNetworkMessage,
      testingNetworkError,
      handleCredentialTest,
      testCredStatus,
      testCredError,
      testCredMessage,
    };
  },
  data() {
    return {
      dayjs,
    };
  },
  computed: {
    // authAttributesLocal(): any {
    //   let found =
    //     this.bot?.attributes?.config.attributes.credential.attributes.auth.find(
    //       (element) => {
    //         return (
    //           element.attributes.id == this.credential?.attributes?.authType
    //         );
    //       }
    //     );
    //   let attr: any[] = [];
    //   if (found) {
    //     found.attributes.config?.forEach((e: { attributes: any }) => {
    //       attr.push(e.attributes);
    //     });
    //   }
    //   return attr;
    // },
  },
  mounted() {},
  methods: {},
});
</script>