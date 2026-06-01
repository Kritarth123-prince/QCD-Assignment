import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService, Order } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders(): Order[] {
    return this.ordersService.findAll();
  }

  // Must be declared before ':id' so 'summary' is not matched as an order id.
  @Get('summary')
  getSummary(): { [status: string]: number } {
    return this.ordersService.getGarmentStatusSummary();
  }

  @Get(':id')
  getOrder(@Param('id') id: string): Order | { error: string } {
    const order = this.ordersService.findOne(id);
    if (!order) {
      return { error: `Order with id ${id} not found` };
    }
    return order;
  }
}
