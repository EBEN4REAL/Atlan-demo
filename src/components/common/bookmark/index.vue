<template>
  <div class="flex items-stretch">
    <div
      class="flex items-stretch mr-3 overflow-x-auto flex-nowrap bookmark-bar "
    >
      <div
        v-for="(link, index) in links"
        :key="link.key"
        class="flex bookmark-bar-child "
      >
        <a-dropdown
          v-model:visible="showBookmarkDropdownArray[index]"
          :trigger="['click']"
          @visibleChange="hideEditBookmarkDropdown"
        >
          <div
            class="flex items-center justify-center py-0.5 px-2 border rounded mr-3 hover:bg-gray-100 cursor-pointer"
            :class="
              showBookmarkDropdownArray[index] &&
              selectedBookmarkId === link.key
                ? 'bg-gray-100'
                : ''
            "
            @click="() => toggleBookmarkDropDown({ key: link.key, index })"
          >
            <img
              :src="link.faviconURL"
              :alt="link.altText"
              class="w-5 h-5 mr-2"
            />
            <p class="mb-0 text-gray-500">{{ link.title }}</p>
          </div>
          <template v-if="selectedBookmarkId === link.key" #overlay>
            <div
              v-if="!editSelectedBookmark"
              class="px-4 py-2 bg-white rounded shadow "
              @click.prevent
            >
              <p
                class="flex mb-2 cursor-pointer hover:text-primary"
                @click="() => handleEditBookmark(selectedBookmarkId)"
              >
                <span class="flex items-center justify-center mr-2">
                  <fa icon="fal pencil-alt"></fa
                ></span>
                Edit
              </p>
              <p
                class="flex mb-2 cursor-pointer hover:text-primary"
                @click="handleCopyLink"
              >
                <span class="flex items-center justify-center mr-2">
                  <fa icon="fal copy"></fa
                ></span>
                Copy Link
              </p>
              <p
                class="flex mb-2 cursor-pointer hover:text-red-500"
                @click="() => handleDeleteBookmark(link)"
              >
                <span class="flex items-center justify-center mr-2">
                  <fa icon="fal trash-alt"></fa
                ></span>
                Delete
              </p>
            </div>
            <div
              v-else
              class="w-64 px-4 py-4 bg-white rounded shadow add-bookmark"
              @click.prevent
            >
              <div class="flex items-center justify-between mb-3">
                <p class="mb-0 text-lg font-bold text-dark-gray">
                  Edit Bookmark
                </p>
                <span
                  class="flex items-center justify-center text-lg cursor-pointer hover:text-red-500"
                >
                  <fa
                    icon="fal times-circle"
                    @click="hideEditBookmarkDropdown"
                  ></fa
                ></span>
              </div>

              <a-form
                ref="editBookMarkRef"
                :model="editBookmarkState"
                :rules="rules"
                layout="vertical"
              >
                <a-form-item label="Link" name="url" class="mb-3">
                  <a-input
                    v-model:value="editBookmarkState.url"
                    placeholder="eg: https://notion.so"
                    @change="handleEditInputChange"
                  />
                </a-form-item>
                <a-form-item
                  v-if="editShowTitle"
                  label="Title"
                  name="title"
                  class="mb-4"
                >
                  <a-input
                    v-model:value="editBookmarkState.title"
                    place="Enter a title"
                  >
                    <template #prefix>
                      <img
                        v-if="editBookmarkState.faviconURL"
                        :src="editBookmarkState.faviconURL"
                        class="w-5 h-5 mr-2"
                      />
                      <img
                        v-else
                        src="https://img.icons8.com/ios/250/000000/attach.png"
                        class="w-6 h-6 mr-2"
                      />
                    </template>
                  </a-input>
                </a-form-item>
                <div v-if="editShowTitle" class="flex justify-end">
                  <a-button
                    type="primary"
                    class="rounded"
                    :loading="updateBtnLoading"
                    @click="() => handleUpdateBookmark(link)"
                    >Update</a-button
                  >
                </div>
              </a-form>
            </div>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div
      v-if="showOverflowFade"
      class="absolute right-0 w-24 h-8 right-fade"
    ></div>
    <div>
      <a-dropdown v-model:visible="showDropdown" :trigger="['click']">
        <a-button
          v-if="links.length > 0"
          class="h-full p-2 px-2 rounded"
          @click="toggleDropDown"
        >
          <span class="flex items-center justify-center">
            <fa icon="fal plus"></fa
          ></span>
        </a-button>
        <a-button
          v-else
          class="flex items-center h-full px-3 py-2 text-sm rounded text-gray"
          @click="toggleDropDown"
        >
          <span class="flex items-center justify-center mr-2">
            <fa icon="fal plus"></fa
          ></span>
          Add bookmark
        </a-button>
        <template #overlay>
          <div
            class="w-64 px-4 py-4 bg-white rounded shadow add-bookmark"
            @click.prevent
          >
            <p class="text-lg font-bold text-dark-gray">
              Add Bookmarks
            </p>
            <a-form
              ref="addBookMarkRef"
              :model="addBookmarkState"
              :rules="rules"
              layout="vertical"
            >
              <a-form-item label="Link" name="url" class="mb-3">
                <a-input
                  v-model:value="addBookmarkState.url"
                  v-input-focus
                  placeholder="eg: https://notion.so"
                  @change="handleInputChange"
                />
              </a-form-item>
              <a-form-item
                v-if="showTitle"
                label="Title"
                name="title"
                class="mb-4"
              >
                <a-input
                  v-model:value="addBookmarkState.title"
                  place="Enter a title"
                >
                  <template #prefix>
                    <img
                      :src="addBookmarkState.faviconURL"
                      class="w-5 h-5 mr-2"
                    />
                  </template>
                </a-input>
              </a-form-item>
              <div v-if="showTitle" class="flex justify-end">
                <a-button
                  type="primary"
                  class="rounded"
                  :loading="addBtnLoading"
                  @click="handleBookmarkAdd"
                  >Done</a-button
                >
              </div>
            </a-form>
          </div>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, computed, ComputedRef } from "vue";
import { useHead } from "@vueuse/head";

interface link {
  [index: string]: {
    key: string | number;
    title: string;
    url: string;
    faviconURL: string;
    altText?: string;
  };
}
export default defineComponent({
  components: {},
  props: {
    className: {
      type: String,
      default: "",
    },
    links: {
      type: Object as () => Ref<link[]>,
      default: [],
    },
    bookmarkBarStyle: {
      type: Object,
      default: {},
    },
    showOverflowFade: {
      type: Boolean,
      default: false,
    },
    addBtnLoading: {
      type: Boolean,
      default: false,
    },
    updateBtnLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    useHead({
      title: "Bookmark",
    });
    const urlValidationRegex = new RegExp(
      "(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)",
      "g"
    );
    const addBookMarkRef: Ref<any> = ref(null);
    const showDropdown = ref(false);
    const links: ComputedRef<link[]> = computed(() => props.links);
    const addBtnLoading = computed(() => props.addBtnLoading);
    const updateBtnLoading = computed(() => props.updateBtnLoading);
    const showBookmarkDropdownArray = ref(links.value.map((e) => false));
    watch(links, () => {
      showBookmarkDropdownArray.value = links.value.map((e) => false);
    });
    const selectedBookmarkId: Ref<string> = ref("");
    const editSelectedBookmark = ref(false);
    const showTitle = ref(false);
    const addBookmarkState: Ref<{
      title: string;
      url: string;
      faviconURL: string | null;
    }> = ref({
      url: "",
      title: "",
      faviconURL: "",
    });
    const rules = {
      url: [
        {
          required: true,
          pattern: urlValidationRegex,
          message: "Please enter a valid URL",
          trigger: "change",
        },
      ],
    };
    const toggleDropDown = () => {
      showDropdown.value = !showDropdown.value;
      addBookmarkState.value.url = "";
      addBookmarkState.value.title = "";
      addBookmarkState.value.faviconURL = null;
      if (addBookMarkRef.value) addBookMarkRef.value.clearValidate();
      showTitle.value = false;
    };

    const fetchAndSetMetaDataOfUrl = () => {
      let urlHostName = "";
      const hostNameParts = new URL(addBookmarkState.value.url).hostname.split(
        "."
      );
      if (hostNameParts.length > 0) urlHostName = hostNameParts[0];
      const faviconURL = `https://s2.googleusercontent.com/s2/favicons?domain=${addBookmarkState.value.url}`;
      // make first letter uppercase
      urlHostName = urlHostName.replace(/\w/, (c) => c.toUpperCase());
      addBookmarkState.value.faviconURL = faviconURL;
      addBookmarkState.value.title = urlHostName;
    };

    const handleInputChange = (e: any) => {
      addBookMarkRef.value
        .validate()
        .then(() => {
          showTitle.value = true;
          fetchAndSetMetaDataOfUrl();
        })
        .catch((err: any) => {
          showTitle.value = false;
        });
    };

    const handleBookmarkAdd = () => {
      emit("handleBookmarAdd", addBookmarkState.value);
      showDropdown.value = false;
    };

    // edit

    const editBookMarkRef: Ref<any> = ref(null);
    const editShowTitle = ref(true);

    const handleEditInputChange = (e: any) => {
      editBookMarkRef.value
        .validate()
        .then(() => {
          editShowTitle.value = true;
          fetchAndSetEditMetaDataOfUrl();
        })
        .catch((err: any) => {
          editShowTitle.value = false;
        });
    };
    const toggleBookmarkDropDown = ({
      key,
      index,
    }: {
      key: string | number;
      index: number;
    }) => {
      showBookmarkDropdownArray.value[index] = !showBookmarkDropdownArray.value[
        index
      ];
      if (showBookmarkDropdownArray.value[index])
        selectedBookmarkId.value = key;
      else selectedBookmarkId.value = "";
    };

    const editBookmarkState = ref({
      url: "",
      title: "",
      faviconURL: "",
    });

    const handleEditBookmark = (selectedId: string) => {
      editSelectedBookmark.value = true;
      const resultedLink = links.value.find((link) => link.key === selectedId);
      editBookmarkState.value.title = resultedLink.title;
      editBookmarkState.value.url = resultedLink.url;
      editBookmarkState.value.faviconURL = resultedLink.faviconURL;
    };
    const hideEditBookmarkDropdown = () => {
      editSelectedBookmark.value = false;
    };

    const fetchAndSetEditMetaDataOfUrl = () => {
      let urlHostName = "";
      const hostNameParts = new URL(editBookmarkState.value.url).hostname.split(
        "."
      );
      if (hostNameParts.length > 0) urlHostName = hostNameParts[0];
      const faviconURL = `https://s2.googleusercontent.com/s2/favicons?domain=${editBookmarkState.value.url}`;
      // make first letter uppercase
      urlHostName = urlHostName.replace(/\w/, (c) => c.toUpperCase());
      editBookmarkState.value.faviconURL = faviconURL;
      editBookmarkState.value.title = urlHostName;
    };

    const handleUpdateBookmark = (linkData: any) => {
      emit("handleUpdateBookmark", {
        ...editBookmarkState.value,
        key: linkData.key,
        alt: linkData.alt,
      });
      editSelectedBookmark.value = false;
    };
    const handleDeleteBookmark = (linkData: any) => {
      emit("handleDeleteBookmark", linkData);
      editSelectedBookmark.value = false;
    };

    const handleCopyLink = () => {
      const selectedLink = links.value.find(
        (link) => link.key === selectedBookmarkId.value
      );
      navigator.clipboard.writeText(selectedLink.url).then(
        () => {
          console.log(
            "Async: Copying to clipboard was successful!",
            selectedLink.url
          );
        },
        (err) => {
          console.error("Async: Could not copy text: ", err);
        }
      );
    };

    return {
      addBtnLoading,
      updateBtnLoading,
      handleDeleteBookmark,
      handleUpdateBookmark,
      handleEditInputChange,
      links,
      editBookmarkState,
      hideEditBookmarkDropdown,
      editSelectedBookmark,
      selectedBookmarkId,
      toggleBookmarkDropDown,
      showBookmarkDropdownArray,
      handleBookmarkAdd,
      toggleDropDown,
      showTitle,
      showDropdown,
      rules,
      addBookMarkRef,
      addBookmarkState,
      handleInputChange,
      editBookMarkRef,
      editShowTitle,
      handleCopyLink,
      handleEditBookmark,
    };
  },
});
</script>

<style lang="less" scoped>
.add-bookmark {
  min-height: 150px;
}
.bookmark-bar-child {
  flex: 0 0 auto;
}
.bookmark-bar {
  position: relative;
}
.right-fade {
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    white 85%
  );
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

<route lang="yaml">
        meta:
          layout: default
          requiresAuth: true
      </route>
