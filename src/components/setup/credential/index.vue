<template>
  <a-form :model="credential" layout="vertical" ref="form">
    <a-form-item
      label="Connection name"
      name="displayName"
      class="w-1/2"
      :has-feedback="true"
      :rules="nameRules"
    >
      <a-input v-model:value="credential.displayName" input-focus />
    </a-form-item>

    <div class="grid grid-cols-12 space-x-3 flex-nowrap">
      <div class="col-span-9">
        <a-form-item name="host" :has-feedback="true">
          <template #label>
            <span>{{ hostLocal?.label }}</span>
            <a-tooltip
              v-if="hostLocal?.info"
              :title="hostLocal?.info"
              placement="right"
              ><span class="ml-1"
                ><fa icon="fal info-circle" class="pushtop"></fa></span
            ></a-tooltip>
          </template>
          <DynamicInput
            v-model="credential.host"
            dataType="string"
            :placeholder="hostLocal?.placeholder"
            :defaultValue="hostLocal?.default"
            :prefix="hostLocal?.prefix"
            :suffix="hostLocal?.suffix"
          ></DynamicInput>
        </a-form-item>
      </div>

      <div class="col-span-3" v-show="portLocal?.isVisible">
        <a-form-item name="port" :has-feedback="true">
          <template #label>
            <span>{{ portLocal?.label }}</span>
            <a-tooltip
              v-if="portLocal?.info"
              :title="portLocal?.info"
              placement="right"
              ><span class="ml-1"
                ><fa icon="fal info-circle" class="pushtop"></fa></span
            ></a-tooltip>
          </template>
          <DynamicInput
            v-model="credential.port"
            dataType="number"
            :placeholder="portLocal?.placeholder"
            :defaultValue="portLocal?.default"
            :prefix="portLocal?.prefix"
            :suffix="portLocal?.suffix"
          ></DynamicInput>
        </a-form-item>
      </div>
    </div>

    <a-form-item
      label="Authentication Mode"
      name="name"
      v-if="authTypes.length > 1"
    >
      <RadioButton
        :list="authTypes"
        v-model="credential.authType"
        @change="handleAuthTypeChange"
      ></RadioButton>
    </a-form-item>

    <div class="grid grid-cols-12 space-x-3 flex-nowrap">
      <template
        v-for="attr in authAttributesLocal(credential.authType)"
        :key="attr.id"
      >
        <div class="col-span-6">
          <a-form-item
            v-if="attr.isVisible"
            :has-feedback="true"
            :name="attr.id"
          >
            <template #label>
              <span>{{ attr.label }}</span>
              <a-tooltip v-if="attr.info" :title="attr.info" placement="right"
                ><span class="ml-1"
                  ><fa icon="fal info-circle" class="pushtop"></fa></span
              ></a-tooltip>
            </template>
            <DynamicInput
              name="username"
              v-model="credential[attr.id]"
              :dataType="attr.type"
              :placeholder="attr.placeholder"
              :prefix="attr.prefix"
              :suffix="attr.suffix"
              :defaultValue="attr.default"
            ></DynamicInput>
          </a-form-item>
        </div>
      </template>
    </div>

    <div class="grid grid-cols-12">
      <a-form-item
        v-if="databaseLocal?.isVisible"
        :has-feedback="true"
        class="col-span-4"
        :name="databaseLocal?.id"
      >
        <template #label>
          <span>{{ databaseLocal?.label }}</span>
          <a-tooltip
            v-if="databaseLocal?.info"
            :title="databaseLocal?.info"
            placement="right"
            ><span class="ml-1"
              ><fa icon="fal info-circle" class="pushtop"></fa></span
          ></a-tooltip>
        </template>
        <DynamicInput
          :name="databaseLocal?.id"
          v-model="credential.database"
          :dataType="databaseLocal?.type"
          :placeholder="databaseLocal?.placeholder"
          :prefix="databaseLocal?.prefix"
          :defaultValue="databaseLocal?.default"
        ></DynamicInput>
      </a-form-item>
    </div>

    <div
      class="grid grid-cols-12 gap-2 px-3 pt-3 border border-gray-200 rounded  flex-nowrap bg-gray-50"
    >
      <div class="col-span-12">
        <p class="mb-2 text-sm font-normal text-gray-400">Advanced</p>
      </div>
      <template v-for="attr in extraAttributesLocal" :key="attr?.id">
        <div class="col-span-6">
          <a-form-item
            v-if="attr.isVisible"
            :has-feedback="true"
            :name="'extra.' + attr?.id"
          >
            <template #label>
              <span>{{ attr.label }}</span>
              <a-tooltip v-if="attr.info" :title="attr.info" placement="right"
                ><span class="ml-1"
                  ><fa icon="fal info-circle" class="pushtop"></fa></span
              ></a-tooltip>
            </template>

            <DynamicInput
              v-model="credential.extra[attr.id]"
              :dataType="attr?.type"
              :placeholder="attr?.placeholder"
              :prefix="attr?.prefix"
              :suffix="attr?.suffix"
              :enumList="enumAttributes(attr)"
              :enumAllowCustom="attr?.allowCustom"
              :defaultValue="attr?.default"
            ></DynamicInput>
          </a-form-item>
        </div>
      </template>
    </div>

    <div class="flex py-2 mt-3 space-x-3">
      <a-button
        type="primary"
        class="bg-green-500 border-green-500"
        :loading="
          isNetworkTestLoading || isCredTestLoading || isCredIdTestLoading
        "
        @click="handleTest"
        >Test Authentication</a-button
      >
      <div
        class=""
        v-if="
          (isNetworkTestSuccess || isNetworkTestError) && !isNetworkTestLoading
        "
      >
        <a-alert :type="networkAlertType" show-icon class="leading-none">
          <template #message>
            <div class="flex items-center align-middle">
              <!-- <div v-html="testingNetworkMessage"></div> -->
              <div class="hidden mr-2 md:block">
                {{ networkAlertMessage }}
              </div>

              <div v-if="isNetworkTestError" class="">
                <a-tooltip :title="networkErrorMessage"
                  ><fa icon="fal info-circle"></fa
                ></a-tooltip>
              </div>
            </div>
            <!-- {{ testingNetworkMessage }} -->
          </template>
        </a-alert>
      </div>

      <div
        class=""
        v-if="
          (!isEdit || credential.login || credential.password) &&
          (isCredTestSuccess || isCredTestError) &&
          !isCredTestLoading
        "
      >
        <a-alert :type="credAlertType" show-icon class="leading-none">
          <template #message>
            <div class="flex items-center align-middle">
              <!-- <div v-html="testingNetworkMessage"></div> -->
              <div class="hidden mr-2 md:block">{{ credAlertMessage }}</div>

              <div v-if="isCredTestError" class="">
                <a-tooltip :title="credErrorMessage"
                  ><fa icon="fal info-circle"></fa
                ></a-tooltip>
              </div>
            </div>
            <!-- {{ testingNetworkMessage }} -->
          </template>
        </a-alert>
      </div>

      <div
        class=""
        v-if="
          isEdit &&
          !credential.login &&
          !credential.password &&
          (isCredIdTestSuccess || isCredIdTestError) &&
          !isCredIdTestLoading
        "
      >
        <a-alert :type="credIdAlertType" show-icon class="leading-none">
          <template #message>
            <div class="flex items-center align-middle">
              <!-- <div v-html="testingNetworkMessage"></div> -->
              <div class="hidden mr-2 md:block">{{ credIdAlertMessage }}</div>

              <div v-if="isCredIdTestError" class="">
                <a-tooltip :title="credIdAlertMessage"
                  ><fa icon="fal info-circle"></fa
                ></a-tooltip>
              </div>
            </div>
            <!-- {{ testingNetworkMessage }} -->
          </template>
        </a-alert>
      </div>
    </div>
    <div
      class="p-2 mt-2 text-sm text-gray-500 bg-yellow-200 rounded"
      v-if="isEdit"
    >
      Sensitive credentials are not displayed for security reasons.
    </div>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, watch } from "vue";

import RadioButton from "@common/radio/button.vue";
import DynamicInput from "@common/input/dynamic.vue";

import { BotsType } from "~/types/atlas/bots";
import useBotModel from "~/composables/connection/useBotModel";
import useConnectionTest from "~/composables/bots/useConnectionTest";
import useCredentialTest from "~/composables/bots/useCredentialTest";
import useCredentialTestbyID from "~/composables/bots/useCredentialTestByID";

export default defineComponent({
  components: { RadioButton, DynamicInput },
  props: {
    item: {
      type: Object as PropType<BotsType>,
      required: false,
      default(): any {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      required: false,
      default(): any {
        return false;
      },
    },
    defaultCredential: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
    defaultConnection: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  data() {
    return {
      nameRules: [
        {
          required: true,
          message: "Name of the connection is mandatory",
          trigger: "blur",
        },
      ],
    };
  },
  emits: ["verified"],
  setup(props, { emit }) {
    const form = ref("");

    const {
      host: hostLocal,
      port: portLocal,
      database: databaseLocal,
      extraAttributes: extraAttributesLocal,
      authAttributes: authAttributesLocal,
      enumAttributes,
      authTypes,
    } = useBotModel(props.item);

    const credential: {
      [key: string]: any;
    } = reactive({
      displayName: "",
      host: hostLocal.value?.default,
      port: parseInt(portLocal?.value?.default),
      database: databaseLocal?.value?.default,
      connType: props.item?.attributes?.integrationName,
      login: "",
      password: "",
      authType: authTypes.value[0]?.id,
      url: props?.item?.attributes?.config.attributes.credentialTemplate?.url,
      driver:
        props.item?.attributes?.config?.attributes?.credentialTemplate?.driver,
      extra: {},
    });

    const credentialGuid = ref("");
    if (props.isEdit) {
      credential.displayName = props.defaultConnection?.attributes?.displayName;
      credential.host = props.defaultConnection?.attributes?.host;
      credential.port = props.defaultConnection?.attributes?.port;
      credential.authType = props.defaultCredential?.attributes?.authType;
      // change it to credential
      credential.extra = props.defaultCredential?.attributes?.extra;
      credentialGuid.value = props.defaultCredential?.guid;
    }

    const now = ref(false);
    const initialBody = {};
    const {
      data,
      state: stateNetwork,
      error: errorNetwork,
      isLoading: isNetworkTestLoading,
      isSuccess: isNetworkTestSuccess,
      isError: isNetworkTestError,
      alertType: networkAlertType,
      alertMessage: networkAlertMessage,
      errorMessage: networkErrorMessage,
      isValidating,
      replaceBody: replaceNetworkTestBody,
    } = useConnectionTest(now, initialBody);

    const handleNetworkTest = () => {
      replaceNetworkTestBody({
        host: credential.host,
        port: credential.port,
      });
      if (!now.value) {
        now.value = true;
      }
    };

    const credNow = ref(false);
    const {
      state: stateCredential,
      isLoading: isCredTestLoading,
      isSuccess: isCredTestSuccess,
      isError: isCredTestError,
      alertType: credAlertType,
      alertMessage: credAlertMessage,
      errorMessage: credErrorMessage,
      replaceBody: replaceCredentialTestBody,
    } = useCredentialTest(credNow, credentialGuid.value);

    const editNow = ref(false);
    const {
      isLoading: isCredIdTestLoading,
      isSuccess: isCredIdTestSuccess,
      isError: isCredIdTestError,
      alertType: credIdAlertType,
      alertMessage: credIdAlertMessage,
      errorMessage: credIdErrorMessage,
      replaceId: replaceCredID,
    } = useCredentialTestbyID(editNow, credentialGuid.value);

    const handleCredentialTest = () => {
      if (props.isEdit) {
        if (credential.login || credential.password) {
          replaceCredentialTestBody(credential);
          if (!credNow.value) {
            credNow.value = true;
          }
        } else {
          replaceCredID(credentialGuid.value);
          if (!editNow.value) {
            editNow.value = true;
          }
        }
      } else {
        replaceCredentialTestBody(credential);
        if (!credNow.value) {
          credNow.value = true;
        }
      }
    };

    const handleTest = () => {
      console.log("handle Test");
      handleNetworkTest();
      handleCredentialTest();
    };

    const handleAuthTypeChange = () => {
      credential.login = "";
      credential.password = "";
    };

    watch(
      [isNetworkTestLoading, isCredTestLoading, isCredIdTestLoading],
      () => {
        if (props.isEdit && !credential.login && !credential.password) {
          if (!isNetworkTestLoading.value && !isCredIdTestLoading.value) {
            if (isCredIdTestSuccess.value && isNetworkTestSuccess.value) {
              emit("verified", credential);
            } else if (isNetworkTestError.value || isCredIdTestError.value) {
              emit("verified", null);
            }
          }
        } else {
          if (!isNetworkTestLoading.value && !isCredTestLoading.value) {
            if (isCredTestSuccess.value && isNetworkTestSuccess.value) {
              emit("verified", credential);
            } else if (isNetworkTestError.value || isCredTestError.value) {
              emit("verified", null);
            }
          }
        }
      }
    );

    const getCredential = async () => {
      try {
        await form.value.validate();
        handleTest();
        return true;
      } catch (err) {
        console.log("error", err);
        return;
      }
    };

    return {
      data,
      stateNetwork,
      errorNetwork,
      stateCredential,
      hostLocal,
      portLocal,
      databaseLocal,
      extraAttributesLocal,
      authAttributesLocal,
      credential,
      authTypes,
      isValidating,
      credentialGuid,
      enumAttributes,
      handleTest,
      handleNetworkTest,
      handleCredentialTest,
      isNetworkTestLoading,
      isNetworkTestSuccess,
      isNetworkTestError,
      networkAlertType,
      networkAlertMessage,
      networkErrorMessage,
      isCredTestLoading,
      isCredTestSuccess,
      isCredTestError,
      credAlertType,
      credAlertMessage,
      credErrorMessage,
      handleAuthTypeChange,
      form,
      getCredential,
      isCredIdTestLoading,
      isCredIdTestSuccess,
      isCredIdTestError,
      credIdAlertType,
      credIdAlertMessage,
      credIdErrorMessage,
      replaceCredID,
    };
  },
  methods: {},
});
</script>