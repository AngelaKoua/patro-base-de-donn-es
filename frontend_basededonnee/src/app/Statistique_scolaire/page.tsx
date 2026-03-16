"use client";
import dynamic from 'next/dynamic';
const StatistiqueScolaireComponent = dynamic(() => import('./StatistiqueScolaireComponent'), { ssr: false });
export default StatistiqueScolaireComponent;

