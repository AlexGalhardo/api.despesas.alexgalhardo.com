import { PrismaClient } from "@prisma/client";
import Bcrypt from "../src/utils/bcrypt.util";

const prisma = new PrismaClient({
	errorFormat: "pretty",
});

const seedDatabase = async () => {
	await prisma.user.deleteMany({});
	await prisma.expense.deleteMany({});

	await prisma.user.createMany({
		data: [
			{
				name: "Alex",
				email: "aleexgvieira@gmail.com",
				password: await Bcrypt.hash("alexQWE!123"),
				reset_password_token: null,
				reset_password_token_expires_at: null,
				created_at: new Date(),
				updated_at: null,
			},
		],
		skipDuplicates: true,
	});
};

seedDatabase();
