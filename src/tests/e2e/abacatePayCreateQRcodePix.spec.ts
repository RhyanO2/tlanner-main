import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { authenticateCreatedUser } from '../factories/makeUser';
import { server } from '../../app';


describe('abacatePayCreateQRcodePixtests', () => {
  test('Create QRcode Pix', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .post('/pixQrCode/create')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        amount: 100,
        expiresIn: 123,
        description: 'aa',
        customer: {
          name: 'Rhyan',
          cellphone: '(88) 9302-8266',
          email: 'rhyanoliveira@proton.me',
          taxId: '631.172.133-33',
        },
        metadata: {
          externalId: '123',
        },
      });

    expect(response.status).toEqual(200);
  });

  test('Create QRcode Pix Fail', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .post('/billing/create')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        amount: 100,
        expiresIn: 123,
        description: 'aa',
        customer: {
          name: 'Rhyan',
        },
        metadata: {
          externalId: '123',
        },
      });

    expect(response.status).toEqual(400);
  });
});
