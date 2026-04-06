import * as bcrypt from 'bcrypt';

export class PasswordService {
    async createHash(password: string): Promise<string> {
        //bcrypt.hash(평문, 솔트)
        return await bcrypt.hash(password, 10);
    }
    async compare(password: string, hash: string): Promise<boolean> {
        //bcrypt.compare(평문, 해시)
        return await bcrypt.compare(password, hash);
    }
}