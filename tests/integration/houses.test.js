const request = require('supertest');
const {User} = require('../../models/user');
const {House} = require('../../models/house');
const mongoose = require('mongoose');

let server;

describe('/api/houses', () => {
    // setup
    beforeEach(function() {
        server = require('../../index');
    });

    // teardown
    afterEach(async function() {
        await server.close();
        await House.remove({});
    });

    describe('GET /', () => {
        it('should return all houses', async () => {
            const houses = [
                { name: 'Unit A1' },
                { name: 'Unit B5' }
            ];

            await House.collection.insertMany(houses);

            const res = await request(server).get('/api/houses');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(h => h.name === 'Unit A1')).toBeTruthy();
            expect(res.body.some(h => h.name === 'Unit B5')).toBeTruthy();
        });
    });

    describe('GET /id', () => {
        // 200 OK
        it('should return a house if valid id is passed', async () => {
            const house = new House({ name: 'Unit K5' });
            house.save();

            const res = await request(server).get('/api/houses/' + house._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', house.name);
        });

        // 404 Not Found
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/houses/1');

            expect(res.status).toBe(404);
        });

        // 404 Not Found
        it('should return 404 if no house with given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/houses/' + id);
      
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        // test variables
        let name;
        let token;

        // define happy path
        const post = async function() {
            return await request(server)
                .post('/api/houses')
                .set('x-auth-token', token)
                .send({ name });
        }

        // setup
        beforeEach(function() {
            name = 'Unit G9';
            token = User().genAuthToken();
        });

        // verify in mongoDB
        it('should save the house if valid', async () => {
            await post();

            const house = await House.find({ name: 'Unit G9' });

            expect(house).not.toBeNull();
        });

        // 200
        it('should save the house and return if valid', async() => {
            const res = await post();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'Unit G9');
        });

        // 400 bad request
        it('should return 400 if name is not valid', async () => {
            name = 'AAAAAAAAAA, BBBBBBBBBB, CCCCCCCCCC, DDDDDDDDDD, EEEEEEEEEE';

            const res = await post();

            expect(res.status).toBe(400);
        });

        // 401 unauthorized
        it('should return 401 if NO token is provided', async () => {
            token = '';

            const res = await post();

            expect(res.status).toBe(401);
        });

        // 401 unauthorized
        it('should return 401 if given token is invalid', async () => {
            token = '1';

            const res = await post();

            expect(res.status).toBe(401);
        });
    });

    describe('PUT /id', () => {
        // define test variables
        let id;
        let newName;
        let token;

        // define happy path
        const put = async function() {
            return await request(server)
                .put('/api/houses/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
        }

        // setup
        beforeEach(async function() {
            const house = new House({ name: 'Unit J1' });
            await house.save();

            id = house._id;
            newName = 'Unit K7';
            token = User().genAuthToken();
        });

        // verify in mongoDB
        it('should update house name if valid', async () => {
            await put();

            const updatedHouse = await House.findById(id);

            expect(updatedHouse.name).toBe('Unit K7');
        });

        // 200
        it('should return if update house and return if valid', async () => {
            const res = await put();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'Unit K7');
        });

        // 400
        it('should return 400 if name is invalid', async () => {
            newName = 'AAAAAAAAAA, BBBBBBBBBB, CCCCCCCCCC, DDDDDDDDDD, EEEEEEEEEE';

            const res = await put();

            expect(res.status).toBe(400);
        });

        // 404
        it('should return 404 if id is invalid', async () => {
            id = 1;
            const res = await put();

            expect(res.status).toBe(404);
        });

        // 404
        it('should return 404 if given id is not found', async () => {
            id = mongoose.Types.ObjectId();
            const res = await put();

            expect(res.status).toBe(404);
        });

        // 401 unauthorized
        it('should return 401 if NO token is provided', async () => {
            token = '';

            const res = await put();

            expect(res.status).toBe(401);
        });

        // 401 unauthorized
        it('should return 401 if given token is invalid', async () => {
            token = '1';

            const res = await put();

            expect(res.status).toBe(401);
        });
    });

    describe('DELETE /id', () => {
        // define test variables
        let id;
        let house;

        // define happy path
        const _delete = async function() {
            return await request(server)
                .delete('/api/houses/' + id)
                .send();
        }

        // setup
        beforeEach(async function() {
            house = new House({ name: 'Unit D3' });
            await house.save();

            id = house._id;
        });

        // verify in mongoDB
        it('should return 202 and removed house', async () => {
            await _delete();

            const house = await House.findById(id);

            expect(house).toBeNull();
        });

        // 200
        it('should return the deleted house id valid', async () => {
            const res = await _delete();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'Unit D3');
        });

        // 404
        it('should return 404 if id is invalid', async () => {
            id = 1;

            const res = await _delete();

            expect(res.status).toBe(404);
        });

        // 404
        it('should return 404 id given id is not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await _delete();

            expect(res.status).toBe(404);
        });
    });
});