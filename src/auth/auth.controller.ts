import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post("/register")
    registerUser(@Body() authRegisterdto: AuthRegisterDto) {
        return this.authService.registerUser(authRegisterdto)
    }


    @Post("/login")
    async signInUser(@Body() authLoginDto: AuthLoginDto, @Res() res: Response) {
        const data = await this.authService.signIn(authLoginDto, res)
        return res.status(HttpStatus.OK).send(data);
    }

}
