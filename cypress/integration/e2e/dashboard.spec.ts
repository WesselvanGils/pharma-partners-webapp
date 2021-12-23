describe('Dashboard test', () =>
{
	const localStorageUser = {
		"_id":"61b9dcc2b763b8affa81d034","email":"testy@test.nl","roles":"Huisarts","firstName":"Test","lastName":"McTest","doctorCode":"D1","employeeCode":"M1",
		"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWNkNmY1ODZjNjQwMzQ4NDY2MDJlNSIsImlhdCI6MTYzODc5NDM5NCwiZXhwIjoxNjM4ODgwNzk0fQ.oHSyf_cArcgjS9SP6qHjOZQu9fDMrzg6fQKLU9zHISw",
	 };

	it('Visits the dashboard page', () =>
	{
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
		cy.contains('Welkom Test')
		cy.contains('Test McTest')
		cy.contains('testy@test.nl')
		cy.get('.navbar-nav').should('have.length', 2);
		
	});
});
