import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);

  constructor() {}

  //test
  async testConnection() {
    try {
      await addDoc(collection(this.db, 'test'), {
        message: 'Hello from Recipe Book!',
        timestamp: new Date()
      });
      console.log('Firebase connected successfully!');
      return true;
    } catch (error) {
      console.error('Firebase connection failed:', error);
      return false;
    }
  }

  async addRecipe(recipe: any) {
    return await addDoc(collection(this.db, 'recipes'), recipe);
  }

  async getRecipes() {
    const querySnapshot = await getDocs(collection(this.db, 'recipes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateRecipe(id: string, recipe: any) {
    return await updateDoc(doc(this.db, 'recipes', id), recipe);
  }

  async deleteRecipe(id: string) {
    return await deleteDoc(doc(this.db, 'recipes', id));
  }

  async createUser(userData: any) {
    return await addDoc(collection(this.db, 'users'), userData);
  }

  async getUserByUsername(username: string) {
    const querySnapshot = await getDocs(collection(this.db, 'users'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((user: any) => user.username === username);
  }

  async getUserByCredentials(username: string, password: string) {
    const querySnapshot = await getDocs(collection(this.db, 'users'));
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((user: any) => user.username === username && user.password === password);
  }
}