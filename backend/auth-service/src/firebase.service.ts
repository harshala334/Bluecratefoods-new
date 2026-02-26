import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private firebaseApp: admin.app.App;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const serviceAccountPath = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');

        if (serviceAccountPath) {
            try {
                this.firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert(serviceAccountPath),
                });
                console.log('Firebase Admin SDK initialized successfully');
            } catch (error) {
                console.error('Error initializing Firebase Admin SDK:', error);
            }
        } else {
            console.warn('FIREBASE_SERVICE_ACCOUNT_PATH not found in environment variables. Firebase features will be disabled.');
        }
    }

    async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        if (!this.firebaseApp) {
            throw new Error('Firebase Admin SDK not initialized');
        }
        return this.firebaseApp.auth().verifyIdToken(idToken);
    }

    async verifyPhoneNumber(idToken: string): Promise<string> {
        const decodedToken = await this.verifyIdToken(idToken);
        if (!decodedToken.phone_number) {
            throw new Error('Token does not contain a phone number');
        }
        return decodedToken.phone_number;
    }
}
