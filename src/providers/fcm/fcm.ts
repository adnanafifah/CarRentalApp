import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthProvider } from '../auth/auth';
import { take } from 'rxjs/operators';

@Injectable()
export class FcmProvider {

	constructor(
		public firebaseNative: Firebase,
		public afs: AngularFirestore,
		private platform: Platform,
		private authService: AuthProvider
	) {
	}

	// Get permission from the user
	async getToken() {

		let token;

		if (this.platform.is('android')) {
			token = await this.firebaseNative.getToken()
		}

		if (this.platform.is('ios')) {
			token = await this.firebaseNative.getToken();
			await this.firebaseNative.grantPermission();
		}

		const userData = await this.authService.user$.pipe(
			take(1)
		).toPromise();

		return this.saveTokenToFirestore(token, userData);
	}

	// Save the token to firestore
	private saveTokenToFirestore(token, userData) {
		if (!token) return;

		const devicesRef = this.afs.collection('devices');

		const docData = {
			token,
			...userData
		};

		return devicesRef.doc(token).set(docData);
	}

	// Listen to incoming FCM messages
	listenToNotifications() {
		return this.firebaseNative.onNotificationOpen()
	}
}
