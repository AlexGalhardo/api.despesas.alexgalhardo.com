import { importSPKI, importPKCS8 } from "jose";

export async function getJWEKeysFromEnv(): Promise<{ JWE_PUBLIC_KEY: any; JWE_PRIVATE_KEY: any }> {
	const JWE_PUBLIC_KEY = await importSPKI(Bun.env.JWE_PUBLIC_KEY as string, "RSA-OAEP-256");
	const JWE_PRIVATE_KEY = await importPKCS8(Bun.env.JWE_PRIVATE_KEY as string, "RSA-OAEP-256");
	return { JWE_PUBLIC_KEY, JWE_PRIVATE_KEY };
}
