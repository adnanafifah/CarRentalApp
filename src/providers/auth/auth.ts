import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user.interface';

@Injectable()
export class AuthProvider {
	user$: Observable<User>;

	constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
		this.user$ = this.afAuth.authState.pipe(
			switchMap(user => {
				if (user) {
					return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
				} else {
					return of(null);
				}
			})
		);
	}

	registerNewUser(userRegister) {
		return this.afAuth.auth.createUserWithEmailAndPassword(userRegister.email, userRegister.password).then(userObj => {
			return this.updateUserData(userObj.user, userRegister);
		});
	}

	private updateUserData(user, userRegister) {
		// Sets user data to firestore on login
		const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
		const data = {
			uid: user.uid,
			email: user.email,
			emailVerified: user.emailVerified,
			icno: userRegister.icno,
			photoURL: user.photoURL,
			displayName: user.displayName,
			phoneno: userRegister.phoneno,
			username: userRegister.username,
			usertype: 'Public'
		};
		return userRef.set(data, { merge: true });
	}

	signIn(email, password) {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password);
	}

	signOut() {
		return this.afAuth.auth.signOut();
	}
}
