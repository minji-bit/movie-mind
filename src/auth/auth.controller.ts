import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestSignUpDto } from './dto/requestSignUp.dto';
import { ResponseSignUpDto } from './dto/responseSignUp.dto';
import { RequestLogInDto } from './dto/requestLogIn.dto';
import { ResponseLogInDto } from './dto/responseLogIn.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from 'src/type';
import { ResponseGetMeDto } from './dto/responseGetMe.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: RequestSignUpDto): Promise<ResponseSignUpDto> {
    return this.authService.signUp(dto);
  }

  @Post('login')
  async logIn(@Body() dto: RequestLogInDto): Promise<ResponseLogInDto> {
    return this.authService.logIn(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any): Promise<ResponseGetMeDto> {
    console.log(req.user);
    return req.user;
  }
}
