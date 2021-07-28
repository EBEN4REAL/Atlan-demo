<template>
  <div class="w-full pt-4 overflow-y-auto rounded container-height">
    <Bookmark
      :links="links"
      :showOverflowFade="true"
      @handleUpdateBookmark="handleUpdateBookmark"
      @handleDeleteBookmark="handleDeleteBookmark"
      @handleBookmarAdd="handleBookmarAdd"
    />
    <div class="mt-8 border rounded h-80">
      <p class="px-4 py-2 text-lg border-b text-gray-dark">Project Overview</p>
    </div>
    <div class="flex h-64 mt-6">
      <div class="flex-1 mr-6 border rounded">
        <p class="px-4 py-2 text-lg border-b text-gray-dark">FAQs</p>
      </div>
      <div class="flex-1 h-64 border rounded">
        <p class="px-4 py-2 text-lg border-b text-gray-dark">Flat Files</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, toRaw, Ref, watch } from "vue";
import Bookmark from "@common/bookmark/index.vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: { Bookmark },
  props: {
    id: String,
  },
  setup(props) {
    useHead({
      title: "Project Home",
    });

    const links = ref([
      {
        faviconURL: "https://img.icons8.com/ios/50/000000/notion.png",
        title: "notion",
        key: "1",
        altText: "notion",
        url: "https:notion.com",
      },
      {
        faviconURL:
          "https://s2.googleusercontent.com/s2/favicons?domain_url=https://hashnode.com",
        title: "Hasnode",
        key: "2",
        altText: "hashnode",
        url: "https://hashnode.com",
      },
      {
        faviconURL:
          "https://s2.googleusercontent.com/s2/favicons?domain_url=https://hashnode.com",
        title: "Hasnode",
        key: "2",
        altText: "hashnode",
        url: "https://hashnode.com",
      },
      {
        faviconURL:
          "https://s2.googleusercontent.com/s2/favicons?domain_url=https://hashnode.com",
        title: "Hasnode",
        key: "2",
        altText: "hashnode",
        url: "https://hashnode.com",
      },
    ]);
    const bookmarkBarStyle = {
      width: "65vw",
    };
    const handleUpdateBookmark = (linkData: any) => {
      console.log(linkData, "update");
      const index = links.value.findIndex((link) => link.key === linkData.key);
      if (index !== -1) links.value[index] = linkData;
    };
    const handleDeleteBookmark = (linkData: any) => {
      console.log(linkData, "delete");
      const index = links.value.findIndex((link) => link.key === linkData.key);
      links.value.splice(index, 1);
    };
    const handleBookmarAdd = (linkData: any) => {
      console.log(linkData, "add");
      const timeStamp = new Date();
      links.value.push({
        ...linkData,
        key: timeStamp,
        alt: "link",
      });
    };

    return {
      handleBookmarAdd,
      handleDeleteBookmark,
      handleUpdateBookmark,
      bookmarkBarStyle,
      links,
    };
  },
});
</script>

<style lang="less" scoped>
.view {
  border: 3px solid white;
  margin-left: -8px;
}
.container-height {
  height: calc(100vh - 20rem);
}
</style>

<route lang="yaml">
      meta:
        layout: default
        requiresAuth: true
    </route>
