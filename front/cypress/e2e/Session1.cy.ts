describe('Session Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.intercept('GET', '/api/session', {
      statusCode: 200,
      body: [
        {
          id: 2,
          name: 'Morning Yoga',
          owner: 'testuser@example.com', // Simule que l'utilisateur est le propriétaire
          attendees: 0,
          date: '2025-02-17T00:00:00.000+00:00', // Date au format ISO
          teacher_id: 2, // ID du professeur
          teacher_name: 'brice cha', // Nom du professeur
          description: 'A relaxing yoga session' // Description de la session
        }
      ]
    }).as('getSessions');

    cy.intercept('GET', '/api/session/2', {
      statusCode: 200,
      body: {
        id: 2,
        name: 'Morning Yoga',
        date: '2025-02-17T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'A relaxing yoga session',
        users: [],
        createdAt: '2024-02-17T16:28:51',
        updatedAt: '2025-02-19T16:27:06'
      }
    }).as('getSessionDetail'); // Alias pour la requête de détails
  });

  it('should log in, navigate to session list and open session details', () => {
    // Connexion
    cy.get('input[formControlName="email"]').type('testuser@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').should('be.enabled').click();

    // Vérifier la redirection vers /sessions
    cy.url().should('include', '/sessions');

    // Attendre que les sessions soient chargées
    cy.wait('@getSessions');

    // Vérifier que la session "Morning Yoga" est visible dans la liste
    cy.get('mat-card .mat-card-title').should('contain', 'Morning Yoga');

    // Vérifier que le bouton "Détail" est bien visible avant de cliquer
    cy.get('button[ng-reflect-router-link="detail,2"]').should('be.visible');


    // Cliquer sur le bouton pour ouvrir les détails de la session
    cy.get('button[ng-reflect-router-link="detail,2"]').click();

    // Attendre la récupération des détails de la session avant de cliquer
    cy.intercept('/api/session/2').as('getSessionDetail');

    // Attendre la récupération des détails de la session
    cy.wait('@getSessionDetail', { timeout: 10000 })
    // .its('response.statusCode')
    // .should('eq', 200);

    // Vérifier que l'URL est correcte
    cy.url().should('include', '/sessions/detail/2');

    // Vérifier que les détails de la session sont affichés
    cy.get('mat-card-content').should('be.visible'); // S'assurer que le contenu de la carte est visible
    cy.contains('Morning Yoga').should('be.visible');
    cy.contains('A relaxing yoga session').should('be.visible');
    cy.contains('brice cha').should('be.visible');
    cy.contains('0 attendees').should('be.visible');

    // Retour à la liste des sessions (commenté)
    cy.get('button[mat-icon-button]').click();
    cy.url().should('include', '/sessions'); // Vérifier que l'URL revient à /sessions
  });





  // it('should log in, navigate to session list and open session details when we are not the owner and click on Edit', () => {
  //   // Simuler que l'utilisateur n'est pas le propriétaire
  //   cy.intercept('GET', '**/api/session', {
  //     statusCode: 200,
  //     body: [
  //       {
  //         id: 2,
  //         name: 'Morning Yoga',
  //         owner: 'anotherUser', // Simule que l'utilisateur n'est pas le propriétaire
  //         attendees: 0,
  //         date: '2025-02-17',
  //         teacher_id: 1,
  //         teacher_name: 'brice cha',
  //         description: 'A relaxing yoga session'
  //       }
  //     ]
  //   }).as('getSessionsAsNonOwner');
  //
  //   // Remplir les champs du formulaire de connexion
  //   cy.get('input[formControlName="email"]').type('testuser@example.com');
  //   cy.get('input[formControlName="password"]').type('password123');
  //
  //   // Vérifier et cliquer sur le bouton "Login"
  //   cy.get('button[type="submit"]').should('be.enabled').click();
  //
  //   // Vérifier la redirection vers la page des sessions
  //   cy.url().should('include', '/sessions');
  //
  //   // Attendre que les sessions soient récupérées
  //   cy.wait('@getSessionsAsNonOwner');
  //
  //   // Vérifier que la session "Morning Yoga" est bien dans le DOM
  //   cy.get('mat-card .mat-card-title').should('contain', 'Morning Yoga');
  //
  //   // Vérifier que le bouton Edit est visible et cliquer dessus
  //   cy.get('button[ng-reflect-router-link="update,2"]').should('be.visible').click();
  //
  //   // Vérifier la redirection vers la page de mise à jour (Update)
  //   cy.url().should('include', '/sessions/update/2');
  //
  //   cy.contains('Update session').should('be.visible');
  //
  //   // Vérifier que les inputs du formulaire sont présents
  //   cy.get('input[formControlName="name"]').should('be.visible'); // Input "Name"
  //   cy.get('input[formControlName="date"]').should('be.visible'); // Input "Date"
  //   cy.get('mat-select[formControlName="teacher_id"]').should('be.visible'); // Sélecteur "Teacher"
  //   cy.get('textarea[formControlName="description"]').should('be.visible'); // Textarea "Description"
  //
  //   // Vérifier que les valeurs par défaut sont présentes dans les champs
  //   cy.get('input[formControlName="name"]').should('have.value', 'Morning Yoga');  // Exemple de valeur
  //   cy.get('input[formControlName="date"]').should('have.value', '2025-02-17'); // Exemple de date
  //   cy.get('mat-select[formControlName="teacher_id"]').should('be.visible').click(); // Ouvrir la liste déroulante
  //
  //   // Vérifier que l'option du professeur "brice cha" est présente et la sélectionner
  //   cy.get('mat-option').contains('brice cha').should('be.visible').click();
  //
  //   // Vérifier que la valeur sélectionnée est bien "brice cha"
  //   cy.get('mat-select[formControlName="teacher_id"] .mat-select-value-text')
  //     .should('contain', 'brice cha');
  //
  //   cy.get('textarea[formControlName="description"]').should('have.value', 'A relaxing yoga session'); // Exemple de description
  //
  //   // Vérifier que le bouton "Save" est visible et n'est pas désactivé
  //   cy.get('button[type="submit"]').should('be.visible').and('not.be.disabled');
  //
  //   // Cliquer sur le bouton "Save"
  //   cy.get('button[type="submit"]').click();
  //
  //   // Vérifier que le formulaire a été soumis avec succès
  //   cy.contains('Session updated !').should('be.visible');
  // });
});
