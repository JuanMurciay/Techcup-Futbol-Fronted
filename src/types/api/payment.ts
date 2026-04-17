export interface CreatePaymentRequestDTO {
  teamId: number;
  receiptUrl?: string;
}

export interface ApprovePaymentRequestDTO {
  approvedBy: string;
}

export interface RejectPaymentRequestDTO {
  comments: string;
}
