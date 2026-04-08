import { Injectable } from '@nestjs/common';
import { ResponseSignUpDto } from './dto/responseSignUp.dto';
import { RequestSignUpDto } from './dto/requestSignUp.dto';
import { PasswordService } from './password.service';
import { nanoid } from 'nanoid';
import { AppException } from 'src/common/exceptions/app.exception';
import { ErrorCode } from 'src/common/exceptions/error-code';
import { UserService } from 'src/user/user.service';
import { ResponseLogInDto } from './dto/responseLogIn.dto';
import { RequestLogInDto } from './dto/requestLogIn.dto';

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

    async logIn(dto:RequestLogInDto):Promise<ResponseLogInDto>{
        //1.email로 user 조회
        const user = await this.userService.getUserWithPasswordByEmail(dto);
        //2.user 없으면 예외(USER_NOT_FOUND)
        if(!user){
            throw new AppException({
                message : '입력하신 email 에 해당하는 회원은 없습니다.',
                errorCode : ErrorCode.USER_NOT_FOUND
            })
        }
        //3.비밀번호 비교
        const isMatched = await this.passwordService.compare(dto.password,user.passwordHash);
        //4.틀리면 예외(INVALID_PASSWORD)
        if(!isMatched){
            throw new AppException({
                message : '비밀번호가 일치하지 않습니다.',
                errorCode : ErrorCode.INVALID_PASSWORD
            })
        }
        //5.성공시 USER 반환
        return {
            id:user.id,
            email: user.email,
            nickname:user.nickname
        };
    }

}
