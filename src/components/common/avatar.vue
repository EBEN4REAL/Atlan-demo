<template>
  <div class="flex items-center">
    <div v-if="allowUpload">
      <a-upload
        accept="image/*"
        class="cursor-pointer"
        :customRequest="handleUploadAvatar"
        :show-upload-list="false"
      >
        <div
          class="hidden text-center border-2 rounded-lg border-primary-300 sm:block"
          :style="{ width: avatarSize + 'px', height: avatarSize + 'px' }"
          v-if="!isReady && uploadStarted"
        >
          <a-spin
            wrapperClassName="test"
            size="small"
            class="flex items-center justify-center w-full h-full"
          ></a-spin>
        </div>
        <a-avatar
          v-else
          :key="uploadKey"
          :shape="avatarShape"
          :size="avatarSize"
          class="hidden border-2 rounded-lg ant-tag-blue text-primary-500 border-primary-300 sm:block"
          :src="updatedImageUrl"
        >
          {{
          getNameInitials(
          getNameInTitleCase(avatarName)
          )
          }}
        </a-avatar>
      </a-upload>
    </div>
    <div v-else>
      <a-avatar
        :key="uploadKey"
        :shape="avatarShape"
        :size="avatarSize"
        class="hidden border-2 rounded-lg ant-tag-blue text-primary-500 border-primary-300 sm:block"
        :src="updatedImageUrl"
      >
        {{
        getNameInitials(
        getNameInTitleCase(avatarName)
        )
        }}
      </a-avatar>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import {
  getNameInitials,
  getNameInTitleCase,
} from "~/composables//utils/string-operations";
import uploadAvatar from "~/composables/avatar/uploadAvatar";
export default {
  name: "avatar",
  props: {
    avatarName: {
      type: String,
      default: "",
    },
    allowUpload: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    avatarShape: {
      type: String,
      default: "square",
    },
    avatarSize: {
      type: Number,
      default: 56,
    },
  },
  setup(props, context) {
    let uploadStarted = ref(false);
    let updatedImageUrl = ref(props.imageUrl);
    const { upload, isReady, uploadKey, refreshImage } = uploadAvatar();
    const handleUploadAvatar = async (uploaded) => {
      console.log("handle Upload", uploaded);
      upload(uploaded.file);
      uploadStarted.value = true;
      updatedImageUrl.value = updatedImageUrl.value + "?" + uploadKey.value;

      return true;
    };
    watch(uploadKey, () => {
      context.emit("imageUpdated", updatedImageUrl);
    });
    return {
      handleUploadAvatar,
      isReady,
      uploadStarted,
      uploadKey,
      updatedImageUrl,
      getNameInitials,
      getNameInTitleCase,
      refreshImage,
    };
  },
};
</script>

<style>
.test {
  height: 100%;
  width: 100%;
}
</style>