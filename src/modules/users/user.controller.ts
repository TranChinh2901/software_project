import { userService } from '@/modules/users/user.service';
import { Request, Response } from "express";
import { AppResponse } from "@/common/success.response";
import { HttpStatusCode } from "@/constants/status-code";
import { ErrorMessages, SuccessMessages } from "@/constants/message";
import { AppError } from "@/common/error.response";
import { ErrorCode } from "@/constants/error-code";
import { CreateUserDto, UserResponseDto } from "./dto/user.dto";
import { toUserResponseDto } from "./user.mapper";
import { User } from "./entity/user.entity";

class UserController {
  async getAll(req: Request, res: Response) {
    const result: User[] = await userService.getAll();

    const listUserDto: UserResponseDto[] = result.map((user: User) =>
      toUserResponseDto(user)
    );

    return new AppResponse({
      message: SuccessMessages.USER.USER_GET,
      statusCode: HttpStatusCode.OK,
      data: listUserDto,
    }).sendResponse(res);
  }

  async getById(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError(
        ErrorMessages.INVALID_ID,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.INVALID_PARAMS
      );
    }
    const user = await userService.getById(id);

    // Converts a User entity returned from the service to a UserResponseDto
    const userDto: UserResponseDto = toUserResponseDto(user);

    return new AppResponse({
      message: SuccessMessages.USER.USER_GET,
      statusCode: HttpStatusCode.OK,
      data: userDto,
    }).sendResponse(res);
  }


  async update(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError(
        ErrorMessages.INVALID_ID,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.INVALID_PARAMS
      );
    }

    const updateUserDto = req.body;
    const updatedUser = await userService.update(id, updateUserDto);
    const userDto: UserResponseDto = toUserResponseDto(updatedUser);

    return new AppResponse({
      message: SuccessMessages.USER.USER_UPDATED,
      statusCode: HttpStatusCode.OK,
      data: userDto,
    }).sendResponse(res);
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new AppError(
        ErrorMessages.INVALID_ID,
        HttpStatusCode.BAD_REQUEST,
        ErrorCode.INVALID_PARAMS
      );
    }

    await userService.delete(id);

    return new AppResponse({
      message: SuccessMessages.USER.USER_DELETED,
      statusCode: HttpStatusCode.OK,
      data: {},
    }).sendResponse(res);
  }
}

export default new UserController();