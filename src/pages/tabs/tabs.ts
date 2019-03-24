import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user.interface';
import { Subscription } from 'rxjs';
import { BookingProvider } from '../../providers/booking/booking';
import { switchMap } from 'rxjs/operators';
import { PaymentProvider } from '../../providers/payment/payment';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-tabs',
	templateUrl: 'tabs.html'
})
export class TabsPage implements OnDestroy, OnInit {

	homeRoot = 'HomePage'
	paymentsRoot = 'PaymentsPage'
	profileRoot = 'ProfilePage'
	bookingsRoot = 'BookingsPage'

	currentTab = 0;

	bookingBadge;
	paymentBadge;

	userData: User;
	userSubscription: Subscription;
	bookingBadgeSub: Subscription;
	paymentBadgeSub: Subscription;
	profileImg = 'assets/imgs/default.png';


	constructor(
		private authService: AuthProvider,
		private navController: NavController,
		private bookingService: BookingProvider,
		private paymentService: PaymentProvider,
		private modalCtrl: ModalController
	) {
		this.userSubscription = this.authService.user$.subscribe(userObj => {
			if (userObj) {
				this.userData = userObj;
				this.profileImg = userObj.photoURL ? userObj.photoURL : 'assets/imgs/default.png';
			}
		});
	}

	ngOnInit() {
		this.bookingBadgeSub = this.authService.user$.pipe(
			switchMap(userRecord => this.bookingService.getUserNewBookingCount(userRecord.uid))
		).subscribe(resultCount => this.bookingBadge = resultCount);

		this.paymentBadgeSub = this.authService.user$.pipe(
			switchMap(userRecord => this.paymentService.getUserNewPaymentCount(userRecord.uid))
		).subscribe(resultCount => this.paymentBadge = resultCount);
	}

	navigateToProfile() {
		this.navController.push('ProfilePage');
	}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
		this.bookingBadgeSub.unsubscribe();
		this.paymentBadgeSub.unsubscribe();
	}

	onTabChange(ev) {
		this.currentTab = ev.index;
	}

	openVehicleSearch() {
		let searchModal = this.modalCtrl.create('VehicleSearchPage');
		searchModal.present();
	}

}
