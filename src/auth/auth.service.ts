import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { Repository } from 'typeorm';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { User } from './auth.model';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ResponseException } from 'src/exception/common.exception';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from "express";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity) private authReponsitory: Repository<AuthEntity>,
        private jwtService: JwtService
    ) {

    }

    generateRefetchToken(userId: string, email: string) {
        return this.jwtService.sign(
            {
                userId,
                email
            },
            {
                secret: process.env.SECRET_CODE_REFETCH,
                expiresIn: "30d"
            }
        )
    }

    generateAccessToken(userId: string, email: string) {
        return this.jwtService.sign({
            userId,
            email
        }, {
            secret: process.env.SECRET_CODE,
            expiresIn: "1d"
        }
        )
    }

    async registerUser(authRegisterDto: AuthRegisterDto): Promise<{}> {
        const { email, password } = authRegisterDto

        const isExist = await this.authReponsitory.findOne({
            where: { email: email }
        })
        if (isExist) {
            throw new ResponseException(HttpStatus.BAD_REQUEST, "Email is exist")
        }
        const hashPassword = await bcrypt.hash(password, 10)

        const user = this.authReponsitory.create({ email, password: hashPassword });
        await this.authReponsitory.save(user)

        return {
            success: true,
            message: `Registration successful for ${user.email}`
        }
    }

    async signIn(authLoginDto: AuthLoginDto, res: Response): Promise<{}> {
        const { email, password } = authLoginDto
        const isUser = await this.authReponsitory.findOne({
            where: {
                email
            }
        })

        if (!isUser) {
            throw new ResponseException(HttpStatus.NOT_FOUND, "Email is not exist")
        }
        const checkPassword = await bcrypt.compare(password, isUser.password)
        if (!checkPassword) {
            throw new ResponseException(HttpStatus.BAD_REQUEST, "Password is incorrect")
        }
        const accessToken = this.generateAccessToken(isUser.id, isUser.email)
        const refreshToken = this.generateRefetchToken(isUser.id, isUser.email)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/"
        });

        isUser.password = undefined
        isUser.id = undefined

        return {
            success: true,
            message: "Login successfully ",
            data: isUser,
            accessToken

        }
    }

}
