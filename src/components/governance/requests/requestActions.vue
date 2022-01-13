<template>
    <div class="flex items-center justify-end gap-x-2">
        <a-dropdown v-model:visible="isVisibleReject" placement="bottomRight">
            <template #overlay>
                <a-menu>
                    <a-menu-item key="1" @click="$emit('reject')">
                        Reject
                    </a-menu-item>
                    <a-menu-item key="2"> Reject with comment </a-menu-item>
                </a-menu>
            </template>
            <!-- @click.stop="$emit('reject')" -->
            <AtlanButton color="secondary" padding="compact" size="sm">
                <template #suffix>
                    <AtlanIcon class="mr-1" icon="ChevronDown" />
                </template>
                <span class="text-red-500"> Decline </span>
            </AtlanButton>
        </a-dropdown>
        <AtlanButton
            color="secondary"
            padding="compact"
            size="sm"
            @click.stop="$emit('accept')"
            ><template #prefix
                ><AtlanIcon class="mr-1" icon="Approve" />
            </template>
            Accept
        </AtlanButton>
        <!-- <AtlanButton
            color="secondary"
            @click.stop="$emit('more')"
            padding="compact"
            size="sm"
            ><template #label><AtlanIcon icon="KebabMenu" /> </template>
        </AtlanButton> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, ref } from 'vue'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'RequestActions',
        components: { AtlanButton },
        emits: ['accept', 'reject', 'more'],
        setup(props, { emit }) {
            const isVisibleReject = ref(true)
            return {
                isVisibleReject,
            }
        },
    })
</script>
