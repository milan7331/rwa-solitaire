import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, HttpException, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User sucessfuly registered'
      }
    } catch(error) {
      if (error.code === '23505') {
        throw new HttpException({
            statusCode: HttpStatus.CONFLICT,
            message: 'User already exists!'
          }, HttpStatus.CONFLICT
        )
      }

      throw new HttpException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong!'
        }, HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
