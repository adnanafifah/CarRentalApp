import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Payment } from '../../models/payment.interface';
import { map, finalize, switchMap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

@Injectable()
export class PaymentProvider {

	constructor(
		private afs: AngularFirestore,
		private storage: AngularFireStorage
	) {
	}

	getUserPaymentList(userid: string) {
		return this.afs.collection<Payment>('payments', ref => ref.where('applicant_id', '==', userid)).valueChanges();
	}

	getUserNewPaymentCount(userid: string) {
		return this.afs.collection<Payment>('payments', ref => ref.where('applicant_id', '==', userid))
			.valueChanges()
			.pipe(
				map((payments: Payment[]) => {
					const filteredPayments = payments.filter(booking => booking.payment_status !== 'Closed');
					return filteredPayments.length == 0 ? null : filteredPayments.length;
				})
			);
	}

	submitPayment(payment: Payment) {
		return this.afs.collection('payments').doc(payment.uid).update(payment);
	}

	uploadProof(payment: Payment, fileImage) {
		const ref = this.storage.ref(`payments/${payment.paymentno}.png`);
		const taskUpload: AngularFireUploadTask = ref.putString(fileImage, 'base64', { contentType: 'image/png' });
		return taskUpload.snapshotChanges().pipe(
			finalize(() => ref.getDownloadURL()),
			switchMap(() => ref.getDownloadURL())
		).toPromise().then((imageUrl) => {
			return this.afs.collection('payments').doc(payment.uid).update({
				'payment_proof': imageUrl
			});
		});
	}

}
