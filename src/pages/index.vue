<template>
  <div class="grid h-full grid-cols-12 p-6 gap-x-12">
    <div class="col-span-12 sm:col-span-8">
      <div class="flex items-center w-full align-middle">
        <div class="flex flex-col w-full">
          <p class="mb-2 text-xl font-bold tracking-tight text-gray-900">
            Welcome Home, {{ fullName }}
          </p>
          <a-input-search placeholder="Search all your assets.." size="large">
            <template #prefix>
              <img :src="displayNameHTML" class="w-auto h-8 mr-3" />
            </template>
          </a-input-search>
        </div>
      </div>
    </div>
    <div
      class="hidden h-full p-3 mt-3 bg-white border rounded-md  sm:col-span-4 sm:block"
    >
      <div class="flex items-center justify-between p-5 align-middle">
        <div class="flex items-center">
          <a-upload
            accept="image/*"
            class="cursor-pointer"
            :customRequest="handleUploadAvatar"
            :show-upload-list="false"
          >
            <div
              class="hidden text-center border-2 rounded-lg  border-primary-300 sm:block"
              style="width: 56px; height: 56px"
              v-if="!isReady && uploadStarted"
            >
              <a-spin size="small" class="" style="margin-top: 18px"></a-spin>
            </div>
            <a-avatar
              v-else
              shape="square"
              :size="56"
              class="hidden border-2 rounded-lg border-primary-300 sm:block"
              :src="imageUrl"
            />
          </a-upload>

          <div class="flex flex-col ml-2">
            <p
              class="mb-0 text-lg leading-none tracking-tight text-gray-800 truncate  text-semibold"
            >
              {{ fullName }}
            </p>
            <p class="mb-0 text-sm text-gray-500">@{{ username }}</p>
            <p class="mt-0 mb-0 text-sm tracking-tight text-gray-800">
              <fa icon="fal user-tag" class="mr-1 text-gray-800 pushtop"></fa
              >Admin
            </p>
          </div>
        </div>
        <fa icon="fal cog"></fa>
      </div>
      <a-divider class="mt-0"></a-divider>

      <div class="px-5">
        <div>
          <p class="mb-2 leading-none text-gray-400">Designation</p>
          <Tags></Tags>
        </div>

        <div class="mt-4">
          <p class="mb-2 leading-none text-gray-400">Skills/Expertise</p>
          <Tags></Tags>
        </div>
        <div class="mt-4">
          <p class="mb-2 leading-none text-gray-400">Saved Filters</p>
          <SavedList></SavedList>
        </div>
      </div>

      <!-- <a-menu mode="inline" class="bg-transparent">
          <a-menu-item key="1">
            <span>Home</span>
          </a-menu-item>
          <a-menu-item-group title="Discover">
            <a-menu-item key="2">
              <span>Assets</span>
            </a-menu-item>
            <a-menu-item key="2">
              <span>Terms</span>
            </a-menu-item>
            <a-menu-item key="2">
              <span>Connections</span>
            </a-menu-item>
            <a-menu-item key="2">
              <span>Projects</span>
            </a-menu-item>
          </a-menu-item-group>
        </a-menu> -->
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, inject, computed, ref } from "vue";
import { useStore } from "~/store";

import PageLoader from "@common/loaders/page.vue";
import SearchBox from "@common/searchbox/searchlist.vue";

import SavedList from "@/home/saved/index.vue";

import Tags from "@common/badge/tags/index.vue";

import uploadAvatar from "~/composables/avatar/uploadAvatar";

export default defineComponent({
  name: "HelloWorld",
  components: {
    PageLoader,
    SearchBox,
    Tags,
    SavedList,
  },
  props: {
    msg: {
      type: String,
      default: "",
    },
  },
  mounted() {
    console.log("mounted");
  },
  setup() {
    const keycloak = inject("$keycloak");
    const store = useStore();

    const fullName = computed(() => {
      let firstName = keycloak.tokenParsed.given_name || "";
      let lastName = keycloak.tokenParsed.family_name || "";
      return `${
        firstName.charAt(0).toUpperCase() + firstName.substr(1).toLowerCase()
      } ${lastName.charAt(0).toUpperCase() + lastName.substr(1).toLowerCase()}`;
    });

    const imageUrl = computed(() => {
      return `http://localhost:3333/api/auth/tenants/default/avatars/${username}`;
    });

    let uploadStarted = ref(false);
    const { upload, isReady } = uploadAvatar();

    const handleUploadAvatar = async (uploaded) => {
      console.log("handle Upload");
      upload(uploaded.file);
      uploadStarted.value = true;
      return true;
    };

    return {
      fullName,
      name: keycloak.tokenParsed.name || "",
      username: keycloak.tokenParsed.preferred_username || "",
      displayName: computed(() => store.getters.getDisplayName),
      displayNameHTML: computed(() => store.getters.getDisplayNameHTML),
      realm: computed(() => store.getters.getRealmName),
      handleUploadAvatar,
      isReady,
      uploadStarted,
      imageUrl,
    };
  },
});
</script>



<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>