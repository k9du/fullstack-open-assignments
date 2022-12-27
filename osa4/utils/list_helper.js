const _ = require('lodash')
const blog = require('../models/blog')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const blogWithMostLikes = blogs.reduce(
        (prev, current) => {
            return prev.likes > current.likes ? prev : current
        }
    )

    const simplifiedBlogInfo = {
        title: blogWithMostLikes.title,
        author: blogWithMostLikes.author,
        likes: blogWithMostLikes.likes
    }

    return simplifiedBlogInfo
}

const mostBlogs = (blogs) => {
    const blogAmounts = _.map(_.countBy(blogs, "author"), (val, key) => ({ author: key, blogs: val}))
    const authorWithMostBlogs = blogAmounts.reduce(
        (prev, current) => {
            return prev.blogs > current.blogs ? prev : current
        }
    )
    return authorWithMostBlogs
}

const mostLikes = (blogs) => {
    let sums = {}
    // let authors = []
    // blogs.map(b => {
    //     authors.push(b.author)
    // })
    // _.each(blogs, function (blog) {
    //     _.each(authors, function (author) {
    //         sums[author] = (sums[author] || 0) + blog[author]
    //     })
    // })

    for ( let i = 0; i < blogs.length; i++ ) {
        const author = blogs[i].author
        const likes = blogs[i].likes
        sums[author] = (sums[author] || 0) + likes
    }

    const max = Object.keys(sums).reduce((a,b) => sums[a] > sums[b] ? a : b)


    const authorWithMostLikes = {
        author: max,
        likes: sums[max]
    }
    
    return authorWithMostLikes
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }