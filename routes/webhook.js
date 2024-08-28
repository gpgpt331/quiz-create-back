
const express = require('express');
const User = require('../models/User');
const dayjs = require('dayjs');

require('dotenv').config();
const router = express.Router();



const defaultPayloadCashTime = {
    id: 686401,
    type: "transaction",
    objectId: "282",
    url: "https://test.com",
    data: {
      id: 282,
      amount: 10000,
      refundedAmount: 0,
      companyId: 2,
      installments: 12,
      paymentMethod: "credit_card",
      status: "paid",
      postbackUrl: null,
      metadata: null,
      traceable: false,
      secureId: "a4594817-be48-4a23-81aa-4bb01f95fe78",
      secureUrl:
        "https://link.compra.com.br/pagar/a4594817-be48-4a23-81aa-4bb01f95fe78",
      createdAt: "2022-07-18T09:54:22.000Z",
      updatedAt: "2022-07-18T09:54:22.000Z",
      paidAt: "2022-07-18T09:54:22.000Z",
      ip: null,
      externalRef: null,
      customer: {
        id: 1,
        externalRef: null,
        name: "Gabryel",
        email: "gabryel@hotmail.com",
        phone: "11999999999",
        birthdate: null,
        createdAt: "2022-05-26T19:17:48.000Z",
        document: {
          number: "12345678910",
          type: "cpf"
        },
        address: {
          street: "Rua República Argentina",
          streetNumber: "4214",
          complement: null,
          zipCode: "11065030",
          neighborhood: "Pompéia",
          city: "Santos",
          state: "SP",
          country: "BR"
        }
      },
      card: {
        id: 147,
        brand: "visa",
        holderName: "GABRYEL FERREIRA",
        lastDigits: "1111",
        expirationMonth: 3,
        expirationYear: 2028,
        reusable: true,
        createdAt: "2022-07-17T18:08:11.000Z"
      },
      boleto: null,
      pix: null,
      shipping: null,
      refusedReason: null,
      items: [
        {
          externalRef: null,
          title: "b456",
          unitPrice: 100,
          quantity: 1,
          tangible: false
        }
      ],
      splits: [
        {
          recipientId: 1,
          amount: 10000,
          netAmount: 9400
        }
      ],
      refunds: [],
      delivery: null,
      fee: {
        fixedAmount: 200,
        spreadPercentage: 4,
        estimatedFee: 600,
        netAmount: 9400
      }
    }
  };



router.post('/', async (req, res) => {
    const { id, data:{status, customer, metadata} } = req.body;
    if (status !== 'paid'){
       return
    }
    try {
       
        const {userId, planoId} = metadata 
        const updatedData = {sub_plano : planoId, sub_validade: dayjs().add
            (30 ,'days')
         }   
        const updatedQuiz = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        // Envie o token e o userId na resposta
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


module.exports = router;