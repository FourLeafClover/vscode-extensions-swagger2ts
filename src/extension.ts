// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const os = require('os')

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "swagger2ts" is now active!');

  let disposable = vscode.commands.registerTextEditorCommand(
    "swagger2ts.interface",
    (e) => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const activeText = e.document.getText(e.selection);
      if (activeText) {
        let lines = activeText.split("\n").filter((x) => x.trim());
        const replaceMap: {
          origin: string;
          replace: string;
        }[] = [
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
            let curLine = (
              index % 2 === 0 ? lines[index + 1] : lines[index - 1]
            ).trim();
            const replaceItem = replaceMap.find((x) =>
              curLine.endsWith(x.origin)
            );
            if (replaceItem) {
              curLine = curLine.replace(
                replaceItem.origin,
                replaceItem.replace
              )+ os.EOL
            } else {
              return `/** ${curLine} */`;
            }
            return curLine;
          }).join(os.EOL)
        e.edit(async (editBuilder) => {
          editBuilder.replace(
            new vscode.Range(
              new vscode.Position(
                e.selection.start.line,
                e.selection.start.character
              ),
              new vscode.Position(
                e.selection.end.line,
                e.selection.end.character
              )
            ),
            newText
          );
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}