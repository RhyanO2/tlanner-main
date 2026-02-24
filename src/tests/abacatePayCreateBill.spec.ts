import { describe, expect, test } from 'vitest';
import request from 'supertest';

import { authenticateCreatedUser } from './factories/makeUser';
import { server } from '../app';

describe('abacatePayCreateBill tests', () => {
  test('Create bill', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    // console.log(user);

    const response = await request(server.server)
      .post('/billing/create')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        products: [
          {
            externalId: 'prod_YnzdddAwD5hdtMdyUGyezbt6',
            name: 'Tlanner Premium Plan',
            quantity: 1,
            price: 700,
          },
        ],
        returnUrl: 'https://tlanner.com.br/',
        completionUrl: 'https://tlanner.com.br/dashboard',
        customerId: 'cust_FJDYScmeZHWhxRh4tF51nuMT',
        customer: {
          name: 'Rhyan',
          cellphone: '(88)9302-8266',
          email: 'rhyanoliveira@proton.me',
          taxId: '631.172.133-33',
        },
        allowCoupons: false,
        coupons: ['ABKT10', 'ABKT5', 'PROMO10'],
        externalId: '',
        metadata: {
          externalId: '',
        },
      });

    expect(response.status).toEqual(200);
  });

  test('Create bill Fail', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .post('/billing/create')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        returnUrl: 'https://tlanner.com.br/',
        completionUrl: 'https://tlanner.com.br/dashboard',
        customerId: 'cust_FJDYScmeZHWhxRh4tF51nuMT',
        customer: {
          name: 'Rhyan',
          cellphone: '(88)9302-8266',
          email: 'rhyanoliveira@proton.me',
          taxId: '631.172.133-33',
        },
        allowCoupons: false,
        coupons: ['ABKT10', 'ABKT5', 'PROMO10'],
        externalId: '',
        metadata: {
          externalId: '',
        },
      });

    expect(response.status).toEqual(400);
  });
});
