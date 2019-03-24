import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FcmProvider } from '../providers/fcm/fcm';
import { tap } from 'rxjs/operators';
import { AuthProvider } from '../providers/auth/auth';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any;

	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, fcm: FcmProvider, toastCtrl: ToastController, authService: AuthProvider) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();

			authService.user$.subscribe(userRecord => {
				if (userRecord) {
					this.rootPage = 'TabsPage';
				} else {
					this.rootPage = 'LoginPage';
				}
				splashScreen.hide();
			});

			// Listen to incoming messages
			fcm.listenToNotifications().pipe(
				tap(msg => {
					// show a toast
					const toast = toastCtrl.create({
						message: msg.body,
						duration: 3000,
						position: 'top'
					});
					toast.present();
				})
			).subscribe()
		});
	}
}

