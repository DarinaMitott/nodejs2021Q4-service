import { PORT } from './common/config';
import { app } from './app';

app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
