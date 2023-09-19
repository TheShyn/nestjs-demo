import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";



export class AuthRegisterDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsNotEmpty()
    confirmPassword: string

    validatePasswordsMatch() {
        if (this.password !== this.confirmPassword) {
            throw new Error('Passwords do not match');
        }
    }
}