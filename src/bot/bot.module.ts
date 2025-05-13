import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Bot } from "./model/bot.model";
import { BotUpadte } from "./bot.update";
import { UstaService } from "./usta/usta.service";
import { Usta } from "./model/usta.model";
import { Category } from "./model/category.model";
import { UstaUpadte } from "./usta/usta.update";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Usta, Category])],
  controllers: [],
  providers: [BotService, UstaService, UstaUpadte, BotUpadte],
  exports: [BotService],
})
export class BotModule {}
