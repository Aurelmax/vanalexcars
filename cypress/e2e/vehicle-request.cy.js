describe('Vehicle Request Form E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/demande');
  });

  it('should display vehicle request form', () => {
    cy.get('form').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="phone"]').should('be.visible');
    cy.get('select[name="vehicle_make"]').should('be.visible');
    cy.get('input[name="vehicle_model"]').should('be.visible');
    cy.get('select[name="vehicle_year"]').should('be.visible');
    cy.get('input[name="budget"]').should('be.visible');
    cy.get('textarea[name="message"]').should('be.visible');
  });

  it('should submit vehicle request successfully', () => {
    // Mock the API response
    cy.intercept('POST', '/api/forms/vehicle-request', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: 1,
          message: 'Demande de véhicule envoyée avec succès',
        },
      },
    }).as('submitVehicleRequest');

    cy.get('input[name="name"]').type('Jane Smith');
    cy.get('input[name="email"]').type('jane@example.com');
    cy.get('input[name="phone"]').type('+33987654321');
    cy.get('select[name="vehicle_make"]').select('Porsche');
    cy.get('input[name="vehicle_model"]').type('911');
    cy.get('select[name="vehicle_year"]').select('2023');
    cy.get('input[name="budget"]').type('80000');
    cy.get('textarea[name="message"]').type('Looking for a sports car');

    cy.get('button[type="submit"]').click();

    cy.wait('@submitVehicleRequest').then(interception => {
      expect(interception.request.body).to.deep.include({
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+33987654321',
        vehicle_make: 'Porsche',
        vehicle_model: '911',
        vehicle_year: '2023',
        budget: '80000',
        message: 'Looking for a sports car',
      });
    });

    // Check for success message or form reset
    cy.get('input[name="name"]').should('have.value', '');
  });

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[name="name"]:invalid').should('exist');
    cy.get('input[name="email"]:invalid').should('exist');
    cy.get('select[name="vehicle_make"]:invalid').should('exist');
    cy.get('input[name="vehicle_model"]:invalid').should('exist');
  });

  it('should handle form submission error', () => {
    // Mock API error
    cy.intercept('POST', '/api/forms/vehicle-request', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
      },
    }).as('submitVehicleRequestError');

    cy.get('input[name="name"]').type('Jane Smith');
    cy.get('input[name="email"]').type('jane@example.com');
    cy.get('select[name="vehicle_make"]').select('Porsche');
    cy.get('input[name="vehicle_model"]').type('911');
    cy.get('textarea[name="message"]').type('Test message');

    cy.get('button[type="submit"]').click();

    cy.wait('@submitVehicleRequestError');

    // Check for error message
    cy.contains('erreur', { matchCase: false }).should('be.visible');
  });
});
