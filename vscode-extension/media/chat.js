(function() {
    const vscode = acquireVsCodeApi();
    const messagesContainer = document.getElementById('messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const tokenCount = document.getElementById('token-count');
    const usageBar = document.getElementById('usage-bar');

    let chatHistory = [];

    // Initial usage fetch
    vscode.postMessage({ type: 'getUsage' });

    sendBtn.addEventListener('click', () => {
        sendMessage();
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        sendBtn.disabled = true;
        
        vscode.postMessage({ 
            type: 'sendMessage', 
            value: text,
            history: chatHistory
        });

        chatHistory.push({ role: 'user', parts: [{ text: text }] });
    }

    function addMessage(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}-message`;
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'addResponse':
                addMessage(message.value, 'ai');
                chatHistory.push({ role: 'model', parts: [{ text: message.value }] });
                sendBtn.disabled = false;
                // Refresh usage after response
                vscode.postMessage({ type: 'getUsage' });
                break;
            case 'usageData':
                const used = message.value.tokensUsed;
                const limit = message.value.tokensLimit;
                const percent = Math.min(100, (used / limit) * 100);
                
                tokenCount.textContent = `${used.toLocaleString()} / ${limit.toLocaleString()}`;
                usageBar.style.width = `${percent}%`;
                
                if (percent > 90) usageBar.style.backgroundColor = 'var(--vscode-errorForeground)';
                else if (percent > 70) usageBar.style.backgroundColor = '#fbbf24';
                break;
        }
    });
}());
