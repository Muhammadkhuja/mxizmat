import {
  Command,
  Ctx,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { BotService } from "./bot.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { TelegrafExeptionFilter } from "../common/filtres/telegraf-exeption.filter";
import { AdminGuard } from "../common/guards/admin.guard";

@Update()
export class BotUpadte {
  constructor(private readonly botService: BotService) {}

  @UseFilters(TelegrafExeptionFilter)
  @UseGuards(AdminGuard)
  @Command("admin")
  async onAdminCommand(@Ctx() ctx: Context) {
    await this.botService.admin_menu(ctx, `Xush kelibsiz, ADMIN `);
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.botService.start(ctx);
  }

  @On("contact")
  async OnContact(@Ctx() ctx: Context) {
    return this.botService.onContact(ctx);
  }

  @Command("stop")
  async OnStop(@Ctx() ctx: Context) {
    return this.botService.onStop(ctx);
  }

  @On("text")
  async OnText(@Ctx() ctx: Context) {
    return this.botService.OnText(ctx);
  }

  @On("location")
  async Onlocation(@Ctx() ctx: Context) {
    return this.botService.OnLocation(ctx);
  }

  @On("message")
  async OnMessage(@Ctx() ctx: Context) {
    console.log(ctx.botInfo);
    console.log(ctx.chat);
    console.log(ctx.chat!.id);
    console.log(ctx.from);
    console.log(ctx.from!.id);
    console.log(ctx.from!.username);
  }
}
