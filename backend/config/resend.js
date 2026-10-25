import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resend } from 'resend';

const backendDirectory = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(backendDirectory, '../.env.local') });
dotenv.config({ path: resolve(backendDirectory, '../.env') });

const getApiKey = () => process.env.RESEND_API_KEY?.trim();
const getFromAddress = () => process.env.RESEND_FROM_EMAIL?.trim();

let resendClient;

const getResendClient = () => {
  const apiKey = getApiKey();

  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
};

export const sendEmail = async ({ to, subject, html, from = getFromAddress() }) => {
  const resend = getResendClient();

  if (!resend) {
    throw new Error('Missing RESEND_API_KEY. Cannot send email.');
  }
  if (!from) {
    throw new Error('Missing RESEND_FROM_EMAIL. Cannot send email.');
  }
  if (!to || typeof to !== 'string') {
    throw new Error('A valid recipient email address is required.');
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    const errorMessage = error.message || 'Resend rejected the email request.';
    throw new Error(errorMessage);
  }

  return data;
};

export const checkEmailHealth = async () => {
  const resend = getResendClient();

  if (!resend) {
    return { status: 'error', message: 'RESEND_API_KEY not configured' };
  }
  if (!getFromAddress()) {
    return { status: 'error', message: 'RESEND_FROM_EMAIL not configured' };
  }

  const { error } = await resend.domains.list();
  if (error) {
    return { status: 'error', message: error.message || 'Resend authentication failed' };
  }

  return {
    status: 'healthy',
    message: 'Email service is operational via Resend API',
  };
};

export default getResendClient;
