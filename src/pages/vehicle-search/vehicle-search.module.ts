import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehicleSearchPage } from './vehicle-search';

@NgModule({
  declarations: [
    VehicleSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(VehicleSearchPage),
  ],
})
export class VehicleSearchPageModule {}
