import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * 토큰이 유효한지 검사
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //토큰을 어디서 추출할지
      ignoreExpiration: false, //만료 허용 여부
      secretOrKey: process.env.JWT_SECRET!, //토큰 검증 시 사용할 시크릿 키
    });
  }
  async validate(payload: any) {
    return {
      id: payload.userId,
      email: payload.email,
      nickname: payload.nickname,
    };
  }
}
