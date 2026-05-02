import * as vscode from 'vscode';
import { ChatSidebarProvider } from './ChatSidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const provider = new ChatSidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('x-code-chat', provider)
	);
}

export function deactivate() {}
