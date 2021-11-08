<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <AnnouncementWidget></AnnouncementWidget>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import AnnouncementWidget from '@/common/widgets/announcement.vue'

    export default defineComponent({
        name: 'Overview',
        components: { AnnouncementWidget },
        props: {},

        setup() {},
    })
</script>
