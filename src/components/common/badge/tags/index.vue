<template>
  <div>
    <div v-if="!allowUpdate && !tags.length">-</div>
    <div v-else class="flex flex-wrap gap-1">
      <div v-for="(tag, index) in tags" :key="index">
        <a-tooltip v-if="tag.length > 20" :title="tag">
          <a-tag
            :closable="allowUpdate"
            :key="tag"
            @close="handleClose(tag)"
            class="bg-gray-50"
            :class="[updatingTags ? 'text-gray-300 pointer-events-none' : '']"
            >{{ `${tag.slice(0, 20)}...` }}</a-tag
          >
        </a-tooltip>
        <a-tag
          :closable="allowUpdate"
          v-else
          @close="handleClose(tag)"
          :class="[updatingTags ? 'text-gray-300 pointer-events-none' : '']"
          class="bg-gray-50"
          >{{ tag }}</a-tag
        >
      </div>

      <a-input
        v-if="inputVisible"
        :disabled="updatingTags"
        ref="inputRef"
        type="text"
        size="small"
        :style="{ width: '78px' }"
        v-model:value="inputValue"
        @blur="handleInputConfirm"
        @keyup.enter="$event.target.blur()"
      />
      <a-tag
        v-else-if="!updatingTags && allowUpdate"
        class="bg-white"
        @click="showInput"
        style="background: #fff; border-style: dashed"
      >
        <fa icon="fal plus" class="pushtop"></fa>New Tag
      </a-tag>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  nextTick,
  watch,
  computed,
} from "vue";

export default defineComponent({
  props: {
    tags: {
      type: Array,
      default: ["Unremovable", "Tag 2", "Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3"],
    },
    updatingTags: {
      type: Boolean,
      default: false,
    },
    allowUpdate: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  setup(props, context) {
    const inputRef = ref();
    const defaultTags = computed(() => props.tags);
    const state = reactive({
      tags: defaultTags,
      inputVisible: false,
      inputValue: "",
    });
    const handleClose = (removedTag: string) => {
      const tags = state.tags.filter((tag) => tag !== removedTag);
      console.log(tags);
      state.tags = tags;
      Object.assign(state, {
        tags,
        inputVisible: false,
        inputValue: "",
      });
      context.emit("updateTags", removedTag, "remove");
    };

    const showInput = () => {
      state.inputVisible = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    };

    const handleInputConfirm = () => {
      if (state.inputValue) {
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        console.log(tags);
        context.emit("updateTags", inputValue);
        watch(
          () => props.updatingTags,
          (newValue) => {
            if (!newValue)
              Object.assign(state, {
                tags,
                inputVisible: false,
                inputValue: "",
              });
          }
        );
      } else {
        state.inputVisible = false;
        state.inputValue = "";
      }
    };
    return {
      ...toRefs(state),
      handleClose,
      showInput,
      handleInputConfirm,
      inputRef,
    };
  },
});
</script>