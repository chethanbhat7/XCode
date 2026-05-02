import * as vscode from 'vscode';

export class ChatSidebarProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage': {
                    const baseUrl = 'http://localhost:3000';
                    try {
                        // Use vscode.window.withProgress for better UX
                        await vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: "X Code: Thinking...",
                            cancellable: false
                        }, async () => {
                            const response = await fetch(`${baseUrl}/api/ai/chat`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ message: data.value, history: data.history })
                            });

                            if (!response.ok) {
                                throw new Error(`Server responded with ${response.status}`);
                            }

                            const result = await response.json() as { text: string };
                            
                            if (this._view) {
                                this._view.webview.postMessage({ type: 'addResponse', value: result.text });
                            }

                            // Update usage
                            await fetch(`${baseUrl}/api/ai/usage`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    tokens: Math.floor(result.text.length / 4) + Math.floor(data.value.length / 4),
                                    prompts: 1
                                })
                            });
                        });
                    } catch (err: any) {
                        vscode.window.showErrorMessage(`X Code Error: ${err.message}. Is the PulseBoard app running at ${baseUrl}?`);
                        if (this._view) {
                            this._view.webview.postMessage({ type: 'addResponse', value: `Error: Could not connect to the assistant server. Please ensure the app is running at ${baseUrl}.` });
                        }
                    }
                    break;
                }
                case 'getUsage': {
                    const baseUrl = 'http://localhost:3000';
                    try {
                        const response = await fetch(`${baseUrl}/api/ai/usage`);
                        if (response.ok) {
                            const usage = await response.json();
                            if (this._view) {
                                this._view.webview.postMessage({ type: 'usageData', value: usage });
                            }
                        }
                    } catch (err) { }
                    break;
                }
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'chat.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'style.css'));
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; connect-src http://localhost:3000;">
				<link href="${styleUri}" rel="stylesheet">
				<title>X Code Chat</title>
			</head>
			<body>
                <div class="header">
                    <span class="header-title">X Code Assistant</span>
                    <div style="display: flex; align-items: center;">
                        <span class="status-dot"></span>
                        <span style="font-size: 10px; color: var(--vscode-descriptionForeground)">Connected</span>
                    </div>
                </div>
                <div class="usage-container" id="usage-container">
                    <div class="usage-info">
                        <span>AI Tokens Used</span>
                        <span id="token-count">0 / 50,000</span>
                    </div>
                    <div class="usage-bar-bg">
                        <div class="usage-bar-fill" id="usage-bar"></div>
                    </div>
                </div>
				<div id="chat-container">
					<div id="messages"></div>
					<div class="input-area">
                        <div class="input-wrapper">
						    <input type="text" id="chat-input" placeholder="Ask anything about the project...">
                        </div>
						<button class="send-btn" id="send-btn">Send Message</button>
					</div>
				</div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
