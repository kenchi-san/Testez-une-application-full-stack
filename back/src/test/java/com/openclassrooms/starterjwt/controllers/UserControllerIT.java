package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;

import java.time.LocalDateTime;

@SpringBootTest
public class UserControllerIT {

    @MockBean
    private UserMapper userMapper; // Injection du mock de UserMapper

    @MockBean
    private UserService userService; // Injection du mock de UserService

    @Autowired
    private UserController userController; // Injection du contrôleur

    @Test
    void testFindById_Success() {
        // Créez un utilisateur simulé
        User mockUser = new User(1L, "john@example.com", "John", "Doe", "password", true, LocalDateTime.now(), LocalDateTime.now());

        // Créez un UserDto simulé
        UserDto mockUserDto = new UserDto(
                mockUser.getId(),
                mockUser.getEmail(),
                mockUser.getLastName(),
                mockUser.getFirstName(),
                mockUser.isAdmin(),
                "2025-02-12T10:00:00", // createdAt sous forme de String
                LocalDateTime.now(),    // updatedAt sous forme de LocalDateTime
                LocalDateTime.now()     // lastModified sous forme de LocalDateTime
        );

        // Simulez le comportement du mappage
        when(userMapper.toDto(mockUser)).thenReturn(mockUserDto);

        // Simulez le comportement du service
        when(userService.findById(1L)).thenReturn(mockUser);

        // Appelez la méthode du contrôleur
        ResponseEntity<?> response = userController.findById("1");

        // Vérifiez le code de statut
        assertEquals(200, response.getStatusCodeValue());

        // Vérifiez que la réponse contient le UserDto
        assertEquals(mockUserDto, response.getBody());
    }

    @Test
    void testFindById_NotFound() {
        // Simulez le cas où l'utilisateur n'est pas trouvé
        when(userService.findById(1L)).thenReturn(null);

        // Appelez la méthode du contrôleur
        ResponseEntity<?> response = userController.findById("1");

        // Vérifiez le code de statut
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testFindById_BadRequest() {
        // Appelez la méthode du contrôleur avec un ID invalide
        ResponseEntity<?> response = userController.findById("invalid-id");

        // Vérifiez que le code de statut est 400 Bad Request
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    @WithMockUser(username = "john@example.com")  // Utilisateur authentifié
    void testDeleteUser_Success() {
        // Créer un utilisateur simulé
        User mockUser = new User(1L, "john@example.com", "John", "Doe", "password", true, LocalDateTime.now(), LocalDateTime.now());

        // Simuler le comportement du service pour trouver l'utilisateur
        when(userService.findById(1L)).thenReturn(mockUser);
        doNothing().when(userService).delete(1L); // Simuler la suppression de l'utilisateur

        // Appeler la méthode du contrôleur pour supprimer l'utilisateur
        ResponseEntity<?> response = userController.save("1");

        // Vérifier que le code de statut est 200 OK
        assertEquals(200, response.getStatusCodeValue());

        // Vérifier que la méthode de suppression du service a été appelée
        verify(userService, times(1)).delete(1L);
    }

    @Test
    @WithMockUser(username = "john@example.com")  // Utilisateur authentifié
    void testDeleteUser_NotFound() {
        // Simuler que l'utilisateur n'est pas trouvé
        when(userService.findById(1L)).thenReturn(null);

        // Appeler la méthode du contrôleur pour supprimer l'utilisateur
        ResponseEntity<?> response = userController.save("1");

        // Vérifier que le code de statut est 404 Not Found
        assertEquals(404, response.getStatusCodeValue());

        // Vérifier que la méthode de suppression n'a pas été appelée
        verify(userService, times(0)).delete(1L);
    }

    @Test
    @WithMockUser(username = "john@example.com")  // Utilisateur authentifié
    void testDeleteUser_Unauthorized() {
        // Créer un utilisateur simulé différent pour le cas de l'authentification
        User mockUser = new User(1L, "jane@example.com", "Jane", "Doe", "password", true, LocalDateTime.now(), LocalDateTime.now());

        // Simuler que l'utilisateur avec l'ID donné existe
        when(userService.findById(1L)).thenReturn(mockUser);

        // Appeler la méthode du contrôleur pour tenter de supprimer l'utilisateur
        ResponseEntity<?> response = userController.save("1");

        // Vérifier que le code de statut est 401 Unauthorized
        assertEquals(401, response.getStatusCodeValue());

        // Vérifier que la méthode de suppression n'a pas été appelée
        verify(userService, times(0)).delete(1L);
    }

    @Test
    void testDeleteUser_BadRequest() {
        // Appeler la méthode du contrôleur avec un ID invalide
        ResponseEntity<?> response = userController.save("invalid-id");

        // Vérifier que le code de statut est 400 Bad Request
        assertEquals(400, response.getStatusCodeValue());

        // Vérifier que la méthode de suppression n'a pas été appelée
        verify(userService, times(0)).delete(any(Long.class));
    }
}
