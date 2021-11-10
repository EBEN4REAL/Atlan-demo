<template>
    <a-button-group>
        <!-- <a-button size="small"><AtlanIcon icon="Share" /></a-button> -->

        <a-button size="small" v-if="name">
            <router-link :to="`/workflows/${name}/setup`" target="_blank">
                <AtlanIcon icon="External" />
            </router-link>
        </a-button>
        <!-- <a-button size="small">
            <AtlanIcon icon="Bookmark" />
        </a-button> -->
    </a-button-group>
</template>

<script>
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {
            name: {
                type: String,
                required: false,
                default: null,
            },
        },
    })
</script>
