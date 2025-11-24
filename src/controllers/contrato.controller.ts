import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ContratoService } from '../service/contrato.service';
import { CreateContratoDto } from '../entity/dto/contrato/createContratoDto';
import { UpdateContratoDto } from '../entity/dto/contrato/updateContratoDto';
import { JwtAuthGuard } from '../application/auth/jwt-auth.guard';

@Controller('contratos')
@UseGuards(JwtAuthGuard)
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  /**
   * POST /contratos
   * Criar novo contrato
   */
  @Post()
  async create(@Body() dto: CreateContratoDto) {
    return this.contratoService.create(dto);
  }

  /**
   * GET /contratos
   * Listar todos os contratos
   */
  @Get()
  async findAll() {
    return this.contratoService.findAll();
  }

  /**
   * GET /contratos/:id
   * Recuperar contrato específico
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contratoService.findOne(id);
  }

  /**
   * PATCH /contratos/:id
   * Atualizar contrato
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContratoDto,
  ) {
    return this.contratoService.update(id, dto);
  }

  /**
   * DELETE /contratos/:id
   * Deletar contrato
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contratoService.remove(id);
  }

  /**
   * POST /contratos/:id/membros
   * Adicionar membro ao contrato
   */
  @Post(':id/membros')
  async adicionarMembro(
    @Param('id') contratoId: string,
    @Body() body: { usuarioId: string },
  ) {
    return this.contratoService.adicionarMembro(contratoId, body.usuarioId);
  }

  /**
   * DELETE /contratos/:id/membros/:usuarioId
   * Remover membro do contrato
   */
  @Delete(':id/membros/:usuarioId')
  async removerMembro(
    @Param('id') contratoId: string,
    @Param('usuarioId') usuarioId: string,
  ) {
    return this.contratoService.removerMembro(contratoId, usuarioId);
  }
}
