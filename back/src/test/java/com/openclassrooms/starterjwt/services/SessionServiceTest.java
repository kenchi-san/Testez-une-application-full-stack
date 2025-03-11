package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class SessionServiceTest {

    private final SessionRepository sessionRepository = Mockito.mock(SessionRepository.class);
    private final UserRepository userRepository = Mockito.mock(UserRepository.class);

    private final SessionService sessionService = new SessionService(sessionRepository, userRepository);

    @Test
    void testCreateSession() {
        // Créer un objet Teacher simulé
        Teacher mockTeacher = new Teacher(); // Remplacez par une implémentation correcte de Teacher
        List<User> users = new ArrayList<>();

        // Créer une session simulée
        Session mockSession = new Session(1L, "Yoga Session", new Date(), "Session description", mockTeacher, users, LocalDateTime.now(), LocalDateTime.now());

        // Créer un SessionDto avec les bons paramètres
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Yoga Session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L); // L'ID du teacher
        sessionDto.setDescription("Session description");
        sessionDto.setUsers(Arrays.asList(1L, 2L)); // Exemple de liste d'IDs des utilisateurs
        sessionDto.setCreatedAt(LocalDateTime.now());
        sessionDto.setUpdatedAt(LocalDateTime.now());

        // Simuler que la méthode save retourne la session simulée
        when(sessionRepository.save(mockSession)).thenReturn(mockSession);

        // Appeler la méthode de service
        Session createdSession = sessionService.create(mockSession);

        // Vérifier que la session retournée est correcte
        assertEquals(mockSession, createdSession);

        // Vérifier que save a été appelé une fois
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    void testDeleteSession() {
        // Simuler que la session à supprimer existe
        doNothing().when(sessionRepository).deleteById(1L);

        // Appeler la méthode de service pour supprimer
        sessionService.delete(1L);

        // Vérifier que deleteById a été appelé une fois
        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    void testFindAllSessions() {
        // Créer des sessions simulées
        Teacher mockTeacher = new Teacher();
        List<User> users = new ArrayList<>();
        Session mockSession1 = new Session(1L, "Yoga Session 1", new Date(), "Description", mockTeacher, users, LocalDateTime.now(), LocalDateTime.now());
        Session mockSession2 = new Session(2L, "Yoga Session 2", new Date(), "Description", mockTeacher, users, LocalDateTime.now(), LocalDateTime.now());

        // Simuler que findAll retourne une liste de sessions
        when(sessionRepository.findAll()).thenReturn(Arrays.asList(mockSession1, mockSession2));

        // Appeler la méthode de service
        var sessions = sessionService.findAll();

        // Vérifier que la liste retournée contient les bonnes sessions
        assertEquals(2, sessions.size());
        assertEquals(mockSession1, sessions.get(0));
        assertEquals(mockSession2, sessions.get(1));
    }

    @Test
    void testGetSessionById_Success() {
        // Créer une session simulée
        Teacher mockTeacher = new Teacher();
        List<User> users = new ArrayList<>();
        Session mockSession = new Session(1L, "Yoga Session", new Date(), "Session description", mockTeacher, users, LocalDateTime.now(), LocalDateTime.now());

        // Simuler que findById retourne la session simulée
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));

        // Appeler la méthode de service
        Session session = sessionService.getById(1L);

        // Vérifier que la session retournée est correcte
        assertEquals(mockSession, session);
    }

    @Test
    void testGetSessionById_NotFound() {
        // Simuler que findById retourne un Optional vide
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        // Appeler la méthode de service
        Session session = sessionService.getById(1L);

        // Vérifier que la session est null
        assertEquals(null, session);
    }

    @Test
    void testUpdateSession() {
        // Créer une session simulée
        Teacher mockTeacher = new Teacher();
        List<User> users = new ArrayList<>();
        Session mockSession = new Session(1L, "Yoga Session", new Date(), "Session description", mockTeacher, users, LocalDateTime.now(), LocalDateTime.now());

        // Simuler que la méthode save retourne la session mise à jour
        when(sessionRepository.save(mockSession)).thenReturn(mockSession);

        // Appeler la méthode de service pour mettre à jour
        Session updatedSession = sessionService.update(1L, mockSession);

        // Vérifier que la session retournée est correcte
        assertEquals(mockSession, updatedSession);

        // Vérifier que save a été appelé une fois
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    void testParticipateInSession_Success() {
        // Créer une session et un utilisateur simulés
        Teacher mockTeacher = new Teacher();
        List<User> users = new ArrayList<>();
        Session mockSession = new Session(1L, "Yoga Session", new Date(), "Session description", mockTeacher, users, LocalDateTime.now(), LocalDateTime.now());
        User mockUser = new User(1L, "john@example.com", "John", "Doe", "password", true, null, null);

        // Simuler que findById retourne la session et l'utilisateur
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        // Appeler la méthode pour participer à la session
        sessionService.participate(1L, 1L);

        // Vérifier que la session a été mise à jour avec l'utilisateur
        assertEquals(1, mockSession.getUsers().size());
        assertEquals(mockUser, mockSession.getUsers().get(0));

        // Vérifier que save a été appelé une fois
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    void testParticipateInSession_NotFound() {
        // Simuler que la session ou l'utilisateur n'existe pas
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Vérifier que la méthode lève une exception
        try {
            sessionService.participate(1L, 1L);
        } catch (NotFoundException e) {
            // Test réussi si une NotFoundException est levée
        }
    }

    @Test
    void testNoLongerParticipate_Success() {
        // Créer une session et un utilisateur simulés
        Teacher mockTeacher = new Teacher();
        List<User> users = new ArrayList<>();
        Session mockSession = new Session(1L, "Yoga Session", new Date(), "Session description", mockTeacher, users, LocalDateTime.now(), LocalDateTime.now());
        User mockUser = new User(1L, "john@example.com", "John", "Doe", "password", true, null, null);

        // Ajouter l'utilisateur à la session
        mockSession.getUsers().add(mockUser);

        // Simuler que findById retourne la session et l'utilisateur
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));

        // Appeler la méthode pour désinscrire de la session
        sessionService.noLongerParticipate(1L, 1L);

        // Vérifier que l'utilisateur a été retiré de la session
        assertEquals(0, mockSession.getUsers().size());

        // Vérifier que save a été appelé une fois
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    void testNoLongerParticipate_BadRequest() {
        // Créer une session simulée
        Teacher mockTeacher = new Teacher();
        List<User> users = new ArrayList<>();
        Session mockSession = new Session(1L, "Yoga Session", new Date(), "Session description", mockTeacher, users, LocalDateTime.now(), LocalDateTime.now());

        // Simuler que la session existe mais l'utilisateur n'est pas dans la session
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));

        // Appeler la méthode pour désinscrire et vérifier l'exception
        try {
            sessionService.noLongerParticipate(1L, 1L);
        } catch (BadRequestException e) {
            // Test réussi si une BadRequestException est levée
        }
    }
}
