export const createAtlanTheme = (monaco: any) => {
    monaco.editor.defineTheme('atlan-light', {
        base: 'vs', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            { token: '', foreground: '#3E4359', background: 'fffffe' },
            { token: 'invalid', foreground: 'cd3131' },
            { token: 'emphasis', fontStyle: 'italic' },
            { token: 'strong', fontStyle: 'bold' },

            { token: 'variable', foreground: '001188' },
            { token: 'field', foreground: '#3E4359' },
            { token: 'variable.predefined', foreground: '4864AA' },
            { token: 'constant', foreground: 'dd0000' },
            { token: 'comment', foreground: '008000' },
            { token: 'number', foreground: '#D75292' },
            { token: 'number.hex', foreground: '#D75292' },
            { token: 'regexp', foreground: '#D75292' },
            { token: 'annotation', foreground: '808080' },
            { token: 'type', foreground: '008080' },

            { token: 'delimiter', foreground: '#3E4359' },
            { token: 'delimiter.html', foreground: '#3E4359' },
            { token: 'delimiter.xml', foreground: '#3E4359' },

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

            { token: 'attribute.name', foreground: '5277D7' },
            { token: 'attribute.value', foreground: '3E4359' },
            { token: 'attribute.value.number', foreground: 'D75292' },
            { token: 'attribute.value.unit', foreground: '09885A' },
            { token: 'attribute.value.html', foreground: '0000FF' },
            { token: 'attribute.value.xml', foreground: '0000FF' },

            { token: 'string', foreground: '5277D7' },
            { token: 'string.html', foreground: '5277D7' },
            { token: 'string.sql', foreground: '5277D7' },
            { token: 'string.yaml', foreground: '5277D7' },

            { token: 'keyword', foreground: '#5277D7' },
            { token: 'keyword.json', foreground: '#5277D7' },
            { token: 'keyword.flow', foreground: '#5277D7' },
            { token: 'keyword.flow.scss', foreground: '#5277D7' },

            { token: 'operator.scss', foreground: '5277D7' },
            { token: 'operator.sql', foreground: '5277D7' },
            { token: 'operator.swift', foreground: '5277D7' },
            { token: 'predefined.sql', foreground: '5277D7' },
        ],
        colors: {},
    })
}
