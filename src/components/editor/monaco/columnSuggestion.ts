/*
  List of monaco.languages.CompletionItemKind  https://github.com/microsoft/monaco-editor/blob/8f6ebdc/typedoc/monaco.d.ts#L5638
*/
import * as monaco from 'monaco-editor';

const columSuggestion = (list:any) => {
    let listFormat = JSON.parse(JSON.stringify(list));
    let columnList = listFormat.map((data) => {
     return {
      label: data.displayText,
      detail: data.attributes.dataType,
      kind: monaco.languages.CompletionItemKind.Field,
      documentation: "Some description or Classification",
      insertText: data.attributes.name,
     }
    });
    return  columnList;
}

export default columSuggestion;