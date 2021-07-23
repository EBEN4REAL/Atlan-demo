import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { defineComponent, PropType } from 'vue';
import { Components } from '~/api/atlas/client';
import { AtlanTableAttributes } from '~/types/asset';

export default defineComponent({
    methods: {
        name(item: any): string {
            return item.metadata?.name;
        },
        creationTimestamp(item: any) {
            return item.metadata?.creationTimestamp;
        },
        labels(item: any) {
            return item.metadata?.labels;
        },
        phase(item: any) {
            return item.status?.phase;
        },
        startedAt(item: any, relative: any) {
            if (relative) {
                return dayjs().from(item.status.startedAt, true);
            }
            return dayjs(item.status.startedAt).format(
                'dddd MMMM D YYYY HH:mm:ss'
            );
        },
        finishedAt(item: any, relative: any) {
            if (relative) {
                if (item.status?.finishedAt) {
                    return dayjs().from(item.status?.finishedAt, true);
                }
            }
            return item.status?.finishedAt;
        },
        connectionQualifiedName(item: any) {
            return this.labels(item)['connection-qualified-name'];
        },
        botName(item: any) {
            return this.labels(item)['bot-template-name'];
        },
        category(item: any) {
            return this.labels(item)['category'];
        },
        connectionName(item) {
            const qualifiedName = this.labels(item)[
                'connection-qualified-name'
            ];
            if (qualifiedName) {
                const split = qualifiedName.split('..');
                if (split.length > 2) {
                    return split[2];
                }
            }
        },
        source(item) {
            const qualifiedName = this.labels(item)[
                'connection-qualified-name'
            ];
            if (qualifiedName) {
                const split = qualifiedName.split('..');
                if (split.length > 2) {
                    return split[1];
                }
            }
        },
        duration(item) {
            if (item?.status?.startedAt && item?.status?.finishedAt) {
                let sec = dayjs(item.status.finishedAt).diff(
                    item.status.startedAt,
                    'second'
                );
                return `${Math.floor(sec / 60)} mins, ${sec % 60} seconds`;
            }
            return '';
        },
        progress(item) {
            return item.status.progress;
        },
        progressPercent(item) {
            let split = item.status.progress.split('/');
            let percentage = 100;
            if (split.length == 2) {
                percentage = (split[0] / split[1]) * 100;
            }
            return percentage;
        },
    },
});
