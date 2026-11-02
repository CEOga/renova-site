const json = (payload, status = 200) => new Response(JSON.stringify(payload), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

export async function onRequestPost({ request, env }) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ message: "Некорректный формат запроса." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 12_000) return json({ message: "Заявка слишком большая." }, 413);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ message: "Не удалось прочитать заявку." }, 400);
  }

  // Honeypot field for simple automated spam.
  if (typeof data.website === "string" && data.website.trim()) return json({ ok: true });

  const name = typeof data.name === "string" ? data.name.trim().slice(0, 80) : "";
  const phone = typeof data.phone === "string" ? data.phone.trim().slice(0, 30) : "";
  const service = typeof data.service === "string" ? data.service.trim().slice(0, 60) : "";
  const message = typeof data.message === "string" ? data.message.trim().slice(0, 1000) : "";
  const phoneDigits = phone.replace(/\D/g, "");

  if (name.length < 2 || phoneDigits.length < 7 || !service) {
    return json({ message: "Проверьте имя, телефон и тип объекта." }, 400);
  }

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return json({ message: "Форма пока не подключена. Попробуйте позже или напишите на info@renova.md." }, 503);
  }

  const text = [
    "Новая заявка с сайта Renova",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Объект: ${service}`,
    message ? `Комментарий: ${message}` : "",
  ].filter(Boolean).join("\n");

  let telegramResponse;
  let telegramResult = null;
  try {
    telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    telegramResult = await telegramResponse.json().catch(() => null);
  } catch {
    return json({ message: "Не удалось отправить заявку. Попробуйте ещё раз или напишите на info@renova.md." }, 502);
  }

  if (!telegramResponse.ok) {
    // Keep diagnostics useful without logging secrets or lead details.
    console.error("[lead] Telegram send failed", {
      status: telegramResponse.status,
      description: typeof telegramResult?.description === "string"
        ? telegramResult.description.slice(0, 160)
        : "No error details",
    });
    return json({ message: "Не удалось отправить заявку. Попробуйте ещё раз или напишите на info@renova.md." }, 502);
  }

  return json({ ok: true });
}
