
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }
  async createUser(CreateUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(CreateUserDto.password, 10)
    const user = await this.userRepository.create({
      ...CreateUserDto, password: hashPassword
    })
    return this.userRepository.save(user)
  }
  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundException('tai khoan khong ton tai')
    }
    //Khong cho update email
    if (dto.email) {
      throw new BadRequestException('Không được đổi email');
    }
    //Doi mat khau thi hash mat khau moi
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10)
    }
    Object.assign(user, dto)
    return this.userRepository.save(user)
  }
  async findAll(): Promise<User[]> {
    const user = await this.userRepository.find()
    return user
  }
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundException('tai khoan khong ton tai')
    }
    return user
  }
  async delete(id: string): Promise<void> {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException('tai khoan khong ton tai')
    }
    await this.userRepository.delete(id)

  }
  async findByEmail(email: string): Promise<User | null> {
  return this.userRepository.findOneBy({ email });
}

}
