import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { map, take } from 'rxjs/operators';
import { FcmProvider } from '../../providers/fcm/fcm';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	loginForm: FormGroup;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public fb: FormBuilder,
		public authService: AuthProvider,
		public toastCtrl: ToastController,
		private fcm: FcmProvider,
		private loadingCtrl: LoadingController
	) {
		this.loginForm = this.fb.group({
			email: '',
			password: ''
		});
	}

	ionViewDidLoad() {
		this.authService.user$
			.pipe(
				take(1),
				map(user => !!user)
			)
			.subscribe(loggedIn => {
				if (loggedIn) {
					this.navCtrl.setRoot('TabsPage', {}, { animate: true, duration: 300 });
				}
			});
	}

	goToRegister() {
		this.navCtrl.push('RegisterPage');
	}

	signIn() {
		let loading = this.loadingCtrl.create({
			content: 'Signing In...'
		});

		loading.present();
		this.authService.signIn(this.loginForm.get('email').value, this.loginForm.get('password').value)
			.then(() => {
				return this.fcm.getToken();
			})
			.then(() => {
				this.navCtrl.setRoot('TabsPage');
				loading.dismiss();
			})
			.catch((error) => {
				let toast = this.toastCtrl.create({
					message: error,
					duration: 3000,
					position: 'bottom',
					cssClass: 'toast-error'
				});

				toast.present();
				loading.dismiss();
			});
	}

}
