const PaymentsRepository = require('../repositories/payments.repository');

class PaymentsService {
  paymentsRepository = new PaymentsRepository();
  pointTransaction = async (req, res) => {
    await this.paymentsRepository.createPointTransaction({ userId, Uid, amount });
  };
}

module.exports = PaymentsService;
