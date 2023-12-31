import { UserRepository } from 'src/user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupForm, UpdatePasswordForm } from './data/user.form';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './data/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // 전체 유저 조회
  async getAllUser() {
    // console.log(this.userRepository2.getAll());
    const users = await this.userRepository.getAll();
    console.log(users);
    // const userDtos = users.map((user) => new UserDto(user));
    // return userDtos;
  }

  // 유저 조회 =================
  async findById(id: number) {
    const user = await this.userRepository.findOneById(id);
    if (!user) throw new UnauthorizedException('유저가 존재하지 않습니다.');
    return new UserDto(user);
  }

  // 유저 조회 (로그인용)
  async findByEmail(email: string) {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) return null;
    return user;
  }

  async findByNickName(nickName: string) {
    const user = await this.userRepository.findOneByNickName(nickName);
    if (!user) throw new UnauthorizedException('유저가 존재하지 않습니다.');
    return new UserDto(user);
  }

  // 회원가입
  create(newUser: User) {
    newUser = {
      ...newUser,
      password: bcrypt.hashSync(newUser.password, 10),
    };
    this.userRepository.save(newUser);
  }

  // 유저 정보 수정
  async updateById(id: number, signupForm: SignupForm) {
    const user = await this.userRepository.findOneById(id);
    if (!user) return null;
    const newUser = {
      ...user,
      ...signupForm,
    };
    this.userRepository.save(newUser);
    return new UserDto(newUser);
  }

  // 유저 삭제
  async deleteById(id: number) {
    const user = await this.userRepository.findOneById(id);
    this.userRepository.remove(user);
  }

  async updatePassword(updatePasswordForm: UpdatePasswordForm) {
    const { email, password, prevPassword } = updatePasswordForm;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('이메일이 존재하지 않습니다.');
    }
    const isMatch = bcrypt.compareSync(prevPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    const newUser = {
      ...user,
      password: bcrypt.hashSync(password, 10),
    };
    this.userRepository.save(newUser);
  }
}
