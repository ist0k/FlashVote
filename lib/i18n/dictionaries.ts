import type { Locale } from "@/lib/i18n/config";

const en = {
  brand: "FlashVote1",
  nav: {
    create: "Create",
    myPolls: "My polls",
  },
  landing: {
    heading: "Ask anything.",
    headingAccent: "Watch the answers roll in live.",
    subtitle:
      "FlashVote1 turns a question into a shareable poll with real-time results — no accounts, no friction.",
    featuresLabel: "Features",
    instant: { title: "Instant", text: "No sign-up required — write a question and go." },
    shareable: { title: "Shareable", text: "Send a link or let people scan the QR code." },
    live: { title: "Live results", text: "Votes appear on the chart in real time." },
    cardTitle: "Create a new poll",
    cardDescription: "You will get a share link and a QR code right away.",
  },
  form: {
    question: "Question",
    questionPlaceholder: "What should we have for lunch?",
    questionHint: "characters",
    options: "Answer options",
    optionPlaceholder: "Option",
    removeOption: "Remove option",
    addOption: "Add option",
    templates: "Quick templates",
    templateYesNo: "Yes / No",
    templateYesNoAbstain: "Yes / No / Maybe",
    templateAgree: "Agree / Disagree",
    expiry: "Poll expiration",
    expiryNever: "No expiry",
    expiryHour: "1 hour",
    expiryDay: "1 day",
    expiryWeek: "1 week",
    submit: "Create poll",
    submitting: "Creating…",
    errors: {
      emptyQuestion: "Please enter a question.",
      questionTooLong: "The question is too long.",
      emptyOption: "Options cannot be empty.",
      duplicateOption: "Options must be unique.",
      tooFewOptions: "Add at least two options.",
      generic: "Something went wrong. Please try again.",
    },
  },
  poll: {
    ownerDescription: "Participants see the voting buttons — you see owner controls below.",
    participantDescription: "Pick an option. Results update in real time.",
    statusOpen: "Open",
    statusClosed: "Closed",
    statusExpired: "Expired",
    voteFieldsetSr: "Choose an option to vote",
    voting: "Voting…",
    votedNotice: "Vote submitted — results update live below.",
    closedNotice: "This poll is no longer accepting votes.",
    resultsHeading: "Live results",
    noVotesYet: "No votes yet — results will appear here as soon as the first vote lands.",
    youVotedForSr: "You voted for",
    voteErrors: {
      already_voted: "You have already voted in this poll.",
      poll_closed: "This poll is closed and no longer accepts votes.",
      invalid_option: "That option does not belong to this poll.",
      rate_limited: "You are voting too fast. Please slow down.",
      session_expired: "Your session expired. Please try again.",
    },
    chart: {
      bars: "Bars",
      donut: "Donut",
      totalLabel: "Total",
      tableCaption: "Poll results",
      colOption: "Option",
      colVotes: "Votes",
      colShare: "Share",
    },
  },
  realtime: {
    connecting: "Connecting",
    connectingDetail: "Establishing a live connection…",
    live: "Live",
    liveDetail: "Results update automatically as votes come in.",
    reconnecting: "Reconnecting",
    reconnectingDetail:
      "The live connection dropped. Results will catch up once reconnected.",
    offline: "Offline",
    offlineDetail:
      "Live updates are paused. Refresh the page to get the latest results.",
    ariaLabel: "Realtime status",
  },
  manage: {
    title: "You own this poll",
    badgeAccepting: "Accepting votes",
    badgeClosed: "Closed",
    qrCaption: "Share this link or let participants scan the QR code.",
    shareLink: "Share link",
    copied: "Copied",
    copyLink: "Copy link",
    emailShare: "Share by email",
    emailSubject: "Vote in my poll",
    closePoll: "Close poll",
    reopenPoll: "Reopen poll",
    delete: "Delete",
    deleteTitle: "Delete this poll?",
    deleteDescription:
      "This permanently removes the question, options and all votes. This action cannot be undone.",
    cancel: "Cancel",
    confirmDelete: "Delete poll",
    deleting: "Deleting…",
    toasts: {
      linkCopied: "Link copied to clipboard",
      copyFailed: "Could not copy the link.",
      closed: "Poll closed",
      reopened: "Poll reopened",
      deleted: "Poll deleted",
    },
  },
  myPolls: {
    title: "My polls",
    newPoll: "New poll",
    created: "Created",
    expires: "expires",
    expired: "expired",
    emptyTitle: "No polls yet",
    emptyText: "Polls you create in this browser will show up here.",
    createFirst: "Create your first poll",
    noneYet: "You have not created any polls yet.",
    ariaList: "Your polls",
  },
  notFound: {
    title: "Page not found",
    text: "This page or poll does not exist. Check the link you were given — it may have been mistyped or the poll was deleted by its owner.",
    cta: "Create your own poll",
  },
  error: {
    title: "Something went wrong",
    text: "An unexpected error occurred. Please try again.",
    retry: "Try again",
  },
  metadata: {
    defaultTitle: "FlashVote1 — real-time polls",
    description:
      "Create a poll in seconds, share the link or QR code, and watch votes come in live.",
  },
};

export type Dictionary = typeof en;

const ru: Dictionary = {
  brand: "FlashVote1",
  nav: {
    create: "Создать",
    myPolls: "Мои опросы",
  },
  landing: {
    heading: "Спросите о чём угодно —",
    headingAccent: "и смотрите ответы в реальном времени.",
    subtitle:
      "FlashVote1 превращает вопрос в опрос с общей ссылкой и живыми результатами — без регистрации и лишних шагов.",
    featuresLabel: "Возможности",
    instant: { title: "Мгновенно", text: "Без регистрации — напишите вопрос и вперёд." },
    shareable: {
      title: "Удобно делиться",
      text: "Отправьте ссылку или дайте отсканировать QR-код.",
    },
    live: { title: "Живые результаты", text: "Голоса появляются на графике в реальном времени." },
    cardTitle: "Новый опрос",
    cardDescription: "Вы сразу получите ссылку и QR-код для участников.",
  },
  form: {
    question: "Вопрос",
    questionPlaceholder: "Где пообедаем сегодня?",
    questionHint: "символов",
    options: "Варианты ответа",
    optionPlaceholder: "Вариант",
    removeOption: "Удалить вариант",
    addOption: "Добавить вариант",
    templates: "Готовые наборы",
    templateYesNo: "Да / Нет",
    templateYesNoAbstain: "Да / Нет / Не знаю",
    templateAgree: "Согласен / Не согласен",
    expiry: "Срок действия",
    expiryNever: "Без срока",
    expiryHour: "1 час",
    expiryDay: "1 день",
    expiryWeek: "1 неделя",
    submit: "Создать опрос",
    submitting: "Создаём…",
    errors: {
      emptyQuestion: "Введите вопрос.",
      questionTooLong: "Вопрос слишком длинный.",
      emptyOption: "Варианты не могут быть пустыми.",
      duplicateOption: "Варианты должны быть уникальными.",
      tooFewOptions: "Добавьте минимум два варианта.",
      generic: "Что-то пошло не так. Попробуйте ещё раз.",
    },
  },
  poll: {
    ownerDescription: "Участники видят кнопки голосования, а вы — панель управления ниже.",
    participantDescription: "Выберите вариант. Результаты обновляются в реальном времени.",
    statusOpen: "Открыт",
    statusClosed: "Закрыт",
    statusExpired: "Истёк",
    voteFieldsetSr: "Выберите вариант для голосования",
    voting: "Голосуем…",
    votedNotice: "Голос учтён — результаты обновляются ниже в реальном времени.",
    closedNotice: "Этот опрос больше не принимает голоса.",
    resultsHeading: "Результаты в реальном времени",
    noVotesYet:
      "Пока никто не проголосовал — результаты появятся здесь, как только придёт первый голос.",
    youVotedForSr: "Вы проголосовали за",
    voteErrors: {
      already_voted: "Вы уже голосовали в этом опросе.",
      poll_closed: "Опрос закрыт и больше не принимает голоса.",
      invalid_option: "Этот вариант не относится к данному опросу.",
      rate_limited: "Слишком быстро! Пожалуйста, помедленнее.",
      session_expired: "Сессия истекла. Попробуйте ещё раз.",
    },
    chart: {
      bars: "Столбцы",
      donut: "Кольцо",
      totalLabel: "Всего",
      tableCaption: "Результаты опроса",
      colOption: "Вариант",
      colVotes: "Голоса",
      colShare: "Доля",
    },
  },
  realtime: {
    connecting: "Подключение",
    connectingDetail: "Устанавливаем живое соединение…",
    live: "Онлайн",
    liveDetail: "Результаты обновляются автоматически по мере голосования.",
    reconnecting: "Переподключение",
    reconnectingDetail:
      "Соединение прервалось. Результаты догрузятся сразу после переподключения.",
    offline: "Нет соединения",
    offlineDetail:
      "Обновления приостановлены. Обновите страницу, чтобы увидеть актуальные данные.",
    ariaLabel: "Статус обновлений",
  },
  manage: {
    title: "Это ваш опрос",
    badgeAccepting: "Принимает голоса",
    badgeClosed: "Закрыт",
    qrCaption: "Отправьте ссылку или дайте отсканировать QR-код.",
    shareLink: "Ссылка на опрос",
    copied: "Скопировано",
    copyLink: "Копировать ссылку",
    emailShare: "Поделиться по почте",
    emailSubject: "Проголосуйте в моём опросе",
    closePoll: "Закрыть опрос",
    reopenPoll: "Переоткрыть опрос",
    delete: "Удалить",
    deleteTitle: "Удалить этот опрос?",
    deleteDescription:
      "Вопрос, варианты и все голоса будут удалены безвозвратно. Действие нельзя отменить.",
    cancel: "Отмена",
    confirmDelete: "Удалить опрос",
    deleting: "Удаляем…",
    toasts: {
      linkCopied: "Ссылка скопирована в буфер обмена",
      copyFailed: "Не удалось скопировать ссылку.",
      closed: "Опрос закрыт",
      reopened: "Опрос переоткрыт",
      deleted: "Опрос удалён",
    },
  },
  myPolls: {
    title: "Мои опросы",
    newPoll: "Новый опрос",
    created: "Создан",
    expires: "истекает",
    expired: "истёк",
    emptyTitle: "Пока нет опросов",
    emptyText: "Опросы, созданные в этом браузере, появятся здесь.",
    createFirst: "Создать первый опрос",
    noneYet: "Вы ещё не создавали опросов.",
    ariaList: "Ваши опросы",
  },
  notFound: {
    title: "Страница не найдена",
    text: "Такой страницы или опроса не существует. Проверьте ссылку — возможно, она введена с ошибкой или опрос удалён владельцем.",
    cta: "Создать свой опрос",
  },
  error: {
    title: "Что-то пошло не так",
    text: "Произошла непредвиденная ошибка. Попробуйте ещё раз.",
    retry: "Повторить",
  },
  metadata: {
    defaultTitle: "FlashVote1 — опросы в реальном времени",
    description:
      "Создайте опрос за секунды, поделитесь ссылкой или QR-кодом и смотрите, как приходят голоса.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ru };

/** Localized plural form for vote counts (EN one/many, RU 1/2-4/many). */
export function pluralVotes(locale: Locale, count: number): string {
  if (locale === "ru") {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return "голос";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "голоса";
    return "голосов";
  }
  return count === 1 ? "vote" : "votes";
}
