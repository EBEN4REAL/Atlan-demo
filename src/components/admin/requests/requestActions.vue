<template>
    <AtlanButton
        color="secondary"
        @click.stop="$emit('accept')"
        padding="compact"
    >
        <template #prefix><AtlanIcon class="mr-1" icon="Decline" /> </template>
        Decline
    </AtlanButton>
    <AtlanButton
        color="secondary"
        @click.stop="$emit('reject')"
        padding="compact"
        ><template #prefix><AtlanIcon class="mr-1" icon="Approve" /> </template>
        Accept
    </AtlanButton>
    <AtlanButton color="secondary" @click.stop="$emit('more')" padding="compact"
        ><template #label><AtlanIcon icon="KebabMenu" /> </template>
    </AtlanButton>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'RequestActions',
        emits: ['accept', 'reject', 'more'],
    })
</script>
