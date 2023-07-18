const PaymentsRepository = require('../repositories/payments.repository');
const HttpException = require('../utils/error');
const axios = require('axios');

class PaymentsService {
  paymentsRepository = new PaymentsRepository();
  createPointTransaction = async ({ userId, impUid, amount }) => {
    try {
      await this.paymentsRepository.creatPointTransaction({ userId, impUid, amount });
      return { message: '결제가 성공적으로 완료되었습니다.' };
    } catch (error) {
      throw error;
    }
  };
  // 어뷰징유저는 DB보단 service에서 처리하는게 리소스를 아낄 수 있음 나중에 생각해보기(redis 캐싱 등)
  cancelPointTransaction = async ({ pointTransactionId, userId }) => {
    const { point } = await this.paymentsRepository.findUser({ userId });

    const { amount, UserId, status } = await this.paymentsRepository.findPointTransaction({
      pointTransactionId,
    });

    if (status === 'CANCEL') throw new HttpException(409, '이미 취소된 결제ID입니다.');
    if (userId !== UserId) throw new HttpException(401, '해당 결제의 유저ID와 다릅니다.');
    if (!point || !amount) throw new HttpException(404, '유저 혹은 결제정보를 찾을 수 없습니다.');
    if (amount > point) throw new HttpException(400, '보유하신 포인트가 취소 포인트보다 적습니다.');

    try {
      const token = await this.getImpToken();
      await axios.post(
        'https://api.iamport.kr/payments/cancel',
        { imp_uid: impUid },
        { headers: { Authorization: token } },
      );
    } catch (error) {
      throw new HttpException(error.response.data.message, error.response.status);
    }

    try {
      await this.paymentsRepository.cancelPointTransaction({
        pointTransactionId,
        amount,
        userId,
      });
      return { message: '결제취소가 성공적으로 완료되었습니다.' };
    } catch (error) {
      throw error;
    }
  };

  async getImpToken() {
    try {
      const result = await axios.post(`https://api.iamport.kr/users/getToken`, {
        imp_key: '아임포트키입력',
        imp_secret: '아임포트시크릿입력',
      });
      return result.data.response.access_token;
    } catch (error) {
      throw new HttpException(error.response.status, error.response.data.message);
    }
  }
}

module.exports = PaymentsService;
