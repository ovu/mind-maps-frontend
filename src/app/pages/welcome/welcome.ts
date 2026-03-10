import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.html'
})
export class Welcome implements OnInit {
  private auth = inject(AuthService);
  private user = inject(UserService);
  private router = inject(Router);

  email = signal<string | null>(null);
  name = signal<string | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.user.getMe().subscribe({
      next: (profile) => {
        this.email.set(profile.email);
        this.name.set(profile.name || null);
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
        this.loading.set(false);
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
