import { defineComponent } from "vue";

import { Components } from "~/api/atlas/client";

import { Search } from "~/api/atlas/search";

export default defineComponent({
    props: {},
    methods: {
        async handleSearch(body: Components.Schemas.SearchParameters, options: any) {
            try {
                const response = await Search.Basic(body, options);
                return response;
            } catch (err) {
                return err;
            }
        },
    }
});
