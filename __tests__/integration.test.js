const app = require('../app')
const request = require('supertest')
const connection = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const fs = require('fs')
const path = require('path')
const endPointJson = require('../endpoints.json')

afterAll(() => connection.end());
beforeEach(() => seed(testData));


describe("GET /api/topics", () => {
    test("Status: 200, respond with all topics", () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
        }) 
        
    })
})

describe("GET /api", () => {
    test("Return an accurate JSON object containing documentation detailing each endpoint", () => {
    return request(app)
        .get('/api')
        .then(({ body }) => {
            expect(body).toEqual(endPointJson)  
        })
    })
})


describe("GET /api/articles/:article_id", () => {
    test('should return an article object and get an article by its id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
            expect(res.body.article).toMatchObject({
                author : expect.any(String),
                title : expect.any(String),
                article_id : expect.any(Number),
                body : expect.any(String),
                topic : expect.any(String),
                created_at : expect.any(String),
                votes : expect.any(Number),
                article_img_url : expect.any(String),
            })
        })
    });

    test('status: 404, responds with an error message when article doesn\'t exist', () => {
        return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article ID does not exist: 99999')
            });
    });

    test('status: 400, responds with an error message when the ID is invalid', () => {
        return request(app)
            .get('/api/articles/one')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            });
    });
            
});

describe("GET /api/articles", () => {
    test("Status: 200, respond with all articles", () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author : expect.any(String),
                    title : expect.any(String),
                    article_id : expect.any(Number),
                    topic : expect.any(String),
                    created_at : expect.any(String),
                    votes : expect.any(Number),
                    article_img_url : expect.any(String),
                    comment_count: expect.any(String)
                })
            })
        }) 
    })

    test("Articles are in descending date order", () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13);
            expect(body.articles).toBeSortedBy("created_at", {
                descending: true
            })
        }) 
    })

    test("Articles do not contain article body", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach((article) => {
                    expect(article).not.toHaveProperty('body')
                })
            })
    })
})

describe("GET /api/articles/:article_id/comments", () => {
    test('should return all comments on article with given article id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(11)
            expect(body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id : expect.any(Number),
                    votes : expect.any(Number),
                    created_at : expect.any(String),
                    author : expect.any(String),
                    body : expect.any(String),
                    article_id : expect.any(Number),
                })
            }))
        })
    });

    test("Comments are in descending date order", () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(11);
            expect(body.comments).toBeSortedBy("created_at", {
                descending: true
            })
        }) 
    })

    test('status: 404, responds with an error message when article doesn\'t exist', () => {
        return request(app)
            .get('/api/articles/99999/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No comments found for article with ID: 99999')
            });
    });

    test('status: 400, responds with an error message when the ID is invalid', () => {
        return request(app)
            .get('/api/articles/one/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            });
    });
            
});
