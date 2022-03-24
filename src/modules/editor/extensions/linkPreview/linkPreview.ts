import { Editor, Extension, Range, Node, mergeAttributes, pasteRulesPlugin, PasteRule } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'

import { Plugin } from 'prosemirror-state'
import { Slice, Fragment } from 'prosemirror-model'



interface commandsProps {
    editor: Editor;
    range: Range;
    props: any;
}

export interface CommandItem {
    title: string;
    textIcon?: string;
    icon?: string;
    description?: string;
    command: (props: commandsProps) => void
}

Extension.create({

    addProseMirrorPlugins() {
        return [

        ]
    },
})
export const pasteRegex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)/gi

/**
 * A regex that matches an url
 */
export const pasteRegexExact = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)$/gi


export default Node.create({
    name: 'linkPreview',

    priority: 1000,

    defaultOptions: {
        HTMLAttributes: {},
    },

    group: 'block',

    content: 'block*',

    parseHTML() {
        return [
            { tag: 'p' },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    },

    addNodeView() {
        return () => {
            const container = document.createElement('p')

            // container.addEventListener('click', event => {
            //   alert('clicked on the container')
            // })
            const preview = document.createElement('p')
            preview.classList.add('flex', 'bg-gray-100', 'w-full', 'p-4', 'm-0')

            const imageDiv = document.createElement('p')
            const image = document.createElement('img')
            image.setAttribute('src', 'https://wiki.atlan.com/content/images/2019/11/Atlan-logo_blue-background_white.png')
            image.setAttribute('width', '150')
            imageDiv.append(image)

            const infoDiv = document.createElement('p');

            const titleDiv = document.createElement('p');
            titleDiv.innerText = "The Atlan Data Wiki"
            titleDiv.classList.add('text-lg', 'text-gray-700', 'p-2', 'm-0')

            const descDiv = document.createElement('p');
            descDiv.innerText = "A fun, helpful encyclopedia for the data universe. Learn about all things data. Lorem Ipsum Dolar set"
            descDiv.classList.add('text-xs', 'text-gray-700', 'p-2', 'm-0')

            infoDiv.append(titleDiv)
            infoDiv.append(descDiv)

            preview.append(imageDiv);
            preview.append(infoDiv);

            container.append(preview)

            return {
                dom: container,
                contentDOM: preview,
            }
        }
    },
    addPasteRules() {
        return [
            nodePasteRule(pasteRegexExact, this.type, {}),
        ]
    }
})


const nodePasteRule = (regexp: RegExp, type, getAttrs) => {

    const handler = fragment => {
        const nodes = [];
        console.log(fragment, 'bro please')
        fragment.commands.setNode(type)
        // fragment.forEach(c => {
        //     const textNodes = c.content;
        //     nodes.push(c)

        //     textNodes.forEach((child) => {
        //         if (!child.isText) {
        //             nodes.push(child.copy(handler(child.content)));
        //         }
        //         if(child.text.match(pasteRegex)){
        //             const attrs = getAttrs;
        //             nodes.push(type.create(attrs));
        //         }
        //     })


        // });

        return Fragment.fromArray(nodes);
    };

    return new PasteRule({
        find: pasteRegexExact,
        handler
        // props: {
        //     transformPasted: slice => new Slice(handler(slice.content), slice.openStart, slice.openEnd),
        // },
    });
}