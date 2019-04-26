import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

const config = {
  apiKey: "AIzaSyD5kJDsNUavyacmRVwP9HvaZD7d4o4qX2Q",
  authDomain: "salty-rogue.firebaseapp.com",
  databaseURL: "https://salty-rogue.firebaseio.com",
  projectId: "salty-rogue",
  storageBucket: "salty-rogue.appspot.com",
  messagingSenderId: "293014247485"
};

class Firebase {
  constructor() {
    app.initializeApp(config)
    this.auth = app.auth()
    this.db = app.firestore()
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  logout() {
    return this.auth.signOut()
  }

  async register(name, email, password) {
    await this.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password)
    return this.auth.currentUser.updateProfile({
      displayName: name
    })
  }

  addQuote(quote) {
		if(!this.auth.currentUser) {
			return alert('Not authorized')
		}

		return this.db.doc(`PhoneRecords/${this.auth.currentUser.uid}`).set({
			quote
		})
	}

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	async getCurrentUserQuote() {
		const quote = await this.db.doc(`PhoneRecords/${this.auth.currentUser.uid}`).get()
		return quote.get('quote')
	}
}

export default new Firebase()