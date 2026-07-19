import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORY_DEFS } from "../src/lib/constants";

const db = new PrismaClient();

// Fixed demo password for every seeded account — documented in README so
// reviewers can log in. Never reuse this constant for real user data.
const DEMO_PASSWORD = "Password123!";

function slugify(input: string) {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return input
    .toLowerCase()
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function hashSeed(seed: string) {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) hash = (hash * 33) ^ seed.charCodeAt(i);
  return Math.abs(hash);
}

function pick<T>(arr: readonly T[], n: number): T {
  return arr[n % arr.length]!;
}

async function main() {
  console.log("Очистка базы…");
  await db.message.deleteMany();
  await db.conversation.deleteMany();
  await db.review.deleteMany();
  await db.favorite.deleteMany();
  await db.order.deleteMany();
  await db.package.deleteMany();
  await db.portfolioItem.deleteMany();
  await db.service.deleteMany();
  await db.category.deleteMany();
  await db.user.deleteMany();

  console.log("Категории…");
  const categories = await Promise.all(
    CATEGORY_DEFS.map((c, i) =>
      db.category.create({
        data: { slug: c.slug, name: c.name, description: c.description, icon: c.icon, order: i },
      })
    )
  );
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  console.log("Исполнители…");
  const freelancerDefs = [
    { name: "Илья Северов", title: "Веб-разработчик full-stack", bio: "Делаю быстрые сайты и сервисы на React и Node.js уже 7 лет. Люблю чистый код и понятные ТЗ.", location: "Москва", skills: "React, Next.js, Node.js, PostgreSQL", verified: true, cat: "web-razrabotka" },
    { name: "Анна Ковалёва", title: "UI/UX и графический дизайнер", bio: "Создаю фирменный стиль и интерфейсы, которым доверяют пользователи. Портфолио — от стартапов до федеральных брендов.", location: "Санкт-Петербург", skills: "Figma, брендинг, UI/UX, иллюстрация", verified: true, cat: "dizajn-i-grafika" },
    { name: "Марат Юсупов", title: "Мобильный разработчик", bio: "Пишу приложения под iOS и Android на Flutter и React Native. Публикую в сторы под ключ.", location: "Казань", skills: "Flutter, React Native, Swift, Kotlin", verified: true, cat: "mobilnaya-razrabotka" },
    { name: "Ольга Дмитриева", title: "Копирайтер и редактор", bio: "Пишу тексты, которые продают: от лендингов до email-рассылок. 9 лет в контент-маркетинге.", location: "Екатеринбург", skills: "Копирайтинг, SEO, редактура, сторителлинг", verified: false, cat: "tekst-i-perevod" },
    { name: "Даниил Орлов", title: "Таргетолог и специалист по рекламе", bio: "Настраиваю рекламные кампании с прозрачной аналитикой и понятным ROI.", location: "Новосибирск", skills: "Таргет, контекст, аналитика, SMM", verified: true, cat: "marketing" },
    { name: "Ксения Волкова", title: "Моушн-дизайнер", bio: "Делаю анимационные ролики и моушн-дизайн для соцсетей и рекламы.", location: "Москва", skills: "After Effects, 2D-анимация, монтаж", verified: false, cat: "video-i-animatsiya" },
    { name: "Тимур Абдуллаев", title: "Саунд-дизайнер", bio: "Озвучка, музыка и звуковой дизайн для роликов, игр и подкастов.", location: "Уфа", skills: "Озвучка, саунд-дизайн, музыка", verified: false, cat: "audio-i-muzyka" },
    { name: "Полина Смирнова", title: "Бизнес-аналитик", bio: "Помогаю принимать решения на основе данных: финмодели, дашборды, аналитика.", location: "Москва", skills: "Excel, Power BI, финмоделирование", verified: true, cat: "biznes-i-analitika" },
    { name: "George Novak", title: "Frontend-разработчик", bio: "Собираю интерфейсы на React с упором на производительность и доступность.", location: "Удалённо", skills: "React, TypeScript, Tailwind CSS", verified: true, cat: "web-razrabotka" },
    { name: "Виктория Лебедева", title: "Логотипы и фирменный стиль", bio: "Разрабатываю логотипы и брендбуки для малого бизнеса и личных брендов.", location: "Краснодар", skills: "Логотип, брендбук, упаковка", verified: false, cat: "dizajn-i-grafika" },
  ];

  const freelancers = [];
  for (const [i, def] of freelancerDefs.entries()) {
    const email = `${slugify(def.name).replace(/-/g, ".")}@artel.demo`;
    const user = await db.user.create({
      data: {
        name: def.name,
        email,
        passwordHash,
        role: "FREELANCER",
        avatarSeed: `${email}-${i}`,
        title: def.title,
        bio: def.bio,
        location: def.location,
        skills: def.skills,
        responseTime: pick(["в течение часа", "в течение 2-3 часов", "в течение дня"], i),
        isVerified: def.verified,
        memberSince: new Date(Date.now() - (200 + i * 47) * 24 * 60 * 60 * 1000),
      },
    });
    freelancers.push({ user, cat: def.cat });
  }

  console.log("Заказчики…");
  const clientDefs = [
    { name: "Мария Петрова", email: "maria.petrova@artel.demo" },
    { name: "Сергей Кузнецов", email: "sergey.kuznecov@artel.demo" },
    { name: "Наталья Егорова", email: "natalya.egorova@artel.demo" },
    { name: "Артём Соколов", email: "artem.sokolov@artel.demo" },
    { name: "Elena Bright", email: "elena.bright@artel.demo" },
  ];
  const clients = [];
  for (const [i, def] of clientDefs.entries()) {
    const user = await db.user.create({
      data: {
        name: def.name,
        email: def.email,
        passwordHash,
        role: "CLIENT",
        avatarSeed: `${def.email}-${i}`,
        memberSince: new Date(Date.now() - (120 + i * 31) * 24 * 60 * 60 * 1000),
      },
    });
    clients.push(user);
  }

  console.log("Услуги и пакеты…");
  const serviceTemplates: Record<string, { title: string; description: string; base: number }[]> = {
    "web-razrabotka": [
      { title: "Разработаю сайт-визитку на Next.js", description: "Современный, быстрый и адаптивный сайт под ключ: от вёрстки до деплоя. Оптимизация под поисковики и мобильные устройства включены.", base: 15000 },
      { title: "Создам интернет-магазин с оплатой и каталогом", description: "Полноценный e-commerce: каталог товаров, корзина, оплата, панель администратора. Подключу аналитику и SEO-разметку.", base: 45000 },
      { title: "Настрою API и бэкенд на Node.js", description: "Спроектирую и разработаю REST/GraphQL API с базой данных, авторизацией и документацией.", base: 25000 },
    ],
    "dizajn-i-grafika": [
      { title: "Разработаю логотип и фирменный стиль", description: "3 концепции логотипа, финальная отрисовка в векторе, гайдлайн по использованию цветов и шрифтов.", base: 8000 },
      { title: "Спроектирую UI/UX дизайн приложения", description: "Пользовательские сценарии, прототип в Figma, финальные экраны с адаптивной сеткой.", base: 30000 },
      { title: "Нарисую иллюстрации для сайта или соцсетей", description: "Уникальные иллюстрации в единой стилистике под ваш бренд.", base: 6000 },
    ],
    "mobilnaya-razrabotka": [
      { title: "Разработаю мобильное приложение на Flutter", description: "Кроссплатформенное приложение под iOS и Android с публикацией в сторы.", base: 60000 },
      { title: "Доработаю существующее приложение", description: "Найду и исправлю баги, добавлю новый функционал в уже существующий проект.", base: 20000 },
    ],
    "tekst-i-perevod": [
      { title: "Напишу продающие тексты для лендинга", description: "Структура, заголовки и тексты блоков, ориентированные на конверсию.", base: 5000 },
      { title: "Переведу документы на английский язык", description: "Профессиональный перевод с сохранением стиля и терминологии.", base: 3000 },
    ],
    marketing: [
      { title: "Настрою таргетированную рекламу ВКонтакте", description: "Анализ аудитории, настройка кампаний, оптимизация под низкую цену заявки.", base: 10000 },
      { title: "Проведу аудит рекламных кампаний", description: "Разберу текущие кампании и дам рекомендации по улучшению показателей.", base: 7000 },
    ],
    "video-i-animatsiya": [
      { title: "Смонтирую видеоролик для соцсетей", description: "Динамичный монтаж со звуковым сопровождением и субтитрами.", base: 6000 },
      { title: "Создам 2D-анимацию для рекламы", description: "Анимационный ролик по вашему сценарию с озвучкой.", base: 18000 },
    ],
    "audio-i-muzyka": [
      { title: "Озвучу рекламный ролик или видео", description: "Профессиональная дикция, обработка звука, несколько вариантов интонации.", base: 3500 },
      { title: "Напишу музыку на заказ", description: "Оригинальная композиция под ваш проект с передачей прав использования.", base: 12000 },
    ],
    "biznes-i-analitika": [
      { title: "Соберу финансовую модель проекта", description: "Полная финмодель в Excel с прогнозом на 3 года и сценариями.", base: 15000 },
      { title: "Построю дашборд в Power BI", description: "Интерактивная аналитическая панель на основе ваших данных.", base: 20000 },
    ],
  };

  let serviceCounter = 0;
  const allServices: { id: string; sellerId: string }[] = [];

  for (const { user, cat } of freelancers) {
    const templates = serviceTemplates[cat] ?? [];
    for (const tpl of templates) {
      serviceCounter += 1;
      const slugBase = slugify(tpl.title);
      let slug = slugBase;
      let n = 1;
      while (await db.service.findUnique({ where: { slug } })) {
        slug = `${slugBase}-${n}`;
        n += 1;
      }
      const coverSeed = `${slug}-${hashSeed(tpl.title + user.id).toString(36)}`;

      const service = await db.service.create({
        data: {
          slug,
          title: tpl.title,
          description: tpl.description,
          coverSeed,
          status: "PUBLISHED",
          categoryId: catBySlug[cat]!.id,
          sellerId: user.id,
          createdAt: new Date(Date.now() - (serviceCounter * 13) * 24 * 60 * 60 * 1000),
          packages: {
            create: [
              {
                tier: "BASIC",
                title: "Базовый",
                description: "Минимально необходимый объём для быстрого результата.",
                priceCents: tpl.base * 100,
                deliveryDays: 3,
                revisions: 1,
                features: "1 вариант,1 правка,Базовая настройка",
              },
              {
                tier: "STANDARD",
                title: "Стандарт",
                description: "Оптимальный баланс объёма и цены — выбирают чаще всего.",
                priceCents: Math.round(tpl.base * 1.8) * 100,
                deliveryDays: 5,
                revisions: 3,
                features: "3 варианта,3 правки,Расширенная настройка,Консультация",
              },
              {
                tier: "PREMIUM",
                title: "Премиум",
                description: "Максимальный объём работ и приоритетная поддержка.",
                priceCents: Math.round(tpl.base * 3.2) * 100,
                deliveryDays: 7,
                revisions: 10,
                features: "5 вариантов,Неограниченные правки,Приоритет в очереди,Поддержка 30 дней",
              },
            ],
          },
        },
        include: { packages: true },
      });

      allServices.push({ id: service.id, sellerId: user.id });

      await db.portfolioItem.create({
        data: {
          title: tpl.title,
          coverSeed: `${coverSeed}-portfolio`,
          userId: user.id,
        },
      });
    }
  }

  console.log("Заказы и отзывы…");
  const reviewTexts = [
    "Отличная работа, всё сдано в срок и даже раньше! Обязательно обращусь ещё раз.",
    "Исполнитель вник в задачу с первого сообщения, результат превзошёл ожидания.",
    "Хорошее качество, но пришлось немного скорректировать по срокам. В целом доволен.",
    "Профессионально и без лишних вопросов — именно то, что нужно было.",
    "Быстрая связь, понятные предложения по улучшению, результат — супер.",
    "Всё чётко по ТЗ, аккуратно и с вниманием к деталям.",
  ];

  let orderCounter = 0;
  for (const service of allServices) {
    const reviewCount = 1 + (hashSeed(service.id) % 4); // 1..4 reviews per service
    const pkgs = await db.package.findMany({ where: { serviceId: service.id } });
    const standardPkg = pkgs.find((p) => p.tier === "STANDARD") ?? pkgs[0]!;

    for (let i = 0; i < reviewCount; i++) {
      orderCounter += 1;
      const client = pick(clients, orderCounter + i);
      const daysAgo = 5 + orderCounter * 3;

      const order = await db.order.create({
        data: {
          serviceId: service.id,
          packageId: standardPkg.id,
          clientId: client.id,
          sellerId: service.sellerId,
          priceCents: standardPkg.priceCents,
          status: "COMPLETED",
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      });

      await db.review.create({
        data: {
          orderId: order.id,
          serviceId: service.id,
          authorId: client.id,
          targetId: service.sellerId,
          rating: 4 + (hashSeed(order.id) % 2), // 4 or 5
          comment: pick(reviewTexts, orderCounter + i),
          createdAt: new Date(Date.now() - (daysAgo - 1) * 24 * 60 * 60 * 1000),
        },
      });

      await db.service.update({
        where: { id: service.id },
        data: { ordersCount: { increment: 1 } },
      });
      await db.user.update({
        where: { id: service.sellerId },
        data: { balanceCents: { increment: Math.round(standardPkg.priceCents * 0.9) } },
      });
    }

    const agg = await db.review.aggregate({ where: { serviceId: service.id }, _avg: { rating: true }, _count: true });
    await db.service.update({
      where: { id: service.id },
      data: { rating: agg._avg.rating ?? 0, ratingCount: agg._count },
    });
  }

  // A couple of in-flight orders so the dashboard has something to act on.
  const firstFreelancerService = allServices[0];
  const secondFreelancerService = allServices[3] ?? allServices[0];
  if (firstFreelancerService) {
    const pkgs = await db.package.findMany({ where: { serviceId: firstFreelancerService.id } });
    await db.order.create({
      data: {
        serviceId: firstFreelancerService.id,
        packageId: pkgs[0]!.id,
        clientId: clients[0]!.id,
        sellerId: firstFreelancerService.sellerId,
        priceCents: pkgs[0]!.priceCents,
        status: "IN_PROGRESS",
        requirements: "Нужен сайт с 4 страницами: главная, услуги, портфолио, контакты. Есть готовый логотип.",
      },
    });
  }
  if (secondFreelancerService) {
    const pkgs = await db.package.findMany({ where: { serviceId: secondFreelancerService.id } });
    await db.order.create({
      data: {
        serviceId: secondFreelancerService.id,
        packageId: pkgs[1]!.id,
        clientId: clients[1]!.id,
        sellerId: secondFreelancerService.sellerId,
        priceCents: pkgs[1]!.priceCents,
        status: "DELIVERED",
        requirements: "Пожалуйста, используйте фирменные цвета из брендбука (приложен).",
      },
    });
  }

  console.log("Диалоги и сообщения…");
  const conversation = await db.conversation.create({
    data: {
      participantAId: [clients[0]!.id, freelancers[0]!.user.id].sort()[0]!,
      participantBId: [clients[0]!.id, freelancers[0]!.user.id].sort()[1]!,
    },
  });
  await db.message.createMany({
    data: [
      { conversationId: conversation.id, authorId: clients[0]!.id, body: "Здравствуйте! Подскажите, беретесь за сайт для локальной кофейни?" },
      { conversationId: conversation.id, authorId: freelancers[0]!.user.id, body: "Добрый день! Да, конечно. Есть ли уже логотип и référence-сайты, которые нравятся?" },
      { conversationId: conversation.id, authorId: clients[0]!.id, body: "Логотип есть, скину в требованиях к заказу. Ориентируюсь на минимализм." },
    ],
  });

  console.log("Избранное…");
  await db.favorite.create({ data: { userId: clients[0]!.id, serviceId: allServices[1]!.id } });
  await db.favorite.create({ data: { userId: clients[0]!.id, serviceId: allServices[4]!.id } });

  console.log(`Готово: ${freelancers.length} исполнителей, ${clients.length} заказчиков, ${allServices.length} услуг.`);
  console.log(`Демо-пароль для всех аккаунтов: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
