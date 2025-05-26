// import { CompactEncrypt, generateKeyPair, compactDecrypt } from 'jose';
// import { TextEncoder, TextDecoder } from 'util';
// import { randomUUID } from 'node:crypto';

// // Generate key pair for RSA encryption
// const { publicKey, privateKey } = await generateKeyPair('RSA-OAEP-256');

// // Define your payload
// const payload = { userId: randomUUID(), name: 'alex', email: 'aleexgvieira@gmail.com', role: 'admin', subscription: { active: true } };
// const encoder = new TextEncoder();
// const encodedPayload = encoder.encode(JSON.stringify(payload));

// // Encrypt the payload using CompactEncrypt
// const token = await new CompactEncrypt(encodedPayload)
// 	.setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
// 	.encrypt(Bun.env.JWE_PUBLIC_KEY);

// console.log("Encrypted JWE:", token);

// // Decrypt the token using compactDecrypt (since it’s a compact JWE)
// const { plaintext } = await compactDecrypt(token, Bun.env.JWE_PRIVATE_KEY);
// const decodedPayload = new TextDecoder().decode(plaintext);

// // Parse and log the payload
// console.log("Decrypted payload:", JSON.parse(decodedPayload));


import { CompactEncrypt, compactDecrypt, importSPKI, importPKCS8 } from 'jose';
import { TextEncoder, TextDecoder } from 'util';
import { randomUUID } from 'node:crypto';

async function getKeyPairFromEnv() {
	const publicKey = await importSPKI(Bun.env.JWE_PUBLIC_KEY as string, 'RSA-OAEP-256');
	const privateKey = await importPKCS8(Bun.env.JWE_PRIVATE_KEY as string, 'RSA-OAEP-256');
	return { publicKey, privateKey };
}

async function encryptAndDecrypt() {
	const { publicKey, privateKey } = await getKeyPairFromEnv();

	const payload = { userId: randomUUID(), name: 'alex', email: 'aleexgvieira@gmail.com', role: 'admin', subscription: { active: true } };
	const encoder = new TextEncoder();
	const encodedPayload = encoder.encode(JSON.stringify(payload));

	const token = await new CompactEncrypt(encodedPayload)
		.setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
		.encrypt(publicKey);

	console.log("Encrypted JWE:", token);

	const { plaintext } = await compactDecrypt(token, privateKey);
	const decodedPayload = new TextDecoder().decode(plaintext);

	console.log("Decrypted payload:", JSON.parse(decodedPayload));
}

encryptAndDecrypt();
