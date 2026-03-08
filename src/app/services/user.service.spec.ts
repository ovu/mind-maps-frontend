import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getMe', () => {
    it('calls GET /api/me and returns user profile', () => {
      const mockProfile = { email: 'user@example.com' };
      service.getMe().subscribe(profile => {
        expect(profile.email).toBe('user@example.com');
      });
      const req = http.expectOne('http://localhost:8080/api/me');
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);
    });
  });
});
