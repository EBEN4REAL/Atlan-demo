<template>
    <div class="flex justify-between my-3">
        <div class="flex w-1/2">
            <a-input-search
                placeholder="Search Members"
                class="mr-1"
                v-model:value="searchText"
                @change="handleSearch"
            ></a-input-search>
            <a-button>Filter</a-button>
        </div>
        <a-button>New Member</a-button>
    </div>
    <a-table :dataSource="dataSource" :columns="columns" />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { User } from "~/api/auth/user";
export default defineComponent({
    data() {
        return {
            dataSource: [
                {
                    key: '1',
                    name: 'Mike',
                    age: 32,
                    address: '10 Downing Street',
                },
                {
                    key: '2',
                    name: 'John',
                    age: 42,
                    address: '10 Downing Street',
                },
            ],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Age',
                    dataIndex: 'age',
                    key: 'age',
                },
                {
                    title: 'Address',
                    dataIndex: 'address',
                    key: 'address',
                },
            ],
            loading: false,
            error: null,
            limit: 10,
            offset: 0,
            cancelToken: null,
            searchText: "",
            debounce: undefined,
        };
    },
    mounted() {
        this.handleUserFetch();
    },
    methods: {
        handleSearch(value: any) {
            clearTimeout(this.debounce);
            this.debounce = setTimeout(() => {
                this.handleUserFetch(value);
            }, 100);
        },
        async handleUserFetch() {
            try {
                if (this.loading && this.cancelToken) {
                    this.cancelToken?.cancel("Operation canceled by the user.");
                } else {
                    this.loading = true;
                    this.cancelToken = this.$axios.CancelToken.source();
                }
                const resp = await User.ListV2({ limit: 10 }, {
                    cancelToken: this.cancelToken?.token
                });

                console.log(resp);

                let temp = [];
                if (resp.data) {
                    resp.data.records.forEach(element => {
                        temp.push({
                            key: element.id,
                            "name": `${element.first_name} ${element.last_name}`
                        })
                    });
                    this.dataSource = temp;
                }
                console.log(resp);
                this.loading = false;
            } catch (error) {
                this.loading = false;
                console.log(error);
            }
        }
    }
});
</script>

<style lang="less" module>
</style>