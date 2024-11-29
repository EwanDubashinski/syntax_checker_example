"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const vscodeLanguageClient = __importStar(require("vscode-languageclient/node"));
const LANGUAGE_CLIENT_NAME = 'FunLang';
const LANGUAGE_CLIENT_ID = 'funlang';
const EXTENSION_START_MSG = 'FunLang started';
const LANGUAGE_CLIENT_STARTING_MSG = 'Starting FunLang Language Server...';
const LANGUAGE_CLIENT_READY_MSG = 'FunLang language client and server are ready';
const LANGUAGE_CLIENT_JAVA_WARNING = 'Failure to initialize language server: the FunLang language server requires JDK 1.8 or higher set in the JAVA_HOME or the funlang.javaHome VSCode setting';
const LANGUAGE_CLIENT_JAVA_START_PATH = 'Starting language server with java path: ';
let langClient;
let output;
async function activate(context) {
    output = vscode.window.createOutputChannel(LANGUAGE_CLIENT_NAME);
    console.log(EXTENSION_START_MSG);
    const serverJarPath = context.asAbsolutePath(path.join('server', 'antlr4-example-1.0-SNAPSHOT.jar'));
    console.log(serverJarPath);
    const javaHome = vscode.workspace.getConfiguration().get('funlang.javaHome') ?? process.env['JAVA_HOME'];
    try {
        initLangClient(serverJarPath, javaHome);
    }
    catch (e) {
        output.appendLine(e);
        vscode.window.showWarningMessage(LANGUAGE_CLIENT_JAVA_WARNING);
    }
}
async function initLangClient(serverJarPath, javaPath) {
    javaPath = javaPath ? path.join(javaPath, '/bin/java') : "java";
    console.log(LANGUAGE_CLIENT_JAVA_START_PATH + javaPath);
    // Create the client options used for the vscode_languageclient.LanguageClient
    let clientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'funlang' }
        ],
        synchronize: {
            // The configurationSection needs to match the configuration definition in
            // the package.json
            configurationSection: 'funlang',
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.fun')
        }
    };
    // Create the server options used for the vscode_languageclient.LanguageClient
    // Note: the server will be started by the client
    let serverOptions = {
        command: javaPath,
        args: ['-jar', serverJarPath],
        // options: { stdio: 'pipe' }
    };
    let debugOptions = {
        command: javaPath,
        args: ['-agentlib:jdwp=transport=dt_shmem,server=y,suspend=y,address=8765,quiet=y', '-jar', serverJarPath],
        // args: ['-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:5005,quiet=y', '-jar', serverJarPath],
        // options: { stdio: 'pipe' }
    };
    // console.log(debugOptions);
    langClient = new vscodeLanguageClient.LanguageClient(LANGUAGE_CLIENT_ID, LANGUAGE_CLIENT_NAME, serverOptions, clientOptions, true);
    // langClient = new vscode_languageclient.LanguageClient(LANGUAGE_CLIENT_ID, LANGUAGE_CLIENT_NAME, debugOptions, clientOptions, false);
    output.appendLine(LANGUAGE_CLIENT_STARTING_MSG);
    await langClient.start();
    langClient.onTelemetry((e) => {
        output.appendLine(e);
    });
    output.appendLine(LANGUAGE_CLIENT_READY_MSG);
}
function deactivate() {
    // if (langClient && langClient.needsStop()) {
    //   langClient.stop();
    // }
}
//# sourceMappingURL=extension.js.map