import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthAdmin } from 'src/guards/admin.guards';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) {
    }

    @Get()
    getAllTasks(@Query() getTaskfilterDto: GetTaskFilterDto) {
        const { status, search } = getTaskfilterDto
        if (status || search) {
            return this.tasksService.getTaskFilter(getTaskfilterDto)
        }
        return this.tasksService.getAllTask()
    }


    @Get("/:id")
    getTaskById(@Param("id") id: string) {
        return this.tasksService.getTaskById(id)
    }

    @UseGuards(AuthAdmin)
    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.createTask(createTaskDto)
    }

    @Delete("/:id")
    deleteTask(@Param("id") id: string): Promise<void> {
        return this.tasksService.removeTask(id)
    }

    @Patch("/:id")
    updateTask(@Body() updateTaskDto: UpdateTaskDto, @Param("id") id: string) {
        return this.tasksService.updateTask(updateTaskDto, id)
    }

    @Post("fileUpload")
    @UseInterceptors(FileInterceptor("file"))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.tasksService.postImgTask(file)
    }




    // @Get()
    // getAllTask(@Query() filterDto: GetTaskFilterDto): Tasks[] {
    //     if (Object.keys(filterDto).length) {
    //         return this.tasksService.getTaskWithFilter(filterDto)
    //     }
    //     return this.tasksService.getAllTasks()
    // }

    // @Post()
    // createTask(
    //     @Body() createTaskDto: CreateTaskDto
    // ): Tasks {
    //     return this.tasksService.createTask(createTaskDto)
    // }


    // @Get("/:id")
    // getTaskById(@Param("id") id: string): Tasks {
    //     return this.tasksService.getTaskById(id)
    // }

    // @Delete("/:id")
    // deleteTask(@Param("id") id: string): string {
    //     return this.tasksService.deleteTask(id)
    // }


    // @Patch("/:id")
    // updateTask(@Body() updateTaskDto: UpdateTaskDto, @Param("id") id: string) {
    //     return this.tasksService.updateTask(updateTaskDto, id)
    // }




}
