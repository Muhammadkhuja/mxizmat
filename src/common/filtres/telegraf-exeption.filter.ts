import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { TelegrafArgumentsHost } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";

@Catch()
export class TelegrafExeptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();
    await ctx.replyWithHTML(`<b>Permission</b>: ${exception.message}`, {
      ...Markup.removeKeyboard(),
    });
  }
}
