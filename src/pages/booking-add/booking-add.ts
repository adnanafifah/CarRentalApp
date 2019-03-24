import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user.interface';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Vehicle } from '../../models/vehicle.interface';
import { merge } from 'rxjs/operators';
import { BookingProvider } from '../../providers/booking/booking';
import { Booking } from '../../models/booking.interface';

/**
 * Generated class for the BookingAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-booking-add',
	templateUrl: 'booking-add.html',
})
export class BookingAddPage implements OnDestroy {
	applicant: User;
	vehicle: Vehicle;

	applicant$: Subscription;
	datefield$: Subscription;

	bookingForm: FormGroup;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private authService: AuthProvider,
		private fb: FormBuilder,
		private bookingService: BookingProvider,
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController,
		private toastCtrl: ToastController
	) {
		this.bookingForm = this.fb.group({
			'applicant_info': this.fb.group({
				'uid': [{ value: null, disabled: true }],
				'username': [{ value: null, disabled: true }],
				'icno': [{ value: null, disabled: true }],
				'phoneno': [{ value: null, disabled: true }],
				'email': [{ value: null, disabled: true }]
			}),
			'vehicle_info': this.fb.group({
				'uid': [{ value: null, disabled: true }],
				'model': [{ value: null, disabled: true }],
				'regno': [{ value: null, disabled: true }],
				'chassisno': [{ value: null, disabled: true }],
				'price': [{ value: null, disabled: true }],
				'category': [{ value: null, disabled: true }],
				'image': [{ value: null, disabled: true }]
			}),
			'destination': ['', [Validators.required]],
			'depart_date': ['', [Validators.required]],
			'return_date': ['', [Validators.required]],
			'duration': [{ value: '0', disabled: true }, Validators.required],
			'purpose': ['', [Validators.required]],
			'estimate_price': [{ value: '0', disabled: true }, [Validators.required]],
			'booking_status': 'Open',
			'payment_status': 'Closed',
			'category': ''
		});
	}

	ionViewDidLoad() {
		// Set Applicant Data
		this.applicant$ = this.authService.user$.subscribe((user: User) => {
			this.applicant = user;
			this.bookingForm.get('applicant_info').patchValue(user);
			this.bookingForm.get('category').setValue(user.usertype);

			if (user.usertype == 'Public') {
				this.bookingForm.get('payment_status').setValue('Open');
			}
		});
		// Set Vehicle Data
		this.vehicle = this.navParams.get('data');
		this.bookingForm.get('vehicle_info').patchValue(this.vehicle);

		// On Date Field Changes, Calculate Price
		const price$ = this.departDate.valueChanges.pipe(
			merge(this.returnDate.valueChanges)
		);
		this.datefield$ = price$.subscribe(() => this.calculateFinalPrice());
	}

	// Calculate Estimate Final Price based on duration
	calculateFinalPrice() {
		if (this.departDate.value !== '' && this.returnDate.value !== '') {
			const startdate = new Date(this.departDate.value);
			const enddate = new Date(this.returnDate.value);

			const diff = Math.abs(enddate.getTime() - startdate.getTime());
			const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
			const finalPrice = diffDays * this.vehPrice.value;

			this.duration.setValue(diffDays);
			this.finalPrice.setValue(finalPrice);
		}
	}

	submitBooking() {
		let loading = this.loadingCtrl.create({
			content: 'Submitting...'
		});

		let alert = this.alertCtrl.create({
			title: 'Booking Added!',
			subTitle: 'Vehicle Booking successfully made. Please wait for confirmation.',
			buttons: ['Dismiss']
		});

		if (this.bookingForm.valid) {
			loading.present();

			let bookingObj: Booking = this.bookingForm.getRawValue();
			bookingObj.depart_date = new Date(this.departDate.value);
			bookingObj.return_date = new Date(this.returnDate.value);

			this.bookingService.addNewBooking(bookingObj)
				.then(() => {
					loading.dismiss();
					alert.present();
					this.navCtrl.popToRoot();
				})
				.catch((error) => {
					console.error(error);
					loading.dismiss();
					let toast = this.toastCtrl.create({
						message: `${error}`,
						duration: 3000,
						position: 'bottom'
					});

					toast.present();
				});
		}
	}

	ngOnDestroy() {
		this.applicant$.unsubscribe();
		this.datefield$.unsubscribe();
	}

	// Field Getters
	get departDate() {
		return this.bookingForm.get('depart_date');
	}

	get returnDate() {
		return this.bookingForm.get('return_date');
	}

	get vehPrice() {
		return this.bookingForm.get('vehicle_info').get('price');
	}

	get finalPrice() {
		return this.bookingForm.get('estimate_price');
	}

	get duration() {
		return this.bookingForm.get('duration');
	}
}
