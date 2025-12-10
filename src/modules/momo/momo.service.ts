import crypto from "crypto";
import axios from "axios";
import { Repository } from "typeorm";
import { AppDataSource } from "@/config/database.config";
import { Order } from "@/modules/orders/entity/order.entity";
import { Transaction } from "@/modules/transactions/entity/transaction.entity";
import { PaymentMethod, PaymentStatus, TransactionStatus } from "@/modules/orders/enum/order.enum";
import { AppError } from "@/common/error.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorCode } from "@/constants/error-code";
import {
  CreateMomoPaymentDto,
  MomoPaymentResponse,
  MomoCallbackDto,
  MomoTransactionStatusResponse
} from "./dto/momo.dto";

export class MomoService {
  private orderRepository: Repository<Order>;
  private transactionRepository: Repository<Transaction>;

  // MoMo Sandbox Config
  private partnerCode: string;
  private accessKey: string;
  private secretKey: string;
  private endpoint: string;
  private redirectUrl: string;
  private ipnUrl: string;

  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.transactionRepository = AppDataSource.getRepository(Transaction);

    // Load config từ .env
    this.partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO";
    this.accessKey = process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85";
    this.secretKey = process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    this.endpoint = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api";
    // Redirect trực tiếp về frontend sau khi thanh toán
    this.redirectUrl = process.env.MOMO_REDIRECT_URL || "http://localhost:3000/checkout/momo-return";
    this.ipnUrl = process.env.MOMO_IPN_URL || "http://localhost:4000/api/v1/momo/callback";
  }

  /**
   * Tạo chữ ký HMAC SHA256
   */
  private createSignature(rawSignature: string): string {
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(rawSignature)
      .digest("hex");
  }

  /**
   * Tạo yêu cầu thanh toán MoMo
   */
  async createPayment(data: CreateMomoPaymentDto): Promise<MomoPaymentResponse> {
    const { order_id, amount, orderInfo } = data;

    // Kiểm tra đơn hàng tồn tại
    const order = await this.orderRepository.findOne({
      where: { id: order_id }
    });

    if (!order) {
      throw new AppError(
        "Đơn hàng không tồn tại",
        HttpStatusCode.NOT_FOUND,
        ErrorCode.ORDER_NOT_FOUND
      );
    }

    // Tạo orderId và requestId unique
    const momoOrderId = `${this.partnerCode}_${order_id}_${Date.now()}`;
    const requestId = momoOrderId;
    const requestType = "payWithMethod";
    const extraData = Buffer.from(JSON.stringify({ order_id })).toString("base64");
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";
    const paymentInfo = orderInfo || `Thanh toán đơn hàng #${order_id}`;

    // Tạo raw signature theo thứ tự alphabet
    const rawSignature =
      `accessKey=${this.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${this.ipnUrl}` +
      `&orderId=${momoOrderId}` +
      `&orderInfo=${paymentInfo}` +
      `&partnerCode=${this.partnerCode}` +
      `&redirectUrl=${this.redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = this.createSignature(rawSignature);

    // Request body
    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: "Test Store",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId: momoOrderId,
      orderInfo: paymentInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId,
      signature
    };

    try {
      const response = await axios.post<MomoPaymentResponse>(
        `${this.endpoint}/create`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      // Lưu transaction pending
      if (response.data.resultCode === 0) {
        const transaction = this.transactionRepository.create({
          transaction_code: momoOrderId,
          amount,
          payment_method: PaymentMethod.MOMO,
          status: TransactionStatus.PENDING,
          order: order
        });
        await this.transactionRepository.save(transaction);
      }

      return response.data;
    } catch (error: any) {
      throw new AppError(
        error.response?.data?.message || "Lỗi kết nối MoMo",
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR
      );
    }
  }

  /**
   * Xử lý callback từ MoMo (IPN)
   */
  async handleCallback(callbackData: MomoCallbackDto): Promise<{ success: boolean; message: string }> {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = callbackData;

    // Verify signature
    const rawSignature =
      `accessKey=${this.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const expectedSignature = this.createSignature(rawSignature);

    if (signature !== expectedSignature) {
      throw new AppError(
        "Chữ ký không hợp lệ",
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Tìm transaction
    const transaction = await this.transactionRepository.findOne({
      where: { transaction_code: orderId },
      relations: ["order"]
    });

    if (!transaction) {
      throw new AppError(
        "Giao dịch không tồn tại",
        HttpStatusCode.NOT_FOUND,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Cập nhật trạng thái dựa vào resultCode
    if (resultCode === 0) {
      // Thanh toán thành công
      transaction.status = TransactionStatus.SUCCESS;
      await this.transactionRepository.save(transaction);

      // Cập nhật trạng thái đơn hàng
      if (transaction.order) {
        transaction.order.payment_status = PaymentStatus.PAID;
        await this.orderRepository.save(transaction.order);
      }

      return { success: true, message: "Thanh toán thành công" };
    } else {
      // Thanh toán thất bại
      transaction.status = TransactionStatus.FAILED;
      await this.transactionRepository.save(transaction);

      return { success: false, message: message || "Thanh toán thất bại" };
    }
  }

  /**
   * Kiểm tra trạng thái giao dịch
   */
  async checkTransactionStatus(orderId: string): Promise<MomoTransactionStatusResponse> {
    const requestId = `check_${Date.now()}`;
    const lang = "vi";

    const rawSignature =
      `accessKey=${this.accessKey}` +
      `&orderId=${orderId}` +
      `&partnerCode=${this.partnerCode}` +
      `&requestId=${requestId}`;

    const signature = this.createSignature(rawSignature);

    const requestBody = {
      partnerCode: this.partnerCode,
      requestId,
      orderId,
      lang,
      signature
    };

    try {
      const response = await axios.post<MomoTransactionStatusResponse>(
        `${this.endpoint}/query`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      return response.data;
    } catch (error: any) {
      throw new AppError(
        error.response?.data?.message || "Lỗi kiểm tra trạng thái",
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.VALIDATION_ERROR
      );
    }
  }

  /**
   * Xử lý redirect URL (khi user quay về từ MoMo)
   */
  async handleReturn(query: any): Promise<{ success: boolean; order_id: number | null; message: string }> {
    const { resultCode, orderId, extraData } = query;

    let orderIdFromExtra: number | null = null;
    
    try {
      if (extraData) {
        const decoded = JSON.parse(Buffer.from(extraData, "base64").toString("utf-8"));
        orderIdFromExtra = decoded.order_id;
      }
    } catch (e) {
      // Ignore parse error
    }

    if (resultCode === "0" || resultCode === 0) {
      return {
        success: true,
        order_id: orderIdFromExtra,
        message: "Thanh toán thành công"
      };
    }

    return {
      success: false,
      order_id: orderIdFromExtra,
      message: "Thanh toán thất bại hoặc bị hủy"
    };
  }
}

export default new MomoService();
