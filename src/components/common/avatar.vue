<template>
  <div class="flex items-center">
    <div v-if="allowUpload">
      <a-upload
        accept="image/*"
        class="cursor-pointer"
        :custom-request="handleUploadAvatar"
        :show-upload-list="false"
      >
        <div
          v-if="!isReady && uploadStarted"
          class="hidden text-center border-2 border-white rounded-md bg-primary-muted sm:block"
          :style="{ width: avatarSize + 'px', height: avatarSize + 'px' }"
        >
          <a-spin
            wrapper-class-name="test"
            size="small"
            class="flex items-center justify-center w-full h-full"
          ></a-spin>
        </div>
        <a-avatar
          v-else
          :key="uploadKey"
          :shape="avatarShape"
          :size="avatarSize"
          class="hidden border-2 border-white rounded-md ant-tag-blue text-primary bg-primary-muted sm:block"
          :src="updatedImageUrl"
        >{{ getNameInitials(getNameInTitleCase(avatarName)) }}</a-avatar>
      </a-upload>
    </div>
    <div v-else>
      <a-avatar
        :key="uploadKey"
        :shape="avatarShape"
        :size="avatarSize"
        class="hidden border-2 border-white rounded-md ant-tag-blue text-primary bg-primary-muted sm:block"
        :src="updatedImageUrl"
      >{{ getNameInitials(getNameInTitleCase(avatarName)) }}</a-avatar>
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
  name: "Avatar",
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
    const uploadStarted = ref(false);
    const updatedImageUrl = ref(props.imageUrl);

    watch(
      () => props.imageUrl,
      () => {
        updatedImageUrl.value = props.imageUrl;
      }
    );
    const { upload, isReady, uploadKey, refreshImage } = uploadAvatar();
    const handleUploadAvatar = async (uploaded) => {
      console.log("handle Upload", uploaded);
      upload(uploaded.file);
      uploadStarted.value = true;
      updatedImageUrl.value = `${updatedImageUrl.value  }?${  uploadKey.value}`;

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