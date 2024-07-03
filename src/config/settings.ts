export const settings = {
	isDev: () => process.env.MODE == 'development',
	log: {
		folder: 'logs/',
		filename: '%DATE%-app-log.log',
		filenameError: '%DATE%-app-error.log',
	},
};
