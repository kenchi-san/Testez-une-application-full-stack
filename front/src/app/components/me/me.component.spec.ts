import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeComponent } from './me.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';  // Importer MatCardModule
import { MatIconModule } from '@angular/material/icon';  // Importer MatIconModule
import { of } from 'rxjs';

// Mock services
const mockSessionService = {
  sessionInformation: { id: 1, admin: true },
  logOut: jest.fn()
};

const mockUserService = {
  getById: jest.fn().mockReturnValue(of({
    id: 1,
    email: 'test@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: true,
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  delete: jest.fn().mockReturnValue(of(null))
};

const mockRouter = {
  navigate: jest.fn()
};

const mockMatSnackBar = {
  open: jest.fn()
};

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [MatCardModule, MatIconModule],  // Ajouter les modules nécessaires d'Angular Material
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getById and fetch user data', () => {
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toBeDefined();
  });

  it('should call logOut and navigate after delete', () => {
    component.delete();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      "Your account has been deleted !", 'Close', { duration: 3000 }
    );
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
