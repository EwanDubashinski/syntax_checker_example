lexer grammar FunLexer;

// Keywords
FUN          : 'fun';
LET          : 'let';
RETURN       : 'return';
FROM         : 'from';
SELECT       : 'select';
WHERE        : 'where';
GROUP        : 'group';
BY           : 'by';
ORDER        : 'order';
LIMIT        : 'limit';
ASC          : 'asc';
DESC         : 'desc';

// Operators
PLUS         : '+';
MINUS        : '-';
MUL          : '*';
DIV          : '/';
MOD          : '%';
ASSIGN       : '<-';
EQUALS       : '=';
NOT_EQUALS   : '!=';
LT           : '<';
GT           : '>';
LTE          : '<=';
GTE          : '>=';
AND          : '&&';
OR           : '||';

// Symbols
LPAREN       : '(';
RPAREN       : ')';
LBRACE       : '{';
RBRACE       : '}';
COMMA        : ',';
COLON        : ':';

// Literals
NUMBER       : [0-9]+;
STRING       : '"' .*? '"';
IDENTIFIER   : [a-zA-Z_][a-zA-Z_0-9]*;

// Whitespace and Comments
WS           : [ \t\r\n]+ -> skip;
LINE_COMMENT : '//' ~[\r\n]* -> skip;
BLOCK_COMMENT: '/*' .*? '*/' -> skip;
