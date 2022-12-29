describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi teppo',
      username: 'teppi',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3003')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to see blogs')
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      // ...
      cy.get('#username').type('teppi')
      cy.get('#password').type('salainen')
      cy.contains('login').click()

      cy.contains('Testi teppo logged in')
    })

    it('fails with wrong credentials', function() {
      // ...
      cy.get('#username').type('eiainakaanoikein')
      cy.get('#password').type('vaarin')
      cy.contains('login').click()
      cy.contains('Wrong username or password')
    })
  })

  describe('When logged in ', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'teppi', password: 'salainen'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3003')
      })
    })

    it('a new blog can be added', function() {
      cy.contains('New blog').click()
      cy.get('#title-input').type('titteli')
      cy.get('#author-input').type('auttori')
      cy.get('#url-input').type('urli')

      cy.contains('Create').click()
      cy.contains('A new blog titteli by auttori added')
    })

    it('a blog can be liked', function() {
      cy.contains('New blog').click()
      cy.get('#title-input').type('titteli')
      cy.get('#author-input').type('auttori')
      cy.get('#url-input').type('urli')

      cy.contains('Create').click()

      // Find view button and click it
      cy.contains('titteli auttori').contains('view').click()

      cy.contains('like the blog').click()
      cy.contains('likes 1')
    })

    it('the person who added the blog can also delete it', function() {

      cy.contains('New blog').click()
      cy.get('#title-input').type('titteli')
      cy.get('#author-input').type('auttori')
      cy.get('#url-input').type('urli')

      cy.contains('Create').click()

      cy.visit('http://localhost:3003')

      cy.contains('titteli auttori').contains('view').click()

      cy.contains('Remove blog').click()

    })

    it('likes are ordered from most liked to least liked', function() {
      cy.contains('New blog').click()

      cy.get('#title-input').type('Third most likes')
      cy.get('#author-input').type('Third')
      cy.get('#url-input').type('Third')

      cy.contains('Create').click()

      cy.contains('Third most likes Third').contains('view').click()

      cy.contains('like the blog').click()

      cy.contains('likes 1')

      cy.contains('hide').click()

      cy.get('#title-input').type('Second most likes')
      cy.get('#author-input').type('Second')
      cy.get('#url-input').type('Second')

      cy.contains('Create').click()

      cy.contains('Second most likes Second').contains('view').click()

      cy.contains('like the blog').click()
      cy.contains('likes 1')

      cy.contains('like the blog').click()
      cy.contains('likes 2')

      cy.contains('hide').click()

      cy.get('#title-input').type('Most likes')
      cy.get('#author-input').type('Most')
      cy.get('#url-input').type('Most')

      cy.contains('Create').click()

      cy.contains('Most likes Most').contains('view').click()
      cy.contains('like the blog').click()
      cy.contains('Most likes Most').contains('likes 1')

      cy.contains('like the blog').click()
      cy.contains('Most likes Most').contains('likes 2')

      cy.contains('like the blog').click()
      cy.contains('Most likes Most').contains('likes 3')

      cy.contains('hide').click()


      cy.get('.blog').eq(0).should('contain', 'Most likes Most')
      cy.get('.blog').eq(1).should('contain', 'Second most likes Second')
    })
  })
})
