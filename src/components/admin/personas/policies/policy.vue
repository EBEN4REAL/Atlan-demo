<template>
    <div>
        <AssetSelectorDrawer
            v-model:visible="assetSelectorVisible"
            :assets="policy.assets"
            connectionQualifiedName="default/snowflake/development-test"
        />
        <div class="flex items-center justify-between">
            <span class="text-base font-bold leading-8 text-gray-500"
                >{{ policy.name }} details</span
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

        <a-form layout="vertical" :wrapper-col="{ span: 12 }" :model="policy">
            <a-form-item label="Name" name="name" required>
                <a-input
                    v-if="isEditing"
                    v-model:value="policy.name"
                    placeholder="Persona Name"
                />
                <span v-else>{{ policy.name }}</span>
            </a-form-item>
            <a-form-item label="Description" name="description">
                <a-textarea
                    v-if="isEditing"
                    v-model:value="policy.description"
                    showCount
                    :maxlength="140"
                    :auto-size="{ minRows: 1, maxRows: 3 }"
                />
                <span v-else>{{ policy.description }}</span>
            </a-form-item>
        </a-form>

        <span class="block mb-1 text-sm text-gray-700">ACCESS</span>
        <a-switch
            :disabled="!isEditing"
            class="mb-2"
            checked-children="Allow"
            un-checked-children="Deny"
            v-model:checked="policy.allow"
        />

        <span class="block mb-1 text-sm text-gray-700">CONNECTION</span>
        <a-input
            v-if="isEditing"
            v-model:value="policy.connectionId"
            placeholder="Connection Id"
            class="mb-2"
        />
        <p class="mb-2" v-else>{{ policy.connectionId }}</p>

        <span class="block mb-1 text-sm text-gray-700">ASSETS</span>
        <!-- <a-select
            v-model:value="policy.assets"
            mode="tags"
            class="w-full mb-2"
            v-if="isEditing"
            placeholder="Enter asset name / pattern"
        /> -->
        <div
            class="flex flex-wrap items-center flex-grow gap-x-1 gap-y-1.5 mb-2"
        >
            <PillGroup
                :data="
                    policy.assets.map((name) => ({
                        label: name,
                    }))
                "
                label-key="label"
                :read-only="!isEditing"
                @add="openAssetSelector"
            />
        </div>
        <MetadataScopes v-model:actions="policy.actions" />
        <a-divider />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import MetadataScopes from './metadataScopes.vue'
    import AssetSelectorDrawer from '../assets/assetSelectorDrawer.vue'

    import { MetadataPolicies } from '~/types/accessPolicies/personas'
    import { isEditing } from '../composables/useEditPersona'

    export default defineComponent({
        name: 'PersonaPolicy',
        components: {
            AtlanBtn,
            Pill,
            MetadataScopes,
            PillGroup,
            AssetSelectorDrawer,
        },
        props: {
            policy: {
                type: Object as PropType<MetadataPolicies>,
                required: true,
            },
        },
        emits: ['delete'],
        setup(props, { emit }) {
            const assetSelectorVisible = ref(false)
            function removePolicy() {
                emit('delete')
            }

            function openAssetSelector() {
                assetSelectorVisible.value = true
            }
            return {
                assetSelectorVisible,
                isEditing,
                removePolicy,
                openAssetSelector,
            }
        },
    })
</script>
