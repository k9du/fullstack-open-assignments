const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')



describe('Password and username checks', () => {
    beforeEach(async () =>  {
        await User.deleteMany({})
        await Blog.deleteMany({})
    })


    test('deleting only works if logged in as user who added it', async () => {
        const newUser = {
            username: "late",
            name: "l",
            password: "toimii"
        }

        const newBlog = {
            title: "jaajoo",
            author: "seppo",
            url: "www.com",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
        
        
    })


    test('password length > 3', async () => {
        const newUser = {
            username: "Lauri",
            name: "late",
            passowrd: "salainen",
        }

        await api
          .get('/api/users')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })

    test('password length < 3', async () => {
        const newUser = {
            username: "pate",
            name: "patrikki",
            password: "12",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('username length > 3', async () => {
        const newUser = {
            username: "liisa",
            name: "lissu",
            password: "salasala",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })

    test('username length < 3', async () => {
        const newUser = {
            username: "pa",
            name: "patu",
            password: "sdkaos",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
    

    test('password missing', async () => {
        const newUser = {
            username: "sampo",
            name: "samppa",
            password: "",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('username missing', async () => {
        const newUser = {
            username: "",
            name: "henna",
            password: "moikkamoi",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })


    test('username not unique', async () => {
        const newUser = {
            username: "kolli",
            name: "bogel",
            password: "aölkfjölkj",
        }


        const copyUser = {
            username: "kolli",
            name: "bogela",
            password: "aölkfjölkj",
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        await api
            .post('/api/users')
            .send(copyUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})
