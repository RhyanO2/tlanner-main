import axios from 'axios';

const apiKey = process.env.ABACATEPAY_API_KEY;

const api = axios.create({
  baseURL: 'https://api.abacatepay.com/v1/',
  headers: {
    Authorization: `Bearer ${process.env.ABACATEPAY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const abacatePayService = {
  //Cobranças // para pagamentos via pix ou cartao
  createBilling: (data: any) => api.post('billing/create', data),

  //Pix(Apenas QRcode)

  createQRcodePix: (data: any) => api.post('pixQrCode/create', data),
  checkPix: (id: string) =>
    api.get(`/pixQrCode/check?id=${id}`).then((res) => res.data),
};
