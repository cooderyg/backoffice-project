const PaymentsService = require('../services/payments.service');

class PaymentsController {
  paymentsService = new PaymentsService();

  createPointTransaction = async (req, res) => {
    const { impUid, amount, userId } = req.body;
    try {
      const data = await this.paymentsService.createPointTransaction({ userId, impUid, amount });
      res.status(200).json({ data });
    } catch (error) {
      const { status, message } = error;
      if (!status) return res.status(500).json({ message });
      res.status(status).json({ message });
    }
  };

  cancelPointTransaction = async (req, res) => {
    const { pointTransactionId, userId } = req.body;
    try {
      const data = await this.paymentsService.cancelPointTransaction({
        pointTransactionId,
        userId,
      });
      res.status(200).json({ data });
    } catch (error) {
      const { status, message } = error;
      if (!status) return res.status(500).json({ message });
      res.status(status).json({ message });
    }
  };
}

module.exports = PaymentsController;
