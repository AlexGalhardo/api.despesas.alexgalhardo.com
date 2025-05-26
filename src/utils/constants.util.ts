export const using_database = Bun.env.USE_JSON_DATABASE === "true" ? "JSON" : "PostgreSQL";

export const currentYear = new Date().getFullYear();

export const BRAZIL_VALID_PHONE_DDD = [
	11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
	49, 51, 53, 54, 55, 61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89,
	91, 92, 93, 94, 95, 96, 97, 98, 99,
];

export const allowedAddressStatesValues = [
	"AC",
	"AL",
	"AP",
	"AM",
	"BA",
	"CE",
	"DF",
	"ES",
	"GO",
	"MA",
	"MT",
	"MS",
	"MG",
	"PA",
	"PB",
	"PR",
	"PE",
	"PI",
	"RJ",
	"RN",
	"RS",
	"RO",
	"RR",
	"SC",
	"SP",
	"SE",
	"TO",
] as const;

export const allowedAddressCountriesValues = ["BR", "US", "CA", "MX", "AR", "CL", "CO", "ES", "IT", "UK"] as const;
