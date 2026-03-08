import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { mockLocalStorage } from '../testing/mock-storage';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    mockLocalStorage();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.unstubAllGlobals();
  });

  describe('register', () => {
    it('calls POST /auth/register with email and password', () => {
      service.register('a@b.com', 'pass').subscribe();
      const req = http.expectOne('http://localhost:8080/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'a@b.com', password: 'pass' });
      req.flush({});
    });
  });

  describe('login', () => {
    it('calls POST /auth/login and stores token in localStorage', () => {
      service.login('a@b.com', 'pass').subscribe();
      const req = http.expectOne('http://localhost:8080/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush({ token: 'test-token' });
      expect(localStorage.getItem('auth_token')).toBe('test-token');
    });

    it('does not store token if login fails', () => {
      service.login('a@b.com', 'wrong').subscribe({ error: () => {} });
      const req = http.expectOne('http://localhost:8080/auth/login');
      req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('removes auth_token from localStorage', () => {
      localStorage.setItem('auth_token', 'test-token');
      service.logout();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('getToken', () => {
    it('returns token when present', () => {
      localStorage.setItem('auth_token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });

    it('returns null when no token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when token exists', () => {
      localStorage.setItem('auth_token', 'my-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('returns false when no token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
