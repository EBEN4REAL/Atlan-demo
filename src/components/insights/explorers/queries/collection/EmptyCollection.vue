<template>
    <div class="flex flex-col items-center h-full" style="width: 350px">
        <div class="flex flex-col items-center w-full">
            <span class="mt-4 text-2xl font-bold bg-transparent"
                >Collections</span
            >
            <p style="max-width: 18rem" class="mt-2 text-base text-center">
                Collections brings harmony to the growing pile of queries in
                your organisation.
            </p>
        </div>
        <div class="flex flex-col items-center w-full">
            <img :src="Body" alt="" class="w-7/12 mt-7" />

            <p style="max-width: 18rem" class="text-sm font-bold text-center">
                Enrich your collection with Folders and Queries
            </p>
        </div>
        <div class="flex flex-col items-center w-full pb-12">
            <img :src="Footer" alt="" class="w-7/12 mt-6" />

            <p style="max-width: 18rem" class="text-sm font-bold text-center">
                Share collections with your team
            </p>
        </div>
        <div class="bottom-0 absolute p-2">
            <AtlanButton2
                class="w-56 font-bold"
                size="large"
                label="Create a collection"
                suffixIcon="ArrowRight"
                bold
                @click="handleClick"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AtlanButton from '~/components/UI/button.vue'
    import Body from '~/assets/images/insights/collection/body.png'
    import Footer from '~/assets/images/insights/collection/footer.png'

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
                Body,
                Footer,
            }
        },
    })
</script>
