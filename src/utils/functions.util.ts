import { BRAZIL_VALID_PHONE_DDD } from "./constants.util";

export const isValidPhoneNumber = (phone: string | undefined) => {
	if (!phone) return false;
	phone = phone.replace(/\D/g, "");
	if (phone.length !== 13) return false;
	if (Number.parseInt(phone.substring(4, 5)) !== 9) return false;
	if (new Set(phone).size === 1) return false;
	if (BRAZIL_VALID_PHONE_DDD.indexOf(Number.parseInt(phone.substring(2, 4))) === -1) return false;

	return true;
};

export const isValidCPF = (cpf: string | undefined) => {
	if (!cpf) return false;
	cpf = cpf.replace(/\D/g, "");
	if (cpf.length !== 11) return false;
	if (new Set(cpf).size === 1) return false;

	return true;
};

export const isValidBirthDate = (birthDate: string | undefined) => {
	if (!birthDate) return false;

	const cleanedDate = birthDate.replace(/\D/g, "");

	if (cleanedDate.length !== 8) return false;

	const day = Number.parseInt(cleanedDate.substring(0, 2), 10);
	const month = Number.parseInt(cleanedDate.substring(2, 4), 10);
	const year = Number.parseInt(cleanedDate.substring(4, 8), 10);

	const currentYear = new Date().getFullYear();

	if (day < 1 || day > 31) return false;
	if (month < 1 || month > 12) return false;
	if (year < 1920 || year > currentYear) return false;

	const date = new Date(year, month - 1, day);
	if (date.getDate() !== day || date.getMonth() + 1 !== month || date.getFullYear() !== year) {
		return false;
	}

	return true;
};
