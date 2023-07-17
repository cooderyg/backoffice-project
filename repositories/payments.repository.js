const { Users, PointTransactions } = require('../models');
class PaymentsRepository {
  createPointTransaction = async ({ userId, Uid, amount }) => {
    await PointTransactions.create({
      amount,
      userId,
      Uid,
    });
  };
}

module.exports = PaymentsRepository;
