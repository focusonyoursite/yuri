'use server';

import { env } from '@/env';
import { parseError } from '@repo/observability/error';
import { addEventToCalendar } from '@/lib/google-calendar';

export const booking = async (
  name: string,
  email: string,
  phone: string | undefined,
  date: string,
  time: string,
  notes: string | undefined
): Promise<{
  error?: string;
}> => {
  try {
    // Voeg event toe aan Google Calendar
    await addEventToCalendar(name, email, phone, date, time, notes);

    // E-mail naar beheerder
    const adminResponse = await fetch('https://api.improvmx.com/v3/emails/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(env.IMPROVMX_API_KEY).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.IMPROVMX_FROM,
        to: env.IMPROVMX_FROM,
        subject: 'Nieuwe boeking ontvangen',
        text: `
Nieuwe boeking ontvangen:
Naam: ${name}
E-mail: ${email}
Telefoon: ${phone || 'Niet opgegeven'}
Datum: ${date}
Tijd: ${time}
Opmerkingen: ${notes || 'Geen'}`,
        replyTo: email
      })
    });

    if (!adminResponse.ok) {
      throw new Error('Failed to send admin notification email');
    }

    // Bevestigingsmail naar klant
    const clientResponse = await fetch('https://api.improvmx.com/v3/emails/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(env.IMPROVMX_API_KEY).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.IMPROVMX_FROM,
        to: email,
        subject: 'Bevestiging van je boeking',
        text: `
Beste ${name},

Bedankt voor je boeking! Hier zijn de details:

Datum: ${date}
Tijd: ${time}
${phone ? `Telefoon: ${phone}` : ''}
${notes ? `Opmerkingen: ${notes}` : ''}

Je ontvangt binnenkort een Google Calendar uitnodiging voor deze afspraak.
Ik neem zo snel mogelijk contact met je op om de afspraak te bevestigen.

Met vriendelijke groet,
Yuri Radomisli`
      })
    });

    if (!clientResponse.ok) {
      throw new Error('Failed to send confirmation email');
    }

    return {};
  } catch (error) {
    const errorMessage = parseError(error);
    return { error: errorMessage };
  }
}; 