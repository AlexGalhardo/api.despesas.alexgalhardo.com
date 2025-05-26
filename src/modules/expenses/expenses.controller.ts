import ExpenseCreateUseCase from "src/modules/expenses/use-cases/expense-create.use-case";
import ExpenseDeleteUseCase from "src/modules/expenses/use-cases/expense-delete.use-case";
import ExpenseGetAllUseCase from "src/modules/expenses/use-cases/expense-get-all.use-case";
import ExpenseGetByIdUseCase from "src/modules/expenses/use-cases/expense-get-by-id.use-case";
import ExpenseUpdateUseCase from "src/modules/expenses/use-cases/expense-update.use-case";
import ExpenseGetStatisticsUseCase from "src/modules/expenses/use-cases/expenses-get-statistics.use-case";
import { compactDecrypt } from "jose";
import { TextDecoder } from "util";
import { getJWEKeysFromEnv } from "src/utils/get-jwe-keys-from-env.util";

export default class ExpensesController {
	static async getUserEmailFromAuthorizationBearerToken(bearerToken: string): Promise<string> {
		const { JWE_PRIVATE_KEY } = await getJWEKeysFromEnv();
		const { plaintext } = await compactDecrypt(bearerToken, JWE_PRIVATE_KEY);
		const decodedJWE = JSON.parse(new TextDecoder().decode(plaintext));
		return decodedJWE.user_email;
	}

	static async getAll({ bearer, set }) {
		try {
			const { success, ...rest } = await new ExpenseGetAllUseCase().execute({
				user_email: await ExpensesController.getUserEmailFromAuthorizationBearerToken(bearer),
			});
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}

	static async getStatistics({ bearer, set }) {
		try {
			const { success, ...rest } = await new ExpenseGetStatisticsUseCase().execute({
				user_email: await ExpensesController.getUserEmailFromAuthorizationBearerToken(bearer),
			});
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}

	static async getById({ bearer, params: { id }, set }) {
		try {
			const { success, ...rest } = await new ExpenseGetByIdUseCase().execute({
				id,
				user_email: await ExpensesController.getUserEmailFromAuthorizationBearerToken(bearer),
			});
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}

	static async create({ bearer, body, set }) {
		console.log("chegou no create expense -> ", bearer, body);
		try {
			if (body?.password !== Bun.env.CREATE_EXPENSE_PASSWORD) {
				throw new Error('Invalid password')
			}
			const { success, ...rest } = await new ExpenseCreateUseCase().execute({
				user_email: 'aleexgvieira@gmail.com',
				...body,
			});
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}

	static async update({ bearer, params: { id }, body: { description, category, amount }, set }) {
		try {
			const { success, ...rest } = await new ExpenseUpdateUseCase().execute({
				user_email: await ExpensesController.getUserEmailFromAuthorizationBearerToken(bearer),
				id,
				description,
				category,
				amount,
			});
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}

	static async delete({ bearer, params: { id }, set }) {
		try {
			const { success, ...rest } = await new ExpenseDeleteUseCase().execute({
				id,
				user_email: await ExpensesController.getUserEmailFromAuthorizationBearerToken(bearer),
			});
			return { success, ...rest };
		} catch (error: any) {
			set.status = 400;
			return {
				success: false,
				error: error.issues ?? error.message,
			};
		}
	}
}
