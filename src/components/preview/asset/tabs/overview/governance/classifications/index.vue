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
          <p class="mt-2 text-xs text-gray-400">
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
          <p class="mb-1 text-lg text-gray-500 border-b">
            Create Classification
          </p>
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
      class="px-2 py-1 transition duration-500 ease-in-out rounded-lg  hover:bg-gray-50 hover:border"
    >
      <p class="mb-1 text-sm tracking-wide text-gray-400">Classifications</p>
      <div class="flex flex-wrap items-center gap-x-1">
        <template
          v-for="(classification, index) in assetLinkedClassifcations"
          :key="'classification-' + classification?.typeName + index"
        >
          <div class="flex m-1 mb-1 rounded-md">
            <div
              class="flex items-center px-2 py-2 leading-none align-middle cursor-pointer  bg-primary-300 text-primary-400 bg-opacity-10 hover:bg-primary-500 hover:text-white drop-shadow-sm"
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
              :loading="
                unlinkClassificationStatus.status === 'loading' &&
                unlinkClassificationStatus.typeName === classification.typeName
                  ? true
                  : false
              "
              class="flex items-center justify-center p-1 px-2 border-none  bg-primary-300 hover:bg-primary-500 hover:text-white bg-opacity-10"
            >
              <span
                class="flex items-center justify-center"
                v-if="
                  unlinkClassificationStatus.status === 'loading' &&
                  unlinkClassificationStatus.typeName ===
                    classification.typeName
                    ? false
                    : true
                "
              >
                <fa icon="fal times-circle" class="" />
              </span>
            </a-button>
          </div>
        </template>
        <a-button
          @click.stop.prevent="openLinkClassificationPopover"
          class="flex items-center justify-center p-1 px-2 ml-1  bg-primary-300 hover:bg-primary-500 hover:text-white bg-opacity-10"
        >
          <span class="flex items-center justify-center">
            <fa icon="fal plus" class="" />
          </span>
        </a-button>
      </div>
      <p
        class="mb-0 text-gray-500"
        v-if="assetLinkedClassifcations?.length < 1"
      >
        No classifications added
      </p>
    </div>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, toRaw, reactive } from "vue";
import { Classification } from "~/api/atlas/classification";
import { useDiscoveryStore } from "~/pinia/discovery";

export default defineComponent({
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
    const store = useDiscoveryStore();
    let asset = computed(() => props.item ?? {});
    const linkClassificationPopover = ref(false);
    const linkClassificationStatus = ref("");
    const linkClassificationStatusError = ref("");
    const unlinkClassificationStatus = ref({
      status: "",
      typeName: null,
    });
    const unlinkClassificationStatusErrorText = ref("");
    const showCreateClassificationPopover = ref(false);

    const createClassificationRef = ref(null);

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
    const assetLinkedClassifcations = computed(
      () => store.selectedAsset.classifications
    );
    console.log(assetLinkedClassifcations, "assetLinkedClassifcations");

    const unLinkClassification = (classification: any) => {
      unlinkClassificationStatus.value.status = "loading";
      unlinkClassificationStatus.value.typeName = classification.typeName;
      const { typeName, entityGuid } = classification;
      // No content response
      const { data, error, isReady } = Classification.archiveClassification({
        cache: false,
        typeName,
        entityGuid,
      });

      /* Todo show loader during unlinking of classification from asset*/
      watch([data, error, isReady], () => {
        if (isReady && !error.value) {
          unlinkClassificationStatus.value.status = "success";
          unlinkClassificationStatus.value.typeName = null;
          store.removeClassificationToSelectedAsset(classification);
        } else {
          unlinkClassificationStatus.value.status = "failed";
          unlinkClassificationStatus.value.typeName = null;
          unlinkClassificationStatusErrorText.value = "something went wrong";
          console.error("unling link failed");
        }
      });
    };

    const openLinkClassificationPopover = () => {
      console.log("clicked");
      linkClassificationPopover.value = true;
    };

    // fetching classifications
    const fetchClassificationStatus = ref("");
    console.log(store.isClassificationsFetched, "fetchedddddd");

    let availableClassificationsForLink = computed(
      () => store.availableClassificationsForLink
    );

    const linkClassificationData = ref({
      propagate: false,
      removePropagationsOnEntityDelete: true,
      typeName: "",
    });

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
          const classification = payload.value.shift();
          store.addClassificationToSelectedAsset(classification);
          selectedClassificationForLink.value = undefined;
        } else {
          console.log("link failed");
          linkClassificationStatus.value = "error";
          linkClassificationStatusError.value = "Something went wrong!";
        }
      });
    };

    const handleLinkClassificationPopoverCancel = () => {
      linkClassificationPopover.value = false;
    };

    const selectedClassificationForLink = ref(undefined);

    const handleSelectedClassificationForLink = (typeName) => {
      linkClassificationData.value.typeName = typeName;
    };

    const showCreateClassificationForm = () => {
      showCreateClassificationPopover.value = true;
    };

    const hideCreateClassificationWindow = () => {
      showCreateClassificationPopover.value = false;
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
              store.addClassifications(toRaw(classifications));
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

    const handleClassificationClick = () => {};

    return {
      asset,
      unlinkClassificationStatus,
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
      assetLinkedClassifcations,
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
