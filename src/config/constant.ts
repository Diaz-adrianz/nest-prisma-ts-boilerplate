export const constant = {
	JWT_ACCESS_EXP: 15 * 30, // 15 minutes
	JWT_REFRESH_EXP: 30 * 24 * 60 * 60, // 30 days
	RT_KEY_IN_COOKIE: 'rt',
	DECORATORS: {
		AUTH_PUBLIC: 'auth_public',
		AUTH_FEATURE: 'auth_feature',
	},
};
