import * as jwt from "jsonwebtoken";
import UsersRepository from "src/repositories/users.repository";
import { ErrorsMessages } from "src/utils/errors-messages.util";
import { compactDecrypt } from "jose";
import { TextDecoder } from "util";
import { getJWEKeysFromEnv } from "src/utils/get-jwe-keys-from-env.util";

const ValidateHeaderAuthorizationBearerTokenMiddleware = async ({ bearer, set }: any) => {
	try {
		if (!bearer) {
			set.status = 401;
			set.headers["WWW-Authenticate"] = `Bearer realm='sign', error="invalid_request"`;

			return {
				success: false,
				error: ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_REQUIRED,
			};
		}

		const { JWE_PRIVATE_KEY } = await getJWEKeysFromEnv();

		// const jwtDecoded = jwt.verify(bearer, Bun.env.JWT_SECRET as string) as jwt.JwtPayload;

		const { plaintext } = await compactDecrypt(bearer, JWE_PRIVATE_KEY);
		const decodedJWE = JSON.parse(new TextDecoder().decode(plaintext));

		const userFoundAndJwtValidated = await new UsersRepository().findByEmail(decodedJWE.user_email);

		if (!userFoundAndJwtValidated) {
			set.status = 401;
			return {
				success: false,
				error: ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_INVALID,
			};
		}
	} catch (error: any) {
		set.status = 401;
		return {
			success: false,
			error: error.message,
		};
	}
};

export default ValidateHeaderAuthorizationBearerTokenMiddleware;
