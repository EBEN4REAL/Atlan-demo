<template>
    <div>
        <div class="flex items-center justify-between">
            <span class="text-base font-bold leading-8 text-gray-500"
                >Policy Details</span
            >

            <AtlanBtn
                v-if="isEditing"
                size="sm"
                @click="removePolicy"
                color="secondary"
                padding="compact"
                ><AtlanIcon icon="Delete" class="-mx-1 text-red-400"></AtlanIcon
            ></AtlanBtn>
        </div>

        <span class="block mb-1 text-sm text-gray-700">ACCESS</span>
        <a-switch
            :disabled="!isEditing"
            class="mb-2"
            checked-children="Allow"
            un-checked-children="Deny"
            v-model:checked="policy.allow"
        />

        <span class="block mb-1 text-sm text-gray-700">ASSETS</span>
        <a-select
            v-model:value="policy.assets"
            mode="tags"
            class="w-full mb-2"
            v-if="isEditing"
            placeholder="Enter asset name / pattern"
        />
        <div
            v-else
            class="flex flex-wrap items-center flex-grow gap-x-1 gap-y-1.5 mb-2"
        >
            <Pill
                v-for="asset in policy.assets"
                :label="asset"
                :has-action="false"
            />
        </div>

        <span class="mb-1 text-sm text-gray-700">SCOPES</span>
        <div class="mb-3" v-for="scope in scopeList">
            <span class="block mb-1 text-sm text-gray-500 capitalize">{{
                scope.type
            }}</span>
            <a-checkbox-group
                :value="policy.actions"
                :name="scope.type"
                :options="scope.scopes"
            />
        </div>
        <a-divider />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { MetadataPolicies } from '~/types/accessPolicies/personas'
    import { isEditing } from './composables/useEditPersona'
    import useScopeService from '~/services/heracles/composables/scopes'

    export default defineComponent({
        name: 'PersonaPolicy',
        components: { AtlanBtn, Pill },
        props: {
            policy: {
                type: Object as PropType<MetadataPolicies>,
                required: true,
            },
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const { scopeList } = useScopeService().listScopes()

            function removePolicy() {
                emit('delete')
            }
            return {
                scopeList,
                isEditing,
                removePolicy,
            }
        },
    })
</script>
