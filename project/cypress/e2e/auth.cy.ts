describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/auth');
  });

  it('should show sign in form by default', () => {
    cy.get('h2').should('contain', 'Sign In');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('should switch to sign up form', () => {
    cy.contains('Need an account? Sign Up').click();
    cy.get('h2').should('contain', 'Create an Account');
  });

  it('should show validation errors for invalid email', () => {
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('.text-red-500').should('exist');
  });

  it('should show validation errors for short password', () => {
    cy.contains('Need an account? Sign Up').click();
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('123');
    cy.get('button[type="submit"]').click();
    cy.get('.text-red-500').should('contain', 'Password must be at least 6 characters');
  });
});