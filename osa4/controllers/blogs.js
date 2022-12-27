const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username : 1, name : 1 })
    response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    console.log('posting')
    const body = request.body
    console.log('request', request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log('decoded', decodedToken)


    if ( !request.token || !decodedToken.id ) {
        return response.status(401).json({ error: 'token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id,
    })
    
    
    
    if ( !blog.title || !blog.url ) {
        response.status(400).end()
    } else {
        const savedBlog = await blog.save()
        await savedBlog.populate('user')
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const {id} = request.params
    console.log(request.params)
    const user = request.user
    console.log(request.user)

    // Get who added the blog
    const blog = await Blog.findById(id)
    console.log(user.id, blog, id)
    if ( !blog || !user ) {
        return response.status(404).json({ error: 'blog couldn\'t be found'})
    }

    if ( blog.user.toString() === user._id.toString() ) {
        await Blog.findByIdAndRemove({ _id: id })
        response.status(204).end()
    } else {
        response.status(401).json({ error: 'unauthorized'})
    }

    user.blogs = user.blogs.filter((b) => b.toString() !== id)
    await user.save()
    response.status(204).end()
})

module.exports = blogsRouter