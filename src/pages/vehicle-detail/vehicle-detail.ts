import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Vehicle } from '../../models/vehicle.interface';

/**
 * Generated class for the VehicleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-vehicle-detail',
	templateUrl: 'vehicle-detail.html',
})
export class VehicleDetailPage {
	vehicle: Vehicle;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		this.vehicle = this.navParams.get('data');
	}

	goToBookingPage() {
		this.navCtrl.push('BookingAddPage', { data: this.vehicle });
	}
}
