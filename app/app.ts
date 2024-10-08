import {createApp} from 'https://deno.land/x/dropserver_app@v0.2.2/mod.ts';

import createRoutes from './routes.ts';

const app = createApp({
	routes: createRoutes,
	migrations: async () => {
		const {default: createMigrations} = await import('./migrations.ts');
		return createMigrations();
	}
});

export default app;