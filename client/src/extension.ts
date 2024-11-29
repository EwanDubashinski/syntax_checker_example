import * as vscode from 'vscode';
import * as path from 'path';

import * as vscodeLanguageClient from 'vscode-languageclient/node';

const LANGUAGE_CLIENT_NAME = 'FunLang';
const LANGUAGE_CLIENT_ID = 'funlang';
const EXTENSION_START_MSG = 'FunLang started';
const LANGUAGE_CLIENT_STARTING_MSG = 'Starting FunLang Language Server...';
const LANGUAGE_CLIENT_READY_MSG = 'FunLang language client and server are ready';
const LANGUAGE_CLIENT_JAVA_WARNING = 'Failure to initialize language server: the FunLang language server requires JDK 1.8 or higher set in the JAVA_HOME or the funlang.javaHome VSCode setting';
const LANGUAGE_CLIENT_JAVA_START_PATH = 'Starting language server with java path: ';

let langClient: vscodeLanguageClient.LanguageClient;
let output: vscode.OutputChannel;

export async function activate(context: vscode.ExtensionContext) {
  output = vscode.window.createOutputChannel(LANGUAGE_CLIENT_NAME);
  console.log(EXTENSION_START_MSG);
  const serverJarPath = context.asAbsolutePath(path.join('server', 'antlr4-example-1.0-SNAPSHOT.jar'));
  console.log(serverJarPath);

  const javaHome: string | undefined = vscode.workspace.getConfiguration().get('funlang.javaHome') ?? process.env['JAVA_HOME'];
  try {
    initLangClient(serverJarPath, javaHome);
  } catch (e: any) {
    output.appendLine(e);
    vscode.window.showWarningMessage(LANGUAGE_CLIENT_JAVA_WARNING);
  }
}

async function initLangClient(serverJarPath: string, javaPath?: string) {
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
  let serverOptions: vscodeLanguageClient.ServerOptions = {
    command: javaPath,
    args: ['-jar', serverJarPath],
    // options: { stdio: 'pipe' }
  };

  let debugOptions: vscodeLanguageClient.ServerOptions = {
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

export function deactivate() {
  // if (langClient && langClient.needsStop()) {
  //   langClient.stop();
  // }
}
