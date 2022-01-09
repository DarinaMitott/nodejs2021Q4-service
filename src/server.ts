import { PORT } from './common/config';
import { app } from './app';
import { logger } from './logger';

app.listen(PORT, () =>
  logger.info(`App is running on http://localhost:${PORT}`)
);
