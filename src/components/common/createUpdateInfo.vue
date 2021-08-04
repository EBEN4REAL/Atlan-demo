<template>
  <p class="mb-0 text-sm text-gray-400" style="word-break: break-word">
    <span v-if="createdAtString || createdBy">
      Created {{ createdAtString }}
      <span v-if="createdBy">
        by
        <span
          class="underline cursor-pointer text-primary"
          @click="() => handleClickUser(createdBy)"
          >{{ createdBy }}</span
        >
      </span>
    </span>
    <span v-if="updatedAtString || updatedBy">
      <span class="px-1">·</span>
      Updated {{ updatedAtString }}
      <span v-if="updatedBy">
        by
        <span
          class="underline cursor-pointer text-primary"
          @click="() => handleClickUser(updatedBy)"
        >
          {{ updatedBy }}</span
        >
      </span>
    </span>
  </p>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

// ? Composables
import { useTimeAgo } from "@vueuse/core";
import { useUserPreview } from "~/composables/user/showUserPreview";

// ? Utils

export default defineComponent({
  props: {
    createdAt: {
      type: [Number, String],
      default: 0,
    },
    createdBy: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: [Number, String],
      default: 0,
    },
    updatedBy: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    // user preview drawer
    const { showUserPreview, setUserUniqueAttribute } = useUserPreview();

    // ? Methods
    const handleClickUser = (username: string) => {
      setUserUniqueAttribute(username, "username");
      showUserPreview({ allowed: ["about"] });
    };

    // ? computed
    const updatedAtString = computed(() => {
      if (props.updatedAt) {
        return useTimeAgo(props.updatedAt).value;
      }
      return 0;
    });

    const createdAtString = computed(() => {
      if (props.createdAt) {
        return useTimeAgo(props.createdAt).value;
      }
      return 0;
    });

    return {
      useTimeAgo,
      updatedAtString,
      createdAtString,
      handleClickUser,
    };
  },
});
</script>

<style scoped></style>
