package server;

import org.eclipse.lsp4j.InitializeParams;
import org.eclipse.lsp4j.InitializeResult;
import org.eclipse.lsp4j.ServerCapabilities;
import org.eclipse.lsp4j.TextDocumentSyncKind;
import org.eclipse.lsp4j.jsonrpc.Launcher;
import org.eclipse.lsp4j.launch.LSPLauncher;
import org.eclipse.lsp4j.services.LanguageClient;
import org.eclipse.lsp4j.services.LanguageServer;
import org.eclipse.lsp4j.services.TextDocumentService;
import org.eclipse.lsp4j.services.WorkspaceService;

import java.util.concurrent.CompletableFuture;

public class FunServer implements LanguageServer {

    private final FunTextDocumentService textDocumentService = new FunTextDocumentService(this);
    private LanguageClient languageClient;

    @Override
    public CompletableFuture<InitializeResult> initialize(InitializeParams initializeParams) {
        ServerCapabilities capabilities = new ServerCapabilities();
        capabilities.setTextDocumentSync(TextDocumentSyncKind.Full);
        InitializeResult result = new InitializeResult(capabilities);
        return CompletableFuture.completedFuture(result);
    }

    @Override
    public CompletableFuture<Object> shutdown() {
        return null;
    }

    @Override
    public void exit() {
        System.exit(0);
    }

    @Override
    public TextDocumentService getTextDocumentService() {
        return textDocumentService;
    }

    @Override
    public WorkspaceService getWorkspaceService() {
        return null;
    }

    public static void main(String[] args) {
        FunServer server = new FunServer();
        Launcher<LanguageClient> launcher = LSPLauncher.createServerLauncher(server, System.in, System.out, false, null);
        server.setLanguageClient(launcher.getRemoteProxy());
        launcher.startListening();
    }

    public LanguageClient getLanguageClient() {
        return languageClient;
    }

    public void setLanguageClient(LanguageClient languageClient) {
        this.languageClient = languageClient;
    }
}
