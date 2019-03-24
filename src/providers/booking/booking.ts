import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Booking } from '../../models/booking.interface';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../models/user.interface';
import { Vehicle } from '../../models/vehicle.interface';

@Injectable()
export class BookingProvider {

	constructor(
		private afs: AngularFirestore
	) {
	}

	getUserBookings(userid: string) {
		return this.afs.collection<Booking>('bookings', ref => ref.where('applicant_info.uid', '==', userid)).valueChanges();
	}

	getUserNewBookingCount(userid: string) {
		return this.afs.collection<Booking>('bookings', ref => ref.where('applicant_info.uid', '==', userid))
			.valueChanges()
			.pipe(
				map((bookings: Booking[]) => {
					const filteredBookings = bookings.filter(booking => booking.booking_status !== 'Closed' && booking.booking_status !== 'Rejected');
					return filteredBookings.length == 0 ? null : filteredBookings.length;
				})
			);
	}

	addNewBooking(bookingObj: Booking) {
		const docRef = this.afs.firestore.collection("documentno").doc("bookings");

		// Create document initial document if does not exist
		return docRef.get().then((doc) => {
			if (doc.exists) {
				return doc.data();
			} else {
				const recordObj = {
					'Compact': 0,
					'Sedan': 0,
					'SUV': 0,
					'Van': 0,
					'Truck': 0,
					'Bus': 0
				};
				return docRef.set(recordObj).then(() => recordObj);
			}
		}).then((documentObj) => {
			return this.getBookingNo(bookingObj, documentObj).then((bookingNo) => {
				bookingObj.bookingno = bookingNo;
				return this.afs.collection('bookings').add(bookingObj);
			});
		}).then((bookingRecord) => {
			return this.afs.collection('bookings').doc(bookingRecord.id).update({
				'uid': bookingRecord.id
			});
		});
	}

	getBookingByID(id: string) {
		console.log(id);
		return this.afs.doc<Booking>(`bookings/${id}`).valueChanges().pipe(
			// Get Applicant Info
			switchMap((bookingRecord) => {
				const bookingObj = bookingRecord;

				return this.afs.doc(`users/${bookingRecord.applicant_info.uid}`).valueChanges().pipe(
					map((userRecord: User) => {
						bookingObj.applicant_info = userRecord;
						return bookingObj;
					})
				);
			}),

			// Get Vehicle Info
			switchMap((bookingRecord) => {
				const bookingObj = bookingRecord;

				return this.afs.doc(`vehicles/${bookingRecord.vehicle_info.uid}`).valueChanges().pipe(
					map((vehRecord: Vehicle) => {
						bookingObj.vehicle_info = vehRecord;
						return bookingObj;
					})
				);
			})
		);
	}

	getBookingNo(bookingObj: Booking, documentObj) {
		let bookingno = '';
		if (bookingObj.vehicle_info.category === 'Compact') {
			bookingno = 'BKCPT' + this.pad(documentObj.Compact++, 4);
		} else if (bookingObj.vehicle_info.category === 'Sedan') {
			bookingno = 'BKSDN' + this.pad(documentObj.Sedan++, 4);
		} else if (bookingObj.vehicle_info.category === 'SUV') {
			bookingno = 'BKSUV' + this.pad(documentObj.SUV++, 4);
		} else if (bookingObj.vehicle_info.category === 'Van') {
			bookingno = 'BKVAN' + this.pad(documentObj.Van++, 4);
		} else if (bookingObj.vehicle_info.category === 'Truck') {
			bookingno = 'BKTRK' + this.pad(documentObj.Truck++, 4);
		} else if (bookingObj.vehicle_info.category === 'Bus') {
			bookingno = 'BKBUS' + this.pad(documentObj.Bus++, 4);
		}

		return this.afs.collection('documentno').doc('bookings').update(documentObj).then(() => bookingno);
	}

	// Pad number with leading zeros
	pad(n: any, width: any, z?: any) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
}
