<template>
    <div>Hello World</div>

    <teleport v-if="allow" to="#overAssetPreviewSidebar">
        <a-drawer
            :visible="true"
            placement="right"
            :mask="false"
            :get-container="false"
            :wrap-style="{ position: 'absolute', width: '100%' }"
            :keyboard="false"
            :destroy-on-close="true"
            :closable="false"
            width="100%"
        >
            <GlossaryPreview :selected-asset="tempTerm" />
        </a-drawer>
    </teleport>
    <!-- <div id="sidePanel" class="relative w-1/3">profile sidebar</div> -->
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue'
    import GlossaryPreview from '@/glossary/preview/glossaryPreview.vue'

    export default defineComponent({
        components: { GlossaryPreview },
        setup() {
            const tempTerm = ref({
                typeName: 'AtlasGlossaryTerm',
                attributes: {
                    sourceCreatedAt: 0,
                    certificateStatus: 'VERIFIED',
                    __modifiedBy: 'nitya',
                    qualifiedName:
                        'EfIXVR40svdOlYWyvfLjk@ytL2hFWseVCrnw1bODcav',
                    __state: 'ACTIVE',
                    meanings: [],
                    __guid: '68e3d587-995d-4e3d-9dc6-f813d9cc7746',
                    ownerGroups: '',
                    certificateUpdatedBy: 'nitya',
                    sourceUpdatedAt: 0,
                    __createdBy: 'nitya',
                    announcementUpdatedAt: 0,
                    __modificationTimestamp: 1635319049422,
                    anchor: {
                        guid: 'a4a86135-040a-4aa9-8f94-d4313cc05356',
                        typeName: 'AtlasGlossary',
                        attributes: { name: 'Sales Glossary' },
                        uniqueAttributes: {
                            qualifiedName: 'ytL2hFWseVCrnw1bODcav',
                        },
                    },
                    name: 'term 1',
                    certificateUpdatedAt: 1635318463737,
                    __timestamp: 1635318400213,
                    ownerUsers: 'nitya',
                },
                guid: '68e3d587-995d-4e3d-9dc6-f813d9cc7746',
                status: 'ACTIVE',
                displayText: 'term 1',
                classificationNames: [],
                classifications: [],
                meaningNames: [],
                meanings: [],
                isIncomplete: false,
                labels: [],
            })

            const allow = ref(false)

            onMounted(() => {
                allow.value = true
            })
            return { tempTerm, allow }
        },
    })
</script>

<style scoped></style>
