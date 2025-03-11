package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialisation d'un objet User pour les tests
        user = new User(
                "john.doe@example.com",  // email
                "Doe",                   // lastName
                "John",                  // firstName
                "securePassword",        // password
                false                    // admin
        );
        user.setId(1L);  // Définir un ID fictif pour l'utilisateur
    }

    @Test
    public void testFindById() {
        // Simuler la méthode findById du repository
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User foundUser = userService.findById(1L);

        assertNotNull(foundUser);
        assertEquals(1L, foundUser.getId());
        assertEquals("john.doe@example.com", foundUser.getEmail());
        assertEquals("Doe", foundUser.getLastName());
        assertEquals("John", foundUser.getFirstName());
        assertEquals("securePassword", foundUser.getPassword());
        assertFalse(foundUser.isAdmin());
    }

    @Test
    public void testFindById_UserNotFound() {
        // Simuler le cas où l'utilisateur n'est pas trouvé
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        User foundUser = userService.findById(99L);

        assertNull(foundUser);  // Aucun utilisateur trouvé
    }

    @Test
    public void testDelete() {
        // Simuler le comportement de suppression, s'assurer que deleteById est appelé
        doNothing().when(userRepository).deleteById(1L);

        userService.delete(1L);

        // Vérification que deleteById a été appelé avec l'ID 1
        verify(userRepository, times(1)).deleteById(1L);
    }
}
