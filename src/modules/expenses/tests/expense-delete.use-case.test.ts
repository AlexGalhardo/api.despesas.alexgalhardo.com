import { afterAll, describe, expect, it } from "bun:test";
import { ExpenseCategory } from "@prisma/client";
import UsersRepository from "../../../repositories/users.repository";
import { app } from "../../../server";
import { faker } from "@faker-js/faker";

describe("...Testing Expense Delete Use Case", () => {
	it("should delete expense using user owner jwt token", async () => {
		const user = {
			name: faker.internet.userName(),
			email: faker.internet.email(),
			password: "testsignupQWE!123",
		};

		const responseSignup: any = await app
			.handle(
				new Request("http://localhost/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(user),
				}),
			)
			.then((res) => res.json());

		expect(responseSignup.success).toBeTrue();
		expect(responseSignup.data.name).toBe(user.name);
		expect(responseSignup.data.email).toBe(user.email);
		expect(responseSignup.data.jwt_token).toBeString();

		const expense = {
			description: "creating new expense for delete test",
			category: ExpenseCategory.SHOP,
			amount: 20000,
		};

		const responseExpenseCreated: any = await app
			.handle(
				new Request("http://localhost/expenses", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${responseSignup.data.jwt_token}`,
					},
					body: JSON.stringify(expense),
				}),
			)
			.then((res) => res.json());

		expect(responseExpenseCreated.success).toBeTrue();
		expect(responseExpenseCreated.data).toStrictEqual({
			...responseExpenseCreated.data,
			id: expect.any(String),
			user_email: user.email,
			created_at: expect.any(String),
			updated_at: expect.any(String),
		});

		const responseExpenseDeleted: any = await app
			.handle(
				new Request(`http://localhost/expenses/${responseExpenseCreated.data.id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${responseSignup.data.jwt_token}`,
					},
				}),
			)
			.then((res) => res.json());

		expect(responseExpenseDeleted.success).toBeTrue();

		afterAll(async () => {
			await new UsersRepository().delete(responseSignup.data.id);
		});
	});
});
