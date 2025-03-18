describe('Login Form Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should display the login page correctly', () => {
    cy.get('mat-card').should('be.visible');
    cy.get('mat-card-title').contains('Login').should('be.visible');
  });

  it('should have email and password fields', () => {
    cy.get('input[formControlName="email"]').should('exist');

    cy.get('input[formControlName="password"]').should('exist');
  });

  it('should disable submit button when form is invalid', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should enable submit button when form is valid', () => {
    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').should('be.enabled');
  });

  it('should submit the form with valid data', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest'); // Attend l'interception de la requête
    cy.url().should('include', '/session'); // Vérifie que l'URL a bien été redirigée
  });

  it('should toggle password visibility when icon is clicked', () => {
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');

    cy.get('button[aria-label="Hide password"]').click();
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'text');

    cy.get('button[aria-label="Hide password"]').click();
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');
  });

  it('should log out successfully', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/session');

    cy.wait(1000);

    cy.get('.link').contains('Logout').should('be.visible').click();

    cy.wait(1000);

    cy.location('pathname').should('match', /\/(login)?$/);
  });
});
