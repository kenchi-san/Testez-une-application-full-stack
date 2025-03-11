import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: { admin: true }
  };

  const mockSessionApiService = {
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
    detail: jest.fn().mockReturnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks(); // Nettoie les mocks avant chaque test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionApiService.create when form is submitted for a new session', () => {
    component.sessionForm?.setValue({
      name: 'Test Session',
      date: '2025-01-01',
      teacher_id: '1',
      description: 'Test Description'
    });

    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalledWith({
      name: 'Test Session',
      date: '2025-01-01',
      teacher_id: '1',
      description: 'Test Description'
    });
  });

  it('should call sessionApiService.update when form is submitted for an existing session', () => {
    component.onUpdate = true;
    component['id'] = '1'; // Force un ID valide
    component.sessionForm?.setValue({
      name: 'Updated Session',
      date: '2025-01-01',
      teacher_id: '1',
      description: 'Updated Description'
    });

    component.submit();

    expect(mockSessionApiService.update).toHaveBeenCalledWith('1', {
      name: 'Updated Session',
      date: '2025-01-01',
      teacher_id: '1',
      description: 'Updated Description'
    });
  });

  it('should initialize form for session creation', () => {
    component.ngOnInit();
    expect(component.sessionForm?.valid).toBeFalsy();
    expect(component.sessionForm?.controls['name'].hasError('required')).toBeTruthy();
    expect(component.sessionForm?.controls['date'].hasError('required')).toBeTruthy();
    expect(component.sessionForm?.controls['teacher_id'].hasError('required')).toBeTruthy();
    expect(component.sessionForm?.controls['description'].hasError('required')).toBeTruthy();
  });

  it('should navigate to sessions page if user is not an admin', () => {
    mockSessionService.sessionInformation!.admin = false;
    fixture.detectChanges(); // Met à jour le composant

    const routerNavigateSpy = jest.spyOn(component['router'], 'navigate');
    component.ngOnInit();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize form for session update', () => {
    component.onUpdate = true;
    component['id'] = '1'; // ID valide

    const mockSession = {
      id: '1',
      name: 'Test Session',
      date: '2025-01-01',
      teacher_id: '1',
      description: 'Test Description'
    };

    mockSessionApiService.detail.mockReturnValue(of(mockSession));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.sessionForm?.value.name).toBe('Test Session');
    expect(component.sessionForm?.value.date).toBe('2025-01-01');
    expect(component.sessionForm?.value.teacher_id).toBe('1');
    expect(component.sessionForm?.value.description).toBe('Test Description');
  });

  it('should handle validation errors when form is incomplete', () => {
    component.sessionForm?.setValue({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    });

    component.submit();

    expect(component.sessionForm?.invalid).toBeTruthy();
    expect(component.sessionForm?.controls['name'].hasError('required')).toBeTruthy();
    expect(component.sessionForm?.controls['date'].hasError('required')).toBeTruthy();
    expect(component.sessionForm?.controls['teacher_id'].hasError('required')).toBeTruthy();
    expect(component.sessionForm?.controls['description'].hasError('required')).toBeTruthy();
  });
});
