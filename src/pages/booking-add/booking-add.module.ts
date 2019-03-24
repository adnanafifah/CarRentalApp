import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingAddPage } from './booking-add';

@NgModule({
  declarations: [
    BookingAddPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingAddPage),
  ],
})
export class BookingAddPageModule {}
