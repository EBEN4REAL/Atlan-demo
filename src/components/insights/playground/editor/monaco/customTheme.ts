import * as monaco from 'monaco-editor'

export const getLightAtlanTheme = () => {
    return monaco.editor.defineTheme('atlanThemeLight', {
        base: 'vs', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            { token: '', foreground: '000000', background: 'fffffe' },
            { token: 'invalid', foreground: 'cd3131' },
            { token: 'emphasis', fontStyle: 'italic' },
            { token: 'strong', fontStyle: 'bold' },

            { token: 'variable', foreground: '001188' },
            { token: 'variable.predefined', foreground: '4864AA' },
            { token: 'constant', foreground: 'dd0000' },
            { token: 'comment', foreground: '008000' },
            { token: 'number', foreground: '09885A' },
            { token: 'number.hex', foreground: '3030c0' },
            { token: 'regexp', foreground: '800000' },
            { token: 'annotation', foreground: '808080' },
            { token: 'type', foreground: '008080' },

            { token: 'delimiter', foreground: '000000' },
            { token: 'delimiter.html', foreground: '383838' },
            { token: 'delimiter.xml', foreground: '0000FF' },

            { token: 'tag', foreground: '800000' },
            { token: 'tag.id.jade', foreground: '4F76AC' },
            { token: 'tag.class.jade', foreground: '4F76AC' },
            { token: 'meta.scss', foreground: '800000' },
            { token: 'metatag', foreground: 'e00000' },
            { token: 'metatag.content.html', foreground: 'FF0000' },
            { token: 'metatag.html', foreground: '808080' },
            { token: 'metatag.xml', foreground: '808080' },
            { token: 'metatag.php', fontStyle: 'bold' },

            { token: 'key', foreground: '863B00' },
            { token: 'string.key.json', foreground: 'A31515' },
            { token: 'string.value.json', foreground: '0451A5' },

            { token: 'attribute.name', foreground: 'FF0000' },
            { token: 'attribute.value', foreground: '0451A5' },
            { token: 'attribute.value.number', foreground: '09885A' },
            { token: 'attribute.value.unit', foreground: '09885A' },
            { token: 'attribute.value.html', foreground: '0000FF' },
            { token: 'attribute.value.xml', foreground: '0000FF' },

            { token: 'string', foreground: 'A31515' },
            { token: 'string.html', foreground: '0000FF' },
            { token: 'string.sql', foreground: 'FF0000' },
            { token: 'string.yaml', foreground: '0451A5' },

            { token: 'keyword', foreground: '0000FF' },
            { token: 'keyword.json', foreground: '0451A5' },
            { token: 'keyword.flow', foreground: 'AF00DB' },
            { token: 'keyword.flow.scss', foreground: '0000FF' },

            { token: 'operator.scss', foreground: '666666' },
            { token: 'operator.sql', foreground: '778899' },
            { token: 'operator.swift', foreground: '666666' },
            { token: 'predefined.sql', foreground: 'FF00FF' },
        ],
        colors: {},
    })
}
