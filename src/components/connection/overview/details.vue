<template>
  <div>
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
        :defaultCredential="defaultCredential"
      ></Credential>
    </a-modal>
    <div class="p-6 bg-white rounded shadow-sm">
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

        <a-button class="bg-green-500 border-green-500" type="primary">
          Test Authentication</a-button
        >
      </div>

      <p class="mt-3 mb-0 text-sm text-gray-400">Display Name</p>
      <div class="flex items-center align-middle">
        <div class="text-gray-900">{{ item?.attributes?.displayName }}</div>
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
    </div>
  </div>
</template>
  
<script lang="ts">
import dayjs from "dayjs";
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, PropType, ref } from "vue";
import { ConnectionType } from "~/types/atlas/connection";
import SourceMixin from "~/mixins/source";
import { BotsType } from "~/types/atlas/bots";
import { CredentialType } from "~/types/atlas/credential";

import Credential from "@/setup/credential/index.vue";

export default defineComponent({
  mixins: [SourceMixin],
  components: { Credential },
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

    const credentialView = ref();

    const handleUpdate = async () => {
      console.log("update");
      console.log(await credentialView.value.getCredential());
    };

    const handleEdit = () => {
      defaultCredential.value = {
        name: props.item?.attributes?.displayName,
        host: props.item?.attributes?.host,
        port: props.item?.attributes?.port,
        conn_type: props?.item.attributes?.integrationName,
        login: "",
        password: "",
        auth_type: props.credential?.attributes?.authType,
        extra: props.item?.attributes?.extra,
      };
      console.log(defaultCredential);
      visible.value = true;
    };
    return {
      handleEdit,
      handleUpdate,
      credentialView,
      visible,
      defaultCredential,
    };
  },
  computed: {
    authAttributesLocal(): any {
      let found =
        this.bot?.attributes?.config.attributes.credential.attributes.auth.find(
          (element) => {
            return (
              element.attributes.id == this.credential?.attributes?.authType
            );
          }
        );
      let attr: any[] = [];
      if (found) {
        found.attributes.config?.forEach((e: { attributes: any }) => {
          attr.push(e.attributes);
        });
      }
      return attr;
    },
  },
  methods: {},
});
</script>