import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestSignUpDto } from './dto/requestSignUp.dto';
import { ResponseSignUpDto } from './dto/responseSignUp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() dto:RequestSignUpDto):Promise<ResponseSignUpDto>{
        return this.authService.signUp(dto);
    }



    
}
