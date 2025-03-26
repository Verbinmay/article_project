import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { PayloadCurrent } from '../app/decorators/payload.decorator';
import { PaginationQuery } from '../app/pagination/pagination-input.dto';
import { ResponseType } from '../app/utils/generate-response';
import { AccessTokenPayload } from '../auth/dto/access-token-payload.dto';
import { JwtAuthGuard } from '../auth/passport/guards/jwt-auth.guard';
import { NewArticleInputDto } from './dto/create-article-input.dto';
import { UpdateArticleInputDto } from './dto/update-article-input.dto';
import { CreateArticleCommand } from './use-cases/create-article-case';
import { DeleteArticleCommand } from './use-cases/delete-article-case';
import { GetArticleCommand } from './use-cases/get-article-case';
import { UpdateArticleCommand } from './use-cases/update-article-case';

@Controller('article')
export class ArticleController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post()
  async create(
    @Body() inputModel: NewArticleInputDto,
    @PayloadCurrent() payload: AccessTokenPayload,
  ) {
    const result: ResponseType = await this.commandBus.execute(
      new CreateArticleCommand(inputModel, payload),
    );
    return result;
  }
  //!Сомнительно, но окей
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result: ResponseType = await this.commandBus.execute(
      new DeleteArticleCommand(id),
    );

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleInputDto,
    @PayloadCurrent() payload: AccessTokenPayload,
  ) {
    const result: ResponseType = await this.commandBus.execute(
      new UpdateArticleCommand(id, updateArticleDto, payload),
    );
    return result;
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    const result: ResponseType = await this.commandBus.execute(
      new GetArticleCommand(query),
    );
    return result;
  }
}
