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
          <avatar
            :imageUrl="imageUrl"
            :allowUpload="true"
            :avatarName="fullName || username"
          />
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
          <div class="flex">
            <Tags
              :tags="designations"
              @updateTags="handleUpdateDesignation"
              :disableNewTag="updatingDesignation"
            ></Tags>
            <a-spin size="small" v-if="updatingDesignation"></a-spin>
          </div>
        </div>

        <div class="mt-4">
          <p class="mb-2 leading-none text-gray-400">Skills/Expertise</p>
          <div class="flex">
            <Tags
              :tags="skills"
              @updateTags="handleUpdateSkills"
              :disableNewTag="updatingSkills"
            ></Tags>
            <a-spin size="small" v-if="updatingSkills"></a-spin>
          </div>
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
      </a-menu>-->
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

import { useHead } from "@vueuse/head";

import { message } from "ant-design-vue";

import { User } from "~/api/auth/user";

import { useUser } from "~/composables/user/useUsers";

import Avatar from "~/components/common/avatar.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    PageLoader,
    SearchBox,
    Tags,
    SavedList,
    Avatar,
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

    let username = keycloak.tokenParsed.preferred_username || "";

    const fullName = computed(() => {
      let firstName = keycloak.tokenParsed.given_name || "";
      let lastName = keycloak.tokenParsed.family_name || "";
      return `${
        firstName.charAt(0).toUpperCase() + firstName.substr(1).toLowerCase()
      } ${lastName.charAt(0).toUpperCase() + lastName.substr(1).toLowerCase()}`;
    });
    useHead({
      title: `Welcome - ${fullName.value} `,
    });
    let imageUrl = ref(
      `http://localhost:3333/api/auth/tenants/default/avatars/${username}`
    );
    let updatingDesignation = ref(false);
    let updatingSkills = ref(false);
    const filterObj = { $and: [{ email_verified: true }, { username }] };
    const { userList, getUser, state, STATES } = useUser({
      limit: 1,
      offset: 0,
      sort: "first_name",
      filter: filterObj,
    });

    const userObj = computed(() => {
      return userList && userList.value && userList.value.length
        ? userList.value[0]
        : [];
    });
    const designations = computed(() => {
      if (userObj?.value?.attributes?.designation)
        return userObj.value.attributes.designation.split(",");
      return [];
    });
    const skills = computed(() => {
      if (userObj?.value?.attributes?.skills)
        return userObj.value.attributes.skills.split(",");
      return [];
    });
    const handleUpdateDesignation = async (tags: any) => {
      const attributeKeys = Object.keys(userObj.value.attributes);
      let formattedAttributes = {};
      attributeKeys.forEach((key) => {
        formattedAttributes[key] = [userObj.value.attributes[key]];
      });
      const requestPayload = {
        attributes: {
          ...formattedAttributes,
          designation: [tags.join(",")],
        },
      };
      try {
        //TODO: use useAPI chaining and fetch the user after update
        updatingDesignation.value = true;
        await User.UpdateUser(userObj.value.id, requestPayload);
        getUser();
        updatingDesignation.value = false;
      } catch (error) {
        updatingDesignation.value = false;
        message.error("Unable to update designation, please try again");
      }
    };
    const handleUpdateSkills = async (tags: any) => {
      const attributeKeys = Object.keys(userObj.value.attributes);
      let formattedAttributes = {};
      attributeKeys.forEach((key) => {
        formattedAttributes[key] = [userObj.value.attributes[key]];
      });
      const requestPayload = {
        attributes: {
          ...formattedAttributes,
          skills: [tags.join(",")],
        },
      };

      try {
        //TODO: use useAPI chaining and fetch the user after update
        updatingSkills.value = true;
        await User.UpdateUser(userObj.value.id, requestPayload);
        getUser();
        updatingSkills.value = false;
      } catch (error) {
        message.error("Unable to update skills, please try again");
        updatingSkills.value = false;
      }
    };

    return {
      fullName,
      name: keycloak.tokenParsed.name || "",
      username,
      displayName: computed(() => store.getters.getDisplayName),
      displayNameHTML: computed(() => store.getters.getDisplayNameHTML),
      realm: computed(() => store.getters.getRealmName),
      imageUrl,
      handleUpdateDesignation,
      handleUpdateSkills,
      skills,
      designations,
      state,
      STATES,
      updatingSkills,
      updatingDesignation,
    };
  },
});
</script>

<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>
