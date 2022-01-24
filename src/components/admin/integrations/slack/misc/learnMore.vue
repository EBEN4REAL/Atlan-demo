<template>
    <a-popover
        :overlay-class-name="$style.learnMorePopover"
        trigger="click"
        :overlayStyle="{
            width: '508px',
            height: '336px',
        }"
    >
        <template #content>
            <!-- learnMore component is failing import -->
            <div class="relative p-4" style="width: 508px">
                <div class="w-full p-4 bg-gray-100 rounded-xl">
                    <div class="bg-white shadow-xl rounded-xl">
                        <div
                            class="flex items-center p-3 border-b border-gray-100 gap-x-20"
                        >
                            <div class="flex items-center gap-x-1">
                                <div
                                    style="background: #ee6a5f"
                                    class="w-3 h-3 rounded-full"
                                ></div>
                                <div
                                    style="background: #f5bd4f"
                                    class="w-3 h-3 rounded-full"
                                ></div>
                                <div
                                    style="background: #61c454"
                                    class="w-3 h-3 rounded-full"
                                ></div>
                            </div>
                            <div
                                class="flex items-center justify-between px-1 bg-gray-100 rounded w-52 h-7"
                            >
                                <div class=""></div>
                                <div class="flex items-center gap-x-1">
                                    <div class="mb-1">
                                        <AtlanIcon
                                            icon="SafariLock"
                                            style="font-color: #797979"
                                            class="rotate-90"
                                        />
                                    </div>
                                    <span>slack.com</span>
                                </div>
                                <div
                                    class=""
                                    :style="{
                                        transform:
                                            'rotateZ(-45deg) rotateY(180deg)',
                                    }"
                                >
                                    <AtlanIcon icon="Refresh" />
                                </div>
                            </div>
                        </div>
                        <div
                            style="padding-top: 22px; padding-bottom: 84px"
                            class="px-3"
                        >
                            <div class="rounded-lg">
                                <AtlanIcon
                                    class="w-full"
                                    style="height: 6.8rem"
                                    icon="SlackToken"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="absolute bottom-0 left-0 right-0 p-4 bg-white rounded-b-lg shadow-xl"
                >
                    <ol class="flex flex-col text-xs gap-y-2">
                        <li>
                            1. Open
                            <a
                                target="_blank"
                                href="https://api.slack.com/apps"
                                class="text-primary"
                            >
                                https://api.slack.com/apps
                            </a>
                            on your browser.
                        </li>
                        <li>
                            2. Click on
                            <b>Generate Token</b>
                        </li>
                        <li>
                            3. Select your
                            <b>Slack workspace</b>
                        </li>
                        <li>
                            4. Copy <b>Access Token</b> &
                            <b>Refresh Token</b>
                        </li>
                    </ol>
                </div>
            </div>
            <!-- learnMore component is failing import -->
        </template>
        <slot />
    </a-popover>
</template>

<script setup lang="ts"></script>

<style scoped></style>
