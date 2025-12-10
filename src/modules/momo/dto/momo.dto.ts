export interface CreateMomoPaymentDto {
  order_id: number;
  amount: number;
  orderInfo?: string;
}

export interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink?: string;
  qrCodeUrl?: string;
}

export interface MomoCallbackDto {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: string;
  transId: number;
  resultCode: number;
  message: string;
  payType: string;
  responseTime: number;
  extraData: string;
  signature: string;
}

export interface MomoTransactionStatusRequest {
  orderId: string;
  requestId: string;
}

export interface MomoTransactionStatusResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  extraData: string;
  amount: number;
  transId: number;
  payType: string;
  resultCode: number;
  refundTrans?: any[];
  message: string;
  responseTime: number;
  signature: string;
}
