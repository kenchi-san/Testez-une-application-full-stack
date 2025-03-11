package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserDetailsImplTest {

    private UserDetailsImpl user1;
    private UserDetailsImpl user2;
    private UserDetailsImpl user3;
    private UserDetailsImpl userWithNullId;

    @BeforeEach
    void setUp() {
        user1 = UserDetailsImpl.builder()
                .id(1L)
                .username("john.doe")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("password")
                .build();

        user2 = UserDetailsImpl.builder()
                .id(1L)
                .username("john.doe")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("password")
                .build();

        user3 = UserDetailsImpl.builder()
                .id(2L)
                .username("jane.doe")
                .firstName("Jane")
                .lastName("Doe")
                .admin(false)
                .password("password")
                .build();

        userWithNullId = UserDetailsImpl.builder()
                .id(null)
                .username("null.id")
                .firstName("Null")
                .lastName("Id")
                .admin(false)
                .password("password")
                .build();
    }

    @Test
    void testEquals_SameObject() {
        // Same object should be equal
        assertTrue(user1.equals(user1));
    }

    @Test
    void testEquals_SameId() {
        // Different instances with same id should be equal
        assertTrue(user1.equals(user2));
    }

    @Test
    void testEquals_DifferentId() {
        // Different instances with different id should not be equal
        assertFalse(user1.equals(user3));
    }

    @Test
    void testEquals_NullObject() {
        // Should return false when compared with null
        assertFalse(user1.equals(null));
    }

    @Test
    void testEquals_DifferentClass() {
        // Should return false when compared with an object of a different class
        assertFalse(user1.equals("Some string"));
    }

    @Test
    void testEquals_NullId() {
        // Should handle comparison with null id correctly
        UserDetailsImpl anotherUserWithNullId = UserDetailsImpl.builder()
                .id(null)
                .username("null.id")
                .firstName("Null")
                .lastName("Id")
                .admin(false)
                .password("password")
                .build();

        assertTrue(userWithNullId.equals(anotherUserWithNullId));
    }
}
