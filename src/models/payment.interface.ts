export interface Payment {
    'uid'?: string;
    'paymentno': string;
    'bookingno': string;
    'applicant_id': string;
    'created_datetime': any;
    'payment_datetime'?: any;
    'payment_type'?: string;
    'bank'?: string;
    'payment_amount'?: number;
    'payment_proof'?: string;
    'payment_status': string;
}
