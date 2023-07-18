const { Users, PointTransactions, sequelize } = require('../models');
const { Transaction } = require('sequelize');
const HttpException = require('../utils/error');
class PaymentsRepository {
  creatPointTransaction = async ({ userId, impUid, amount }) => {
    const t = await sequelize.transaction({
      // 격리수준 설정
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    try {
      await PointTransactions.create(
        {
          amount,
          UserId: userId,
          Uid: impUid,
        },
        { transaction: t },
      );
      await Users.increment(
        { point: amount }, //
        { where: { userId } },
        { transaction: t },
      );
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, error.message);
    }
  };

  cancelPointTransaction = async ({ pointTransactionId, amount, userId }) => {
    const t = await sequelize.transaction({
      // 격리수준 설정
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    try {
      await PointTransactions.update(
        { status: 'CANCEL' },
        { where: { pointTransactionId } },
        { transaction: t },
      );
      await Users.decrement(
        { point: amount }, //
        { where: { userId } },
        { transaction: t },
      );
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new HttpException(500, '결제취소 중 에러가 발생했습니다.');
    }
  };

  findPointTransaction = async ({ pointTransactionId }) => {
    return await PointTransactions.findOne({ pointTransactionId });
  };

  findUser = async ({ userId }) => {
    return await Users.findOne({ userId });
  };
}

module.exports = PaymentsRepository;
