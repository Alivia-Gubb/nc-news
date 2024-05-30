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

//remember make error handling tests
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
        

