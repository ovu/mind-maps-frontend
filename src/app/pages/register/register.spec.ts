import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => http.verify());

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Register);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not submit when form is invalid (empty fields)', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentInstance.submit();
    http.expectNone('http://localhost:8080/auth/register');
  });

  it('should not submit with invalid email', () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;
    component.form.setValue({ email: 'not-an-email', password: 'pass123' });
    component.submit();
    http.expectNone('http://localhost:8080/auth/register');
  });

  it('should call register API and navigate to /login on success', () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.form.setValue({ email: 'a@b.com', password: 'pass123' });
    component.submit();

    const req = http.expectOne('http://localhost:8080/auth/register');
    expect(req.request.body).toEqual({ email: 'a@b.com', password: 'pass123' });
    req.flush({});

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should display server error message on failure', () => {
    const fixture = TestBed.createComponent(Register);
    const component = fixture.componentInstance;

    component.form.setValue({ email: 'a@b.com', password: 'pass123' });
    component.submit();

    const req = http.expectOne('http://localhost:8080/auth/register');
    req.flush({ error: 'Email already exists' }, { status: 409, statusText: 'Conflict' });

    expect(component.serverError()).toBe('Email already exists');
    expect(component.loading()).toBe(false);
  });

  it('should show link to login page', async () => {
    const fixture = TestBed.createComponent(Register);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[href="/login"]');
    expect(link).toBeTruthy();
    expect(link?.textContent).toContain('Log in');
  });
});
