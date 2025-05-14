import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./model/bot.model";
import { Context, Markup, Telegraf } from "telegraf";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../../app.constants";
import { Usta } from "./model/usta.model";
import { Op } from "sequelize";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Usta) private readonly ustaModel: typeof Usta,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await this.botModel.create({
          user_id: user_id!,
          user_name: ctx.from?.username!,
          first_name: ctx.from?.first_name!,
          last_name: ctx.from?.last_name!,
          lang: ctx.from?.language_code!,
        });

        await ctx.replyWithHTML(
          `Ro'yxatdan o'tish tugmalarnidan birini tanlang`,
          {
            ...Markup.keyboard(["Usta", "Mijoz"]).oneTime().resize(),
          }
        );
      }
      await ctx.replyWithHTML(
        `Ro'yxatdan o'tish tugmalarnidan birini tanlang`,
        {
          ...Markup.keyboard(["Usta", "Mijoz"]).oneTime().resize(),
        }
      );
    } catch (error) {
      console.log(`Error on Start`, error);
    }
  }

  async OnLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML(`Iltimos, <b>start</b> tugmasini bosing`, {
            ...Markup.keyboard([["/start"]])
              .oneTime()
              .resize(),
          });
        } else {
          const address = await this.ustaModel.findOne({
            where: {
              user_id,
              last_state: { [Op.ne]: "finish" },
            },
            order: [["id", "DESC"]],
          });
          if (address && address.last_state == "location") {
            address.location = `${ctx.message.location.latitude}, ${ctx.message.location.longitude}`;
            address.last_state = "start_at";
            await address.save();
            await ctx.reply("Ishni boshlanish vaqtini kiriting");
          } else {
            await ctx.reply("Lokatsiyani pastagi tugma bilan jonating");
          }
        }
      }
    } catch (error) {
      console.log("Error on OnLocation", error);
    }
  }

  async onContact(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML(`Iltimos, <b>start</b> tugmasini bosing`, {
          ...Markup.keyboard([["/start"]])
            .oneTime()
            .resize(),
        });
      } else {
        const contact = await this.ustaModel.findOne({
          where: {
            user_id,
            last_state: { [Op.ne]: "finish" },
          },
          order: [["id", "DESC"]],
        });
        // if (contact && contact.last_state == "phone") {
        //     contact.phone_number = `${ctx.message.contact.phone_number}`;
        if (ctx.message && "contact" in ctx.message) {
          if (contact && contact.last_state === "phone") {
            contact.phone_number = `${ctx.message.contact.phone_number}`;
            contact.last_state = "workshop_name";
            await contact.save();
            await ctx.reply("Usta xona nomini kiriting");
          } else {
            await ctx.reply("Kontakt ni pasdagi tugma bilan jo'nating");
          }
        }
      }
    } catch (error) {
      console.log(`Error on Contact`, error);
    }
  }

  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await ctx.replyWithHTML(`Iltimos, <b>start</b> tugmasini bosing`, {
          ...Markup.keyboard([["/start"]])
            .oneTime()
            .resize(),
        });
      } else if (user.status) {
        user.status = false;
        user.phone_number = "";
        await user.save();
        await ctx.replyWithHTML(`Bot uyqu rejimiga o'tdi`, {
          ...Markup.keyboard([["/start"]])
            .oneTime()
            .resize(),
        }),
          ctx.replyWithHTML(`Agar kerak bo'lsa startni bosing`);
      }
    } catch (error) {
      console.log(`Error on Contact`, error);
    }
  }

  async OnText(ctx: Context) {
    if ("text" in ctx.message!) {
      try {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user) {
          await ctx.replyWithHTML("Iltimos, <b>start</b> tugmasini bosing", {
            ...Markup.keyboard([["/start"]])
              .oneTime()
              .resize(),
          });
        } else {
          const usta = await this.ustaModel.findOne({
            where: {
              user_id,
              last_state: { [Op.ne]: "finish" },
            },
            order: [["id", "DESC"]],
          });
          if (usta) {
            const userInput = ctx.message?.text;

            switch (usta.last_state) {
              case "name":
                usta.name = userInput;
                usta.last_state = "phone";
                await usta.save();
                await ctx.reply(
                  "Telefon raqamingizni pastdagi tugam bilan jo'nating",
                  {
                    ...Markup.keyboard([
                      [Markup.button.contactRequest("Raqam yuborish")],
                    ])
                      .resize()
                      .oneTime(),
                  }
                );
                break;

              case "workshop_name":
                usta.workshop_name = userInput;
                usta.last_state = "address";
                await usta.save();
                await ctx.reply("Manzilingizni kiriting");
                break;

              case "address":
                usta.address = userInput;
                usta.last_state = "landmark";
                await usta.save();
                await ctx.reply("Moljalingizni kiriting");
                break;

              case "landmark":
                usta.landmark = userInput;
                usta.last_state = "location";
                await usta.save();
                await ctx.reply("Lokatsiyani yuboring", {
                  ...Markup.keyboard([
                    [Markup.button.locationRequest("Lokatsiyani yuborish")],
                  ])
                    .resize()
                    .oneTime(),
                });
                break;

              case "start_at":
                usta.start_at = userInput;
                usta.last_state = "end_at";
                await usta.save();
                await ctx.reply("Ish tugash vaqtini kiriting");
                break;

              case "end_at":
                usta.end_at = userInput;
                usta.last_state = "time";
                await usta.save();
                await ctx.reply(
                  "Har bir mijoz uchun ortacha sarflanadigan vaqtni kiriting"
                );
                break;

              case "time":
                usta.time = Number(userInput);
                usta.last_state = "confirm";
                await usta.save();

                await ctx.replyWithHTML(
                  `<b>Quyidagi ma'lumotlarni tasdiqlaysizmi?</b>\n\n` +
                    `1. Ismi: ${usta.name}\n` +
                    `2. Tel: ${usta.phone_number}\n` +
                    `3. Ustaxona: ${usta.workshop_name || "-"}\n` +
                    `4. Manzil: ${usta.address || "-"}\n` +
                    `5. Moljal: ${usta.landmark || "-"}\n` +
                    `6. Lokatsiya: ${usta.location || "-"}\n` +
                    `7. Boshlash: ${usta.start_at}\n` +
                    `8. Tugash: ${usta.end_at}\n` +
                    `9. Mijozga vaqt: ${usta.time} min`,
                  {
                    ...Markup.inlineKeyboard([
                      [Markup.button.callback("Tasdiqlash", "confirm_usta")],
                      [Markup.button.callback("Bekor qilish", "cancel_usta")],
                    ]),
                  }
                );
                break;

              default:
                await ctx.reply(
                  "Noma'lum holat. Iltimos, /start buyrugini bosing."
                );
                break;
            }
          }
        }
      } catch (error) {
        console.log("error OnText", error);
      }
    }
  }
}
