import { CanvasDocument } from '../engine/LayerModel';
import { DesignMemory } from '../algorithms/styleExtractor';

const PROJECTS_STORAGE_KEY = 'editive_projects_v2';
const RECENT_PROJECT_ID_KEY = 'editive_active_project_id';
const DESIGN_MEMORIES_KEY = 'editive_design_memories_v2';

export class LocalStorageManager {
  public static getProjects(): CanvasDocument[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(PROJECTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveProject(doc: CanvasDocument): void {
    if (typeof window === 'undefined') return;
    try {
      const projects = this.getProjects();
      const existingIndex = projects.findIndex((p) => p.id === doc.id);
      const updatedDoc = {
        ...doc,
        lastSavedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        projects[existingIndex] = updatedDoc;
      } else {
        projects.unshift(updatedDoc);
      }

      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      localStorage.setItem(RECENT_PROJECT_ID_KEY, doc.id);
    } catch (e) {
      console.error('Failed to save project to localStorage', e);
    }
  }

  public static getProject(id: string): CanvasDocument | null {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id) || null;
  }

  public static deleteProject(id: string): void {
    if (typeof window === 'undefined') return;
    const projects = this.getProjects().filter((p) => p.id !== id);
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    if (localStorage.getItem(RECENT_PROJECT_ID_KEY) === id) {
      localStorage.removeItem(RECENT_PROJECT_ID_KEY);
    }
  }

  public static getDesignMemories(): DesignMemory[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(DESIGN_MEMORIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveDesignMemory(memory: DesignMemory): void {
    if (typeof window === 'undefined') return;
    try {
      const memories = this.getDesignMemories();
      const idx = memories.findIndex((m) => m.id === memory.id);
      if (idx >= 0) {
        memories[idx] = memory;
      } else {
        memories.unshift(memory);
      }
      localStorage.setItem(DESIGN_MEMORIES_KEY, JSON.stringify(memories));
    } catch (e) {
      console.error('Failed to save design memory', e);
    }
  }
}
