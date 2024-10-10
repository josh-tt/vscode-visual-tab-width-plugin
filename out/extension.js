"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
let decorationType;
let isWiderTabsActive = true; // Set to true by default
let statusBarItem;
function activate(context) {
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = "visualTabWidth.showOptions";
    context.subscriptions.push(statusBarItem);
    function updateVisualWidth() {
        const config = vscode.workspace.getConfiguration("editor");
        const tabSize = config.get("tabSize", 2);
        const multiplier = vscode.workspace
            .getConfiguration("visualTabWidth")
            .get("multiplier", 2);
        if (decorationType) {
            decorationType.dispose();
        }
        decorationType = vscode.window.createTextEditorDecorationType({
            before: {
                contentText: " ",
                width: `${tabSize * (multiplier - 1)}ch`,
                margin: "0",
            },
        });
        // Update status bar
        updateStatusBar(tabSize, multiplier);
        applyDecorations();
    }
    function updateStatusBar(tabSize, multiplier) {
        if (isWiderTabsActive) {
            statusBarItem.text = `Tab Width: ${(tabSize * multiplier).toFixed(2)}`;
            statusBarItem.show();
        }
        else {
            statusBarItem.hide();
        }
    }
    function applyDecorations() {
        if (!isWiderTabsActive || !decorationType)
            return;
        vscode.window.visibleTextEditors.forEach((editor) => {
            const text = editor.document.getText();
            const decorations = [];
            const regex = /^[\t ]+/gm;
            let match;
            while ((match = regex.exec(text)) !== null) {
                for (let i = 0; i < match[0].length; i++) {
                    const startPos = editor.document.positionAt(match.index + i);
                    const endPos = editor.document.positionAt(match.index + i + 1);
                    decorations.push({
                        range: new vscode.Range(startPos, endPos),
                    });
                }
            }
            // Add null check here
            if (decorationType) {
                editor.setDecorations(decorationType, decorations);
            }
        });
    }
    function toggleWiderTabs() {
        isWiderTabsActive = !isWiderTabsActive;
        if (isWiderTabsActive) {
            updateVisualWidth();
        }
        else {
            if (decorationType) {
                decorationType.dispose();
                decorationType = undefined;
            }
            statusBarItem.hide();
        }
        vscode.window.showInformationMessage(`Wider tabs display: ${isWiderTabsActive ? "ON" : "OFF"}`);
    }
    function hideIndents() {
        vscode.workspace
            .getConfiguration("editor")
            .update("guides.indentation", false, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("Indent guides hidden");
    }
    function showIndents() {
        vscode.workspace
            .getConfiguration("editor")
            .update("guides.indentation", true, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage("Indent guides shown");
    }
    async function showOptions() {
        const config = vscode.workspace.getConfiguration("editor");
        const tabSize = config.get("tabSize", 2);
        const multiplier = vscode.workspace
            .getConfiguration("visualTabWidth")
            .get("multiplier", 2);
        const options = [
            `Set Tab Width (current: ${(tabSize * multiplier).toFixed(2)})`,
            `Set Multiplier (current: ${multiplier.toFixed(2)})`,
            isWiderTabsActive ? "Disable Wider Tabs" : "Enable Wider Tabs",
            "Hide Indent Guides",
            "Show Indent Guides",
        ];
        const choice = await vscode.window.showQuickPick(options);
        switch (choice) {
            case options[0]:
                const newWidth = await vscode.window.showInputBox({
                    prompt: "Enter new tab width",
                    validateInput: (value) => {
                        return /^\d*\.?\d+$/.test(value)
                            ? null
                            : "Please enter a valid number";
                    },
                });
                if (newWidth) {
                    const newMultiplier = parseFloat(newWidth) / tabSize;
                    await vscode.workspace
                        .getConfiguration("visualTabWidth")
                        .update("multiplier", newMultiplier, vscode.ConfigurationTarget.Global);
                    updateVisualWidth();
                }
                break;
            case options[1]:
                const newMultiplier = await vscode.window.showInputBox({
                    prompt: "Enter new multiplier",
                    validateInput: (value) => {
                        return /^\d*\.?\d+$/.test(value)
                            ? null
                            : "Please enter a valid number";
                    },
                });
                if (newMultiplier) {
                    await vscode.workspace
                        .getConfiguration("visualTabWidth")
                        .update("multiplier", parseFloat(newMultiplier), vscode.ConfigurationTarget.Global);
                    updateVisualWidth();
                }
                break;
            case options[2]:
                toggleWiderTabs();
                break;
            case options[3]:
                hideIndents();
                break;
            case options[4]:
                showIndents();
                break;
        }
    }
    context.subscriptions.push(vscode.commands.registerCommand("visualTabWidth.showOptions", showOptions), vscode.commands.registerCommand("visualTabWidth.toggleWiderTabs", toggleWiderTabs), vscode.commands.registerCommand("visualTabWidth.hideIndents", hideIndents), vscode.commands.registerCommand("visualTabWidth.showIndents", showIndents), vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("editor.tabSize") ||
            e.affectsConfiguration("visualTabWidth.multiplier")) {
            updateVisualWidth();
        }
    }), vscode.window.onDidChangeActiveTextEditor(() => {
        if (vscode.window.activeTextEditor) {
            applyDecorations();
        }
    }), vscode.workspace.onDidChangeTextDocument((e) => {
        if (vscode.window.activeTextEditor &&
            e.document === vscode.window.activeTextEditor.document) {
            applyDecorations();
        }
    }));
    updateVisualWidth(); // This will apply the wider tabs immediately
}
exports.activate = activate;
function deactivate() {
    if (decorationType) {
        decorationType.dispose();
    }
    statusBarItem.dispose();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map