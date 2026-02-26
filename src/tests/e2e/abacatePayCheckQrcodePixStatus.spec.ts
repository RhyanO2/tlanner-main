import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { authenticateCreatedUser } from '../factories/makeUser';
import { server } from '../../app';

describe('abacatePayCreateQRcodePixtests', () => {
  test('Check status QRcode Pix', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .get(`/pixQrCode/check?id=${'pix_char_0s10FAfCFqWdwaGQM46FTJ5U'}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(200);
  });

  test('Check status QRcode Pix fail', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .get(`/pixQrCode/check?id=${''}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(400);
  });
});
