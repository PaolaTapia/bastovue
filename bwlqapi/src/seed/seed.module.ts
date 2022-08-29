import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AnimalsModule } from '../animals/animals.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AnimalsModule],
})
export class SeedModule {}
