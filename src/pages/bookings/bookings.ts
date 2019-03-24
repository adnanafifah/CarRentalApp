import { Component } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';
import { BookingProvider } from '../../providers/booking/booking';
import { Observable } from 'rxjs';
import { Booking } from '../../models/booking.interface';
import { AuthProvider } from '../../providers/auth/auth';
import { switchMap } from 'rxjs/operators';

/**
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-bookings',
	templateUrl: 'bookings.html',
})
export class BookingsPage {
	bookings$: Observable<Booking[]>;

	constructor(
		public navCtrl: NavController,
		private bookingService: BookingProvider,
		private authService: AuthProvider,
		private appCtrl: App
	) {
		this.bookings$ = this.authService.user$.pipe(
			switchMap(userRecord => this.bookingService.getUserBookings(userRecord.uid)),
		);
	}

	getBookingColor(status) {
		if (status == 'Open') {
			return 'success';
		} else if (status == 'Rejected') {
			return 'danger';
		} else if (status == 'Pending Payment') {
			return 'warning';
		} else if (status == 'Closed') {
			return 'secondary';
		}
	}

	navigateToDetail(booking: Booking) {
		this.appCtrl.getRootNav().push('BookingEditPage', { data: booking });
	}
}
