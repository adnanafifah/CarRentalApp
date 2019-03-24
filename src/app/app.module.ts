// Ionic Core Module
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SuperTabsModule } from 'ionic2-super-tabs';

// Native Plugins
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Firebase } from '@ionic-native/firebase';
import { Camera } from '@ionic-native/camera';

// Pages
import { MyApp } from './app.component';

// App Config
import { env } from '../environment/env';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

// Providers
import { UserProvider } from '../providers/user/user';
import { AuthProvider } from '../providers/auth/auth';
import { VehicleProvider } from '../providers/vehicle/vehicle';
import { BookingProvider } from '../providers/booking/booking';
import { FcmProvider } from '../providers/fcm/fcm';
import { PaymentProvider } from '../providers/payment/payment';

@NgModule({
	declarations: [
		MyApp,
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, {
			tabsHideOnSubPages: true,
		}),
		AngularFireModule.initializeApp(env.dbconfig),
		AngularFireAuthModule,
		AngularFirestoreModule,
		AngularFireStorageModule,
		SuperTabsModule.forRoot()
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		Firebase,
		Camera,
		UserProvider,
		AuthProvider,
		VehicleProvider,
		BookingProvider,
		FcmProvider,
		PaymentProvider
	]
})
export class AppModule { }
