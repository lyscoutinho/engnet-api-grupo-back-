import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../application/auth/jwt-auth.guard';
import { DashboardService } from '../service/dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard() {
    return this.dashboardService.getDashboardData();
  }
}