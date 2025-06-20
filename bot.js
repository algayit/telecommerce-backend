require("dotenv").config({ path: __dirname + "/.env" });
const { Telegraf, Markup } = require("telegraf");
const { getUserByTelegramId, updateUserTelegramId } = require("./services/auth.service");
const { getCartByTelegramId } = require("./services/cart.service");
const { getOrderById, deleteOrderGroup} = require("./services/order.service");

const bot = new Telegraf(process.env.TELEGRAM_BOT_KEY);
const userInputMap = new Map();

// Helper function to send main menu
const sendMainMenu = (ctx, firstName) => {
  return ctx.reply(
    `👋 Salam, ${firstName}! Xoş gəldiniz! 😊 Aşağıdakı menyudan seçim edin:`,
    Markup.keyboard([
      ["🛒 Səbət", "📦 Sifarişlər"],
      ["🆔 ID-ni göstər"],
    ]).resize()
  );
};

// Show Telegram ID
bot.hears("🆔 ID-ni göstər", (ctx) => {
  ctx.reply(`Sizin Telegram ID-niz: ${ctx.chat.id}`);
});

// Handle bot start
bot.start(async (ctx) => {
  try {
    const telegramId = ctx.chat.id;
    const firstName = ctx.chat.first_name;
    const existingUser = await getUserByTelegramId(telegramId);
    if (existingUser) return sendMainMenu(ctx, firstName);

    ctx.reply("Xahiş edirik, User ID daxil edin:");
    userInputMap.set(telegramId, true);
  } catch (error) {
    console.error("Telegram ID kaydedilirken hata:", error);
    ctx.reply("❌ Sistem xətası baş verdi, yenidən cəhd edin.");
  }
});

// Handle User ID input
bot.hears(/\d+/, async (ctx) => {
  const telegramId = ctx.chat.id;
  if (!userInputMap.has(telegramId)) return;
  
  try {
    const userId = ctx.message.text;
    await updateUserTelegramId({ userId, telegramId });
    ctx.reply("✅ Telegram ID və User ID sistemə əlavə olundu.");
    sendMainMenu(ctx, ctx.chat.first_name);
  } catch (error) {
    console.error("User ID update error:", error);
    ctx.reply("❌ Sistem xətası baş verdi, yenidən cəhd edin.");
  } finally {
    userInputMap.delete(telegramId);
  }
});

// Show Cart Items
bot.hears("🛒 Səbət", async (ctx) => {
  try {
    const cartItems = await getCartByTelegramId(ctx.chat.id);
    if (!cartItems.length) return ctx.reply("🛒 Səbətiniz boşdur.");

    const cartMessage = cartItems.map(
      ({ name, quantity, subtotal }) => `🔹 ${name} - ${quantity} ədəd - ${subtotal} AZN`
    ).join("\n");
    
    ctx.reply(`🛒 Səbətinizdəki məhsullar:\n\n${cartMessage}`);
  } catch (error) {
    console.error("Cart error:", error);
    ctx.reply("❌ Sistem xətası baş verdi, yenidən cəhd edin.");
  }
});

// Show Orders
bot.hears("📦 Sifarişlər", async (ctx) => {
  try {
    const userDetail = await getUserByTelegramId(ctx.chat.id);
    const orderDetail = await getOrderById(userDetail.user_id);
    if (!orderDetail.length) return ctx.reply("📦 Sifariş yoxdur.");

    const groupedOrders = orderDetail.reduce((acc, item) => {
      (acc[item.order_no] ||= []).push(item);
      return acc;
    }, {});

    for (const [orderNo, orderItems] of Object.entries(groupedOrders)) {
      const orderDetails = orderItems.map(({ name, quantity, price }) =>
        `🔹 ${name} - ${quantity} ədəd - ${price * quantity} AZN`
      ).join("\n");
      
      const totalAmount = orderItems.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
      ctx.replyWithMarkdown(`📦 *Sifariş No: ${orderNo}* \n\n${orderDetails}\n\n💰 *Toplam məbləğ:* ${totalAmount} AZN`,
        Markup.inlineKeyboard([
          Markup.button.callback("💳 Ödəniş et", `pay_order_${orderNo}`),
          Markup.button.callback("🗑️ Sifarişi sil", `delete_order_${orderNo}`) // Add the delete button
        ])
      );
    }
  } catch (error) {
    console.error("Order error:", error);
    ctx.reply("❌ Sistem xətası baş verdi, yenidən cəhd edin.");
  }
});

// Handle Delete Order Action
bot.action(/^delete_order_(.+)$/, async (ctx) => {
  try {
    const orderNo = ctx.match[1];
    const deletedOrder = await deleteOrderGroup(orderNo); 

    if (deletedOrder) {
      ctx.reply(`📦 Sifariş No: ${orderNo} uğurla silindi.`);
    } else {
      ctx.reply(`❌ Sifariş No: ${orderNo} silinə bilmədi. Yenidən cəhd edin.`);
    }
  } catch (error) {
    console.error("Delete Order error:", error);
    ctx.reply("❌ Xəta baş verdi, yenidən cəhd edin.");
  }
});

// Handle Payment Action
bot.action(/^pay_order_(.+)$/, async (ctx) => {
  try {
    const orderNo = ctx.match[1];
    ctx.reply(`💳 Ödəniş üçün link: [Buraya basın](https://payment-link-for-order-${orderNo}.com)`, {
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("Payment error:", error);
    ctx.reply("❌ Xəta baş verdi, yenidən cəhd edin.");
  }
});

// Back to Main Menu
bot.hears("🔙 Əsas menyuya qayıt", (ctx) => sendMainMenu(ctx, ctx.chat.first_name));

// Start Bot
bot.launch().then(() => console.log("✅ Telegram bot is running..."));
