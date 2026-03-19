import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NodeService } from '../../services/node.service';
import { NodeResponse, UpdateNodeRequest } from '../../models/mind-map.model';

const API_BASE = 'http://localhost:8080';

const PRESET_COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280',
];

@Component({
  selector: 'app-node-editor-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './node-editor-panel.html',
})
export class NodeEditorPanel {
  private nodeService = inject(NodeService);

  mindMapId = input.required<string>();
  node = input.required<NodeResponse>();
  isRoot = input<boolean>(false);

  nodeUpdated = output<void>();
  nodeDeleted = output<void>();
  close = output<void>();

  presetColors = PRESET_COLORS;
  saving = signal(false);
  imageUrlInput = signal('');

  get currentType(): string {
    return this.node().nodeType;
  }

  get currentText(): string {
    return this.node().text || '';
  }

  get currentValue(): string {
    return this.node().value || '';
  }

  get currentColor(): string {
    return this.node().color || '#ffffff';
  }

  getImageSrc(): string {
    const value = this.node().value;
    if (!value) return '';
    if (value.startsWith('http')) return value;
    return `${API_BASE}/uploads/${value}`;
  }

  updateField(field: keyof UpdateNodeRequest, value: string): void {
    this.saving.set(true);
    const request: UpdateNodeRequest = { [field]: value };
    this.nodeService.update(this.mindMapId(), this.node().id, request).subscribe({
      next: () => {
        this.saving.set(false);
        this.nodeUpdated.emit();
      },
      error: () => this.saving.set(false),
    });
  }

  onTypeChange(newType: string): void {
    this.updateField('nodeType', newType);
  }

  onTextBlur(value: string): void {
    if (value !== this.node().text) {
      this.updateField('text', value);
    }
  }

  onColorChange(color: string): void {
    this.updateField('color', color);
  }

  onValueBlur(value: string): void {
    if (value !== this.node().value) {
      this.updateField('value', value);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.saving.set(true);
    this.nodeService.uploadPicture(this.mindMapId(), this.node().id, file).subscribe({
      next: () => {
        this.saving.set(false);
        this.nodeUpdated.emit();
      },
      error: () => this.saving.set(false),
    });
  }

  setImageUrl(): void {
    const url = this.imageUrlInput().trim();
    if (!url) return;
    this.updateField('value', url);
    this.imageUrlInput.set('');
  }

  addChild(): void {
    this.saving.set(true);
    this.nodeService.add(this.mindMapId(), {
      parentId: this.node().id,
      nodeType: 'text',
      text: 'New node',
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.nodeUpdated.emit();
      },
      error: () => this.saving.set(false),
    });
  }

  deleteNode(): void {
    if (!confirm('Delete this node and all its children?')) return;
    this.saving.set(true);
    this.nodeService.delete(this.mindMapId(), this.node().id).subscribe({
      next: () => {
        this.saving.set(false);
        this.nodeDeleted.emit();
      },
      error: () => this.saving.set(false),
    });
  }
}
