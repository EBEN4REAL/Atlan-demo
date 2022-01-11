<template>
    <div class="w-full px-4 py-3 border-b border-gray-300 bg-gray-100" style='min-width: 374px;'>
        <div class="flex w-full align-center items-center">
            <ClassificationIcon :classification="classification" class="w-5 h-5"/>
            <p class="text-base font-gray-700 font-bold max-w-xs truncate mr-1 ml-3">{{ classification.displayName }}</p>
            <a-button class="px-1.5 py-1 ml-auto">
                <AtlanIcon icon="SidebarSwitch" style="height: auto" />
            </a-button>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, PropType, defineComponent } from 'vue'
    import { ClassificationInterface } from '~/types/classifications/classification.interface'
    import ClassificationIcon from '@/common/icon/classificationIcon.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'ClassificationHead',
        components: {
            ClassificationIcon,
            AtlanIcon
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            }
        },
        setup(props) {
            console.log(props.classification)
        }
    })
</script>

<style scoped>

</style>