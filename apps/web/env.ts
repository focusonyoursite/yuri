import { keys as cms } from '@repo/cms/keys';
import { keys as flags } from '@repo/feature-flags/keys';
import { keys as core } from '@repo/next-config/keys';
import { keys as observability } from '@repo/observability/keys';
import { keys as rateLimit } from '@repo/rate-limit/keys';
import { keys as security } from '@repo/security/keys';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  extends: [
    cms(),
    core(),
    observability(),
    flags(),
    security(),
    rateLimit(),
  ],
  server: {
    IMPROVMX_API_KEY: z.string(),
    IMPROVMX_FROM: z.string().email(),
    GOOGLE_CLIENT_EMAIL: z.string().email(),
    GOOGLE_PRIVATE_KEY: z.string(),
    GOOGLE_CALENDAR_ID: z.string(),
    GOOGLE_CALENDAR_EMAIL: z.string().email(),
  },
  client: {},
  runtimeEnv: {
    IMPROVMX_API_KEY: process.env.IMPROVMX_API_KEY,
    IMPROVMX_FROM: process.env.IMPROVMX_FROM,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
    GOOGLE_CALENDAR_EMAIL: process.env.GOOGLE_CALENDAR_EMAIL,
  },
});
