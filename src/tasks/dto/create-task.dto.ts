import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../tasks.model";

export class CreateTaskDto {
    @IsNotEmpty({
        message: "Title should be not empty"
    })
    title: string;

    @IsNotEmpty()
    description: string
}

export class UpdateTaskDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsEnum(TaskStatus)
    status: TaskStatus
}