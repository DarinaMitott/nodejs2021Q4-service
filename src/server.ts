import { PORT } from './common/config';
import { app, initDb } from './app';
import { logger } from './logger';

initDb()
    .then(() => {
        app.listen(PORT, () =>
            logger.info(`App is running on http://localhost:${PORT}`)
        );
    })
