import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
	selector: 'page-register',
	templateUrl: 'register.html',
})
export class RegisterPage {

	registerForm: FormGroup;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public fb: FormBuilder,
		public authProvider: AuthProvider,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController
	) {
		this.registerForm = this.fb.group({
			username: ['', Validators.compose([Validators.required])],
			email: ['', Validators.compose([Validators.required, Validators.email])],
			phoneno: ['', Validators.compose([Validators.required, Validators.pattern('^(\\+?6?01)[0|1|2|3|4|6|7|8|9]\\-*[0-9]{7,8}$')])],
			icno: ['', Validators.compose([Validators.required, Validators.minLength(12)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
	}

	registerUser() {
		if (this.registerForm.valid) {
			let loading = this.loadingCtrl.create({
				content: 'Registering...'
			});

			loading.present();
			this.authProvider.registerNewUser(this.registerForm.value).then(result => {
				loading.dismiss();
				this.navCtrl.setRoot('TabsPage');
			}).catch(error => {
				loading.dismiss();
				let toast = this.toastCtrl.create({
					message: `${error}`,
					duration: 3000,
					position: 'bottom'
				});

				toast.present();
			});
		} else {
			this.validateFormFields();
		}
	}

	validateFormFields() {
		Object.keys(this.registerForm.controls).forEach(field => {
			const control = this.registerForm.get(field);
			control.markAsTouched({ onlySelf: true });
		});
	}
}
