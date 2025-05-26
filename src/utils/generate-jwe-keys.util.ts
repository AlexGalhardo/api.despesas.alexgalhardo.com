import { generateKeyPair } from "jose";

async function createJWEKeys() {
	const { publicKey, privateKey } = await generateKeyPair("RSA-OAEP-256", {
		modulusLength: 2048,
		publicExponent: new Uint8Array([1, 0, 1]),
		extractable: true,
	});

	const publicKeyPEM = await exportKeyToPEM(publicKey, "spki", "PUBLIC");
	const privateKeyPEM = await exportKeyToPEM(privateKey, "pkcs8", "PRIVATE");

	console.log("\nAdd the following to your .env file:\n");
	console.log(`JWE_PUBLIC_KEY="${publicKeyPEM}"`);
	console.log(`JWE_PRIVATE_KEY="${privateKeyPEM}"`);
}

async function exportKeyToPEM(key, format, type) {
	const keyData = await crypto.subtle.exportKey(format, key);
	const exportedAsBase64 = Buffer.from(keyData).toString("base64");
	return `-----BEGIN ${type} KEY-----\n${exportedAsBase64.match(/.{1,64}/g).join("\n")}\n-----END ${type} KEY-----`;
}

createJWEKeys();
