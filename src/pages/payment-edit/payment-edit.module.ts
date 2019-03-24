import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentEditPage } from './payment-edit';

@NgModule({
  declarations: [
    PaymentEditPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentEditPage),
  ],
})
export class PaymentEditPageModule {}
