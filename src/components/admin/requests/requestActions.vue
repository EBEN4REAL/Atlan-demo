<template>
    <div class="flex items-center justify-end gap-x-2">
        <AtlanButton
            color="secondary"
            @click.stop="$emit('reject')"
            padding="compact"
            size="sm"
        >
            <template #prefix
                ><AtlanIcon class="mr-1" icon="Decline" />
            </template>
            Decline
        </AtlanButton>
        <AtlanButton
            color="secondary"
            @click.stop="$emit('accept')"
            padding="compact"
            size="sm"
            ><template #prefix
                ><AtlanIcon class="mr-1" icon="Approve" />
            </template>
            Accept
        </AtlanButton>
        <AtlanButton
            color="secondary"
            @click.stop="$emit('more')"
            padding="compact"
            size="sm"
            ><template #label><AtlanIcon icon="KebabMenu" /> </template>
        </AtlanButton>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'RequestActions',
        emits: ['accept', 'reject', 'more'],
        components: { AtlanButton },
    })
</script>
