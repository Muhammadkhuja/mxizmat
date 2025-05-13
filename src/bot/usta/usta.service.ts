import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "../model/bot.model";
import { Context, Markup, Telegraf } from "telegraf";
import { Usta } from "../model/usta.model";
import { Category } from "../model/category.model";

@Injectable()
export class UstaService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Usta) private readonly ustaModel: typeof Usta,
    @InjectModel(Category) private readonly categoryModel: typeof Category,
  ) {}

  async OnThisUstashw(ctx: Context) {
    const categories = await this.categoryModel.findAll();
    if (!categories.length) {
      return ctx.reply("Hozircha bolimlar yoq.");
    }

    const buttons = categories.map((cat) => [
      Markup.button.callback(cat.name, `cat_${cat.id}`),
    ]);

    await ctx.reply("Iltimos, oz yonalishingizni tanlang:",{ 
      ...Markup.inlineKeyboard(buttons),
    });
  }
  async OnClicLocation(ctx: Context) {
    try {
      const data = ctx.callbackQuery!["data"];
      const message = ctx.callbackQuery!["message"];

      console.log("callbackQuery:", ctx.callbackQuery);

      const categoryId = Number(data.split("_")[1]);

      await ctx.deleteMessage(message?.message_id);

      await this.onRegister(ctx, categoryId);
    } catch (error) {
      console.log("OnClicLocation error:", error);
    }
  }

  async onRegister(ctx: Context, categoryId) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        await ctx.replyWithHTML("Iltimos, <b>start</b> tugmasini bosing", {
          ...Markup.keyboard([["/start"]])
            .oneTime()
            .resize(),
        });
        return
      }
      await this.ustaModel.create({
        user_id: user_id!,
        category_id: categoryId,
        last_state: "name",
      });

      console.log("user_id:", user_id);
      console.log("categoryId:", categoryId);

      await ctx.replyWithHTML("ismingini kiriting");
    } catch (error) {
      console.log("errorr onAddress", error);
    }
  }
}
