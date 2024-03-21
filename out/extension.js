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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const os = require('os');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "swagger2ts" is now active!');
    let disposable = vscode.commands.registerTextEditorCommand("swagger2ts.interface", (e) => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        const activeText = e.document.getText(e.selection);
        if (activeText) {
            console.log(activeText.split("\n"));
            let lines = activeText.split("\n").filter((x) => x.trim());
            const replaceMap = [
                {
                    origin: "string",
                    replace: ":string;",
                },
                {
                    origin: "number($bigdecimal)",
                    replace: ":number;",
                },
                {
                    origin: "integer($int32)",
                    replace: ":number;",
                },
                {
                    origin: "string($date-time)",
                    replace: ":string;",
                },
                {
                    origin: "integer($int64)",
                    replace: ":string;",
                },
                {
                    origin: "boolean",
                    replace: ": boolean;",
                },
            ];
            const newText = lines
                .map((line, index) => {
                let curLine = (index % 2 === 0 ? lines[index + 1] : lines[index - 1]).trim();
                const replaceItem = replaceMap.find((x) => curLine.endsWith(x.origin));
                if (replaceItem) {
                    curLine = curLine.replace(replaceItem.origin, replaceItem.replace) + os.EOL;
                }
                else {
                    return `/** ${curLine} */`;
                }
                return curLine;
            }).join(os.EOL);
            e.edit(async (editBuilder) => {
                editBuilder.replace(new vscode.Range(new vscode.Position(e.selection.start.line, e.selection.start.character), new vscode.Position(e.selection.end.line, e.selection.end.character)), newText);
            });
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map