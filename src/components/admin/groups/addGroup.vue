<template>
  <div>
    <div class="form-height">
      <div class="max-w-2xl">
        <a-form
          :label-align="'right'"
          :model="group"
          :rules="validations"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 9 }"
        >
          <div>
            <div>
              <div>
                <a-form-item label="Name" name="name">
                  <a-input v-model:value="group.name" @input="setGroupAlias" />
                </a-form-item>
              </div>
              <div>
                <a-form-item label="Alias" name="alias">
                  <a-input
                    v-model:value="group.alias"
                    @input="restrictGroupAlias"
                  />
                </a-form-item>
              </div>
            </div>
            <a-form-item
              :wrapper-col="{ span: 12 }"
              label="Description"
              name="description"
            >
              <a-textarea v-model:value="group.description" :rows="2" />
            </a-form-item>
            <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
              <template #label>
                <span class="">Mark as default</span>
                <a-tooltip
                  :title="'New users will be automatically added to default groups'"
                  placement="right"
                  ><span class="ml-1"
                    ><fa icon="fal info-circle" class="pushtop"></fa></span
                ></a-tooltip>
              </template>
              <a-switch v-model:checked="isDefault" />
              <span v-if="isDefault" class="ml-2"
                >All new users will be automatically added to this group</span
              >
            </a-form-item>
            <div class="mt-4 border-b"></div>
            <div class="mt-3 ml-2">
              <div class="mb-2">
                <span class="mr-2">Select users</span
                ><span class="text-gray">(Optional)</span>
              </div>
              <UserList
                user-list-header-class="min-w-full"
                :user-list-style="{ maxHeight: 'calc(100vh - 35rem)' }"
                @updateSelectedUsers="updateUserList"
              />
            </div>
          </div>
        </a-form>
      </div>
    </div>
    <div class="flex justify-end max-w-2xl mt-4">
      <div class="flex items-center text-xl">
        <a-button
          type="link"
          class="mr-3 font-bold cursor-pointer text-gray-500"
          @click="routeToGroups"
          >Cancel</a-button
        >
        <a-button
          type="primary"
          size="large"
          html-type="submit"
          :disabled="isSubmitDisabled"
          :loading="createGroupLoading"
          @click="handleSubmit"
          >Create Group</a-button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import {
  defineComponent,
  ref,
  reactive,
  computed,
  UnwrapRef,
  watch,
} from "vue";
import { message } from "ant-design-vue";
import { Group } from "~/api/auth/group";
import UserList from "~/components/admin/groups/common/userList.vue";
import whoami from "~/composables/user/whoami";

interface Group {
  name: String;
  alias: String;
  description: String;
}
export default defineComponent({
  name: "AddGroup",
  components: { UserList },
  setup(props, context) {
    const router = useRouter();
    const createGroupLoading = ref(false);
    const isDefault = ref(false);
    const group: UnwrapRef<Group> = reactive({
      name: "",
      description: "",
      alias: "",
    });
    const validations = {
      name: [
        { required: true, message: "Group name is required", trigger: "blur" },
      ],
    };
    const { username } = whoami();
    const userIds = ref([]);
    const isSubmitDisabled = computed(() => {
      const { name, alias } = group;
      return !!(name == "" || alias == "");
    });
    const setGroupAlias = () => {
      group.alias = getAliasFromName(group.name);
    };
    const getAliasFromName = (title) => title
        .trim()
        .toLowerCase()
        .replace(/[!:;@#$%^&*'"<>,/.\\(){}[\]|`~?+=-]+/g, "")
        .replace(/[ ]+/g, "_");
    const restrictGroupAlias = () => {
      group.alias = getAliasFromName(group.alias);
    };
    const updateUserList = (list) => {
      userIds.value = list;
    };
    const handleSubmit = () => {
      const currentDate = new Date().toISOString();
      const createdBy = username.value;
      // deliberately switching alias and name so as to keep alias as a unique identifier for the group, for keycloak name is the unique identifier. For us, alias is the unique identifier and different groups with same name can exist.
      const requestPayload = ref({
        group: {
          name: group.alias,
          attributes: {
            description: [group.description],
            alias: [group.name],
            created_at: [currentDate],
            created_by: [createdBy],
            isDefault: [`${isDefault.value}`],
          },
        },
        users: userIds.value,
      });
      const { data, isReady, error, isLoading } =
        Group.CreateGroup(requestPayload);
      watch(
        [data, isReady, error, isLoading],
        () => {
          createGroupLoading.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            message.success("Group added");
            router.push(`/admin/groups`);
          } else if (error && error.value) {
            message.error("Unable to create group, please try again.");
          }
        },
        { immediate: true }
      );
    };
    const routeToGroups = () => {
      router.push(`/admin/groups`);
    };

    return {
      group,
      isSubmitDisabled,
      validations,
      createGroupLoading,
      handleSubmit,
      setGroupAlias,
      restrictGroupAlias,
      updateUserList,
      isDefault,
      routeToGroups,
    };
  },
  data() {
    return {
      group: {
        name: "",
        alias: "",
        description: "",
      },
    };
  },
});
</script>

<style lang="less" scoped>
.form-height {
  max-height: calc(100vh - 13rem) !important;
  overflow-y: auto;
}
</style>


