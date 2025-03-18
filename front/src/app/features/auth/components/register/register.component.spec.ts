import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: { register: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    // Création de mocks avec Jest pour AuthService et Router
    authServiceMock = {
      register: jest.fn()
    };
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message when registration fails', async () => {
    const registerRequest = {
      email: 'invalidemail@domain.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '1234'
    };

    // Simuler une erreur lors de l'enregistrement
    const errorResponse = new Error('Registration failed');
    authServiceMock.register.mockReturnValue(throwError(() => errorResponse));

    // Remplir le formulaire avec des données
    component.form.controls['email'].setValue(registerRequest.email);
    component.form.controls['firstName'].setValue(registerRequest.firstName);
    component.form.controls['lastName'].setValue(registerRequest.lastName);
    component.form.controls['password'].setValue(registerRequest.password);

    // Soumettre le formulaire
    component.submit();

    // Attendre la mise à jour du DOM
    await fixture.whenStable();
    fixture.detectChanges();

    // Vérifier l'affichage du message d'erreur
    const errorMessage: HTMLElement = fixture.debugElement.query(By.css('.error')).nativeElement;
    expect(errorMessage).toBeTruthy(); // Vérifier que l'élément d'erreur existe
    expect(errorMessage.textContent).toBe('An error occurred'); // Vérifier le texte de l'erreur
  });

  it('should navigate to login page on successful registration', async () => {
    const registerRequest = {
      email: 'yoga@studio.com',
      firstName: 'Admin',
      lastName: 'Admin',
      password: 'test!1234'
    };

    // Simuler une réponse réussie
    authServiceMock.register.mockReturnValue(of(void 0)); // Réponse vide en cas de succès

    // Remplir le formulaire avec des données valides
    component.form.controls['email'].setValue(registerRequest.email);
    component.form.controls['firstName'].setValue(registerRequest.firstName);
    component.form.controls['lastName'].setValue(registerRequest.lastName);
    component.form.controls['password'].setValue(registerRequest.password);

    // Soumettre le formulaire
    component.submit();

    // Attendre la mise à jour du DOM
    await fixture.whenStable();
    fixture.detectChanges();

    // Vérifier que le router a bien navigué vers la page de connexion
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
