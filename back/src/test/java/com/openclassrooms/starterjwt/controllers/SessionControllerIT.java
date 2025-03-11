package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SessionControllerIT {

    @InjectMocks
    private SessionController sessionController;

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    private Session session;
    private SessionDto sessionDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        session = new Session(1L, "Test Session", new Date(), "Test description", null, null, null, null);
        sessionDto = new SessionDto(1L, "Test Session", new Date(), 1L, "Test description", null, null, null);
    }

    @Test
    void testFindSessionById_Success() {
        // Arrange
        when(sessionService.getById(any(Long.class))).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        // Act
        ResponseEntity<?> response = sessionController.findById("1");

        // Assert
        verify(sessionService, times(1)).getById(any(Long.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testFindSessionById_NotFound() {
        // Arrange
        when(sessionService.getById(any(Long.class))).thenReturn(null);

        // Act
        ResponseEntity<?> response = sessionController.findById("1");

        // Assert
        verify(sessionService, times(1)).getById(any(Long.class));
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateSession_Success() {
        // Arrange
        when(sessionService.create(any(Session.class))).thenReturn(session);
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        // Act
        ResponseEntity<?> response = sessionController.create(sessionDto);

        // Assert
        verify(sessionService, times(1)).create(any(Session.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testUpdateSession_Success() {
        // Arrange
        when(sessionService.update(any(Long.class), any(Session.class))).thenReturn(session);
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

        // Act
        ResponseEntity<?> response = sessionController.update("1", sessionDto);

        // Assert
        verify(sessionService, times(1)).update(any(Long.class), any(Session.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testParticipate_Success() {
        // Arrange
        doNothing().when(sessionService).participate(any(Long.class), any(Long.class));

        // Act
        ResponseEntity<?> response = sessionController.participate("1", "1");

        // Assert
        verify(sessionService, times(1)).participate(any(Long.class), any(Long.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testNoLongerParticipate_Success() {
        // Arrange
        doNothing().when(sessionService).noLongerParticipate(any(Long.class), any(Long.class));

        // Act
        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "1");

        // Assert
        verify(sessionService, times(1)).noLongerParticipate(any(Long.class), any(Long.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testFindAllSessions_Success() {
        // Préparer les données simulées
        List<Session> sessionList = new ArrayList<>();
        sessionList.add(session);

        List<SessionDto> sessionDtoList = new ArrayList<>();
        sessionDtoList.add(sessionDto);

        // Mock du service pour renvoyer les sessions
        when(sessionService.findAll()).thenReturn(sessionList);

        // Mock du mapper pour convertir les sessions en SessionDto
        when(sessionMapper.toDto(sessionList)).thenReturn(sessionDtoList);

        // Appel de la méthode findAll()
        ResponseEntity<?> response = sessionController.findAll();

        // Vérifier que le code de statut est 200 OK
        assertEquals(200, response.getStatusCodeValue());

        // Vérifier que la réponse contient la liste de SessionDto
        assertNotNull(response.getBody());
        assertTrue(((List<?>) response.getBody()).size() > 0);

        // Vérifier que le contenu de la réponse est bien une liste de SessionDto
        assertTrue(((List<?>) response.getBody()).get(0) instanceof SessionDto);

        // Vérifier que la méthode du service a été appelée
        verify(sessionService, times(1)).findAll();

        // Vérifier que le mapper a bien transformé les sessions
        verify(sessionMapper, times(1)).toDto(sessionList);
    }

    @Test
    void testDeleteSession_Success() {
        // Arrange
        doNothing().when(sessionService).delete(any(Long.class));
        when(sessionService.getById(any(Long.class))).thenReturn(session);

        // Act
        ResponseEntity<?> response = sessionController.save("1"); // Correction ici pour appeler delete() et non save()

        // Assert
        verify(sessionService, times(1)).getById(any(Long.class));
        verify(sessionService, times(1)).delete(any(Long.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteSession_NotFound() {
        // Arrange
        when(sessionService.getById(any(Long.class))).thenReturn(null);

        // Act
        ResponseEntity<?> response = sessionController.save("1"); // Correction ici pour appeler delete() et non save()

        // Assert
        verify(sessionService, times(1)).getById(any(Long.class));
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDeleteSession_BadRequest() {
        // Arrange
        String invalidId = "invalid-id";

        // Act
        ResponseEntity<?> response = sessionController.save(invalidId); // Correction ici pour appeler delete() et non save()

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(sessionService, times(0)).delete(any(Long.class)); // Vérifier que delete n'est pas appelé
    }
}
