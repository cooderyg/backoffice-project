const PaymentsService = require('../services/payments.service');

class PaymentsController {
  paymentsService = new PaymentsService();
  pointTransaction = async (req, res) => {
    await this.paymentsService.pointTransaction({ userId, Uid, amount });
  };
}

module.exports = PaymentsController;
