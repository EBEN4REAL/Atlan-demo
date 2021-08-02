<template>
    <div>
        <p class="mb-2 text-2xl atlan-gray-500 text-uppercase">
            Classification
        </p>

        <div class="relative flex items-center justify-between w-full">
            <p class="mb-0 text-sm text-gray-400">
                Manage classification tags to build access policies.
                <!-- <span class="ml-2 text-primary">Documentation</span> -->
            </p>
            <a-button
                type="primary"
                class="absolute right-0 rounded add-classification-btn"
                @click="toggleModal"
                >+ Add Classification</a-button
            >
        </div>
    </div>

    <splitpanes class="h-auto pt-6 default-theme">
        <pane
            min-size="25"
            max-size="50"
            size="25"
            class="relative pr-6 bg-white"
        >
            <a-input
                ref="searchText"
                v-model:value="treeFilterText"
                @input="handleSearch"
                type="text"
                class="bg-white shadow-none form-control border-right-0"
                placeholder="Search classifications"
            >
                <template #suffix>
                    <fa
                        v-if="treeFilterText"
                        @click="clearSearchText"
                        icon="fal times-circle"
                        class="ml-2 mr-1 text-red-600"
                    />
                    <fa
                        v-if="!treeFilterText"
                        icon="fal search"
                        class="ml-2 mr-1 text-gray-500"
                    />
                </template>
            </a-input>
            <div class="mt-2 overflow-y-auto treelist">
                <!-- <CreateClassificationTree
                    :treeData="treeFilterText !== '' ? filteredData : treeData"
                    @nodeEmit="nodeEmit"
                /> -->
                <div
                    v-for="item in treeFilterText !== ''
                        ? filteredData
                        : treeData"
                    class="flex px-4 py-2 mb-1 rounded cursor-pointer tree-item"
                    :class="
                        selectedClassificationNameFromRoute === item.name
                            ? 'tree-item-active'
                            : ''
                    "
                    :key="item.guid"
                    @click="() => nodeEmit(item)"
                >
                    <span class="truncate ...">{{ item.title }}</span>
                </div>
            </div>
        </pane>
        <pane size="74" class="flex flex-col pl-6 bg-white">
            <router-view class="flex-grow" />
        </pane>

        <a-modal
            :visible="modalVisible"
            title="Add"
            :onCancel="closeModal"
            :destroyOnClose="true"
            :footer="null"
        >
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

                <div class="flex justify-end w-full">
                    <a-button @click="closeModal" class="mr-4">Cancel</a-button>
                    <a-button
                        type="primary"
                        @click="createClassification"
                        :loading="
                            createClassificationStatus === 'loading'
                                ? true
                                : false
                        "
                        >Create</a-button
                    >
                </div>
            </a-form>
            <p v-if="createErrorText" class="mt-4 mb-0 text-sm text-red-500">
                {{ createErrorText }}
            </p>
        </a-modal>
    </splitpanes>
</template>

<script lang="ts">
       import {
           defineComponent,
           PropType,
    development
           reactive,
           ref,
           toRaw,
           UnwrapRef,
           watch,

           Ref,
           computed,
       } from 'vue'
       import ConnectionTree from '@/connection/tree/index.vue'
       import Loading from '@common/loaders/section.vue'
       import ErrorView from '@common/error/index.vue'
       import CreateClassificationTree from '@common/tree/classification/index.vue'
       import { useRouter } from 'vue-router'
       import { useClassificationStore } from '~/components/admin/classifications/_store'

       import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
       import { Classification } from '~/api/atlas/classification'
       import { classificationInterface } from '~/types/classifications/classification.interface'
       import { typedefsInterface } from '~/types/typedefs/typedefs.interface'


       export default defineComponent({
           name: 'ClassificationProfileWrapper',
           components: {

               ConnectionTree,
               Loading,
               ErrorView,
               CreateClassificationTree,
           },
           props: {
               classificationName: {
                   type: String as PropType<String>,
               },
           },
           setup(props, context) {
               const store = useClassificationStore()
               const router = useRouter()
               const modalVisible = ref(false)
               const createClassificationStatus = ref('')
               const treeFilterText = ref('')
               const createClassificationFormRef = ref()
               const classificationName = computed(() => props.classificationName)
               const createErrorText = ref('')
               interface FormState {
                   name: string
                   description: string
               }
               const treeData = computed(() => store.classificationTree)

               store.setSelectedClassification(
                   router?.currentRoute.value?.params?.classificationId as string
               )
               const selectedClassificationNameFromRoute = computed(
                   () => store.selectedClassification
               )
               console.log(
                   router?.currentRoute.value?.params?.classificationId,
                   'route',
                   router
               )

               const filteredData = computed(
                   () => store.filteredClassificationTree
               )

               // get classifications
               store.setClassificationsStatus('loading')
               const { data: classificationData, error: classificationError } =

                   Classification.getClassificationList<typedefsInterface>({
                       cache: false,
                   })

               watch([classificationData, classificationError], () => {
                   if (classificationData.value) {
                       let classifications =
                           classificationData.value.classificationDefs || []
                       store.setClassifications(classifications ?? [])
                       store.initializeFilterTree()
                       store.setClassificationsStatus('success')
                       if (store.classificationTree.length > 0) {
                           router.push(
                               `/admin/classifications/${encodeURIComponent(
                                   store.classificationTree[0].name
                               )}`
                           )
                           console.log(router, 'router1')
                       }
                   } else {
                       store.setClassificationsStatus('error')
                   }
               })

               const nodeEmit = (node: classificationInterface) => {
                   router.push(
                       `/admin/classifications/${encodeURIComponent(node.name)}`
                   )
                   store.setSelectedClassification(node.name)

                   console.log(node.name)
               }
               const formState: UnwrapRef<FormState> = reactive({
                   name: '',
                   description: '',
               })
               const urlValidationRegex = new RegExp('^[a-zA-Z]*$', 'g')
               const rules = {
                   name: [
                       {
                           required: true,

                           pattern: urlValidationRegex,
                           message:
                               'Names must consist of a letter followed by a sequence of letter, number, space, or _ characters',

                           trigger: 'blur',
                       },
                   ],
               }


               const handleSearch = (e: Event) => {
                   treeFilterText.value = (<HTMLInputElement>e.target).value
                   store.filterClassificationTree(treeFilterText.value)
               }

               const clearSearchText = () => {
                   treeFilterText.value = ''
               }

               const closeModal = () => {
                   modalVisible.value = false

                   formState.name = ''
                   formState.description = ''
               }
               const resetRef = (ref: Ref<string>, time: number) => {
                   setTimeout(() => {
                       ref.value = ''
                   }, time)
               }
               const createClassification = () => {

                   const payload: {
                       classificationDefs: classificationInterface[]
                   } = {
                       classificationDefs: [],
                   }
                   const classificationObj = {
                       attributeDefs: [],
                       description: '',
                       name: '',
                       superTypes: [],

                   } as unknown as classificationInterface

                   createClassificationFormRef.value
                       .validate()
                       .then(() => {
                           classificationObj.name = formState.name
                           classificationObj.description = formState.description
                           payload.classificationDefs.push(classificationObj)
                           // create classification
                           createClassificationStatus.value = 'loading'
                           const {
                               data: createClassificationData,
                               error: createClassificationError,

                           } = Classification.createClassification<typedefsInterface>(
                               {
                                   cache: false,
                                   payload,
                               }
                           )

                           watch(
                               [
                                   createClassificationData,
                                   createClassificationError,
                               ],
                               () => {
                                   console.log(
                                       createClassificationData,
                                       createClassificationError
                                   )

                                   if (
                                       createClassificationData.value &&
                                       !createClassificationError.value
                                   ) {
                                       console.log(
                                           'in errror',
                                           createClassificationData.value,
                                           createClassificationError.value
                                       )
                                       let classifications: classificationInterface[] =
                                           createClassificationData.value
                                               .classificationDefs
                                       classifications = [
                                           ...store.classifications,
                                           ...classifications,
                                       ]

                                       store.classifications =
                                           classifications ?? []
                                       const classificationTree =
                                           store.transformClassificationTreeData
                                       store.classificationTree =
                                           classificationTree ?? []
                                       createClassificationStatus.value = 'success'
                                       formState.name = ''
                                       formState.description = ''
                                       closeModal()
                                       // set this classification in view
                                       store.setSelectedClassification(
                                           classificationObj.name
                                       )
                                       router.push(
                                           `/admin/classifications/${encodeURIComponent(
                                               classificationObj.name
                                           )}`
                                       )
                                   } else {
                                       createClassificationStatus.value = 'error'
                                       const error = toRaw(
                                           createClassificationError.value
                                       )
                                       console.log(
                                           'errormessage',
                                           error.response.data.errorMessage
                                       )
                                       createErrorText.value =
                                           error.response.data.errorMessage

                                       resetRef(createErrorText, 8000)
                                   }
                               }
                           )
                       })
                       .catch((error: ValidateErrorEntity<FormState>) => {
                           console.log('error', error)
                       })
               }

               const toggleModal = () => {
                   modalVisible.value = !modalVisible.value
               }


               const handleSelectNode = (node: classificationInterface) => {
                   console.log(node, 'parent')
               }

               const classifications = computed(() => store.classifications)

               const selectedClassification: any = computed(() => {
                   if (!props.classificationName) {
                       return {}
                   }

                   if (classifications.value.length === 0) {
                       return {}
                   }
                   return classifications.value.find(
                       (classification: classificationInterface) =>
                           (classification.name || '') ===
                           decodeURI(props.classificationName as string)
                   )
               })
               const handleClickUser = (username: string) => {}

               return {
                   selectedClassificationNameFromRoute,
                   handleClickUser,
                   createClassificationStatus,
                   createErrorText,
                   filteredData,
                   treeData,
                   clearSearchText,
                   handleSearch,
                   treeFilterText,
                   modalVisible,
                   classificationName,
                   selectedClassification,
                   nodeEmit,
                   closeModal,
                   createClassification,
                   toggleModal,
                   createClassificationFormRef,
                   other: '',
                   formState,
                   rules,
                   handleSelectNode,
               }
           },
       })
</script>
<style lang="less" scoped>
    .treelist {
        height: calc(100vh - 14rem);
    }
    .tree-item:hover {
        background-color: #e9eefa;
        color: #2251cc;
    }
    .tree-item-active {
        background-color: #e9eefa;
        color: #2251cc;
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
        content: '*';
    }

    .add-classification-btn {
        top: -50%;
    }
</style>
<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
