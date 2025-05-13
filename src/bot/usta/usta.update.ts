import { Action, Ctx, Hears, Update } from "nestjs-telegraf";
import { BotService } from "../bot.service";
import { Context } from "telegraf";
import { UstaService } from "./usta.service";


@Update()
export class UstaUpadte {
  constructor(
    private readonly botService: BotService,
    private readonly ustaService: UstaService
  ) {}

  @Hears("Usta")
  async OnUstaparamshw(@Ctx() ctx: Context) {
    return this.ustaService.OnThisUstashw(ctx);
  }

  @Action(/^cat_\d+/)
  async OnClicLocation(@Ctx() ctx: Context) {
    return this.ustaService.OnClicLocation(ctx);
  }
}