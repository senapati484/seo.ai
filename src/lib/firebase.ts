/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection name for user reports
const REPORTS_COLLECTION = "userReports";

// Interface for report data
export interface ReportData {
    walletAddress: string;
    hash: string;
    timestamp: string;
    cid?: string;
    ipfsUrl?: string;
    txHash?: string;
    blockNumber?: number;
    network?: any;
    // Add other fields you want to store
}

// Store a new report for a user
export const addUserReport = async (reportData: ReportData) => {
    try {
        const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
            ...reportData,
            createdAt: new Date().toISOString()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding report: ", error);
        const message = (typeof error === 'object' && error && 'message' in error) ? String((error as { message?: unknown }).message) : 'Failed to add report';
        return { success: false, error: message };
    }
};

// Get all reports for a specific wallet address
export const getUserReports = async (walletAddress: string) => {
    try {
        const q = query(
            collection(db, REPORTS_COLLECTION),
            where("walletAddress", "==", walletAddress)
        );

        const querySnapshot = await getDocs(q);
        const reports: any[] = [];

        querySnapshot.forEach((doc) => {
            reports.push({ id: doc.id, ...doc.data() });
        });

        // Sort client-side by createdAt desc to avoid composite index requirement
        reports.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
        return { success: true, reports };
    } catch (error) {
        console.error("Error getting reports: ", error);
        const message = (typeof error === 'object' && error && 'message' in error) ? String((error as { message?: unknown }).message) : 'Failed to get reports';
        return { success: false, error: message };
    }
};

// Get a specific report by hash
export const getReportByHash = async (hash: string) => {
    try {
        const q = query(
            collection(db, REPORTS_COLLECTION),
            where("hash", "==", hash)
        );

        const querySnapshot = await getDocs(q);
        const reports: any[] = [];

        querySnapshot.forEach((doc) => {
            reports.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, reports: reports.length > 0 ? reports[0] : null };
    } catch (error) {
        console.error("Error getting report by hash: ", error);
        const message = (typeof error === 'object' && error && 'message' in error) ? String((error as { message?: unknown }).message) : 'Failed to get report by hash';
        return { success: false, error: message };
    }
};

// Real-time listener for user reports
export const onUserReportsChange = (walletAddress: string, callback: (reports: any[]) => void) => {
    const q = query(
        collection(db, REPORTS_COLLECTION),
        where("walletAddress", "==", walletAddress)
    );

    return onSnapshot(q, (querySnapshot) => {
        const reports: any[] = [];
        querySnapshot.forEach((d) => {
            reports.push({ id: d.id, ...d.data() });
        });
        // Sort client-side by createdAt desc
        reports.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
        callback(reports);
    });
};