describe('RECRUIT X End-to-End Interview Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads landing page successfully with hero and category cards', () => {
    cy.contains('RECRUIT X').should('be.visible');
    cy.contains('Ace Your Next Tech Interview').should('be.visible');
    cy.contains('Java & OOP').should('be.visible');
  });

  it('allows candidate sign-in and redirect to dashboard', () => {
    cy.visit('/signin');
    cy.contains('Sign In to RECRUIT X').should('be.visible');
    cy.get('input[type="email"]').type('candidate.demo@recruitx.ai');
    cy.get('input[type="password"]').type('demopass123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Choose Interview Category').should('be.visible');
  });

  it('navigates through interview setup and launches live room', () => {
    cy.visit('/interview/setup');
    cy.contains('Configure Your Mock Interview').should('be.visible');
    cy.contains('Start AI Interview').click();
    cy.url().should('include', '/interview/int_');
    cy.contains('Alex — Senior AI Interviewer').should('be.visible');
    cy.contains('Live Interview Transcript').should('be.visible');
  });

  it('opens API documentation and test execution suite', () => {
    cy.visit('/api-docs');
    cy.contains('REST API & System Test Suite').should('be.visible');
    cy.contains('/api/interview/start').should('be.visible');
  });
});
