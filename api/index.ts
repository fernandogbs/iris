import type { Clock } from "../src/application/ports/Clock";
import { loadEnv } from "../src/infra/config/env";
import { createDatabaseClient } from "../src/infra/db/client";
import { createFactCheckRepository } from "../src/infra/db/factCheck.repository";
import { createGoogleFactCheckProvider } from "../src/infra/http/googleFactCheck.adapter";
import { createMlProvider } from "../src/infra/http/mlProvider.adapter";
import { createLogger } from "../src/infra/logging/logger";
import { createMetricsRegistry } from "../src/infra/metrics/registry";
import { createServer } from "../src/server";

const env = loadEnv();
const logger = createLogger(env);
const metrics = createMetricsRegistry();
const databaseClient = createDatabaseClient(env);

const clock: Clock = { now: () => new Date() };
const factCheckRepository = createFactCheckRepository(databaseClient);
const startedAt = Date.now();

const app = createServer({
  factProvider: createGoogleFactCheckProvider({
    apiKey: env.FACT_CHECK_API_KEY,
    languageCode: env.FACT_CHECK_LANGUAGE_CODE,
    logger,
    metrics,
    timeoutMs: env.HTTP_TIMEOUT_MS,
    url: env.FACT_CHECK_API_URL,
  }),
  mlProvider: createMlProvider({
    apiKey: env.ML_SERVICE_API_KEY,
    logger,
    metrics,
    timeoutMs: env.HTTP_TIMEOUT_MS,
    url: env.ML_SERVICE_URL,
  }),
  repository: factCheckRepository,
  clock,
  logger,
  metrics,
  checkDatabase: () => databaseClient.ping(),
  getUptimeMs: () => Date.now() - startedAt,
});

export default app;
