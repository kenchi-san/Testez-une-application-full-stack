package com.openclassrooms.starterjwt.security;

import com.openclassrooms.starterjwt.security.jwt.AuthTokenFilter;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.mockito.Mock;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;
import org.mockito.MockitoAnnotations;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.mockito.Mockito.*;

public class AuthTokenFilterTest {

    private AuthTokenFilter authTokenFilter;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        // Création de l'instance de AuthTokenFilter sans constructeur avec arguments
        authTokenFilter = new AuthTokenFilter();

        // Injection des dépendances via ReflectionTestUtils
        ReflectionTestUtils.setField(authTokenFilter, "jwtUtils", jwtUtils);
        ReflectionTestUtils.setField(authTokenFilter, "userDetailsService", userDetailsService);
    }

    @Test
    public void testDoFilterInternal_ValidJwt() throws Exception {
        // Configuration des mocks pour un JWT valide
        String jwt = "valid-jwt-token";
        String username = "john.doe";
        UserDetails userDetails = mock(UserDetails.class);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(jwtUtils.validateJwtToken(jwt)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(jwt)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

        // Appel de la méthode protected
        ReflectionTestUtils.invokeMethod(authTokenFilter, "doFilterInternal", request, response, filterChain);

        // Vérifications
        verify(filterChain).doFilter(request, response);  // Vérification que la chaîne de filtres continue
    }

    @Test
    public void testDoFilterInternal_InvalidJwt() throws Exception {
        // Configuration des mocks pour un JWT invalide
        String jwt = "invalid-jwt-token";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(jwtUtils.validateJwtToken(jwt)).thenReturn(false);

        // Appel de la méthode protected
        ReflectionTestUtils.invokeMethod(authTokenFilter, "doFilterInternal", request, response, filterChain);

        // Vérifications
        verify(filterChain).doFilter(request, response);  // Vérification que la chaîne de filtres continue
    }
}
