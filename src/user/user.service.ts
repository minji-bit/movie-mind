import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { RequestGetUserDto } from './dto/requestGetUser.dto';
import { ResponseGetUserDto } from './dto/responseGetUser.dto';
import { UserCreateInputDto } from './dto/userCreateInput.dto';
import { ResponseCreateUserDto } from './dto/responseCreateUser.dto';
import {RequestLogInDto} from 'src/auth/dto/requestLogIn.dto';
import { ResponseGetUserPassword } from './dto/responseGetUserPass.dto';

@Injectable()
export class UserService {
    constructor(private readonly db: PrismaService){}

    async getUserByEmail(dto: RequestGetUserDto) : Promise< ResponseGetUserDto| null>{
        const user = await this.db.user.findUnique({
            where: {
                email: dto.email,
            },
            select:{
                id: true,
                email:true,
                nickname :true
            }
        });
        if(!user){
            return null;
        }
        return user;
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
    

    async getUserWithPasswordByEmail(dto : RequestLogInDto) :Promise<ResponseGetUserPassword|null>{
        const user = await this.db.user.findUnique({
            where:{
                email:dto.email
            },
            select:{
                id:true,
                email: true,
                nickname:true,
                passwordHash :true,
            }
        });
        return user;
    }

  


    
}
