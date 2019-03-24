import { User } from "./user.interface";
import { Vehicle } from "./vehicle.interface";
import { Payment } from "./payment.interface";
export interface Booking {
	'uid': string;
	'applicant_info': User;
	'vehicle_info': Vehicle;
	'payment_info'?: Payment;
	'destination': string;
	'depart_date': any;
	'return_date': any;
	'duration': number;
	'purpose': string;
	'estimate_price': number;
	'booking_status': string;
	'payment_status': string;
	'category': string;
	'bookingno'?: string;
}
