import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';
import { mockLocalStorage } from '../../testing/mock-storage';

describe('Login', () => {
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    mockLocalStorage();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    http.verify();
    vi.unstubAllGlobals();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentInstance.submit();
    http.expectNone('http://localhost:8080/auth/login');
  });

  it('should call login API and navigate to /welcome on success', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.form.setValue({ email: 'a@b.com', password: 'pass123' });
    component.submit();

    const req = http.expectOne('http://localhost:8080/auth/login');
    expect(req.request.body).toEqual({ email: 'a@b.com', password: 'pass123' });
    req.flush({ token: 'jwt-token' });

    expect(localStorage.getItem('auth_token')).toBe('jwt-token');
    expect(navigateSpy).toHaveBeenCalledWith(['/welcome']);
  });

  it('should display server error message on failure', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component.form.setValue({ email: 'a@b.com', password: 'wrong' });
    component.submit();

    const req = http.expectOne('http://localhost:8080/auth/login');
    req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.serverError()).toBe('Invalid credentials');
    expect(component.loading()).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should show link to register page', async () => {
    const fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[href="/register"]');
    expect(link).toBeTruthy();
    expect(link?.textContent).toContain('Register');
  });
});
