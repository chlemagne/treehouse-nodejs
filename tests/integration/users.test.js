const request = require('supertest');
const {User} = require('../../models/user');

let server;

describe('api/users', () => {
    // setup
    beforeEach(function() {
        server = require('../../index');
    });

    // teardown
    afterEach(async function() {
        await server.close();
        await User.remove({});
    });

    describe('POST /', () => {
        // test variables
        let form;

        // define happy path
        const post = async function() {
            return await request(server)
                .post('/api/users')
                .send(form);
        };

        // setup
        beforeEach(function() {
            form = {
                firstName: 'Naruto',
                lastName: 'Uzumaki',
                middleName: '',
                email: 'kyuubi9t@gmail.com',
                password: 'DefendK0n0h@_'
            };
        });

        // verify in mongoDB
        it('should save user if valid', async () => {
            await post();

            const user = await User.find({ email: 'kyuubi9t@gmail.com' });

            expect(user).not.toBeNull();
        });

        // encrypt password in mongoDB
        it('should not store the password as plain text in db', async () => {
            await post();

            const user = await User.findOne({ email: 'kyuubi9t@gmail.com' });

            expect(user.password).not.toBe('DefendK0n0h@_');
        });

        // 200
        it('should return user if valid', async () => {
            const res = await post();

            expect(res.status).toBe(200);
            expect(res.body).not.toHaveProperty('password');
            expect(res.body).toHaveProperty('email', 'kyuubi9t@gmail.com');
        });

        // 400 bad request
        it('should return 400 if user is invalid', async () => {
            // TODO: test all fields
            form = {};

            const res = await post();

            expect(res.status).toBe(400);
        });

        // 400 bad request
        it('should return 400 if email already exists', async () => {
            await post();
            const res = await post();

            expect(res.status).toBe(400);
        });
    });
});