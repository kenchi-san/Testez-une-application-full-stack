describe('User Account Page', () => {
  beforeEach(() => {
    // Intercepter la requête GET pour récupérer les sessions (si nécessaire pour la page /sessions)
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

    // Simuler la connexion
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('loginRequestAdmin');

    // Remplir le formulaire de connexion
    cy.get('input[formControlName=email]').type('john.doe@example.com');
    cy.get('input[formControlName=password]').type('password123{enter}{enter}');

    cy.url().should('include', '/sessions');
  });

  it('should display the user account details on the /me page', () => {
    // Simuler l'interception de la requête GET pour récupérer les informations de l'utilisateur connecté
    cy.intercept('GET', '/api/user/1', {
      statusCode: 200,
      body: {
        id: 1,
        email: 'john.doe@example.com',
        lastName: 'Doe',
        firstName: 'John',
        admin: true,
        createdAt: '2025-03-17T22:27:23',
        updatedAt: '2025-03-18T00:46:14'
      }
    }).as('getUserInfo');


    // Cliquer sur le bouton "Account" pour accéder à la page du compte utilisateur
    cy.get('span[routerlink="me"].link').should('be.visible').click();

    // Vérifier que nous sommes bien sur la page /me
    cy.url().should('include', '/me');

    // Attendre la réponse de l'interception pour s'assurer que les données de l'utilisateur sont récupérées
    cy.wait('@getUserInfo');

    // Vérifier que toutes les informations sont affichées sur la page
    cy.contains('Email: john.doe@example.com').should('be.visible');
    cy.contains('Name: John DOE').should('be.visible');
    cy.contains('You are admin').should('be.visible');
  });
});
