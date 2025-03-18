describe('Session Page', () => {
  let jwtToken;

  beforeEach(() => {
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Morning Yoga',
          description: 'A relaxing yoga session',
          date: '2025-02-17T16:28:52',
          createdAt: '2025-02-17T15:18:17',
          updatedAt: '2025-02-17T15:18:27',
          users: [{ id: 1, firstName: 'John', lastName: 'Doe' }],
          teachers: [
            { id: 1, firstName: 'DELAHE', lastName: 'Margot' },
            { id: 2, firstName: 'Thiercelin', lastName: 'Hélène' }
          ]
        }
      ]
    }).as('getSessions');

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Morning Yoga',
        description: 'A relaxing yoga session.',
        date: '2023-12-01',
        teacher_id: 1,
        users: [],
        createdAt: '2023-01-01',
        updatedAt: '2023-11-01',
      }
    }).as('getSessionDetail');


    cy.intercept('GET', '/api/teacher/1', {
      statusCode: 200,
      body:
        {
          "id": 1,
          "lastName": "TeacherLastName",
          "firstName": "TeacherFirstName",
          "createdAt": "2024-01-01",
          "updatedAt": "2024-01-01"
        }
    }).as('teacherDetail');

    cy.visit('/login');

    // Intercepter la requête de connexion
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    }).as('loginRequestNoAdmin');


    // Remplir les champs du formulaire de connexion
    cy.get('input[formControlName=email]').type('testuser@example.com');
    cy.get('input[formControlName=password]').type(`${'password123'}{enter}{enter}`);

    // Vérifier que la redirection est correcte
    cy.url().should('include', '/sessions');
  });




  // TODO A CORRIGER
  it('should allow user to participate and unparticipate in a session', () => {
    cy.wait('@getSessions');

    // 🔹 Intercepter les détails de la session avec un utilisateur **non inscrit**
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Morning Yoga',
        description: 'A relaxing yoga session.',
        date: '2023-12-01',
        teacher_id: 1,
        users: [], // L'utilisateur n'est pas inscrit
        createdAt: '2023-01-01',
        updatedAt: '2023-11-01',
      },
    }).as('getSessionDetail');

    // Aller sur les détails de la session
    cy.get('button[mat-raised-button][color="primary"]')
      .contains('Detail')
      .click({ force: true });

    cy.wait('@getSessionDetail');
    cy.url().should('include', '/sessions/detail/1');

    // Vérifier que le bouton "Participate" est bien affiché
    cy.get('button[mat-raised-button][color="primary"]').should('be.visible');

    // 🔹 Intercepter la requête d'inscription
    cy.intercept('POST', '/api/session/1/participate/1', {
      statusCode: 200,
      body: { message: 'Participation réussie' },
    }).as('participate');

    // 🔹 Intercepter la réponse après inscription
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Morning Yoga',
        description: 'A relaxing yoga session.',
        date: '2023-12-01',
        teacher_id: 1,
        users: [1], // L'utilisateur est maintenant inscrit
        createdAt: '2023-01-01',
        updatedAt: '2023-11-01',
      },
    }).as('getSessionDetailParticipated');

    // 🔹 Clic sur "Participate"
    cy.get('button[mat-raised-button][color="primary"]').click();
    cy.wait('@participate');
    cy.wait('@getSessionDetailParticipated');

    // // Vérifier que le bouton "Do not participate" apparaît
    cy.get('button[mat-raised-button][color="warn"]').should('be.visible');
    //
    // // 🔹 Intercepter la requête de désinscription
    cy.intercept('DELETE', '/api/session/1/participate/1', {
      statusCode: 200,
      body: { message: 'Désinscription réussie' },
    }).as('unparticipate');

    // // 🔹 Intercepter la réponse après désinscription
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Morning Yoga',
        description: 'A relaxing yoga session.',
        date: '2023-12-01',
        teacher_id: 1,
        users: [], // L'utilisateur est maintenant **désinscrit**
        createdAt: '2023-01-01',
        updatedAt: '2023-11-01',
      },
    }).as('getSessionDetailUnparticipated');

    // 🔹 Clic sur "Do not participate"
    cy.get('button[mat-raised-button][color="warn"]').click();
    cy.wait('@unparticipate');
    cy.wait('@getSessionDetailUnparticipated');

    // Vérifier que le bouton "Participate" est de nouveau visible
    cy.get('button[mat-raised-button][color="primary"]').should('be.visible');
  });

  it('should display session details correctly', () => {
    cy.contains('Morning Yoga').should('be.visible');
    cy.contains('Morning Yoga')
      .closest('mat-card')
      .within(() => {
        cy.contains('Detail').click();
      });

    cy.wait('@getSessionDetail');
    cy.wait('@teacherDetail');

    cy.contains('Morning Yoga').should('be.visible');
    cy.contains('Morning Yoga').should('be.visible');
    cy.contains('A relaxing yoga session').should('be.visible');
  });

  it('should navigate to session details and return to the sessions list', () => {
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');

    cy.get('button[mat-raised-button][color="primary"]')
      .contains('Detail')
      .click({ force: true });

    cy.wait('@getSessionDetail');
    cy.url().should('include', '/sessions/detail/1');

    cy.get('button mat-icon').contains('arrow_back').click();
    cy.url().should('include', '/sessions');
  });

});
