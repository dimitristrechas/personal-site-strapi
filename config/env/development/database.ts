export default ({ env }) => ({
	connection: {
		client: 'postgres',
		connection: {
		host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', 5432),
			database: env('DATABASE_NAME', 'personal_site_strapi'),
			user: env('DATABASE_USERNAME', 'dtrechas'),
			password: env('DATABASE_PASSWORD', '2CeK728W'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});
