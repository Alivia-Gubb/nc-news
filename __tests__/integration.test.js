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
    