import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import { User, Notification, SupportMessage, VotingSession, NewsItem, SntStats, MeterReadingRecord } from "./src/types";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "snt_albatros_secret_key_jwt_2026";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
const users: User[] = [
  {
    id: "user_1",
    username: "ivan",
    fio: "Иванов Иван Иванович",
    plotNumber: "123",
    phone: "+7 (900) 123-45-67",
    email: "ivanov@example.com",
    plotArea: 850, // 8.5 соток
    balance: 12450.00,
    isAdmin: false,
    meterReading: 4521.43,
  },
  {
    id: "user_admin",
    username: "admin",
    fio: "Иванов Игорь Игоревич (Председатель)",
    plotNumber: "1",
    phone: "+7 (495) 123-45-67",
    email: "info@snt-albatros.ru",
    plotArea: 1200, // 12 соток
    balance: 0.00,
    isAdmin: true,
    meterReading: 2154.10,
  }
];

// Initial News
const news: NewsItem[] = [
  {
    id: "news_1",
    title: "Ремонт дорожного покрытия",
    content: "Уважаемые садоводы! Сообщаем, что с 15 по 20 мая будут проводиться работы по грейдированию и отсыпке щебнем центральной улицы. Просьба убрать автомобили с обочин для обеспечения беспрепятственного проезда строительной техники.",
    date: "10 Мая 2024",
    isImportant: false,
  },
  {
    id: "news_2",
    title: "Отключение электроэнергии",
    content: "В связи с плановыми ремонтными работами на трансформаторной подстанции, 12 мая с 10:00 до 14:00 будет временно прекращена подача электроэнергии на участках с 1 по 50. Приносим извинения за неудобства.",
    date: "05 Мая 2024",
    isImportant: true,
  },
  {
    id: "news_3",
    title: "Подготовка к летнему сезону",
    content: "Правление СНТ напоминает о необходимости своевременного покоса травы на участках и прилегающей территории. Также напоминаем о правилах вывоза крупногабаритного мусора.",
    date: "28 Апреля 2024",
    isImportant: false,
  }
];

// Initial Notifications
const notifications: Notification[] = [
  {
    id: "notif_1",
    title: "Ваша заявка на пропуск одобрена",
    message: "Автомобиль А123БВ777 может беспрепятственно проезжать на территорию СНТ до конца текущих суток.",
    date: "Сегодня, 10:45",
    type: "success",
    targetPlot: "123",
  },
  {
    id: "notif_2",
    title: "Начислены пени за 2 квартал",
    message: "В связи с просрочкой платежа по членским взносам начислена пеня в размере 145.00 ₽. Пожалуйста, погасите задолженность.",
    date: "Вчера, 18:20",
    type: "warning",
    targetPlot: "123",
  },
  {
    id: "notif_3",
    title: "Напоминание о собрании",
    message: "Напоминаем, что 25 мая состоится общее собрание членов СНТ. Пожалуйста, ознакомьтесь с повесткой дня в личном кабинете.",
    date: "10 мая, 12:00",
    type: "info",
  }
];

// Support Tickets / Register Updates
const supportMessages: SupportMessage[] = [];

// Meter Readings Log
const meterReadings: MeterReadingRecord[] = [
  {
    id: "reading_1",
    plotNumber: "123",
    value: 4521.43,
    date: "15.05.2024",
    amountBilled: 1332.20,
  }
];

// Electronic Voting Sessions
const votingSessions: VotingSession[] = [
  {
    id: "vote_1",
    title: "Голосование по смете на 2026 год и целевым взносам",
    description: "В повестке: утверждение приходно-расходной сметы, модернизация электросетей (3-я очередь) и ремонт центрального проезда.",
    startDate: "15.05.2025",
    endDate: "30.05.2025",
    status: "active",
    quorumRequired: 50,
    quorumCurrent: 65,
    options: [
      { id: "opt_for", text: "За принятие сметы", votes: 142 },
      { id: "opt_against", text: "Против принятия сметы", votes: 34 },
      { id: "opt_abstain", text: "Воздержаться", votes: 12 }
    ]
  },
  {
    id: "vote_2",
    title: "Выборы ревизионной комиссии",
    description: "Голосование завершено 10.04.2025. Итоговый протокол №4 от 12.04.2025 сформирован и подписан ЭЦП.",
    startDate: "01.04.2025",
    endDate: "10.04.2025",
    status: "completed",
    quorumRequired: 50,
    quorumCurrent: 72,
    options: [
      { id: "opt_rec_1", text: "Утвердить состав (Ковалев, Петрова, Смирнов)", votes: 184 },
      { id: "opt_rec_reject", text: "Отклонить предложенный состав", votes: 22 }
    ]
  }
];

// Statistics Data
const stats: SntStats = {
  totalPlots: 350,
  totalMembers: 280,
  feePerSotka: 1500,
  tpPower: "250 кВт",
  totalDebt: 345000,
  totalCollectedFees: 4125000,
  energyConsumptionHistory: [
    { month: "Янв", consumption: 42000, cost: 228900 },
    { month: "Фев", consumption: 38000, cost: 207100 },
    { month: "Мар", consumption: 31000, cost: 168950 },
    { month: "Апр", consumption: 25000, cost: 136250 },
    { month: "Май", consumption: 18000, cost: 98100 },
    { month: "Июн", consumption: 15000, cost: 81750 },
  ],
  feesHistory: [
    { year: "2021", required: 3200000, collected: 3050000 },
    { year: "2022", required: 3500000, collected: 3410000 },
    { year: "2023", required: 3900000, collected: 3780000 },
    { year: "2024", required: 4200000, collected: 4125000 },
  ]
};

// Track user-casted votes: userId -> votingSessionId -> optionId
const userVotes: Record<string, Record<string, string>> = {
  "user_1": {
    "vote_2": "opt_rec_1" // Already voted in the completed election
  }
};

// Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Токен авторизации отсутствует" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Неверный или просроченный токен" });
    }
    req.user = decoded;
    next();
  });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. JWT AUTHENTICATION
app.post("/api/auth/register", (req, res) => {
  const { username, password, fio, plotNumber, phone, email, plotArea } = req.body;

  if (!username || !password || !fio || !plotNumber) {
    return res.status(400).json({ error: "Заполните все обязательные поля" });
  }

  const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: "Пользователь с таким именем уже существует" });
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    username,
    fio,
    plotNumber,
    phone: phone || "",
    email: email || "",
    plotArea: Number(plotArea) || 600, // default 6 соток
    balance: 0.00,
    isAdmin: false,
    meterReading: 0.00,
  };

  users.push(newUser);

  // Generate JWT Token
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, isAdmin: newUser.isAdmin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({ token, user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Введите имя пользователя и пароль" });
  }

  // Simple hardcoded checks
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(400).json({ error: "Пользователь не найден" });
  }

  // In this system, any password is valid for easy testing, but we check if it matches the fallback
  // of username (or "password" / "admin" for initial records)
  const isPassValid = (username === "admin" && password === "admin") || 
                      (username === "ivan" && password === "password") ||
                      (username !== "admin" && username !== "ivan");

  if (!isPassValid) {
    return res.status(400).json({ error: "Неверный пароль" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

app.get("/api/auth/me", authenticateToken, (req: any, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }
  res.json(user);
});

// 2. CABINET SERVICES
app.post("/api/cabinet/meter-readings", authenticateToken, (req: any, res) => {
  const { value } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const numValue = Number(value);
  if (isNaN(numValue) || numValue < user.meterReading) {
    return res.status(400).json({ error: "Новые показания не могут быть меньше предыдущих" });
  }

  const difference = numValue - user.meterReading;
  // Let's say electricity rate is 5.43 rubles per kWh
  const cost = difference * 5.43;

  user.meterReading = numValue;
  user.balance += cost; // increase bill/balance due

  // Add meter reading record
  const record: MeterReadingRecord = {
    id: `reading_${Date.now()}`,
    plotNumber: user.plotNumber,
    value: numValue,
    date: new Date().toLocaleDateString("ru-RU"),
    amountBilled: Number(cost.toFixed(2)),
  };

  meterReadings.push(record);

  // Auto push notification about billing
  notifications.unshift({
    id: `notif_${Date.now()}`,
    title: "Показания счетчика обновлены",
    message: `Приняты показания: ${numValue} кВт·ч. Начислено к оплате за расход (${difference.toFixed(2)} кВт·ч): ${cost.toFixed(2)} ₽.`,
    date: "Только что",
    type: "info",
    targetPlot: user.plotNumber,
  });

  res.json({ user, record });
});

app.post("/api/cabinet/pay", authenticateToken, (req: any, res) => {
  const { amount } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const payAmount = Number(amount);
  if (isNaN(payAmount) || payAmount <= 0) {
    return res.status(400).json({ error: "Неверная сумма платежа" });
  }

  user.balance = Math.max(0, Number((user.balance - payAmount).toFixed(2)));

  // Add success notification
  notifications.unshift({
    id: `notif_${Date.now()}`,
    title: "Оплата за взносы принята",
    message: `Успешно оплачено ${payAmount.toFixed(2)} ₽. Ваш текущий баланс обновлен.`,
    date: "Только что",
    type: "success",
    targetPlot: user.plotNumber,
  });

  res.json({ user });
});

// Electronic Voting API
app.post("/api/cabinet/vote", authenticateToken, (req: any, res) => {
  const { votingSessionId, optionId } = req.body;
  const userId = req.user.id;

  const session = votingSessions.find(v => v.id === votingSessionId);
  if (!session) {
    return res.status(404).json({ error: "Сессия голосования не найдена" });
  }

  if (session.status !== "active") {
    return res.status(400).json({ error: "Голосование уже закрыто" });
  }

  // Check if already voted
  if (!userVotes[userId]) {
    userVotes[userId] = {};
  }

  if (userVotes[userId][votingSessionId]) {
    return res.status(400).json({ error: "Вы уже проголосовали в этой сессии" });
  }

  const option = session.options.find(o => o.id === optionId);
  if (!option) {
    return res.status(400).json({ error: "Выбран неверный вариант" });
  }

  // Cast vote
  option.votes += 1;
  userVotes[userId][votingSessionId] = optionId;

  // Recalculate quorum slightly for dynamic feel
  session.quorumCurrent = Math.min(100, session.quorumCurrent + 1);

  res.json({ session, userVotedOptionId: optionId });
});

// Get user votes list
app.get("/api/cabinet/my-votes", authenticateToken, (req: any, res) => {
  res.json(userVotes[req.user.id] || {});
});

// 3. CONTACT FORM / REGISTRY UPDATE SUPPORT MESSAGES
app.post("/api/support", (req, res) => {
  const { fio, plotNumber, phone, message } = req.body;

  if (!fio || !plotNumber || !phone || !message) {
    return res.status(400).json({ error: "Заполните все поля формы" });
  }

  const newMessage: SupportMessage = {
    id: `support_${Date.now()}`,
    fio,
    plotNumber,
    phone,
    message,
    createdAt: new Date().toLocaleString("ru-RU"),
  };

  supportMessages.push(newMessage);

  // If a matching user exists in our DB, notify them!
  const matchedUser = users.find(u => u.plotNumber === plotNumber);
  if (matchedUser) {
    notifications.unshift({
      id: `notif_${Date.now()}`,
      title: "Запрос на изменение реестра принят",
      message: `Ваше обращение по участку №${plotNumber} успешно отправлено в правление СНТ. Мы рассмотрим его в ближайшее время.`,
      date: "Только что",
      type: "success",
      targetPlot: plotNumber,
    });
  }

  res.json({ success: true, message: "Обращение успешно зарегистрировано в системе" });
});

// 4. NOTIFICATIONS & CUSTOM PUSH NOTIFICATIONS POLLING
app.get("/api/notifications", (req, res) => {
  const plot = req.query.plot as string;

  // Filter: public notifications (no targetPlot) + notifications targeted to this specific plot
  const filtered = notifications.filter(n => !n.targetPlot || n.targetPlot === plot);
  res.json(filtered);
});

// 5. ADMIN UTILITIES
app.post("/api/admin/notifications", authenticateToken, (req: any, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Доступ запрещен" });
  }

  const { title, message, type, targetPlot } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Заголовк и текст уведомления обязательны" });
  }

  const newNotif: Notification = {
    id: `notif_${Date.now()}`,
    title,
    message,
    date: "Только что",
    type: type || "info",
    targetPlot: targetPlot || undefined, // empty means broadcast to all
  };

  notifications.unshift(newNotif);

  res.status(201).json({ success: true, notification: newNotif });
});

// Retrieve Admin dashboard metrics & support messages list
app.get("/api/admin/dashboard", authenticateToken, (req: any, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Доступ запрещен" });
  }

  res.json({
    usersCount: users.length,
    supportMessages,
    meterReadings,
    votingSessions,
    stats,
  });
});

// 6. GENERAL SNT INFORMATION (PUBLIC)
app.get("/api/news", (req, res) => {
  res.json(news);
});

app.get("/api/stats", (req, res) => {
  res.json(stats);
});

app.get("/api/voting", (req, res) => {
  res.json(votingSessions);
});

// 7. WORDPRESS EXPORTER (ACF/Custom Post Types JSON representation)
app.get("/api/wordpress/export", (req, res) => {
  const wordpressConfig = {
    cpt: [
      {
        name: "snt_news",
        label: "Новости СНТ",
        supports: ["title", "editor", "thumbnail", "excerpt"],
        acf_fields: [
          { name: "is_important", type: "true_false", label: "Важная новость (красная рамка)" }
        ],
        sample_posts: news.map(n => ({
          title: n.title,
          content: n.content,
          date: n.date,
          meta: { is_important: n.isImportant ? 1 : 0 }
        }))
      },
      {
        name: "snt_notifications",
        label: "Уведомления",
        supports: ["title", "editor"],
        acf_fields: [
          { name: "type", type: "select", choices: ["info", "warning", "success", "alert"] },
          { name: "target_plot", type: "text", label: "Номер участка получателя (пусто для всех)" }
        ],
        sample_posts: notifications.map(notif => ({
          title: notif.title,
          content: notif.message,
          meta: { type: notif.type, target_plot: notif.targetPlot || "" }
        }))
      },
      {
        name: "snt_stats",
        label: "Статистика СНТ",
        acf_fields: [
          { name: "total_plots", type: "number", value: stats.totalPlots },
          { name: "total_members", type: "number", value: stats.totalMembers },
          { name: "fee_per_sotka", type: "number", value: stats.feePerSotka },
          { name: "tp_power", type: "text", value: stats.tpPower }
        ]
      }
    ],
    theme_template_files: [
      {
        filename: "page-contacts.php",
        description: "Контактные данные правления СНТ, интерактивная карта и форма обновления реестра с AJAX отправкой."
      },
      {
        filename: "page-payments.php",
        description: "Информация о тарифах взносов, банковских реквизитах и PDF/DOCX документах с интеграцией копирования счетов."
      },
      {
        filename: "single-snt_news.php",
        description: "Шаблон детальной страницы новости с подсветкой важных оповещений."
      }
    ],
    seo_wp_configuration: {
      yoast_meta_defaults: {
        homepage_title: "СНТ «Альбатрос» — Официальный портал садоводов Рузского городского округа",
        homepage_description: "Официальный сайт СНТ «Альбатрос». Документы, взносы, тарифы, новости и личный кабинет садовода для прозрачного управления."
      }
    }
  };

  res.json(wordpressConfig);
});


// ----------------------------------------------------
// VITE DEV SERVER OR STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
