<template>
  <a-popover
    placement="left"
    v-model:visible="linkClassificationPopover"
    overlayClassName="inlinepopover"
    @visibleChange="
      () => {
        showCreateClassificationPopover = false;
      }
    "
    trigger="click"
  >
    <template #content>
      <div
        class="flex flex-col p-4 overflow-y-auto"
        style="width: 350px; height: 250px"
      >
        <div v-if="!showCreateClassificationPopover">
          <p class="pb-1 text-lg text-gray-500 border-b">Link Classification</p>
          <p class="mb-1 text-sm text-gray-400">Select classifications</p>
          <a-select
            v-model:value="selectedClassificationForLink"
            style="width: 100%"
            @change="handleSelectedClassificationForLink"
            placeholder="Select a classifications"
          >
            <template
              v-for="classification in availableClassificationsForLink"
              :key="classification.name"
            >
              <a-select-option :value="classification.name">{{
                classification.displayName
              }}</a-select-option>
            </template>
          </a-select>
          <p class="mt-2 text-xs text-gray-400 ">
            Can't find the right classification to link, create a new
            classification from
            <a @click="showCreateClassificationForm">here</a>
          </p>
          <a-checkbox
            class="mt-2 text-gray-400"
            v-model:checked="linkClassificationData.propagate"
            >Propagate classification to related assets
          </a-checkbox>
          <a-checkbox
            class="mt-2 text-gray-400"
            v-if="linkClassificationData.propagate"
            v-model:checked="
              linkClassificationData.removePropagationsOnEntityDelete
            "
            >Remove propagation when
            <span class="font-semibold text-gray-500">{{
              asset.displayText
            }}</span>
            is deleted
          </a-checkbox>
        </div>
        <div v-else>
          <a-form
            ref="createClassificationFormRef"
            :model="formState"
            :rules="rules"
            layout="vertical"
          >
            <a-form-item ref="name" label="Name" name="name">
              <a-input v-model:value="formState.name" />
            </a-form-item>
            <a-form-item
              ref="description"
              label="Description"
              name="description"
            >
              <a-textarea v-model:value="formState.description" />
            </a-form-item>
          </a-form>
          <p v-if="createErrorText" class="mt-4 mb-0 text-sm text-red-500">
            {{ createErrorText }}
          </p>
        </div>
      </div>

      <div
        v-if="!showCreateClassificationPopover"
        class="flex justify-end p-2 space-x-2 border-t border-gray-100"
      >
        <a-button size="small" @click="handleLinkClassificationPopoverCancel"
          >Cancel</a-button
        >
        <a-button
          type="primary"
          size="small"
          @click="handleLinkClassificationPopoverSave"
          :loading="linkClassificationStatus === 'loading' ? true : false"
          >Link</a-button
        >
      </div>
      <div
        v-else
        class="flex justify-end p-2 space-x-2 border-t border-gray-100"
      >
        <a-button
          size="small"
          @click="
            () => {
              showCreateClassificationPopover = false;
            }
          "
          >Cancel</a-button
        >
        <a-button
          type="primary"
          size="small"
          :loading="createClassificationStatus === 'loading' ? true : false"
          @click="createClassification"
          >Create</a-button
        >
      </div>
    </template>

    <div
      class="px-2 py-1 transition duration-500 ease-in-out rounded-lg hover:bg-gray-50 hover:border"
    >
      <p class="mb-1 text-sm tracking-wide text-gray-400">Classifications</p>
      <div class="flex flex-wrap items-center gap-x-1">
        <template
          v-for="(classification, index) in formattedLinkedClassifications"
          :key="'classification-' + classification?.typeName + index"
        >
          <div class="flex m-1 mb-1 rounded-md ">
            <div
              class="flex items-center px-2 py-2 leading-none align-middle cursor-pointer bg-primary-300 text-primary-400 bg-opacity-10 hover:bg-primary-500 hover:text-white drop-shadow-sm"
              @click.prevent.stop="handleClassificationClick"
            >
              <fa
                icon="fal chart-network"
                v-if="classification.propagate"
                class="mr-1 leading-none pushtop"
              ></fa>
              <div class="text-shadow">
                {{ classification?.typeName }}
              </div>
            </div>
            <a-button
              v-if="!classification.hideRemoveButton"
              @click.stop="() => unLinkClassification(classification)"
              class="flex items-center justify-center p-1 px-2 border-none bg-primary-300 hover:bg-primary-500 hover:text-white bg-opacity-10"
            >
              <span class="flex items-center justify-center">
                <fa icon="fal times-circle" class="" />
              </span>
            </a-button>
          </div>
        </template>
        <a-button
          @click.stop.prevent="openLinkClassificationPopover"
          class="flex items-center justify-center p-1 px-2 ml-1 bg-primary-300 hover:bg-primary-500 hover:text-white bg-opacity-10"
        >
          <span class="flex items-center justify-center">
            <fa icon="fal plus" class="" />
          </span>
        </a-button>
      </div>
      <p
        class="mb-0 text-gray-500"
        v-if="formattedLinkedClassifications.length < 1"
      >
        No classifications added
      </p>
    </div>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, toRaw, reactive } from "vue";
import StatusBadge from "@common/badge/status/index.vue";

import fetchUserList from "~/composables/user/fetchUserList";
import fetchGroupList from "~/composables/group/fetchGroupList";
import updateOwners from "~/composables/asset/updateOwners";
import { Classification } from "~/api/atlas/classification";

export default defineComponent({
  components: { StatusBadge },

  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    let now = ref(true);
    let linkedClassifications = computed(
      () => props.item?.classifications ?? []
    );
    let asset = computed(() => props.item ?? {});
    const linkClassificationPopover = ref(false);
    const linkClassificationStatus = ref("");
    const linkClassificationStatusError = ref("");
    const unlinkClassificationStatus = ref("");
    const unlinkClassificationStatusError = ref("");
    const showCreateClassificationPopover = ref(false);

    const createClassificationRef = ref(null);

    let ownerType = ref("user");

    const {
      list,
      total,
      filtered,
      handleSearch: handleUserSearch,
    } = fetchUserList(now);

    const {
      list: listGroup,
      handleSearch: handleGroupSearch,
      total: totalGroupCount,
    } = fetchGroupList(now);

    const {
      handleCancel,
      execute,
      isReady,
      state,
      ownerUsers,
      isCompleted,
      ownerGroups,
    } = updateOwners(props.item, ownerType);

    const handleUpdate = () => {
      execute();
    };

    const handleSearch = (e) => {
      if (ownerType.value === "user") {
        handleUserSearch(e);
      }
      if (ownerType.value === "group") {
        handleGroupSearch(e);
      }
    };

    let searchText = ref("");
    const handleOwnerTypeChange = (e: any) => {
      searchText.value = "";
      handleSearch(searchText.value);
    };

    const handleClassificationClick = () => {
      console.log("clciked");
    };

    //Todo need to add showAddTagButton props using policy

    /*
    const evaluateAssetAccess = ($axios, params) => {
  console.log(params);

  // return [{ username: "varun" }, { username: "krishna" }];
  return $axios.$post(`${tenantPath($axios)}/access/evaluate`, {
    ...params,
    validateStatus(status) {
      return status >= 200 && status < 300;
    }
  });
};
*/
    const formattedLinkedClassifications = computed(() => {
      return linkedClassifications.value.map((classification) => {
        if (
          classification &&
          classification.hasOwnProperty("isAutoClassification") &&
          classification.isAutoClassification
        ) {
          return {
            ...classification,
            hideRemoveButton: false,
          };
        } else if (
          classification.propagate &&
          classification.entityGuid &&
          asset.value.guid !== classification.entityGuid
        ) {
          return {
            ...classification,
            hideRemoveButton: true,
          };
        }
        return {
          ...classification,
          hideRemoveButton: false,
        };
      });
    });

    console.log(
      formattedLinkedClassifications,
      "formattedCLassification",
      asset.value.guid,
      asset
    );

    const unLinkClassification = (classification) => {
      emit("unLinkClassification", classification);
    };

    const openLinkClassificationPopover = () => {
      console.log("clicked");
      linkClassificationPopover.value = true;
    };

    // fetching classifications
    let classificationsList = ref(null);
    const fetchClassificationStatus = ref("");
    const {
      data: classificationData,
      error: classificationError,
    } = Classification.getClassificationList({ cache: false });
    fetchClassificationStatus.value = "loading";

    const ShowFetchStatusString = computed(() => {
      switch (fetchClassificationStatus.value) {
        case "success": {
          return "success";
        }
        case "error": {
          return "Something went wrong!";
        }
        default: {
          return "Loading...";
        }
      }
    });

    let availableClassificationsForLink = ref([]);

    watch([classificationData, classificationError], () => {
      if (classificationData.value) {
        fetchClassificationStatus.value = "success";
        let cls = classificationData.value.classificationDefs ?? [];
        cls = cls.map((classification) => {
          classification.alias = classification.name;
          return classification;
        });
        classificationsList.value = cls ?? [];
        console.log(classificationsList.value, "classificationList");
      } else {
        fetchClassificationStatus.value = "error";
        console.log("classification erorr ");
      }
    });

    watch([classificationsList, linkedClassifications], () => {
      if (classificationsList.value && linkedClassifications.value) {
        let availableClassifications = [];
        classificationsList.value.forEach((classification) => {
          let index = linkedClassifications.value.findIndex(
            (cl) => cl.typeName === classification.name
          );
          if (index === -1) availableClassifications.push(classification);
        });
        availableClassificationsForLink.value = availableClassifications;
        console.log(availableClassificationsForLink, "available");
      }
    });

    const linkClassificationLocally = (payloadArray) => {
      const payload = payloadArray.value.shift();
      linkedClassifications.value.push(payload);
    };

    const handleLinkClassificationPopoverSave = () => {
      const payload = ref([
        {
          entityGuid: asset.value.guid,
          attributes: {},
          propagate: linkClassificationData.value.propagate,
          removePropagationsOnEntityDelete:
            linkClassificationData.value.removePropagationsOnEntityDelete,
          typeName: linkClassificationData.value.typeName,
          validityPeriods: [],
        },
      ]);
      linkClassificationStatus.value = "loading";
      const { data, error, isReady } = Classification.linkClassification({
        cache: undefined,
        payload,
        entityGuid: asset.value.guid,
      });

      watch([data, error, isReady], () => {
        if (isReady && !error.value) {
          linkClassificationStatus.value = "success";
          linkClassificationPopover.value = false;
          linkClassificationLocally(payload);
        } else {
          console.log("link failed");
          linkClassificationStatus.value = "error";
          linkClassificationStatusError.value = "Something went wrong!";
        }
      });
    };

    const handleLinkClassificationPopoverCancel = () => {};

    const selectedClassificationForLink = ref(undefined);

    const linkClassificationData = ref({
      propagate: false,
      removePropagationsOnEntityDelete: true,
      typeName: "",
    });

    const handleSelectedClassificationForLink = (typeName) => {
      linkClassificationData.value.typeName = typeName;
    };

    const showCreateClassificationForm = () => {
      showCreateClassificationPopover.value = true;
    };

    const hideCreateClassificationWindow = () => {
      showCreateClassificationPopover.value = false;
    };

    const modifyClassificationsListLocally = (classification) => {
      console.log(toRaw(classificationsList.value), classification, "updated");
      let cl = ...classification;
      classificationsList.value= [ref(),...classificationsList.value,]
      console.log(classificationsList.value);
      // classificationsList.value = [
      //   ...classificationsList.value,
      //   classifications,
      // ];
    };

    interface FormState {
      name: string;
      description: string;
    }
    const createClassificationStatus = ref("");
    const createErrorText = ref("");
    const createClassificationFormRef = ref();

    const formState: UnwrapRef<FormState> = reactive({
      name: "",
      description: "",
    });
    const rules = {
      name: [
        {
          required: true,
          message: "Please input Classification name",
          trigger: "blur",
        },
      ],
    };

    const resetRef = (ref, time) => {
      setTimeout(() => {
        ref.value = "";
      }, time);
    };

    const createClassification = () => {
      const payload = {
        classificationDefs: [],
      };
      const classificationObj: any = {
        attributeDefs: [],
        description: "",
        name: "",
        superTypes: [],
      };

      createClassificationFormRef.value
        .validate()
        .then(() => {
          classificationObj.name = formState.name;
          classificationObj.description = formState.description;
          payload.classificationDefs.push(classificationObj);
          // create classification
          createClassificationStatus.value = "loading";
          const {
            data: createClassificationData,
            error: createClassificationError,
          } = Classification.createClassification({ cache: false, payload });

          watch([createClassificationData, createClassificationError], () => {
            console.log(createClassificationData, createClassificationError);
            if (createClassificationData.value) {
              let classifications =
                createClassificationData.value.classificationDefs ?? [];
              console.log(
                "getClassifications -> classifications",
                classifications
              );
              createClassificationStatus.value = "success";
              formState.name = "";
              formState.description = "";
              modifyClassificationsListLocally(toRaw(classifications));
              hideCreateClassificationWindow();
            } else {
              createClassificationStatus.value = "error";
              const error = toRaw(createClassificationError.value);
              console.log("errormessage", error.response.data.errorMessage);
              createErrorText.value = error.response.data.errorMessage;
              resetRef(createErrorText, 6000);
            }
          });
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log("error", error);
        });
    };

    return {
      asset,
      createClassificationStatus,
      createClassificationFormRef,
      showCreateClassificationPopover,
      linkClassificationData,
      linkClassificationStatus,
      selectedClassificationForLink,
      handleSelectedClassificationForLink,
      handleLinkClassificationPopoverCancel,
      handleLinkClassificationPopoverSave,
      openLinkClassificationPopover,
      availableClassificationsForLink,
      linkClassificationPopover,
      formattedLinkedClassifications,
      unLinkClassification,
      handleClassificationClick,
      createClassificationRef,
      showCreateClassificationForm,
      createClassification,
      formState,
      rules,
      createErrorText,
    };
  },
});

// typeName is name in classification
</script>

<style lang="less" module>
.borderless {
  @apply border-none shadow-none px-4 !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  &:global(.ant-input-affix-wrapper-focused) {
    @apply border-none shadow-none;
  }
}
:global(.ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before) {
  @apply hidden;
}
// Aesterik in right side
:global(.ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after) {
  display: inline-block;
  margin-left: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: "*";
}
</style>
