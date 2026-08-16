import { CanvasDocument } from './LayerModel';

export class HistoryManager {
  private undoStack: CanvasDocument[] = [];
  private redoStack: CanvasDocument[] = [];
  private maxHistory: number;

  constructor(maxHistory = 50) {
    this.maxHistory = maxHistory;
  }

  public pushState(doc: CanvasDocument): void {
    // Clone document state deeply
    const snapshot: CanvasDocument = JSON.parse(JSON.stringify(doc));
    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    // Clear redo stack on new action
    this.redoStack = [];
  }

  public undo(currentDoc: CanvasDocument): CanvasDocument | null {
    if (this.undoStack.length === 0) return null;

    const currentSnapshot: CanvasDocument = JSON.parse(JSON.stringify(currentDoc));
    this.redoStack.push(currentSnapshot);

    const prevState = this.undoStack.pop();
    return prevState ? JSON.parse(JSON.stringify(prevState)) : null;
  }

  public redo(currentDoc: CanvasDocument): CanvasDocument | null {
    if (this.redoStack.length === 0) return null;

    const currentSnapshot: CanvasDocument = JSON.parse(JSON.stringify(currentDoc));
    this.undoStack.push(currentSnapshot);

    const nextState = this.redoStack.pop();
    return nextState ? JSON.parse(JSON.stringify(nextState)) : null;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
