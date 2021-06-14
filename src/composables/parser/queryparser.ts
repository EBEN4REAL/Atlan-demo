import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { PostgreSQLParserVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';
import { PostgreSQLLexer } from "~/grammar/PostgreSQLLexer";
import { PostgreSQLParserParser } from "~/grammar/PostgreSQLParserParser";

export const parseQuery = (query: string, caretPosition: number): any => {
    // Create input stream from the given query string
    const inputStream = CharStreams.fromString(prepareQuery(query));
    // Create lexer
    const lexer = new PostgreSQLLexer(inputStream);
    const tokenStream = new CommonTokenStream(lexer);
    // Create parser based on the tokens from lexer
    const parser = new PostgreSQLParserParser(tokenStream);

    // Create Abstract Syntax Tree based on the root 'expression' from the parser
    const tree = parser.root();
    // Visit the tree to gather the result
    const visitor = new PostgreSQLParserVisitor(caretPosition);
    // console.log(tree);
    // console.log(visitor);

    return visitor.visit(tree);
};

const prepareQuery = (query: string): string => {
    // Remove whitespaces at the end of query string
    return query.trimEnd();
};