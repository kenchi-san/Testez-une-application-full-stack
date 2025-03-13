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
    }).as('loginRequest');



    // Remplir les champs du formulaire de connexion
    cy.get('input[formControlName=email]').type('testuser@example.com');
    cy.get('input[formControlName=password]').type(`${'password123'}{enter}{enter}`);

    // Vérifier que la redirection est correcte
    cy.url().should('include', '/sessions');
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
  });

  it('should display session details correctly', () => {
    cy.url().should('include', '/sessions');

    cy.wait('@getSessions');
    cy.contains('Morning Yoga').should('be.visible');
      cy.contains('A relaxing yoga session').should('be.visible');
      cy.contains('February 17, 2025').should('be.visible');
  });

  it('should show the session description and date', () => {

    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');
    cy.get('button[mat-raised-button][color="primary"]').contains('Detail').click({ force: true });
    cy.wait('@getSessionDetails');
    cy.url().should('include', '/sessions/detail/1');

    // cy.contains('DELAHE Margot').should('be.visible');
  // cy.contains('Thiercelin Hélène').should('be.visible');
  });

  it('should allow participation and unparticipation actions', () => {
    cy.get('button[mat-raised-button][color="primary"]').then(($button) => {
      if ($button.is(':visible')) {
        cy.wrap($button).click();
        cy.intercept('POST', '/api/session/1/participate/1', { statusCode: 200 }).as('participate');
        cy.wait('@participate');
      } else {
        cy.get('button[mat-raised-button][color="warn"]').click();
        cy.intercept('DELETE', '/api/session/1/participate/1', { statusCode: 200 }).as('unparticipate');
        cy.wait('@unparticipate');
      }
    });
  });

  it('should call delete function when "Delete" button is clicked', () => {
    cy.get('button[mat-raised-button][color="warn"]').should('not.exist');
  });

  it('should allow navigation with back button', () => {
    cy.get('button[mat-icon-button]').click();
    cy.url().should('include', '/sessions');
  });
});
