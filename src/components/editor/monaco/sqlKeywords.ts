import * as monaco from 'monaco-editor';
import { languageTokens } from "@/editor/monaco/sqlTokens";

const sqlKeywords = () => {
  let keywordsList = languageTokens.keywords.map((keyword) => {
   return {
    label: keyword,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: keyword,
   }
  });
  return  keywordsList;
}

export default sqlKeywords;