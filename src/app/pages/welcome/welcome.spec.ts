import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { Welcome } from './welcome';
import { mockLocalStorage } from '../../testing/mock-storage';

describe('Welcome', () => {
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    mockLocalStorage();
    localStorage.setItem('auth_token', 'test-token');
    await TestBed.configureTestingModule({
      imports: [Welcome],
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
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    http.expectOne('http://localhost:8080/api/me').flush({ email: 'a@b.com' });
  });

  it('should fetch user email and display it', async () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    const req = http.expectOne('http://localhost:8080/api/me');
    req.flush({ email: 'user@example.com' });

    await fixture.whenStable();
    expect(fixture.componentInstance.email()).toBe('user@example.com');
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should display name in greeting when available', async () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    const req = http.expectOne('http://localhost:8080/api/me');
    req.flush({ email: 'user@example.com', name: 'Alice' });

    await fixture.whenStable();
    expect(fixture.componentInstance.name()).toBe('Alice');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');
    expect(heading?.textContent).toContain('Alice');
  });

  it('should show generic welcome when name is absent', async () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    const req = http.expectOne('http://localhost:8080/api/me');
    req.flush({ email: 'user@example.com' });

    await fixture.whenStable();
    expect(fixture.componentInstance.name()).toBeNull();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');
    expect(heading?.textContent).toContain('Welcome!');
    expect(heading?.textContent).not.toContain(',');
  });

  it('should show generic welcome when name is empty string', async () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    const req = http.expectOne('http://localhost:8080/api/me');
    req.flush({ email: 'user@example.com', name: '' });

    await fixture.whenStable();
    expect(fixture.componentInstance.name()).toBeNull();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('h1');
    expect(heading?.textContent).toContain('Welcome!');
  });

  it('should redirect to /login on 401 error', () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    const navigateSpy = vi.spyOn(router, 'navigate');

    const req = http.expectOne('http://localhost:8080/api/me');
    req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should logout and navigate to /login when logout is clicked', async () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/me').flush({ email: 'a@b.com' });
    await fixture.whenStable();

    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.componentInstance.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should render sign out button', async () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/me').flush({ email: 'a@b.com' });
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent).toContain('Sign out');
  });
});
