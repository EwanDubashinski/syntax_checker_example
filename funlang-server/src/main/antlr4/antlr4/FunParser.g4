parser grammar FunParser;

options { tokenVocab=FunLexer; }

// Entry Point
program
    : statement* EOF
    ;

// Statements
statement
    : function_decl
    | variable_decl
    | return_statement
    | query
    ;

function_decl
    : FUN IDENTIFIER '(' param_list? ')' block
    ;

param_list
    : IDENTIFIER (',' IDENTIFIER)*
    ;

variable_decl
    : LET IDENTIFIER ASSIGN expression
    ;

return_statement
    : RETURN expression
    ;

block
    : LBRACE statement* RBRACE
    ;

// Expressions
expression
    : query
    | IDENTIFIER
    | NUMBER
    | STRING
    | '(' expression ')'
    | expression bin_op expression
    ;

// Binary Operators
bin_op
    : PLUS
    | MINUS
    | MUL
    | DIV
    | MOD
    | EQUALS
    | NOT_EQUALS
    | LT
    | GT
    | LTE
    | GTE
    | AND
    | OR
    ;

// SQL-Like Queries
query
    : FROM IDENTIFIER LBRACE sql_clauses RBRACE
    ;

sql_clauses
    : SELECT column_list
      (WHERE condition)?
      (GROUP BY column_list)?
      (ORDER BY column_list (ASC | DESC)?)?
      (LIMIT NUMBER)?
    ;

column_list
    : IDENTIFIER (',' IDENTIFIER)*
    ;

condition
    : expression
    ;
