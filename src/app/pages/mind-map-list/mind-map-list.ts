import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService, UserProfile } from '../../services/user.service';
import { MindMapService } from '../../services/mind-map.service';
import { MindMapListItem } from '../../models/mind-map.model';

@Component({
  selector: 'app-mind-map-list',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './mind-map-list.html',
})
export class MindMapList implements OnInit {
  private auth = inject(AuthService);
  private userService = inject(UserService);
  private mindMapService = inject(MindMapService);
  private router = inject(Router);

  user = signal<UserProfile | null>(null);
  mindMaps = signal<MindMapListItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');

  showCreateForm = signal(false);
  newMapName = signal('');
  creating = signal(false);

  editingId = signal<string | null>(null);
  editingName = signal('');

  filteredMaps = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const maps = this.mindMaps();
    if (!query) return maps;
    return maps.filter(m => m.name.toLowerCase().includes(query));
  });

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (profile) => this.user.set(profile),
      error: (err) => {
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      },
    });
    this.loadMaps();
  }

  loadMaps(): void {
    this.loading.set(true);
    this.error.set(null);
    this.mindMapService.list().subscribe({
      next: (maps) => {
        maps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.mindMaps.set(maps);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        } else {
          this.error.set('Failed to load mind maps.');
          this.loading.set(false);
        }
      },
    });
  }

  openCreate(): void {
    this.showCreateForm.set(true);
    this.newMapName.set('');
  }

  cancelCreate(): void {
    this.showCreateForm.set(false);
    this.newMapName.set('');
  }

  submitCreate(): void {
    const name = this.newMapName().trim();
    if (!name) return;
    this.creating.set(true);
    this.mindMapService.create(name).subscribe({
      next: () => {
        this.showCreateForm.set(false);
        this.newMapName.set('');
        this.creating.set(false);
        this.loadMaps();
      },
      error: () => {
        this.creating.set(false);
      },
    });
  }

  startRename(map: MindMapListItem): void {
    this.editingId.set(map.id);
    this.editingName.set(map.name);
  }

  cancelRename(): void {
    this.editingId.set(null);
    this.editingName.set('');
  }

  submitRename(map: MindMapListItem): void {
    const name = this.editingName().trim();
    if (!name || name === map.name) {
      this.cancelRename();
      return;
    }
    this.mindMapService.update(map.id, name).subscribe({
      next: () => {
        this.cancelRename();
        this.loadMaps();
      },
      error: () => {
        this.cancelRename();
      },
    });
  }

  deleteMap(map: MindMapListItem): void {
    if (!confirm(`Delete "${map.name}"? This cannot be undone.`)) return;
    this.mindMapService.delete(map.id).subscribe({
      next: () => this.loadMaps(),
    });
  }

  openMap(map: MindMapListItem): void {
    this.router.navigate(['/mind-maps', map.id]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
