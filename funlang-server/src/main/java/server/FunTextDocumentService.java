package server;

import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.eclipse.lsp4j.*;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.TextDocumentService;

import antlr4.FunLexer;
import antlr4.FunParser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FunTextDocumentService implements TextDocumentService {
    public static final String LANGUAGE = "FUN";

    private final FunServer server;

    public FunTextDocumentService(FunServer server) {
        this.server = server;
    }

    @Override
    public void didOpen(DidOpenTextDocumentParams didOpenTextDocumentParams) {
        
    }

    @Override
    public void didChange(DidChangeTextDocumentParams didChangeTextDocumentParams) {
        VersionedTextDocumentIdentifier versionedTextDocumentIdentifier = didChangeTextDocumentParams.getTextDocument();
        String uri = versionedTextDocumentIdentifier.getUri();
//        Iterator<TextDocumentContentChangeEvent> textDocumentContentChangeEventIterator = didChangeTextDocumentParams.getContentChanges().iterator();
        String text = didChangeTextDocumentParams.getContentChanges().getLast().getText();

//        while (textDocumentContentChangeEventIterator.hasNext()) {
//            TextDocumentContentChangeEvent textDocumentContentChangeEvent = textDocumentContentChangeEventIterator.next();
//            String text = textDocumentContentChangeEvent.getText();
//            openDocuments.put(uri, text);
//            List<Diagnostic> currentDiagnostics = ;
//            diagnostics.addAll(currentDiagnostics);
//        }

        se  .publishDiagnostics(new PublishDiagnosticsParams(uri, validateDocument(uri, text)));
    }

    @Override
    public void didClose(DidCloseTextDocumentParams didCloseTextDocumentParams) {
        client.publishDiagnostics(
                new PublishDiagnosticsParams(
                        didCloseTextDocumentParams.getTextDocument().getUri(),
                        Collections.emptyList()));
    }

    @Override
    public void didSave(DidSaveTextDocumentParams didSaveTextDocumentParams) {

    }

    private List<Diagnostic> validateDocument(String documentUri, String documentContent) {
        List<Diagnostic> diagnostics = new ArrayList<>();

        FunLexer lexer = new FunLexer(CharStreams.fromString(documentContent.toUpperCase()));
        FunParser parser = new FunParser(new CommonTokenStream(lexer));
        parser.removeErrorListeners();
        SyntaxErrorListener errorListener = new SyntaxErrorListener();

        parser.addErrorListener(errorListener);
        parser.program();

        for (SyntaxError error : errorListener.getSyntaxErrors()) {
            Position start = new Position(error.getLine() - 1, error.getCharPositionInLine());
            Position end = new Position(error.getLine() - 1, error.getCharPositionInLine() + error.getOffendingSymbol().getText().length());

            Diagnostic diagnostic = new Diagnostic(new Range(start, end), error.getMessage(), DiagnosticSeverity.Error, LANGUAGE);
            diagnostics.add(diagnostic);
        }

        return diagnostics;
    }
}
