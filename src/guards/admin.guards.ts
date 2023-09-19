import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ResponseException } from "src/exception/common.exception";



@Injectable()
export class AuthAdmin implements CanActivate {
    constructor(private jwtService: JwtService) {

    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const bearer = request?.headers?.authorization
        const token = bearer?.split(" ")?.[1]

        if (!bearer || !token) {
            throw new ResponseException(HttpStatus.UNAUTHORIZED, "Token not found")
        }

        const decode = this.jwtService.verify(token, {
            secret: process.env.SECRET_CODE
        })
        console.log(decode, "decode")
        if (decode.email !== 'test1234@gmail.com') {
            throw new ResponseException(HttpStatus.UNAUTHORIZED, "You do not have permission to do this")
        }
        return true
    }
}