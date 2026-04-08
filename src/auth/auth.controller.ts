import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestSignUpDto } from './dto/requestSignUp.dto';
import { ResponseSignUpDto } from './dto/responseSignUp.dto';
import { RequestLogInDto } from './dto/requestLogIn.dto';
import { ResponseLogInDto } from './dto/responseLogIn.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() dto:RequestSignUpDto):Promise<ResponseSignUpDto>{
        return this.authService.signUp(dto);
    }

    @Post('login')
    async logIn(@Body() dto:RequestLogInDto):Promise<ResponseLogInDto>{
        return this.authService.logIn(dto);
    }


    



    
}
