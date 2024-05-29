const app = require('../app')
const request = require('supertest')
const connection = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
//add before each when adding POST PATCH DELETE
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
      //invalid url  
    })
})