import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from 'angularfire2/firestore';
import { Vehicle } from '../../models/vehicle.interface';
import { Subject, combineLatest } from 'rxjs';
import { switchMap, startWith, map } from 'rxjs/operators';
import { Booking } from '../../models/booking.interface';

/*
  Generated class for the VehicleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VehicleProvider {

	searchParams: Subject<any> = new Subject<any>();
	searchParamValue;

	constructor(
		private afs: AngularFirestore
	) {
	}

	getAllVehicles() {
		// Vehicles Observable
		const vehicles$ = this.searchParams.pipe(
			startWith(null),
			switchMap((searchFilter) => {
				return this.afs.collection<Vehicle>('vehicles', ref => {
					let query: CollectionReference | Query = ref;

					if (searchFilter && searchFilter.price) {
						query = query.where('price', '<=', searchFilter.price);
					}

					query = query.where('status', '==', 'Active');

					return query;
				}).valueChanges().pipe(
					map((vehicles: Vehicle[]) => {
						if (searchFilter) {
							return vehicles.filter(veh => {
								return searchFilter.category.indexOf(veh.category) >= 0;
							})
						}

						return vehicles;
					})
				);
			}),
		);

		//Bookings Observable
		const booking$ = this.searchParams.pipe(
			startWith(null),
			switchMap((searchFilter) => {
				return this.afs.collection<Booking>('bookings', ref => {
					let query: CollectionReference | Query = ref;

					if (!searchFilter)
						query = query.where('booking_status', '==', 'Lel');

					return query;
				}).valueChanges().pipe(
					map((bookings: Booking[]) => {
						if (searchFilter) {
							let filteredBookings = bookings.filter((book) => {
								var valid = false;
								var date_from = book.depart_date.toDate();
								var date_to = book.return_date.toDate();

								if (date_from <= searchFilter.dateFrom && date_to >= searchFilter.dateFrom)
									valid = true;

								if (date_from <= searchFilter.dateTo && date_to >= searchFilter.dateTo)
									valid = true;

								if (date_from <= searchFilter.dateFrom && date_to >= searchFilter.dateTo)
									valid = true;

								if (searchFilter.dateFrom <= date_from && searchFilter.dateTo >= date_to)
									valid = true;

								return valid;
							});

							let returnArray = [];
							filteredBookings.forEach((val) => {
								returnArray.push(val.vehicle_info.uid);
							});

							return returnArray;
						} else {
							return [];
						}
					})
				)
			})
		);

		return combineLatest(vehicles$, booking$).pipe(
			map(([vehichles, bookings]) => {

				return vehichles.filter(veh => {
					return bookings.indexOf(veh.uid) < 0;
				});
			})
		);
	}

}
