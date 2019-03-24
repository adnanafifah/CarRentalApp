import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { IonicPage, ViewController } from 'ionic-angular';
import { VehicleProvider } from '../../providers/vehicle/vehicle';
import { FormGroup, FormBuilder } from '@angular/forms';

/**
 * Generated class for the VehicleSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-vehicle-search',
	templateUrl: 'vehicle-search.html',
})
export class VehicleSearchPage {
	searchForm: FormGroup;
	vehCategory = [
		'Compact',
		'Sedan',
		'SUV',
		'Van',
		'Truck',
		'Bus'
	];


	constructor(
		private vehService: VehicleProvider,
		private viewCtrl: ViewController,
		private fb: FormBuilder
	) {
		this.searchForm = this.fb.group({
			'category': '',
			'dateFrom': '',
			'dateTo': '',
			'price': 1000
		});

		if (this.vehService.searchParamValue) {
			let searchObj = this.vehService.searchParamValue;
			searchObj.dateFrom = formatDate(searchObj.dateFrom, 'yyyy-MM-dd', 'en-MY');
			searchObj.dateTo = formatDate(searchObj.dateTo, 'yyyy-MM-dd', 'en-MY');
			this.searchForm.patchValue(this.vehService.searchParamValue);
		} else {
			this.searchForm.patchValue({
				'category': this.vehCategory
			});
		}
	}

	searchVehicle() {
		let searchObj = this.searchForm.value;

		this.vehService.searchParamValue = searchObj;

		searchObj.dateFrom = new Date(searchObj.dateFrom);
		searchObj.dateTo = new Date(searchObj.dateTo);

		this.vehService.searchParams.next(searchObj);
		this.closeModal();
	}

	closeModal() {
		this.viewCtrl.dismiss();
	}

}
