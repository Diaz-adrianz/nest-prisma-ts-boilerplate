export type TuserAuth = {
	id: string;
	username: string;
	email: string;
	client: TclientInfo;
};

export type TclientInfo = {
	ip?: string;
	device?: string;
	browser?: string;
	os?: string;
};

export type TjwtPayload = {
	sid: string;
	iss: string;
	iat: number;
	exp: number;
};
