<template>
  <div class="flex flex-wrap gap-1">
    <template v-for="(tag, index) in finalTags" :key="index">
      <a-tooltip v-if="tag.length > 20" :title="tag">
        <a-tag
          :closable="tag.hasOwnProperty('closeable')?tag[closable]:true"
          :key="tag"
          @close="handleClose(tag)"
          class="bg-gray-50"
        >{{ `${tag.slice(0, 20)}...` }}</a-tag>
      </a-tooltip>
      <a-tag
        :closable="tag.hasOwnProperty('closeable')?tag[closable]:true"
        v-else
        @close="handleClose(tag)"
        class="bg-gray-50"
      >{{ tag }}</a-tag>
    </template>
    <a-input
      v-if="inputVisible && !disableNewTag"
      ref="inputRef"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      v-model:value="inputValue"
      @blur="handleInputConfirm"
      @keyup.enter="$event.target.blur()"
    />
    <a-tag
      v-else-if="!disableNewTag"
      class="bg-white"
      @click="showInput"
      style="background: #fff; border-style: dashed"
    >
      <fa icon="fal plus" class="pushtop"></fa>New Tag
    </a-tag>
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
  onMounted,
  computed,
} from "vue";

export default defineComponent({
  props: {
    tags: {
      type: Array,
      default: ["Unremovable", "Tag 2", "Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3Tag 3"],
    },
    disableNewTag: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  setup(props, context) {
    const inputRef = ref();
    const tagsF = computed(() => props.tags);
    const finalTags = ref(tagsF);
    const state = reactive({
      tags: props.tags,
      inputVisible: false,
      inputValue: "",
    });

    onMounted(() => {
      state.tags = [...props.tags];
    });
    // watch(
    //   () => props.tags,
    //   () => {
    //     state.tags = [...props.tags];
    //   }
    // );
    watch(
      () => state.tags,
      () => {
        console.log(state.tags);
      }
    );
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
      const inputValue = state.inputValue;
      let tags = state.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      console.log(tags);
      Object.assign(state, {
        tags,
        inputVisible: false,
        inputValue: "",
      });
      context.emit("updateTags", inputValue);
    };
    return {
      ...toRefs(state),
      handleClose,
      showInput,
      handleInputConfirm,
      inputRef,
      finalTags,
    };
  },
});
</script>