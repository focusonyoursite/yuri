import { google } from 'googleapis';
import { env } from '@/env';

const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.JWT(
    env.GOOGLE_CLIENT_EMAIL,
    undefined,
    env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  )
});

export const addEventToCalendar = async (
  name: string,
  email: string,
  phone: string | undefined,
  date: string,
  time: string,
  notes: string | undefined
) => {
  const startDateTime = new Date(`${date}T${time}`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 uur sessie

  const event = {
    summary: `Massage sessie - ${name}`,
    description: `
Klant: ${name}
E-mail: ${email}
${phone ? `Telefoon: ${phone}` : ''}
${notes ? `Opmerkingen: ${notes}` : ''}
    `.trim(),
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Europe/Amsterdam',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Europe/Amsterdam',
    },
    attendees: [
      { email },
      { email: env.GOOGLE_CALENDAR_EMAIL }
    ],
  };

  try {
    const response = await calendar.events.insert({
      calendarId: env.GOOGLE_CALENDAR_ID,
      requestBody: event,
      sendUpdates: 'all', // Stuur e-mails naar alle deelnemers
    });

    return { eventId: response.data.id };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
}; 