import { defineComponent } from "vue";
import { SourceList } from "~/constant/source";

export default defineComponent({
    methods: {
        logo(integrationName: string) {
            return SourceList.find(
                (src) => src.id === integrationName
            )?.image;
        },
        label(integrationName: string) {
            return SourceList.find(
                (src) => src.id === integrationName
            )?.label;
        },
    },
});
