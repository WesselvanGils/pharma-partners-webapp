/**
 *
 */
describe('Auth login', () => {
  const localStorageUser = {
     "_id":"61b9dcc2b763b8affa81d034","email":"testy@test.nl","roles":"Huisarts","firstName":"Test","lastName":"McTest","doctorCode":"D1","employeeCode":"M1",
     "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWNkNmY1ODZjNjQwMzQ4NDY2MDJlNSIsImlhdCI6MTYzODc5NDM5NCwiZXhwIjoxNjM4ODgwNzk0fQ.oHSyf_cArcgjS9SP6qHjOZQu9fDMrzg6fQKLU9zHISw",
  };

  it('visits the /signin page', () => {
    cy.visit('/login')
    cy.contains('Inloggen')
    cy.get('h2').should('have.text', 'Inloggen')
    cy.get('button#submitbutton').should('have.text', ' Log In ')
  })

  it('should show error message when email is invalid', () => {
    cy.visit('/login')
    cy.get('input#inputEmail').type('some invalid email')
    cy.get('input#inputPassword').click()
    cy.get('#email-invalid').should('have.text', 'Geef een correct emailadres.')
  })


  it('should return a token when login is valid', () => {
    cy.visit('/login')
    cy.get('input#inputEmail').type('testy@test.nl')
    cy.get('input#inputPassword').type('password')
    cy.get('button#submitbutton')
      .click()
      .should(() => {
        //
        expect(localStorage.getItem('currentuser')).to.eq(JSON.stringify(localStorageUser))
      })
    cy.location('pathname').should('eq', '/home')
  })
})
