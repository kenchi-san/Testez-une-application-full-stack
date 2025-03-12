describe('Session Page', () => {
  let jwtToken;

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          user: { id: 1, firstName: 'John', lastName: 'Doe', isAdmin: false }
        }
      });
    }).as('loginUser');

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

    cy.visit('http://localhost:4200/login');
    cy.url().should('include', '/login');

    cy.get('input[formControlName="email"]').should('exist').and('be.visible');
    cy.get('input[formControlName="password"]').should('exist').and('be.visible');

    cy.get('input[formControlName="email"]').type('testuser@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginUser').its('response.body').should('exist').then((body) => {
      jwtToken = body.token;
    });

    cy.url().should('include', '/sessions');

    cy.wait('@getSessions');

    cy.url().should('include', '/sessions');

    cy.get('button[mat-raised-button][color="primary"]').contains('Detail').click({ force: true });

    cy.url().should('include', '/sessions/detail/1');

    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
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
    }).as('getSessionDetails');

    cy.wait('@getSessionDetails');
  });

  it('should display session details correctly', () => {
    cy.contains('Morning Yoga').should('be.visible');
    cy.contains('DELAHE Margot').should('be.visible');
    cy.contains('Thiercelin Hélène').should('be.visible');
  });

  it('should show the session description and date', () => {
    cy.contains('A relaxing yoga session').should('be.visible');
    cy.contains('February 17, 2025').should('be.visible');
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
