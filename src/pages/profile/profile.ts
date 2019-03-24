import { Component, OnDestroy } from '@angular/core';
import { IonicPage, App, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from '../../models/user.interface';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html',
})
export class ProfilePage implements OnDestroy {
	userData: User;
	userSubscription: Subscription;

	profileImg = 'assets/imgs/default.png';
	profileImgBg: any = this.sanitizer.bypassSecurityTrustStyle('linear-gradient(rgba(36, 199, 220, 0.725), rgba(81, 74, 157, 0.745))');

	constructor(
		private authService: AuthProvider,
		private app: App,
		private sanitizer: DomSanitizer,
		private navCtrl: NavController
	) {
		this.userSubscription = this.authService.user$.subscribe(userObj => {
			if (userObj) {
				this.userData = userObj;
				this.profileImg = userObj.photoURL;
				this.profileImgBg = this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(36, 199, 220, 0.725), rgba(81, 74, 157, 0.745)), url(${userObj.photoURL})`);
			} else {
				this.profileImg = 'assets/imgs/default.png';
				this.profileImgBg = this.sanitizer.bypassSecurityTrustStyle('linear-gradient(rgba(36, 199, 220, 0.725), rgba(81, 74, 157, 0.745))');
			}
		});
	}

	ngOnDestroy() {
		this.userSubscription.unsubscribe();
	}

	signOut() {
		this.authService.signOut().then(() => this.app.getRootNav().setRoot('LoginPage', {}, { animate: true, duration: 300 }));
	}

	navigateBack() {
		this.navCtrl.popToRoot();
	}
}
