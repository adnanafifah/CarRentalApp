import { Component } from '@angular/core';
import { IonicPage, App, NavParams } from 'ionic-angular';
import { VehicleProvider } from '../../providers/vehicle/vehicle';
import { Observable } from 'rxjs';
import { Vehicle } from '../../models/vehicle.interface';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class HomePage {
	vehicleList$: Observable<Vehicle[]>;

	constructor(
		public appCtrl: App,
		public navParams: NavParams,
		private vehService: VehicleProvider
	) {
	}

	ionViewDidLoad() {
		this.vehicleList$ = this.vehService.getAllVehicles();
	}

	navigateToDetail(vehicle: Vehicle) {
		this.appCtrl.getRootNav().push('VehicleDetailPage', { data: vehicle });
	}

}
