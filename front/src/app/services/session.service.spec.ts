import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit false when not logged in', (done) => {
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBeFalsy(); // Utilisation de toBeFalsy
      done();
    });
  });

  it('should emit true when logged in', (done) => {
    // Ajout de la propriété admin dans mockUser
    const mockUser: SessionInformation = {
      id: 1,
      token: 'sample-token',
      type: 'user',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false, // Ajout de la propriété admin
    };

    service.logIn(mockUser);

    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBeTruthy(); // Utilisation de toBeTruthy
      done();
    });
  });

  it('should store session information when logged in', () => {
    const mockUser: SessionInformation = {
      id: 1,
      token: 'sample-token',
      type: 'user',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false, // Ajout de la propriété admin
    };

    service.logIn(mockUser);

    expect(service.sessionInformation).toEqual(mockUser);
  });

  it('should clear session information when logged out', () => {
    const mockUser: SessionInformation = {
      id: 1,
      token: 'sample-token',
      type: 'user',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false, // Ajout de la propriété admin
    };

    service.logIn(mockUser); // First log in
    service.logOut(); // Then log out

    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBeFalsy(); // Utilisation de toBeFalsy
  });

  it('should emit false when logged out', (done) => {
    const mockUser: SessionInformation = {
      id: 1,
      token: 'sample-token',
      type: 'user',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false, // Ajout de la propriété admin
    };

    service.logIn(mockUser); // First log in
    service.logOut(); // Then log out

    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBeFalsy(); // Utilisation de toBeFalsy
      done();
    });
  });

  it('should call next() method when login or logout occurs', () => {
    const nextSpy = jest.spyOn(service as any, 'next'); // Spy on the private `next` method

    const mockUser: SessionInformation = {
      id: 1,
      token: 'sample-token',
      type: 'user',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false, // Ajout de la propriété admin
    };

    service.logIn(mockUser); // Log in
    expect(nextSpy).toHaveBeenCalled(); // Check if next() was called

    service.logOut(); // Log out
    expect(nextSpy).toHaveBeenCalledTimes(2); // Check if next() was called again
  });
});
