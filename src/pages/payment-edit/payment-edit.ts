import { Component } from '@angular/core';
import { IonicPage, NavParams, LoadingController, AlertController, ToastController, NavController } from 'ionic-angular';
import { Payment } from '../../models/payment.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PaymentProvider } from '../../providers/payment/payment';
import { formatDate } from '@angular/common';

/**
 * Generated class for the PaymentEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-payment-edit',
	templateUrl: 'payment-edit.html',
})
export class PaymentEditPage {
	payment: Payment;
	payForm: FormGroup;

	payTypeOptions = ['Cash', 'Bank Transfer', 'Visa', 'Master Card', 'Online Banking'];
	bankOptions = [
		'Maybank',
		'POSB Bank',
		'Public Bank Berhad',
		'RHB Bank',
		'Hong Leong Bank',
		'AmBank',
		'United Overseas Bank',
		'Bank Rakyat',
		'OCBC Bank',
		'HSBC Bank'
	];

	payProofImage: string | any = 'assets/imgs/default.png';
	proofImageString;

	submitted = false;

	constructor(
		public navParams: NavParams,
		private fb: FormBuilder,
		private camera: Camera,
		private payService: PaymentProvider,
		private loadCtrl: LoadingController,
		private alertCtrl: AlertController,
		private toastCtrl: ToastController,
		private navCtrl: NavController
	) {
		this.payForm = this.fb.group({
			'uid': [{ value: null, disabled: true }],
			'paymentno': [{ value: null, disabled: true }],
			'bookingno': [{ value: null, disabled: true }],
			'applicant_id': [{ value: null, disabled: true }],
			'created_datetime': [{ value: null, disabled: true }],
			'payment_datetime': [null, [Validators.required]],
			'payment_type': ['', [Validators.required]],
			'bank': ['', Validators.required],
			'payment_amount': [0, [Validators.required]],
			'payment_proof': [{ value: null, disabled: true }],
			'payment_status': [{ value: null, disabled: true }]
		});

		this.payment = this.navParams.get('data');
		if (this.payment) {
			const payObj = this.payment;
			payObj.payment_datetime = payObj.payment_datetime ? formatDate(payObj.payment_datetime.toDate(), 'yyyy-MM-dd', 'en-MY') : null;
			this.payProofImage = payObj.payment_proof ? payObj.payment_proof : this.payProofImage;

			if (payObj.payment_status !== 'Open') {
				this.payment_datetime.disable();
				this.payment_type.disable();
				this.bank.disable();
				this.payment_amount.disable();
			}
			this.payForm.patchValue(payObj);
		}
	}

	uploadImage() {
		const options: CameraOptions = {
			quality: 70,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.PNG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true
		}

		this.camera.getPicture(options).then((imageData) => {
			this.proofImageString = imageData;
			this.payProofImage = 'data:image/png;base64,' + imageData;
		}).catch(error => {
			console.error(error);
		});
	}

	getErrorMsg(field) {
		const formField = this.payForm.get(field);

		if (formField.hasError('required')) {
			return 'This field is required.';
		}

		return '';
	}

	submitPayment() {
		let loading = this.loadCtrl.create({
			content: 'Submitting...'
		});

		let alert = this.alertCtrl.create({
			title: 'Payment Submitted!',
			subTitle: 'Payment Record successfully submitted!',
			buttons: ['Dismiss']
		});

		this.submitted = true;

		if (this.payProofImage == 'assets/imgs/default.png') {
			this.toastCtrl.create({
				message: 'Please upload an image of payment proof.',
				duration: 3000,
				position: 'bottom',
				cssClass: 'toast-error'
			}).present();

		} else if (this.payForm.valid) {
			loading.present();

			const paymentObj: Payment = this.payForm.getRawValue();
			paymentObj.payment_datetime = new Date(this.payment_datetime.value);
			paymentObj.payment_status = 'Submitted';

			this.payService.submitPayment(paymentObj)
				.then(() => {
					return this.payService.uploadProof(paymentObj, this.proofImageString);
				}).then((result) => {
					loading.dismiss();
					alert.present();
					this.navCtrl.popToRoot();
				}).catch((error) => {
					loading.dismiss();

					this.toastCtrl.create({
						message: 'Oops! An error occured. Please contact system administrator!',
						duration: 3000,
						position: 'bottom',
						cssClass: 'toast-error'
					}).present();
				})
		}
	}

	get payment_amount() {
		return this.payForm.get('payment_amount');
	}
	get bank() {
		return this.payForm.get('bank');
	}
	get payment_datetime() {
		return this.payForm.get('payment_datetime');
	}
	get payment_type() {
		return this.payForm.get('payment_type');
	}
}
