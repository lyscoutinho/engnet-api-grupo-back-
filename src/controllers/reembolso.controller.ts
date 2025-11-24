import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Res,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReembolsoService } from '../service/reembolso.service';
import { RelatorioService } from '../service/relatorio.service';
import { CreateReembolsoDto } from '../entity/dto/reembolso/createReembolsoDto';
import { UpdateReembolsoDto } from '../entity/dto/reembolso/updateReembolsoDto';
import { JwtAuthGuard } from '../application/auth/jwt-auth.guard';

@Controller('reembolsos')
@UseGuards(JwtAuthGuard)
export class ReembolsoController {
  constructor(
    private readonly reembolsoService: ReembolsoService,
    private readonly relatorioService: RelatorioService,
  ) {}

  /**
   * POST /reembolsos/contrato/:contratoId
   * Criar reembolso para um contrato específico
   */
  @Post('/contrato/:contratoId')
  async createForContrato(
    @Param('contratoId') contratoId: string,
    @Req() req,
    @Body() dto: CreateReembolsoDto,
  ) {
    return this.reembolsoService.create(contratoId, req.user_id, dto);
  }

  /**
   * GET /reembolsos
   * Listar todos os reembolsos
   */
  @Get()
  async findAll() {
    return this.reembolsoService.findAll();
  }

  /**
   * GET /reembolsos/:id
   * Recuperar reembolso específico
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reembolsoService.findOne(id);
  }

  /**
   * PATCH /reembolsos/:id
   * Atualizar reembolso
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReembolsoDto,
  ) {
    return this.reembolsoService.update(id, dto);
  }

  /**
   * DELETE /reembolsos/:id
   * Deletar reembolso
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reembolsoService.remove(id);
  }

  /**
   * GET /reembolsos/:id/export-excel
   * Exportar reembolso para Excel
   */
  @Get(':id/export-excel')
  async exportToExcel(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const buffer = await this.relatorioService.exportToExcel(id);

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="reembolso-${id}.xlsx"`,
      });

      res.send(buffer);
    } catch (error) {
      throw new BadRequestException('Erro ao exportar para Excel: ' + error.message);
    }
  }
}
