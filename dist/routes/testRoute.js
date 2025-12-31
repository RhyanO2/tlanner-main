export const TESTROUTE = async (server) => {
    server.get('/', {
        schema: {
            summary: 'Check the connection with server'
        }
    }, async (req, res) => {
        res.status(418).send({ WORKING: 'This is fine!👍' });
    });
};
