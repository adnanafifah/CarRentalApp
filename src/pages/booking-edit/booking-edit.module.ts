import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookingEditPage } from './booking-edit';

@NgModule({
  declarations: [
    BookingEditPage,
  ],
  imports: [
    IonicPageModule.forChild(BookingEditPage),
  ],
})
export class BookingEditPageModule {}
