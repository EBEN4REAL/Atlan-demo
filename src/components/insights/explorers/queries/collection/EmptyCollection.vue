<template>
    <div class="flex flex-col items-center w-full h-full">
        <div class="flex flex-col items-center w-full">
            <AtlanIcon icon="CollectionHeader" class="w-full h-32" />
            <span class="-mt-12 text-2xl font-bold bg-transparent"
                >Collections</span
            >
            <p style="max-width: 18rem" class="mt-3 text-base text-center">
                Collections brings harmony to the growing pile of important
                queries in your organisation.
            </p>
        </div>
        <div class="flex flex-col items-center w-full">
            <AtlanIcon icon="CollectionBody" class="w-full h-48" />

            <p style="max-width: 18rem" class="mt-3 text-base text-center">
                Organise queries relevant for your project in folders.
            </p>
        </div>
        <div class="flex flex-col items-center w-full">
            <AtlanIcon icon="CollectionFooter" class="w-full h-48" />

            <p style="max-width: 18rem" class="mt-3 text-base text-center">
                Share collections with your team.
            </p>
        </div>

        <AtlanButton
            class="font-bold w-36 mt-11"
            size="lg"
            color="primary"
            padding="compact"
            @click="handleClick"
        >
            Create a collection
            <AtlanIcon icon="ArrowRight" class="inline" />
        </AtlanButton>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanButton from '~/components/UI/button.vue'

    export default defineComponent({
        name: 'EmptyCollection',
        components: { AtlanButton },
        props: {},
        emits: ['event'],
        setup(props, { emit }) {
            const handleClick = () => {
                emit('event')
            }
            return {
                handleClick,
            }
        },
    })
</script>
