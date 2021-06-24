<template>
  <div class="grid grid-cols-12 p-6 bg-white border rounded shadow-sm">
    <a-modal
      v-if="visible"
      v-model:visible="visible"
      okText="Update"
      :width="600"
      :maskClosable="false"
      @ok="handleUpdate"
      :closable="false"
    >
      <Credential
        ref="credentialView"
        :item="bot"
        :isEdit="true"
        :defaultConnection="item"
        :defaultCredential="credential"
      ></Credential>
    </a-modal>

    <div class="col-span-9 pr-6">
      <div class="flex justify-between">
        <div class="flex items-center align-middle">
          <img
            :src="logo(item?.attributes?.integrationName)"
            class="w-auto h-6 mr-1"
          />

          <div class="text-sm tracking-wider text-gray-600 uppercase">
            {{ label(item?.attributes?.integrationName) }}
          </div>
        </div>
        <div class="flex space-x-2">
          <div class="mr-1" v-if="testingNetworkStatus">
            <a-alert
              :type="testingNetworkStatus"
              show-icon
              class="leading-none"
            >
              <template #message>
                <div class="flex items-center align-middle">
                  <!-- <div v-html="testingNetworkMessage"></div> -->

                  <div class="">
                    <a-tooltip :title="testingNetworkError"
                      ><fa icon="fal info-circle"></fa
                    ></a-tooltip>
                  </div>
                </div>
                <!-- {{ testingNetworkMessage }} -->
              </template>
            </a-alert>
          </div>
          <div class="" v-if="testCredStatus">
            <a-alert :type="testCredStatus" show-icon class="leading-none">
              <template #message>
                <div class="flex items-center align-middle">
                  <!-- <div v-html="testingNetworkMessage"></div> -->
                  <!-- <div class="hidden mr-2 md:block">{{ testCredMessage }}</div> -->

                  <div class="">
                    <a-tooltip :title="testCredError"
                      ><fa icon="fal info-circle"></fa
                    ></a-tooltip>
                  </div>
                </div>
                <!-- {{ testingNetworkMessage }} -->
              </template>
            </a-alert>
          </div>
          <a-button
            class="bg-green-500 border-green-500"
            type="primary"
            @click="handleTest"
          >
            Test Authentication</a-button
          >
        </div>
      </div>

      <div class="flex space-x-5">
        <div>
          <p class="mt-3 mb-0 text-sm text-gray-400">Display Name</p>
          <div class="flex items-center align-middle">
            <div class="text-gray-900">
              {{ item?.attributes?.displayName }}
            </div>
          </div>
        </div>
        <div>
          <p class="mt-3 mb-0 text-sm text-gray-400">Unique Name</p>
          <div class="flex items-center align-middle">
            <div class="text-gray-900">{{ item?.attributes?.name }}</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col mt-3">
        <div class="flex space-x-5">
          <div class="">
            <p class="mb-0 text-sm text-gray-400">
              {{
                bot?.attributes?.config?.attributes?.credential?.attributes.host
                  .attributes.label
              }}
            </p>
            <div class="text-gray-900">{{ item?.attributes?.host }}</div>
          </div>
          <div
            class=""
            v-if="
              bot?.attributes?.config?.attributes?.credential?.attributes.port
                .attributes.isVisible
            "
          >
            <p class="mb-0 text-sm text-gray-400">
              {{
                bot?.attributes?.config?.attributes?.credential?.attributes.port
                  .attributes.label
              }}
            </p>
            <div class="text-gray-900">{{ item?.attributes?.port }}</div>
          </div>
        </div>
        <div class="flex flex-wrap mt-4 space-x-8">
          <div>
            <p class="mb-0 text-sm text-gray-400">Authentication</p>
            <div class="tracking-wider text-gray-900 uppercase">
              {{ credential?.attributes?.authType }}
            </div>
          </div>
          <template v-for="attr in authAttributesLocal" :key="attr.id">
            <div>
              <p class="mb-0 text-sm text-gray-400">{{ attr.label }}</p>
              <div class="text-red-500">
                <fa icon="fal lock" class="mr-1"></fa>Secured
              </div>
            </div>
          </template>
        </div>
        <div class="mt-4">
          <div class="grid grid-cols-12 flex-nowrap">
            <template
              v-for="extra in bot?.attributes?.config?.attributes?.credential
                ?.attributes?.extra"
              :key="extra.id"
            >
              <div class="col-span-4" v-if="extra.attributes.isVisible">
                <p class="mb-0 text-sm text-gray-400">
                  {{ extra.attributes.label }}
                </p>
                <div
                  class="tracking-wider text-gray-900 uppercase"
                  v-if="item?.attributes?.extra"
                >
                  {{ item?.attributes?.extra[extra.attributes.id] }}
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="flex items-center justify-between mt-5 align-middle">
          <div>
            <a-button @click="handleEdit">Edit</a-button>
          </div>

          <p class="mb-0 text-gray-400">
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
      <a-divider class="text-sm">Query Configuration</a-divider>
      <div class="p-3 mt-3 border rounded bg-gray-50">
        <QueryView :item="item"></QueryView>
      </div>
    </div>
    <div class="col-span-3 pl-6 border-l border-dashed">
      <Lastrun :item="item"></Lastrun>
      <TotalView class="mt-6" :item="item" :key="item.guid"></TotalView>
    </div>
  </div>
</template>
  
<script lang="ts">
import dayjs from "dayjs";
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, PropType, ref } from "vue";
import { ConnectionType } from "~/types/atlas/connection";
import QueryView from "@/connection/overview/query.vue";
import SourceMixin from "~/mixins/source";
import { BotsType } from "~/types/atlas/bots";
import { CredentialType } from "~/types/atlas/credential";
import TotalView from "@/connection/overview/analytics/total.vue";
import Lastrun from "@/connection/overview/lastrun/index.vue";

import Credential from "@/setup/credential/index.vue";
import useBotModel from "~/composables/connection/useBotModel";
import updateCredential from "~/composables/credential/updateCredential";
import { Connection } from "~/api/auth/connection";
import { Credential as CredentialService } from "~/api/auth/credential";

export default defineComponent({
  mixins: [SourceMixin],
  components: { Credential, TotalView, QueryView, Lastrun },
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
  },
  data() {
    return {
      dayjs,
    };
  },
  mounted() {},
  setup(props) {
    const visible = ref(false);
    const defaultCredential = ref({});

    const { authAttributes: authAttributesLocal } = useBotModel(props.bot);

    const credentialView = ref();

    const credBody = ref({});
    const guid = ref("");

    const { execute } = updateCredential(guid, credBody, {
      immediate: false,
    });

    const handleUpdate = async () => {
      console.log("update");
      guid.value = props.credential.guid;
      console.log(await credentialView.value.getCredential());
      execute();
    };

    const handleTest = () => {
      handleNetworkTest();
      handleCredentialTest();
    };

    let testingNetworkStatus = ref("");
    let testingNetworkMessage = ref("");
    let testingNetworkError = ref("");
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
          testingNetworkError = err.response.data.message;
        } else {
          testingNetworkError.value = "Something went wrong. Please try again.";
        }
        return false;
      }
    };

    let testCredStatus = ref("");
    let testCredMessage = ref("");
    let testCredError = ref("");

    const handleCredentialTest = async () => {
      try {
        testCredStatus.value = "info";
        testCredMessage.value = "Checking authentication";
        testCredError.value = "";
        await CredentialService.TestCredentialByID(props.credential.guid);
        testCredStatus.value = "success";
        testCredMessage.value = "Authentication is successful";
        testCredError.value = "";
      } catch (err) {
        testCredStatus.value = "error";
        testCredMessage.value = `Network connection failed`;
        if (err.response) {
          testCredError = err.response.data.message;
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
  methods: {},
});
</script>