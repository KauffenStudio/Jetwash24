import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'JetWash24 <noreply@jetwash24.com>';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'jetwash24detailing@gmail.com';
