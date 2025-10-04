describe('Contact Form E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });

  it('should display contact form', () => {
    cy.get('form').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="phone"]').should('be.visible');
    cy.get('select[name="subject"]').should('be.visible');
    cy.get('textarea[name="message"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click();

    cy.get('input[name="name"]:invalid').should('exist');
    cy.get('input[name="email"]:invalid').should('exist');
    cy.get('textarea[name="message"]:invalid').should('exist');
  });

  it('should submit contact form successfully', () => {
    // Mock the API response
    cy.intercept('POST', '/api/forms/contact', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: 1,
          message: 'Message envoyé avec succès',
        },
      },
    }).as('submitContact');

    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="phone"]').type('+33123456789');
    cy.get('select[name="subject"]').select('general');
    cy.get('textarea[name="message"]').type('Test message from Cypress');

    cy.get('button[type="submit"]').click();

    cy.wait('@submitContact').then(interception => {
      expect(interception.request.body).to.deep.include({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+33123456789',
        subject: 'general',
        message: 'Test message from Cypress',
      });
    });

    // Check for success message or form reset
    cy.get('input[name="name"]').should('have.value', '');
  });

  it('should handle form submission error', () => {
    // Mock API error
    cy.intercept('POST', '/api/forms/contact', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error',
      },
    }).as('submitContactError');

    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('textarea[name="message"]').type('Test message');

    cy.get('button[type="submit"]').click();

    cy.wait('@submitContactError');

    // Check for error message
    cy.contains('erreur', { matchCase: false }).should('be.visible');
  });

  it('should show loading state during submission', () => {
    // Mock delayed API response
    cy.intercept('POST', '/api/forms/contact', req => {
      req.reply(res => {
        res.delay(2000);
        res.send({
          statusCode: 200,
          body: {
            success: true,
            data: { id: 1, message: 'Success' },
          },
        });
      });
    }).as('submitContactDelayed');

    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('textarea[name="message"]').type('Test message');

    cy.get('button[type="submit"]').click();

    // Check loading state
    cy.get('button[type="submit"]').should('be.disabled');
    cy.contains('envoi en cours', { matchCase: false }).should('be.visible');

    cy.wait('@submitContactDelayed');
  });
});
