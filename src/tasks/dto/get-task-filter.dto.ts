import { IsEnum, IsOptional } from "class-validator";
import { TaskStatus } from "../tasks.model";

export class GetTaskFilterDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    search?: string
}

