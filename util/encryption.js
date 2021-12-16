import bcrypt from "bcrypt";

const saltRounds = 12;

export async function encrypt(password) {
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    return encryptedPassword;
};




