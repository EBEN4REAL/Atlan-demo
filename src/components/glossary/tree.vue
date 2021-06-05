<!-- <template>
  <div class="w-100 h-100">
    <NewGlossary
      v-if="toggleNewGlossaryModal"
      :visible="toggleNewGlossaryModal"
      @submit="handleSubmitGlossary"
      @cancel="handleCancel"
    />
    <NewCategory
      v-if="toggleNewCategoryModal"
      :visible="toggleNewCategoryModal"
      :category-id="categoryId"
      :category-title="categoryTitle"
      :glossary-id="glossaryId"
      :glossary-title="glossaryTitle"
      @submit="handleSubmitCategory"
      @cancel="handleCancel"
    />
    <NewTerm
      v-if="toggleNewTermModal"
      :visible="toggleNewTermModal"
      :category-id="categoryId"
      :category-title="categoryTitle"
      :glossary-id="glossaryId"
      :glossary-title="glossaryTitle"
      @submit="handleSubmitTerm"
      @cancel="handleCancel"
    />
    <a-tree
      ref="tree"
      :tree-data="treeList"
      :load-data="onLoadData"
      :block-node="true"
      :expanded-keys="expandedKeys"
      :selected-keys="selectedKeys"
      @select="handleNodeSelect"
      @expand="handleExpand"
    >
      <div
        slot="title"
        slot-scope="{ title, key, type, glossaryGuid, icon, status }"
        class="flex items-center align-middle justify-between"
      >
        <a-tooltip
          class="flex items-center truncate text-gray-700 py-1 align-middle"
          :title="title"
          placement="right"
        >
          <emoji
            v-if="type === 'glossary'"
            :data="index"
            emoji=":file_folder:"
            set="twitter"
            :size="18"
            class="mx-1"
          />
          <emoji
            v-else-if="type === 'category'"
            :data="index"
            emoji=":file_folder:"
            set="facebook"
            :size="18"
            class="mx-1"
          />
          <emoji
            v-else-if="type === 'term' && icon"
            :data="index"
            :emoji="icon"
            :size="18"
            class="mx-1"
          />
          <div class="absolute" style="font-size: 9px">
            <i :class="getGlossaryStatusIcon(status)" />
          </div>
          <p class="text-sm truncate mb-0">{{ title }}</p>
        </a-tooltip>
        <a-dropdown class="mr-1">
          <a class="px-2"> <i class="far fa-ellipsis-v text-gray-300" /></a>
          <a-menu slot="overlay">
            <a-menu-item
              v-if="type !== 'term'"
              @click="handleNewTerm(key, title, glossaryGuid)"
            >
              <div class="flex align-middle items-center">
                <emoji
                  :data="index"
                  emoji=":memo:"
                  :size="16"
                  class="mr-2 p-0"
                  style="line-height: initial"
                />

                <p class="mb-0">New Tag</p>
              </div>
            </a-menu-item>

            <a-menu-item
              v-if="type === 'glossary' || type === 'category'"
              @click="handleNewCategory(key, title, glossaryGuid)"
            >
              <div class="flex align-middle items-center">
                <emoji
                  :data="index"
                  emoji=":file_folder:"
                  set="facebook"
                  :size="16"
                  class="mr-2 p-0"
                  style="line-height: initial"
                />

                <p class="mb-0">New Folder</p>
              </div>
            </a-menu-item>

            <a-menu-item
              v-if="type === 'glossary'"
              class="flex align-middle items-center text-red-500"
              @click="handleDeleteGlossary(key, title)"
            >
              <div class="mr-2">
                <i class="fal fa-trash" />
              </div>
              <div>Delete Glossary</div>
            </a-menu-item>
            <a-menu-item
              v-if="type === 'category'"
              class="flex align-middle items-center text-red-500"
              @click="handleDeleteCategory(key, title)"
            >
              <div class="mr-2">
                <i class="fal fa-trash" />
              </div>
              <div>Delete folder</div>
            </a-menu-item>
            <a-menu-item
              v-if="type === 'term'"
              class="flex align-middle items-center text-red-500"
              @click="handleDeleteTerm(key, title)"
            >
              <div class="mr-2">
                <i class="fal fa-trash" />
              </div>
              <div>Delete tag</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-tree>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";

import { mapActions } from "vuex";
import {
  MODULE_LIST_GLOSSARY,
  GLOSSARY_FETCH_LIST,
} from "~/constant/store_types";

// import data from "emoji-mart-vue-fast/data/all.json";
import { Emoji, EmojiIndex } from "emoji-mart-vue-fast";
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";

import NewGlossary from "~/components/workspace/glossary/newGlossary";
import NewCategory from "~/components/workspace/glossary/newCategory";
import NewTerm from "~/components/workspace/glossary/newTerm";

let index = new EmojiIndex(data);
import GlossaryMixin from "~/mixins/glossary";

import { Glossary } from "~/services/auth";

export default defineComponent({
  components: {
    Emoji,
    NewCategory,
    NewGlossary,
    NewTerm,
  },
  mixins: [GlossaryMixin],
  props: {
    list: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      toggleNewGlossaryModal: false,
      toggleNewCategoryModal: false,
      toggleNewTermModal: false,
      glossaryId: "",
      glossaryTitle: "",
      categoryId: "",
      categoryTitle: "",
      expandedKeys: [],
      cancelToken: null,
      treeList: [],
      index,
      selectedKeys: [],
      categories: [],
    };
  },
  mounted() {
    if (this.list) {
      this.list.forEach((item) => {
        if (item) {
          this.treeList.push({
            ...this.getNewGlossary(item),
            title: item.attributes.name,
          });
        }
      });
    }
  },
  methods: {
    ...mapActions(MODULE_LIST_GLOSSARY, [GLOSSARY_FETCH_LIST]),
    handleDeleteCategory(key, title) {
      const that = this;
      this.$confirm({
        title: `Are you sure you want to delete (${title}) ?`,
        content:
          "All the associaated terms and sub-categories will be deleted as well.",
        okType: "danger",
        okText: "Yes",
        onOk() {
          that.$message.loading({
            content: `Deleting Category (${title})`,
            key: "delete",
            duration: 0,
          });
          that.deleteCategory(key, title);
        },
        onCancel() {},
      });
    },
    handleDeleteTerm(key, title) {
      const that = this;
      this.$confirm({
        title: `Are you sure you want to delete (${title}) ?`,
        content: "All the relationships and propagation will be removed.",
        okType: "danger",
        okText: "Yes",
        onOk() {
          that.$message.loading({
            content: `Deleting Tag (${title})`,
            key: "delete",
            duration: 0,
          });
          that.deleteTerm(key, title);
        },
        onCancel() {},
      });
    },
    handleDeleteGlossary(key, title) {
      console.log(key);
      const that = this;
      this.$confirm({
        title: `Are you sure you want to delete (${title}) ?`,
        content:
          "All the associaated terms and categories will be deleted as well.",
        okType: "danger",
        okText: "Yes",
        onOk() {
          that.$message.loading({
            content: `Deleting Glossary (${title})`,
            key: "delete",
            duration: 0,
          });
          that.deleteGlossary(key, title);
        },
        onCancel() {},
      });
    },
    getNewGlossary(item) {
      let title = "";
      if (item.name) {
        title = item.name;
      } else if (item.attributes) {
        title = item.attributes.name;
      }
      return {
        title: title,
        selectable: true,
        key: item.guid,
        guid: item.guid,
        glossaryGuid: item.guid,
        class: "root",
        type: "glossary",
        status: this.getGlossaryStatus(item),
        scopedSlots: {
          title: "title",
        },
      };
    },
    getNewCategory(item) {
      return {
        title: item.name,
        key: item.guid,
        guid: item.guid,
        selectable: true,
        glossaryGuid: item.anchor.glossaryGuid,
        class: "folder",
        type: "category",
        status: this.getGlossaryStatus(item),
        scopedSlots: {
          title: "title",
        },
      };
    },
    getNewTerm(item) {
      let icon = ":memo:";
      if (item.additionalAttributes) {
        if (item.additionalAttributes.icon) {
          icon = item.additionalAttributes.icon;
        }
      }
      return {
        title: item.name,
        key: item.guid,
        guid: item.guid,
        selectable: true,
        glossaryGuid: item.anchor.glossaryGuid,
        icon: icon,
        categories: item.categories,
        class: "leaf",
        isLeaf: true,
        status: this.getGlossaryStatus(item),
        type: "term",
        scopedSlots: {
          title: "title",
        },
      };
    },
    handleNewGlossary() {
      this.toggleNewGlossaryModal = true;
    },
    handleNewCategory(key, title, glossaryId) {
      if (glossaryId === key) {
        this.glossaryId = key;
        this.glossaryTitle = title;
      } else {
        this.categoryId = key;
        this.categoryTitle = title;
        this.glossaryId = glossaryId;
      }
      this.toggleNewCategoryModal = true;
    },
    handleNewTerm(key, title, glossaryGuid) {
      if (key === glossaryGuid) {
        this.glossaryTitle = title;
        this.glossaryId = glossaryGuid;
        this.categoryId = glossaryGuid;
        this.categoryTitle = "";
      } else {
        this.categoryId = key;
        this.categoryTitle = title;
        this.glossaryId = glossaryGuid;
      }
      this.toggleNewTermModal = true;
    },
    handleSubmitGlossary(item) {
      this.toggleNewGlossaryModal = false;
      this.treeList.unshift(this.getNewGlossary(item));
      this.selectedKeys.splice(0, 1, item.guid);
    },
    handleSubmitCategory(subcategory) {
      this.toggleNewCategoryModal = false;

      const cat = this.getNewCategory(subcategory);

      if (!this.categoryId) {
        // find the glossary
        const found = this.treeList.find(
          (node) => node.guid === subcategory.anchor.glossaryGuid
        );
        if (found.children) {
          found.children.unshift(cat);
          this.treeList = [...this.treeList];
          if (!this.expandedKeys.includes(subcategory.anchor.glossaryGuid)) {
            this.expandedKeys.push(subcategory.anchor.glossaryGuid);
          }
          this.selectedKeys.splice(0, 1, subcategory.guid);
        } else {
          this.expandedKeys.push(subcategory.anchor.glossaryGuid);
          this.selectedKeys.splice(0, 1, subcategory.guid);
        }
      } else {
        // find the category
        const loop = (data, key, callback) => {
          data.forEach((item, index, arr) => {
            if (item.key === key) {
              return callback(item, index, arr);
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
          });
        };

        loop(this.treeList, subcategory.parentCategory.categoryGuid, (item) => {
          if (item.children) {
            item.children.unshift(cat);
            this.treeList = [...this.treeList];
            this.selectedKeys.splice(0, 1, subcategory.guid);
            if (
              !this.expandedKeys.includes(
                subcategory.parentCategory.categoryGuid
              )
            ) {
              this.expandedKeys.push(subcategory.parentCategory.categoryGuid);
            }
          } else {
            this.categories[subcategory.anchor.glossaryGuid].push(subcategory);
            this.expandedKeys.push(subcategory.parentCategory.categoryGuid);
            this.selectedKeys.splice(0, 1, subcategory.guid);
          }
        });
      }
      this.$emit("select", cat);
    },
    handleSubmitTerm(item) {
      this.toggleNewTermModal = false;
      const term = this.getNewTerm(item);
      // if the item has categories
      if (item.categories) {
        // find the category
        const loop = (data, key, callback) => {
          data.forEach((item, index, arr) => {
            if (item.key === key) {
              return callback(item, index, arr);
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
          });
        };
        if (item.categories.length > 0) {
          let categoryGuid = item.categories[0].categoryGuid;

          loop(this.treeList, categoryGuid, (founditem) => {
            // if already expanded
            if (founditem.children) {
              founditem.children.unshift(term);
              this.selectedKeys.splice(0, 1, founditem.guid);
              if (!this.expandedKeys.includes(categoryGuid)) {
                this.expandedKeys.push(categoryGuid);
              }
              this.treeList = [...this.treeList];
            } else {
              this.expandedKeys.push(categoryGuid);
              this.selectedKeys.splice(0, 1, founditem.guid);
            }
            //   arr.splice(index, 1);
          });
        }
      } else {
        // find the glossary
        const found = this.treeList.find(
          (node) => node.guid === item.anchor.glossaryGuid
        );
        if (found.children) {
          found.children.unshift(term);
          this.selectedKeys.splice(0, 1, item.guid);
          this.treeList = [...this.treeList];
          if (!this.expandedKeys.includes(item.anchor.glossaryGuid)) {
            this.expandedKeys.push(item.anchor.glossaryGuid);
          }
          this.selectedKeys.splice(0, 1, item.guid);
          // console.log(found);
        } else {
          this.treeList = [...this.treeList];
          this.expandedKeys.push(item.anchor.glossaryGuid);
          this.selectedKeys.splice(0, 1, item.guid);
        }
      }

      this.$emit("select", term);
    },
    handleCancel() {
      this.toggleNewGlossaryModal = false;
      this.toggleNewCategoryModal = false;
      this.toggleNewTermModal = false;
    },
    async deleteGlossary(id, title) {
      try {
        await Glossary.DeleteGlossary(this.$axios, id);
        this.toggleNewGlossaryModal = false;
        this.confirmLoading = false;

        this.treeList = this.treeList.filter((item) => item.guid !== id);

        this.GLOSSARY_FETCH_LIST(true);
        this.$message.success({
          content: `Glossary (${title}) has been deleted`,
          key: "delete",
        });
      } catch (err) {
        this.confirmLoading = false;
        console.log(err);
        this.$message.error({
          content: `Error in deleting Glossary (${title}) `,
          key: "delete",
        });
      }
    },
    async deleteCategory(id, title) {
      try {
        await Glossary.DeleteCategory(this.$axios, id);

        const data = [...this.treeList];
        const loop = (data, key, callback) => {
          data.forEach((item, index, arr) => {
            if (item.key === key) {
              return callback(item, index, arr);
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
          });
        };

        // let dragObj;
        // loop(data, nodekey, (item, index, arr) => {
        //   arr.splice(index, 1);
        //   dragObj = item;
        // });

        loop(data, id, (item, index, arr) => {
          arr.splice(index, 1);
        });

        this.treeList = [...this.treeList];

        //   let dragObj;
        //   loop(data, dragKey, (item, index, arr) => {
        //     arr.splice(index, 1);
        //     dragObj = item;
        //   });

        // this.treeList = this.treeList.filter((item) => item.guid !== id);
        // this.GLOSSARY_FETCH_LIST(true);
        this.$message.success({
          content: `Category (${title}) has been deleted`,
          key: "delete",
        });
      } catch (err) {
        this.confirmLoading = false;
        console.log(err);
        this.$message.error({
          content: `Error in deleting Category (${title}) `,
          key: "delete",
        });
      }
    },
    async deleteTerm(id, title) {
      try {
        await Glossary.DeleteTerm(this.$axios, id);

        const data = [...this.treeList];
        const loop = (data, key, callback) => {
          data.forEach((item, index, arr) => {
            if (item.key === key) {
              return callback(item, index, arr);
            }
            if (item.children) {
              return loop(item.children, key, callback);
            }
          });
        };

        loop(data, id, (item, index, arr) => {
          arr.splice(index, 1);
        });

        this.treeList = [...this.treeList];

        this.$message.success({
          content: `Tag (${title}) has been deleted`,
          key: "delete",
        });
      } catch (err) {
        this.confirmLoading = false;
        console.log(err);
        this.$message.error({
          content: `Error in deleting Tag (${title}) `,
          key: "delete",
        });
      }
    },
    handleNodeSelect(selectedKeys, { selected, node }) {
      console.log("load select");
      this.selectedKeys = selectedKeys;
      if (
        node.dataRef.type === "glossary" ||
        node.dataRef.type === "category"
      ) {
        this.handleExpand(this.expandedKeys, { node: node });
      }
      if (selected) {
        this.$emit("select", node.dataRef);
      }
    },
    async onLoadData(treeNode) {
      console.log("load data");
      try {
        if (treeNode.dataRef.children) {
          return;
        }
        let tempCategories = [];
        let terms = [];
        let children = [];

        if (treeNode.dataRef.type === "glossary") {
          // Get All Categories
          tempCategories = await Glossary.getCategoriesForGlossary(
            this.$axios,
            treeNode.dataRef.glossaryGuid
          );
          this.categories[treeNode.dataRef.glossaryGuid] = tempCategories;
          // Get All Terms for the Root
          terms = await Glossary.getTermsForGlossary(
            this.$axios,
            treeNode.dataRef.guid,
            {
              isRoot: true,
            }
          );
          // Get Relevant Category for the Root
          this.relevantCategory = tempCategories.filter(
            (item) => !item.parentCategory
          );
        } else {
          // Get Relevant Category for the Step
          this.relevantCategory = this.categories[
            treeNode.dataRef.glossaryGuid
          ].filter((item) => {
            if (item.parentCategory) {
              if (item.parentCategory.categoryGuid === treeNode.dataRef.guid) {
                return true;
              }
            }
            return false;
          });
          // Get All Terms for the Category
          terms = await Glossary.getTermsForCategoryDeprecate(
            this.$axios,
            treeNode.dataRef.guid,
            {
              isRoot: false,
            }
          );
        }

        if (this.relevantCategory.length > 0) {
          this.relevantCategory.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          this.relevantCategory.forEach((item) => {
            children.push(this.getNewCategory(item));
          });
        }

        if (terms.length > 0) {
          terms.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          terms.forEach((item) => {
            children.push(this.getNewTerm(item));
          });
        }

        treeNode.dataRef.children = children;
        this.treeList = [...this.treeList];
        return;
      } catch (err) {
        return;
      }
    },
    handleExpand(expanded, node) {
      //check if the expanded list contains any other glossary guid in case of a glossary node - accordion
      if (node.node.dataRef.type === "glossary") {
        const found = this.list.find((item) => expanded.includes(item.guid));
        if (found) {
          const index = this.expandedKeys.indexOf(found.guid);
          this.expandedKeys.splice(index, 1);
        }
      }
      if (!this.expandedKeys.includes(node.node.eventKey)) {
        this.expandedKeys.push(node.node.eventKey);
      } else {
        const index = this.expandedKeys.indexOf(node.node.eventKey);
        if (index > -1) {
          this.expandedKeys.splice(index, 1);
        }
      }
      return;
    },
    onDragEnter(info) {
      console.log(info);
    },
    onDrop() {
      //   console.log(info);
      //   const dropKey = info.node.eventKey;
      //   const dragKey = info.dragNode.eventKey;
      //   const dropPos = info.node.pos.split("-");
      //   const dropPosition =
      //     info.dropPosition - Number(dropPos[dropPos.length - 1]);
      //   const loop = (data, key, callback) => {
      //     data.forEach((item, index, arr) => {
      //       if (item.key === key) {
      //         return callback(item, index, arr);
      //       }
      //       if (item.children) {
      //         return loop(item.children, key, callback);
      //       }
      //     });
      //   };
      //   const data = [...this.gData];
      //   // Find dragObject
      //   let dragObj;
      //   loop(data, dragKey, (item, index, arr) => {
      //     arr.splice(index, 1);
      //     dragObj = item;
      //   });
      //   if (!info.dropToGap) {
      //     // Drop on the content
      //     loop(data, dropKey, (item) => {
      //       item.children = item.children || [];
      //       // where to insert 示例添加到尾部，可以是随意位置
      //       item.children.push(dragObj);
      //     });
      //   } else if (
      //     (info.node.children || []).length > 0 && // Has children
      //     info.node.expanded && // Is expanded
      //     dropPosition === 1 // On the bottom gap
      //   ) {
      //     loop(data, dropKey, (item) => {
      //       item.children = item.children || [];
      //       // where to insert 示例添加到尾部，可以是随意位置
      //       item.children.unshift(dragObj);
      //     });
      //   } else {
      //     let ar;
      //     let i;
      //     loop(data, dropKey, (item, index, arr) => {
      //       ar = arr;
      //       i = index;
      //     });
      //     if (dropPosition === -1) {
      //       ar.splice(i, 0, dragObj);
      //     } else {
      //       ar.splice(i + 1, 0, dragObj);
      //     }
      //   }
      //   this.gData = data;
    },
  },
});
</script>
  
  <style lang="less" module></style>
   -->