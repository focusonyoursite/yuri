'use server';

import { env } from '@/env';
import { parseError } from '@repo/observability/error';

export const contact = async (
  name: string,
  email: string,
  message: string
): Promise<{
  error?: string;
}> => {
  try {
    // Stuur e-mail via ImprovMX
    const response = await fetch('https://api.improvmx.com/v3/emails/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(env.IMPROVMX_API_KEY).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.IMPROVMX_FROM,
        to: env.IMPROVMX_FROM,
        subject: 'Nieuw bericht via contactformulier',
        text: `Naam: ${name}\nE-mail: ${email}\nBericht: ${message}`,
        replyTo: email
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return {};
  } catch (error) {
    const errorMessage = parseError(error);
    return { error: errorMessage };
  }
}; 