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
  },
  client: {},
  runtimeEnv: {
    IMPROVMX_API_KEY: process.env.IMPROVMX_API_KEY,
    IMPROVMX_FROM: process.env.IMPROVMX_FROM,
  },
});
