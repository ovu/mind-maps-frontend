import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';

function mockAuthService(authenticated: boolean) {
  return { isAuthenticated: vi.fn(() => authenticated) };
}

describe('authGuard', () => {
  it('allows navigation when authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService(true) }
      ]
    });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to /login when not authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService(false) }
      ]
    });
    const router = TestBed.inject(Router);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toEqual(router.createUrlTree(['/login']));
  });
});

describe('guestGuard', () => {
  it('allows navigation when not authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService(false) }
      ]
    });
    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to /mind-maps when already authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService(true) }
      ]
    });
    const router = TestBed.inject(Router);
    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
    expect(result).toEqual(router.createUrlTree(['/mind-maps']));
  });
});
