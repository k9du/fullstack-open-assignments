const mongoose = require('mongoose')
const supertest = require('supertest')
const { response } = require('../app')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

let authorToken = null
beforeEach(async () => {
    // Delete users and blogs, create new user and use initial blogs
    await Blog.deleteMany({})
    await User.deleteMany({})

    const kalle = new User({
        username: "kalle",
        name: "kalle",
        password: "salainen",
    })

    // save to /api/users
    const user = await kalle.save()

    // create token for kalle
    const token = {
        username: user.username,
        id: user._id
    }

    // Use jwt to sign token and create time limit (1hr)
    const webtoken = jwt.sign(token, process.env.SECRET, { expiresIn: 60*60})

    const authorizationToken = `Bearer ${webtoken}`

    // Initialize all the blogs to be added by kalle
    for ( const blog of helper.initialBlogs ) {
        blog.user = user._id.toString()
        const newBlog = new Blog(blog)
        await newBlog.save()
    }

    // Now all the initalblogs are at /api/blogs and created by kalle
    authorToken = authorizationToken
})



test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', authorToken)
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs').set('Authorization', authorToken)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id-property has to have the name id instead of _id', async () => {
    const response = await api.get('/api/blogs').set('Authorization', authorToken)
    response.body.forEach(element => {
        expect(element.id).toBeDefined()
    })
})

test('a blog can be added to /api/blogs', async () => {
     const newBlog = {
         title: "Miten saada muija vaikka opiskelee tietotekniikkaa",
         author: "dragon slayer",
         url: "http://www.dragonslayer666.com",
         likes: 10000
     }
 
     await api
         .post('/api/blogs')
         .send(newBlog)
         .set('Authorization', authorToken)
         .expect(201)
         .expect('Content-Type', /application\/json/)
     
     const response = await api.get('/api/blogs').set('Authorization', authorToken)
 
     const authors = response.body.map(a => a.author)
 
     expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
     expect(authors).toContain('dragon slayer')
})

test('if "likes" was not given, it should be zero', async () => {
    const newBlog = {
        title: "Moikka moi",
        author: "ite maikki",
        url: "www.maikki.com"
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', authorToken)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs').set('Authorization', authorToken)
    expect(response.body).toHaveLength(helper.initialBlogs.length+1)
})

test ('if no title AND url were given ', async () => {
    const newBlog = {
        author: "jalle"
    }

    await api
        .post('/api/blogs')
        .set('Authorization', authorToken)
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs').set('Authorization', authorToken)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('if no token was given, 401', async () => {
    const newBlog = {
        title: "testaus2",
        author: "testauss",
        url: "testatus.com",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})


// Close connection
afterAll(() => {
    mongoose.connection.close()
})