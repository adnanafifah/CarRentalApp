import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Booking } from '../../models/booking.interface';
import { Observable, Subscription } from 'rxjs';
import { BookingProvider } from '../../providers/booking/booking';


@IonicPage()
@Component({
	selector: 'page-booking-edit',
	templateUrl: 'booking-edit.html',
})
export class BookingEditPage implements OnDestroy {
	booking: Booking;
	bookingSub: Subscription;

	constructor(
		public navParams: NavParams,
		private bookService: BookingProvider
	) {
		this.bookingSub = this.bookService.getBookingByID(this.navParams.get('data').uid).subscribe(bookingRecord => {
			this.booking = bookingRecord;
		});
	}

	ngOnDestroy() {
		this.bookingSub.unsubscribe();
	}

}
