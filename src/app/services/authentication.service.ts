import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';

export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string
    createdAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser: User | null = null;

    constructor(
        private firebaseService: FirebaseService,
        private router: Router
    ) {

        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    async register(userData: any) {
        try {

            const existingUsers = await this.firebaseService.getUserByUsername(userData.username);
            if (existingUsers.length > 0) {
                throw new Error('Username already exists');
            }

            const docRef = await this.firebaseService.createUser(userData);

            this.currentUser = {
                id: docRef.id,
                username: userData.username,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                createdAt: new Date()
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            console.log('User registered successfully');
            return { success: true };

        } catch (error: any) {
            console.error('Registration failed:', error);
            return { success: false, error: error.message };
        }
    }

    async login(username: string, password: string) {
        try {
            const users = await this.firebaseService.getUserByCredentials(username, password);

            if (users.length === 0) {
                throw new Error('Incorrect username or password');
            }

            const user = users[0] as any;
            this.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

            console.log('Login successful');
            return { success: true };

        } catch (error: any) {
            console.error('Login failed:', error);
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    isLoggedIn(): boolean {
        return this.currentUser !== null;
    }
}