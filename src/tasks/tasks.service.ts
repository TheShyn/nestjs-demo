import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity';
import { TaskStatus, Tasks } from './tasks.model';
import { Response } from 'express';

@Injectable()
export class TasksService {
    // private tasks: Tasks[] = []
    constructor(@InjectRepository(Task) private taskRespository: Repository<Task>) {
    }
    async getTaskById(id: string): Promise<Tasks> {
        const found = await this.taskRespository.findOne({
            where: {
                id: id
            }
        })

        if (!found) {
            throw new NotFoundException()
        }
        return found
    }


    async createTask(createTaskDto: CreateTaskDto): Promise<Tasks> {
        const { title, description } = createTaskDto

        const task = this.taskRespository.create({
            title,
            description,
            status: TaskStatus.OPEN
        })
        await this.taskRespository.save(task)
        return task
    }


    async getTaskFilter(getTaskFilterDto: GetTaskFilterDto): Promise<Tasks[]> {
        const { search, status } = getTaskFilterDto

        const query = this.taskRespository.createQueryBuilder("tasks")

        if (status) {
            query.andWhere('tasks.status = :status', { status })
        }
        if (search) {
            query.andWhere('tasks.title = :title', { search })

        }
        const tasks = await query.getMany()
        return tasks
    }

    async getAllTask(): Promise<Tasks[]> {
        const tasks = await this.taskRespository.find()
        return tasks
    }

    async removeTask(id: string): Promise<void> {
        const found = await this.taskRespository.findOne({
            where: {
                id: id
            }
        })

        if (!found) {
            throw new NotFoundException()
        }
        await this.taskRespository.delete({ id: id })
    }

    async updateTask(updateTaskDto: UpdateTaskDto, id: string): Promise<Tasks> {
        const { status } = updateTaskDto
        const task = await this.getTaskById(id)
        task.status = status
        await this.taskRespository.save(task)
        console.log(task)
        return task
    }

    async postImgTask(file: Express.Multer.File) {
        console.log(file)
    }


}
