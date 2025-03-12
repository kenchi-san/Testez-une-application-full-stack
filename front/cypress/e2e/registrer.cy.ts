describe('Register Form Tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/register');
  });

  it('should display the register page correctly', () => {
    cy.get('mat-card').should('be.visible');
    cy.get('mat-card-title').contains('Register').should('be.visible');
  });

  it('should have all required fields', () => {
    cy.get('input[formControlName="firstName"]').should('exist');
    cy.get('input[formControlName="lastName"]').should('exist');
    cy.get('input[formControlName="email"]').should('exist');
    cy.get('input[formControlName="password"]').should('exist');
  });

  it('should disable submit button when form is invalid', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should enable submit button when form is valid', () => {
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').should('be.enabled');
  });

  it('should submit the form successfully and redirect to login page', () => {
    cy.intercept('POST', '**/api/auth/register', { statusCode: 201, body: {} }).as('registerRequest');

    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').should('be.enabled').click();

    cy.wait('@registerRequest');
    cy.url().should('include', '/login');
  });

  it('should show error message if registration fails', () => {
    cy.intercept('POST', '**/api/auth/register', { statusCode: 400, body: { error: 'An error occurred' } }).as('registerRequest');

    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').should('be.enabled').click();

    cy.wait('@registerRequest');
    cy.get('.error').should('contain', 'An error occurred');
  });

});
