package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TeacherControllerIT {

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    private TeacherDto teacherDto;
    private Teacher teacher;
    private static final LocalDateTime FIXED_DATE = LocalDateTime.of(2025, 2, 12, 0, 0, 0, 0);  // Utiliser une date fixe pour les tests

    @BeforeEach
    void setUp() {
        // Utilisation d'une date fixe pour éviter des comparaisons de dates instables
        teacherDto = new TeacherDto(1L, "Doe", "Mathematics", FIXED_DATE, FIXED_DATE);
        teacher = new Teacher(1L, "Doe", "Mathematics", FIXED_DATE, FIXED_DATE);
    }

    @Test
    void testFindById_ValidId() {
        // Arrange
        when(teacherService.findById(anyLong())).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        // Act
        var response = teacherController.findById("1");

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(teacherDto, response.getBody());

        verify(teacherService, times(1)).findById(anyLong());
        verify(teacherMapper, times(1)).toDto(teacher);
    }

    @Test
    void testFindById_NotFound() {
        // Arrange
        when(teacherService.findById(anyLong())).thenReturn(null);

        // Act
        var response = teacherController.findById("1");

        // Assert
        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testFindById_InvalidId() {
        // Act
        var response = teacherController.findById("invalid-id");

        // Assert
        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void testFindAll() {
        // Arrange
        when(teacherService.findAll()).thenReturn(Collections.singletonList(teacher));
        when(teacherMapper.toDto(anyList())).thenReturn(Collections.singletonList(teacherDto));

        // Act
        var response = teacherController.findAll();

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(((List<TeacherDto>) response.getBody()).size() > 0);

        verify(teacherService, times(1)).findAll();
        verify(teacherMapper, times(1)).toDto(anyList());
    }

    @Test
    void testTeacherDto() {
        // Créer un TeacherDto avec le constructeur complet
        TeacherDto teacherDto = new TeacherDto(1L, "Doe", "John", FIXED_DATE, FIXED_DATE);

        // Vérifier les valeurs
        assertNotNull(teacherDto);
        assertEquals(1L, teacherDto.getId());
        assertEquals("Doe", teacherDto.getLastName());
        assertEquals("John", teacherDto.getFirstName());
        assertEquals(FIXED_DATE, teacherDto.getCreatedAt());
        assertEquals(FIXED_DATE, teacherDto.getUpdatedAt());
    }
}
