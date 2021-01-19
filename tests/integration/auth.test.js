const request = require('supertest');
const { User } = require('../../models/user');

let server;

describe('/api/auth', () => {
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
        let email;
        let password;

        // define happy path
        const login = async function() {
            return await request(server)
                .post('/api/auth')
                .send({ email, password });
        };

        // setup
        beforeEach(async function() {
            email = 'mangekyou@outlook.com';
            password = '_eternalT$ukuyum1';

            // register test user
            const user = new User({
                firstName: 'Sasuke',
                lastName: 'Uchiha',
                middleName: 'Tsu',
                email: email,
                password: password
            });
            await user.save();
        });

        // 200
        it('should return a json web token if user credentials is valid', async () => {
            const res = await login();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('x-auth-token');
        });

        // 400 not found
        it('should return 400 due to client error', async () => {
            email = 'a';
            password = 'b';

            const res = await login();

            expect(res.status).toBe(400);
        });

        // 401 not found
        it('should return 401 if user email does not exist', async () => {
            email = 'unknown@testmail.com';

            const res = await login();

            expect(res.status).toBe(401);
        });

        // 401 not found
        it('should return 401 if user password is invalid', async () => {
            password = '1234';

            const res = await login();

            expect(res.status).toBe(401);
        });        
    });
});
