import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    const httpMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [
        SessionApiService,
        { provide: HttpClient, useValue: httpMock }
      ]
    });

    service = TestBed.inject(SessionApiService);
    httpClientMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.get() on all()', () => {
    const mockSessions: Session[] = [{
      id: 1,
      name: 'Test Session',
      date: new Date(),
      teacher_id: 1,
      description: 'Description',
      users: [] // ✅ Ajout de `users`
    }];
    httpClientMock.get.mockReturnValue(of(mockSessions));

    service.all().subscribe(response => {
      expect(response).toEqual(mockSessions);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith('api/session');
  });

  it('should call HttpClient.get() on detail(id)', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Test Session',
      date: new Date(),
      teacher_id: 1,
      description: 'Description',
      users: [] // ✅ Ajout de `users`
    };
    httpClientMock.get.mockReturnValue(of(mockSession));

    service.detail('1').subscribe(response => {
      expect(response).toEqual(mockSession);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith('api/session/1');
  });

  it('should call HttpClient.post() on create(session)', () => {
    const newSession: Session = {
      id: 2,
      name: 'New Session',
      date: new Date(),
      teacher_id: 2,
      description: 'New Description',
      users: [] // ✅ Ajout de `users`
    };
    httpClientMock.post.mockReturnValue(of(newSession));

    service.create(newSession).subscribe(response => {
      expect(response).toEqual(newSession);
    });

    expect(httpClientMock.post).toHaveBeenCalledWith('api/session', newSession);
  });

  it('should call HttpClient.put() on update(id, session)', () => {
    const updatedSession: Session = {
      id: 1,
      name: 'Updated Session',
      date: new Date(),
      teacher_id: 1,
      description: 'Updated Description',
      users: [] // ✅ Ajout de `users`
    };
    httpClientMock.put.mockReturnValue(of(updatedSession));

    service.update('1', updatedSession).subscribe(response => {
      expect(response).toEqual(updatedSession);
    });

    expect(httpClientMock.put).toHaveBeenCalledWith('api/session/1', updatedSession);
  });

  it('should call HttpClient.delete() on delete(id)', () => {
    httpClientMock.delete.mockReturnValue(of({}));

    service.delete('1').subscribe(response => {
      expect(response).toEqual({});
    });

    expect(httpClientMock.delete).toHaveBeenCalledWith('api/session/1');
  });

  it('should call HttpClient.post() on participate(id, userId)', () => {
    httpClientMock.post.mockReturnValue(of());

    service.participate('1', 'user123').subscribe();

    expect(httpClientMock.post).toHaveBeenCalledWith('api/session/1/participate/user123', null);
  });

  it('should call HttpClient.delete() on unParticipate(id, userId)', () => {
    httpClientMock.delete.mockReturnValue(of());

    service.unParticipate('1', 'user123').subscribe();

    expect(httpClientMock.delete).toHaveBeenCalledWith('api/session/1/participate/user123');
  });
});
