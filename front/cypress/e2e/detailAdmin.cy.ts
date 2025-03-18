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
          users: [1],
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
        users: [1, 2],
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
    cy.intercept('GET', '/api/teacher', {
      statusCode: 200,
      body: [
        { id: 1, firstName: 'DELAHE', lastName: 'Margot' },
        { id: 2, firstName: 'Thiercelin', lastName: 'Hélène' }
      ]
    }).as('getTeachers');
    cy.visit('/login');

    // Intercepter la requête de connexion
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('loginRequestAdmin');

    // Remplir les champs du formulaire de connexion
    cy.get('input[formControlName=email]').type('testuser@example.com');
    cy.get('input[formControlName=password]').type(`${'password123'}{enter}{enter}`);

    // Vérifier que la redirection est correcte
    cy.url().should('include', '/sessions');
  });

  it('should allow admin to create a new session', () => {
    // Attendre que les sessions soient récupérées
    cy.wait('@getSessions');

    // Cliquer sur le bouton "Create" pour accéder à la page de création de session
    cy.get('button[mat-raised-button][color="primary"]')
      .contains('Create')
      .should('be.visible')
      .click();

    // Vérifier que la page de création est bien affichée
    cy.url().should('include', '/sessions/create');

    // Attendre que les enseignants soient récupérés
    cy.wait('@getTeachers');

    // Remplir le formulaire pour créer une nouvelle session
    cy.get('input[formControlName="name"]').type('fere');
    cy.get('input[formControlName="date"]').type('2025-03-21');

    // Sélectionner un enseignant
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('DELAHE Margot').click();

    // Remplir la description de la session
    cy.get('textarea[formControlName="description"]').type('rererererer');

    // Intercepter la requête POST pour la création de session
    cy.intercept('POST', '/api/session', {
      statusCode: 201,
      body: {
        id: 12,  // Nouvelle session avec ID=12
        name: 'fere',
        date: '2025-03-21T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'rererererer',
        users: [],
        createdAt: '2025-03-18T01:05:41.396624',
        updatedAt: '2025-03-18T01:05:41.3976244'
      }
    }).as('createSession');

    // Intercepter la récupération des sessions après la création
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
        },
        {
          id: 12,  // Nouvelle session créée
          name: 'fere',
          description: 'rererererer',
          date: '2025-03-21T00:00:00.000+00:00',
          createdAt: '2025-03-18T01:05:41.396624',
          updatedAt: '2025-03-18T01:05:41.3976244',
          users: [],
          teachers: [{ id: 1, firstName: 'DELAHE', lastName: 'Margot' }]
        }
      ]
    }).as('getSessionsAfterCreate');

    // Soumettre le formulaire pour créer la session
    cy.get('button[mat-raised-button][color="primary"]').contains('Save').click();

    // Attendre les interceptions
    cy.wait('@createSession');
    cy.wait('@getSessionsAfterCreate');

    // Vérifier que la page a redirigé vers la liste des sessions
    cy.url().should('include', '/sessions');

    // Vérifier que la nouvelle session est bien présente dans la liste
    cy.contains('fere').should('be.visible');
  });  it('should allow user to delete a session from the detail page', () => {
    cy.contains('Morning Yoga').should('be.visible');
    cy.contains('Morning Yoga')
      .closest('mat-card')
      .within(() => {
        cy.contains('Detail').click();
      });

    cy.wait('@getSessionDetail');
    cy.wait('@teacherDetail');

    cy.get('button[mat-raised-button][color="warn"]').should('be.visible')
      .within(() => {
        cy.get('mat-icon').should('contain.text', 'delete');
      });

    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as('deleteSession');

    cy.get('button[mat-raised-button][color="warn"]').click();

    cy.wait('@deleteSession');
    cy.url().should('include', '/sessions');
  });
  it('should allow admin to edit a session description', () => {
    cy.wait('@getSessions');

    // 🔹 Vérifier que le bouton "Edit" est visible et cliquer dessus
    cy.get('button[mat-raised-button][color="primary"]')
      .contains('Edit')
      .should('be.visible')
      .click();

    // Vérifier que nous sommes bien sur la page d'édition
    cy.url().should('include', '/sessions/update/1');

    // 🔹 Modifier la description
    cy.get('textarea[formControlName=description]')
      .clear()
      .type('An intense morning yoga session for all levels.');

    // 🔹 Intercepter la requête de mise à jour de session
    cy.intercept('PUT', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Morning Yoga',
        description: 'An intense morning yoga session for all levels.', // ✅ Nouvelle description
        date: '2023-12-01',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2023-01-01',
        updatedAt: '2023-11-01',
      }
    }).as('updateSession');

    // 🔹 Intercepter la récupération des sessions après mise à jour
    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Morning Yoga',
          description: 'An intense morning yoga session for all levels.', // ✅ Mise à jour prise en compte
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
    }).as('getSessionsUpdated');

    // 🔹 Cliquer sur "Save"
    cy.get('button[mat-raised-button][color="primary"]').contains('Save').click();

    // 🔹 Attendre la mise à jour et le rechargement des sessions
    cy.wait('@updateSession');
    cy.wait('@getSessionsUpdated');

    // Vérifier que nous sommes bien revenus sur la liste des sessions
    cy.url().should('include', '/sessions');

    // Vérifier que la session affiche bien la nouvelle description
    cy.contains('An intense morning yoga session for all levels.').should('be.visible');
  });


});
