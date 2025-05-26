import { allowedAddressCountriesValues, allowedAddressStatesValues } from "src/utils/constants.util";
import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";
import { isValidBirthDate, isValidPhoneNumber } from "src/utils/functions.util";

export const UserUpdateValidator = z.object({
	name: z.string().min(4, "name must be at least 4 characters long"),
	password: z
		.string()
		.min(8, "password must be at least 8 characters long")
		.refine((val) => /[A-Z]/.test(val), "password must contain at least one uppercase letter")
		.refine((val) => /[a-z]/.test(val), "password must contain at least one lowercase letter")
		.refine((val) => /[0-9]/.test(val), "password must contain at least one number")
		.refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "password must contain at least one special character"),
	phone_number: z.string().refine(isValidPhoneNumber, "Invalid phone number").optional(),
	cpf: z
		.string()
		.length(11, "customer.documentCpf must have exactly 11 characters")
		.refine(cpf.isValid, "customer.documentCpf is invalid"),
	birth_date: z.string().refine(isValidBirthDate, "Invalid birth date").optional(),
	address: z.object({
		street_name: z.string().min(1, "Street name is required.").optional(),
		cep: z
			.string()
			.transform((value) => value.replace(/\D/g, ""))
			.refine((value) => /^\d{8}$/.test(value), "CEP must be 8 digits.")
			.optional(),
		street_complement: z.string().optional(),
		street_number: z.number().optional(),
		neighborhood: z.string().min(1, "Neighborhood is required.").optional(),
		city: z.string().min(1, "City is required.").optional(),
		state: z.enum(allowedAddressStatesValues, { errorMap: () => ({ message: "Invalid address.state value" }) }),
		country: z.enum(allowedAddressCountriesValues, {
			errorMap: () => ({ message: "Invalid address.country value" }),
		}),
	}),
});
