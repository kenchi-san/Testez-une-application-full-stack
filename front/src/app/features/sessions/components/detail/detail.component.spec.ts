import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';  // Importer MatCardModule
import { MatIconModule } from '@angular/material/icon';  // Importer MatIconModule
import { ActivatedRoute } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

// Mocking services
const mockSessionService = {
  sessionInformation: {
    admin: true,
    id: 1
  }
};

const mockSessionApiService = {
  detail: jest.fn().mockReturnValue(of({
    id: 1,
    teacher_id: 1,
    users: [1, 2, 3],
    // other mock session details
  })),
  delete: jest.fn().mockReturnValue(of(null)),
  participate: jest.fn().mockReturnValue(of(null)),
  unParticipate: jest.fn().mockReturnValue(of(null)),
};

const mockTeacherService = {
  detail: jest.fn().mockReturnValue(of({
    id: 1,
    name: 'John Doe',
    // other mock teacher details
  }))
};

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,  // Ajouter MatCardModule
        MatIconModule   // Ajouter MatIconModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionApiService.detail when ngOnInit is called', () => {
    const sessionDetailSpy = jest.spyOn(mockSessionApiService, 'detail');
    component.ngOnInit();
    expect(sessionDetailSpy).toHaveBeenCalledWith('1');
  });

  it('should correctly set session and teacher data when fetchSession() is called', () => {
    component['fetchSession'](); // Directly calling the private method in test
    expect(component.session).toBeDefined();
    expect(component.teacher).toBeDefined();
  });

  it('should call sessionApiService.delete when delete() is called', () => {
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
  });

  it('should call sessionApiService.participate when participate() is called', () => {
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
  });

  it('should call sessionApiService.unParticipate when unParticipate() is called', () => {
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  it('should update session details when participate() is called', () => {
    const sessionSpy = jest.spyOn(mockSessionApiService, 'detail');
    component.participate();
    expect(sessionSpy).toHaveBeenCalled();
  });

  it('should update session details when unParticipate() is called', () => {
    const sessionSpy = jest.spyOn(mockSessionApiService, 'detail');
    component.unParticipate();
    expect(sessionSpy).toHaveBeenCalled();
  });
});
