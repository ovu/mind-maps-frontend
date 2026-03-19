import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  serverError = signal<string | null>(null);
  loading = signal(false);

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.serverError.set(null);
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/mind-maps']),
      error: (err) => {
        this.serverError.set(err.error?.error ?? 'Login failed. Please check your credentials.');
        this.loading.set(false);
      }
    });
  }
}
