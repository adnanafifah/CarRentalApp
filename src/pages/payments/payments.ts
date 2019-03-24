import { Component } from '@angular/core';
import { IonicPage, App } from 'ionic-angular';
import { PaymentProvider } from '../../providers/payment/payment';
import { Observable } from 'rxjs';
import { Payment } from '../../models/payment.interface';
import { AuthProvider } from '../../providers/auth/auth';
import { switchMap } from 'rxjs/operators';

/**
 * Generated class for the PaymentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-payments',
	templateUrl: 'payments.html',
})
export class PaymentsPage {
	payments$: Observable<Payment[]>;

	constructor(
		public appCtrl: App,
		private payService: PaymentProvider,
		private authService: AuthProvider
	) {
		this.payments$ = this.authService.user$.pipe(
			switchMap(userRecord => this.payService.getUserPaymentList(userRecord.uid))
		);
	}

	navigateToPaymentDetail(payment: Payment) {
		this.appCtrl.getRootNav().push('PaymentEditPage', { data: payment });
	}

	getPaymentColor(status) {
		if (status == 'Open') {
			return 'success';
		} else {
			return 'primary';
		}
	}
}
