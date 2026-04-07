import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { RequestGetUserDto } from './dto/requestGetUser.dto';
import { ResponseGetUserDto } from './dto/responseGetUser.dto';
import { UserCreateInputDto } from './dto/userCreateInput.dto';
import { ResponseCreateUserDto } from './dto/responseCreateUser.dto';

@Injectable()
export class UserService {
    constructor(private readonly db: PrismaService){}

    async getUserByEmail(dto: RequestGetUserDto) : Promise< ResponseGetUserDto| null>{
        const user = await this.db.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if(!user){
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
        };
    }

    async createUser(data: UserCreateInputDto): Promise<ResponseCreateUserDto> {
        const user = await this.db.user.create({
            data: data,
            select: {
                id: true,
                email: true,
                nickname: true,
            },
        });
        return user;
    }


    
}
