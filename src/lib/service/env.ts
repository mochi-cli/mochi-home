/**
 * Configuration, read once and complained about loudly.
 *
 * Every one of these is a secret or an address that differs per environment,
 * and a service that starts with half of them missing fails later, further
 * from the cause, usually in front of somebody trying to pay.
 */

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not set — ${where()}`);
  return value;
}

/**
 * Where to go and set it.
 *
 * Pointing at `.env.example` is useless on a deployed instance, where no such
 * file exists — and the deployed case has an extra step that is the actual
 * cause most of the time: variables added in a dashboard do not reach a
 * deployment that is already running. Saying so in the error saves the round
 * trip of setting it correctly and seeing the same message again.
 */
function where(): string {
  return process.env.VERCEL
    ? 'add it under Settings → Environment Variables (tick Production), then redeploy — ' +
        'a running deployment does not pick up new variables on its own'
    : 'see .env.example';
}

function optional(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

export const env = {
  /**
   * Public origin of this deployment, e.g. https://mochi-cli.com. Scheme and
   * host, no trailing slash and no path.
   *
   * Configured rather than read off the request, for two reasons. Google and
   * Polar hold these URLs already, and the redirect_uri sent to Google has to
   * match what is registered there exactly. And the Host header is attacker
   * controlled: building callback URLs from it is how a sign-in ends up
   * pointing at somebody else's machine.
   *
   * The site and the service are one deployment now, so this and
   * NEXT_PUBLIC_SITE_URL name the same origin. They fail quietly when they
   * disagree, which is why .env.local keeps them next to each other.
   */
  get origin() {
    return required('SERVICE_ORIGIN').replace(/\/$/, '');
  },

  get databaseUrl() {
    return required('DATABASE_URL');
  },

  get google() {
    return {
      clientId: required('GOOGLE_CLIENT_ID'),
      clientSecret: required('GOOGLE_CLIENT_SECRET'),
    };
  },

  get polar() {
    const servers = ['production', 'sandbox'] as const;
    const named = optional('POLAR_SERVER') ?? 'production';
    const server = servers.find((candidate) => candidate === named);
    if (!server) {
      throw new Error(`POLAR_SERVER must be "production" or "sandbox", not "${named}"`);
    }
    return {
      accessToken: required('POLAR_ACCESS_TOKEN'),
      /**
       * A getter, so it is demanded only where it is used.
       *
       * Registering the webhook needs a public URL, which does not exist until
       * the service is deployed — so there is a real window where everything
       * else is configured and this is not. Reading it eagerly would take
       * checkout down for the sake of an endpoint nobody is calling yet, and
       * the service is correct without webhooks anyway: they make the
       * subscription record fast, reconcile-on-read is what makes it right.
       *
       * The webhook route still refuses every delivery until this is set,
       * which is the only safe way to be unconfigured.
       */
      get webhookSecret() {
        return required('POLAR_WEBHOOK_SECRET');
      },
      /** Polar sells *products*, not prices — one per billing cadence. */
      productMonthly: required('POLAR_PRODUCT_MONTHLY'),
      productYearly: required('POLAR_PRODUCT_YEARLY'),
      /**
       * Sandbox is a wholly separate Polar instance with its own tokens and
       * its own product ids, so this is not a flag to flip casually — pointing
       * production at sandbox silently makes every paying customer free.
       */
      server,
    };
  },

  /**
   * How the entitlement claim is signed.
   *
   * `CLAIM_KMS_KEY` is the production answer: the private key is generated
   * inside Cloud KMS and never exists anywhere else, so there is no
   * environment variable to leak. `CLAIM_SIGNING_KEY` is a PKCS#8 PEM for
   * local development only — see claim.ts, which refuses to use it outside it.
   */
  get signing() {
    return {
      kid: required('CLAIM_KID'),
      kmsKey: optional('CLAIM_KMS_KEY'),
      localKey: optional('CLAIM_SIGNING_KEY'),
      /**
       * Credentials for reaching KMS. The Google libraries normally find these
       * by themselves, but only on Google's own infrastructure, where there is
       * a metadata server to ask. On Vercel there is not, so the service
       * account travels as JSON in an environment variable.
       *
       * This is not the thing the KMS argument was avoiding. What leaks here is
       * permission to *ask that one key for signatures* until it is revoked —
       * scoped to roles/cloudkms.signerVerifier on a single key, revocable in a
       * click, and it breaks no installed build. The private key itself still
       * cannot be carried away.
       */
      serviceAccount: optional('GOOGLE_SERVICE_ACCOUNT_JSON'),
    };
  },

  /**
   * How long a claim is believed. Days, not hours — see the README.
   *
   * Checked rather than trusted, because both ways of getting it wrong are
   * nasty. A non-numeric value makes `new Date(NaN).toISOString()` throw, at
   * signing time, in production, on the request of somebody who has just paid.
   * A zero or negative one is worse: every claim is born already expired, so
   * every customer is silently Free and it looks exactly like a working free
   * tier. The upper bound is there because a fat-fingered 3650 is far likelier
   * than a deliberate ten years, and this number is how long a cancelled
   * subscription keeps working.
   */
  /**
   * Per-plan limits to sign into a claim, or nothing.
   *
   * The point of these living here rather than in the app: the app's copy is a
   * constant compiled into every build, and with no auto-updater an installed
   * copy keeps it for as long as it is installed. Raising a limit that way is
   * slow and lowering one is impossible. Set here, it reaches every signed-in
   * machine on its next daily refresh, is believed offline until the claim
   * expires, and needs no release.
   *
   * Unset is the normal state and means "say nothing": the app then uses its
   * own shipped numbers. That is deliberate — an empty variable must not read
   * as zero, which would cut everybody off.
   *
   * A signed-out person has no claim, so nothing here reaches them. That is not
   * a hole to plug: an install nobody signed in to does not talk to us at all.
   */
  limitsFor(plan: 'free' | 'pro'): { mcpCallsPerWeek?: number | null; attachmentBytes?: number } | undefined {
    const upper = plan.toUpperCase();
    const limits: { mcpCallsPerWeek?: number | null; attachmentBytes?: number } = {};

    const calls = optional(`LIMIT_${upper}_MCP_CALLS_PER_WEEK`);
    if (calls !== undefined) {
      // "unlimited" spelled out, because an empty value already means "unset"
      // and the two must not collapse into each other.
      if (calls.trim().toLowerCase() === 'unlimited') limits.mcpCallsPerWeek = null;
      else {
        const n = Number(calls);
        if (!Number.isInteger(n) || n <= 0) {
          throw new Error(
            `LIMIT_${upper}_MCP_CALLS_PER_WEEK must be a positive whole number or "unlimited", not "${calls}"`
          );
        }
        limits.mcpCallsPerWeek = n;
      }
    }

    const mb = optional(`LIMIT_${upper}_ATTACHMENT_MB`);
    if (mb !== undefined) {
      const n = Number(mb);
      if (!Number.isInteger(n) || n <= 0) {
        throw new Error(`LIMIT_${upper}_ATTACHMENT_MB must be a positive whole number of MB, not "${mb}"`);
      }
      limits.attachmentBytes = n * 1024 * 1024;
    }

    return Object.keys(limits).length > 0 ? limits : undefined;
  },

  get claimLifetimeDays() {
    const raw = optional('CLAIM_LIFETIME_DAYS');
    if (raw === undefined) return 7;
    const days = Number(raw);
    if (!Number.isFinite(days) || days <= 0) {
      throw new Error(`CLAIM_LIFETIME_DAYS must be a positive number of days, not "${raw}"`);
    }
    if (days > 90) {
      throw new Error(
        `CLAIM_LIFETIME_DAYS of ${days} is longer than any grace period should be — ` +
          'it is also how long a cancelled subscription keeps Pro'
      );
    }
    return days;
  },

  get isProduction() {
    return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  },
};
