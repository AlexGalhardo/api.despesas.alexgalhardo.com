import type { User } from "@prisma/client";
import UsersRepository, { type UsersRepositoryPort } from "../../../repositories/users.repository";
import { ErrorsMessages } from "../../../utils/errors-messages.util";

interface AuthLoginUseCaseResponse {
	success: boolean;
	data?: User;
	message?: string;
	error?: string;
}

interface CheckUserJewTokenDTO {
	user_id: string;
	user_email: string;
}

export interface AuthLoginUseCasePort {
	execute(payload: CheckUserJewTokenDTO): Promise<AuthLoginUseCaseResponse>;
}

export default class AuthCheckUserJweTokenUseCase implements AuthLoginUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort = new UsersRepository()) {}

	async execute({ user_id, user_email }: CheckUserJewTokenDTO): Promise<AuthLoginUseCaseResponse> {
		const userFound = await this.usersRepository.findByEmail(user_email);

		if (userFound) {
			if (userFound.id === user_id) return { success: true, data: userFound };
		}

		throw new Error(ErrorsMessages.USER_NOT_FOUND);
	}
}
