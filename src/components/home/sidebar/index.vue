<template>
    <div class="flex flex-col">
        <UserPersonalAvatar class="mb-3" />

        <a-button>Discovery</a-button>
        <a-button>Glossary</a-button>
        <a-button>Admin</a-button>
        <a-button>Connectors</a-button>
    </div>
</template>

<script lang="ts">
    import UserPersonalAvatar from '~/components/common/avatar/meLarge.vue'
    import { defineComponent } from 'vue'

    export default defineComponent({
        components: { UserPersonalAvatar },
        props: {},
        setup(props) {},
    })
</script>

<style scoped></style>
