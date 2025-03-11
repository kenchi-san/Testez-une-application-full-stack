import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: { login: jest.Mock };
  let sessionServiceSpy: { logIn: jest.Mock };
  let routerSpy: { navigate: jest.Mock };

  beforeEach(async () => {
    const authServiceMock = { login: jest.fn() };
    const sessionServiceMock = { logIn: jest.fn() };
    const routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule, // Add BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore unknown elements in the template
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Mocked services
    authServiceSpy = TestBed.inject(AuthService) as any;
    sessionServiceSpy = TestBed.inject(SessionService) as any;
    routerSpy = TestBed.inject(Router) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when form is empty', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('should be valid when form is filled correctly', () => {
    component.form.controls['email'].setValue('yoga@studio.com');
    component.form.controls['password'].setValue('test!1234');
    expect(component.form.valid).toBeTruthy();
  });

  it('should call login when form is valid and submit button is clicked', () => {
    const loginRequest = { email: 'yoga@studio.com', password: 'test!1234' };
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    // Simulate the login service returning a successful response
    authServiceSpy.login.mockReturnValue(of({}));

    // Simulate clicking the submit button
    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitButton.nativeElement.click();

    // Call the submit function manually, as the button triggers it
    component.submit();

    // Expect that the login method was called with the correct loginRequest
    expect(authServiceSpy.login).toHaveBeenCalledWith(loginRequest);
  });

  it('should handle login error and set onError to true', () => {
    const loginRequest = { email: 'yoga@studio.com', password: 'test!1234' };
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    const errorResponse = new Error('Login failed');
    authServiceSpy.login.mockReturnValue(throwError(() => errorResponse));

    // Call the submit method, which should trigger the login and error handling
    component.submit();

    // Check that onError is set to true when login fails
    expect(component.onError).toBe(true);
  });

  it('should navigate to /sessions on successful login', () => {
    const loginResponse = { userId: 1, token: 'token' };
    authServiceSpy.login.mockReturnValue(of(loginResponse));
    sessionServiceSpy.logIn.mockImplementation(() => {});
    routerSpy.navigate.mockResolvedValue(true);

    const loginRequest = { email: 'yoga@studio.com', password: 'test!1234' };
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    // Simulate the form submission
    component.submit();

    // Verify that router.navigate was called with the correct route
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should show error message when login fails', (done) => {
    const loginRequest = { email: 'fail@studio.com', password: '1234' };
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    // Simuler une réponse d'erreur de login
    const errorResponse = new Error('Login failed');
    authServiceSpy.login.mockReturnValue(throwError(() => errorResponse));

    // Appeler la méthode submit qui devrait déclencher la logique d'erreur
    component.submit();

    // Attendre que la mise à jour du DOM soit terminée
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      // Vérifier que l'élément de message d'erreur est présent dans le DOM
      const errorMessage: HTMLElement = fixture.debugElement.query(By.css('.error')).nativeElement;

      // S'assurer que l'élément est bien présent
      expect(errorMessage).toBeTruthy(); // Attendre que le message d'erreur soit affiché
      expect(errorMessage.textContent).toBe('An error occurred'); // Vérifier que le message est le bon

      done();
    });
  });


});
