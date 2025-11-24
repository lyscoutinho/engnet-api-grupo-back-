import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { RelatorioService } from '../service/relatorio.service';
import { CreateRelatorioDto } from '../entity/dto/relatorio/CreateRelatorioDto';

@Controller('relatorios')
export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  @Post('reembolso/:reembolsoId')
  create(
    @Param('reembolsoId') reembolsoId: string,
    @Body() dto: CreateRelatorioDto,
  ) {
    return this.relatorioService.create(reembolsoId, dto);
  }

  @Get('reembolso/:reembolsoId')
  findAll(@Param('reembolsoId') reembolsoId: string) {
    return this.relatorioService.findAll(reembolsoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relatorioService.findOne(id);
  }

  @Get('reembolso/:reembolsoId/export-excel')
  async exportToExcel(
    @Param('reembolsoId') reembolsoId: string,
    @Res() res: Response,
  ) {
    const buffer = await this.relatorioService.exportToExcel(reembolsoId);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="reembolso-${reembolsoId}.xlsx"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relatorioService.remove(id);
  }
}