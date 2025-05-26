import { randomUUID } from "node:crypto";
import type { User } from "@prisma/client";
import RabbitMQ from "src/config/rabbitmq.config";
// // import { redis } from "src/config/redis.config";
import { AuthSignupValidator } from "src/validators/auth-signup.validator";
import UsersRepository, { type UsersRepositoryPort } from "../../../repositories/users.repository";
import Bcrypt from "../../../utils/bcrypt.util";
import { getJWEKeysFromEnv } from "src/utils/get-jwe-keys-from-env.util";
import { CompactEncrypt } from "jose";
import axios from "axios";

interface AuthSignupUseCaseResponse {
	success: boolean;
	data?: User;
	error?: string;
}

export interface AuthSignupDTO {
	name: string;
	email: string;
	password: string;
	birth_date: string;
	cpf: string;
	phone_number: string;
	address: {
		street_name: string;
		street_number: string;
		street_complement: string;
		street_neighborhood: string;
		city: string;
		state: string;
		country: string;
		cep: string;
	};
}

export interface AuthSignupUseCasePort {
	execute(authSignupPayload: AuthSignupDTO): Promise<AuthSignupUseCaseResponse>;
}

export default class AuthSignupUseCase implements AuthSignupUseCasePort {
	constructor(
		private readonly usersRepository: UsersRepositoryPort = new UsersRepository(),
		private readonly rabbitMq = new RabbitMQ(),
	) { }

	async execute(authSignupPayload: AuthSignupDTO): Promise<AuthSignupUseCaseResponse> {
		try {
			AuthSignupValidator.parse(authSignupPayload);

			const emailAlreadyRegistred = await this.usersRepository.findByEmail(authSignupPayload.email);

			if (!emailAlreadyRegistred) {
				const { name, email, password, cpf, birth_date, phone_number, address } = authSignupPayload;

				const user_id = randomUUID();

				const { JWE_PUBLIC_KEY } = await getJWEKeysFromEnv();

				const payload = { user_id, user_name: name, user_email: email };
				const encoder = new TextEncoder();
				const encodedPayload = encoder.encode(JSON.stringify(payload));

				const jwe_token = await new CompactEncrypt(encodedPayload)
					.setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
					.encrypt(JWE_PUBLIC_KEY);

				const { data } = await axios.post(
					`${Bun.env.ASAAS_API_URL}/customers`,
					{
						name: name,
						cpfCnpj: cpf,
						email: email,
						phone: phone_number,
						mobilePhone: phone_number,
						address: address.street_name,
						addressNumber: address.street_number,
						province: address.street_neighborhood,
						postalCode: address.cep,
						externalReference: user_id,
						notificationDisabled: false,
					},
					{
						headers: {
							"Content-Type": "application/json",
							access_token:
								"$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwOTI5ODM6OiRhYWNoXzNhYjc1YWQ5LWU5MzItNDFhMy1iMmZmLWRiMTAzY2Q2YjIxZQ==",
						},
					},
				);

				const userCreated = await this.usersRepository.create({
					id: user_id,
					name,
					email,
					password: await Bcrypt.hash(password),
					cpf,
					phone_number,
					birth_date,
					jwe_token,
					asaas_customer_id: data.id,
					asaas_customer_response: JSON.stringify(data),
					subscription: {
						tier: {
							free: true,
							basic: false,
							pro: false,
						},
						starts_at: null,
						ends_at: null,
					},
					address,
				});

				if (userCreated) {
					// const savedInRedis = await redis.set(user_id, JSON.stringify({ ...userCreated }));

					// if (savedInRedis !== "OK") throw new Error("Failed to save in redis in AuthSignupUseCase");

					if (Bun.env.USE_RABBITMQ === "true") {
						await this.rabbitMq.sendMessageUserSignup(JSON.stringify(userCreated));
						// await this.rabbitMq.consumeMessages();
					}

					return { success: true, data: userCreated };
				}

				return { success: false, error: "User not created" };
			}

			return { success: false, error: "Email already registred" };
		} catch (error: any) {
			return { success: false, error: error.message };
		}
	}
}
