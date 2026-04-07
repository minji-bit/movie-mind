import { Injectable } from '@nestjs/common';
import { ResponseSignUpDto } from './dto/responseSignUp.dto';
import { RequestSignUpDto } from './dto/requestSignUp.dto';
import { PasswordService } from './password.service';
import { nanoid } from 'nanoid';
import { AppException } from 'src/common/exceptions/app.exception';
import { ErrorCode } from 'src/common/exceptions/error-code';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor( private readonly passwordService: PasswordService, private readonly userService: UserService){}

    async signUp(dto: RequestSignUpDto):Promise<ResponseSignUpDto>{
        //1. 이메일 중복체크
        const existedUser = await this.userService.getUserByEmail(dto);
        //에러 처리
        if(existedUser){
            throw new AppException({
                message : '이메일이 이미 존재합니다.',
                errorCode : ErrorCode.EMAIL_ALREADY_EXISTS,
            });
        }

        //2. 비밀번호 해시 처리
        const hashedPassword = await this.passwordService.createHash(dto.password);
        //3. 사용자 생성(Prisma)
        const user = {
            id : '',
            email : dto.email,
            passwordHash : hashedPassword,
            nickname : dto.nickname,
        }
        //4. id 생성전략 적용(nanoid 등)
        user.id = nanoid();
        return this.userService.createUser(user);
    }

}
