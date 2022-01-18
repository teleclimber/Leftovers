import {createApp} from './deps.ts';

import createRoutes from './routes.ts';

const app = createApp({
	routes: createRoutes,
	migrations: async () => {
		const {default: createMigrations} = await import('./migrations.ts');
		return createMigrations();
	}
});

export default app;