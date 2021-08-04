import * as monaco from 'monaco-editor';
import { languageTokens } from "~/components/projects/monaco/sqlTokens";

const sqlKeywords = () => {
  const keywordsList = languageTokens.keywords.map((keyword) => ({
    label: keyword,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: keyword,
   }));
  return  keywordsList;
}

export default sqlKeywords;