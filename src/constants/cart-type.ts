export enum OrderType {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPING = 'shipping',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum PaymentMethod {
    COD = 'COD',
    MOMO = 'Momo',
    VNPAY = 'VNpay'
}

export enum PaymentStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
    REFUNDED = 'refunded'
}

export enum CancelOrderStatus {
    REQUESTED = 'requested',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    REFUNDED = 'refunded'
}


export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}
