import * as vscode from 'vscode'

export class StatusBarService {

  private statusBar: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10)

  constructor() {

    this.statusBar.name = 'JS Performance'

  }

  public update(text: string): vscode.StatusBarItem {

    this.statusBar.text = text

    this.statusBar.show()

    return this.statusBar

  }

}