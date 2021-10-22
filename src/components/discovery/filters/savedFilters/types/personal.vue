<template>
    <div class="w-full overflow-y-auto h-44">
        <div v-if="isLoading" class="flex items-center justify-center mt-3">
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Fetching Saved Filters</span>
        </div>
        <div
            v-else-if="savedList.length < 1 && !isLoading"
            class="flex flex-col items-center justify-center h-full"
        >
            <div class="flex flex-col items-center">
                <img
                    :src="emptyScreen"
                    alt="No logs"
                    class="w-2/5 m-auto mb-4"
                />
                <span class="text-gray-500">No Saved Filters Found</span>
            </div>
        </div>

        <div v-else class="flex flex-col w-full">
            <div v-for="(filter, index) in savedList" :key="index">
                <a-popover placement="rightTop">
                    <template #content>
                        <div class="popover-container">
                            <div class="flex items-center mb-2">
                                <p class="text-base font-bold text-gray-700">
                                    {{ filter.name }}
                                </p>
                            </div>
                            <div class="flex items-end w-full">
                                <div class="">
                                    <div class="mb-1 text-gray-700">
                                        Owned by
                                    </div>
                                    <a-popover>
                                        <template #content>
                                            <OwnerInfoCard
                                                :user="filter.ownerName"
                                            />
                                        </template>
                                        <Pill :label="filter.ownerName"
                                            ><template #prefix>
                                                <avatar
                                                    class="-ml-2.5"
                                                    :image-url="
                                                        KeyMaps.auth.avatar.GET_AVATAR(
                                                            {
                                                                username:
                                                                    filter.ownerName,
                                                            }
                                                        )
                                                    "
                                                    :allow-upload="false"
                                                    :avatar-name="
                                                        filter.ownerName
                                                    "
                                                    avatar-size="small"
                                                    :avatar-shape="'circle'" /></template></Pill
                                    ></a-popover>
                                </div>

                                <div
                                    class="flex items-center cursor-pointer  ml-52 text-primary"
                                    @click.stop="() => handleLoadFilter(filter)"
                                >
                                    Load filter
                                    <AtlanIcon
                                        icon="ArrowRight"
                                        class="ml-1"
                                    ></AtlanIcon>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div
                        class="flex items-center justify-between px-2 py-1 text-gray-700 border rounded cursor-pointer  hover:text-primary hover:bg-primary-light"
                        :class="
                            selected === filter.name
                                ? '  border-primary bg-primary-light  text-primary'
                                : '  border-transparent'
                        "
                        @click.stop="() => handleLoadFilter(filter)"
                    >
                        <Tooltip :tooltip-text="filter.name" />
                        <div>
                            <a-tooltip placement="top">
                                <template #title>Load filter</template>

                                <AtlanIcon
                                    icon="Play"
                                    class="w-4 h-4 my-auto text-gray-500"
                                ></AtlanIcon>
                            </a-tooltip>
                        </div></div
                ></a-popover>
            </div>
        </div>
    </div>
</template>
