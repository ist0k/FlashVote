import type { Locale } from "@/lib/i18n/config";

const en = {
  brand: "FlashVote",
  nav: {
    create: "Create",
    myPolls: "My votes",
  },
  landing: {
    heading: "Ask anything.",
    headingAccent: "Watch the answers roll in live.",
    subtitle:
      "FlashVote turns a question into a shareable vote with real-time results — no accounts, no friction.",
    featuresLabel: "Features",
    instant: { title: "Instant", text: "No sign-up required — write a question and go." },
    shareable: { title: "Shareable", text: "Send a link or let people scan the QR code." },
    live: { title: "Live results", text: "Votes appear on the chart in real time." },
    cardTitle: "Create a new vote",
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
    expiry: "Vote expiration",
    expiryNever: "No expiry",
    expiryHour: "1 hour",
    expiryDay: "1 day",
    expiryWeek: "1 week",
    submit: "Create vote",
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
    closedNotice: "Voting has ended for this vote.",
    resultsHeading: "Live results",
    noVotesYet: "No votes yet — results will appear here as soon as the first vote lands.",
    youVotedForSr: "You voted for",
    changeVote: "Change vote",
    voteErrors: {
      already_voted: "You have already cast your vote.",
      poll_closed: "This vote is closed and no longer accepts responses.",
      invalid_option: "That option does not belong to this vote.",
      rate_limited: "You are voting too fast. Please slow down.",
      session_expired: "Your session expired. Please try again.",
      no_vote_to_change: "You have not cast a vote yet.",
      vote_change_failed: "Could not change the vote. Please try again.",
    },
    chart: {
      bars: "Bars",
      donut: "Donut",
      totalLabel: "Total",
      tableCaption: "Vote results",
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
    title: "You own this vote",
    badgeAccepting: "Accepting votes",
    badgeClosed: "Closed",
    qrCaption: "Share this link or let participants scan the QR code.",
    shareLink: "Share link",
    copied: "Copied",
    copyLink: "Copy link",
    emailShare: "Share by email",
    emailSubject: "Cast your vote",
    closePoll: "Close voting",
    reopenPoll: "Reopen voting",
    delete: "Delete",
    deleteTitle: "Delete this vote?",
    deleteDescription:
      "This permanently removes the question, options and all votes. This action cannot be undone.",
    cancel: "Cancel",
    confirmDelete: "Delete vote",
    deleting: "Deleting…",
    toasts: {
      linkCopied: "Link copied to clipboard",
      copyFailed: "Could not copy the link.",
      closed: "Vote closed",
      reopened: "Vote reopened",
      deleted: "Vote deleted",
    },
  },
  myPolls: {
    title: "My votes",
    hint: "Only you see this list — participants open your votes via direct link.",
    newPoll: "New vote",
    created: "Created",
    expires: "expires",
    expired: "expired",
    emptyTitle: "No votes yet",
    emptyText: "Votes you create in this browser will show up here.",
    createFirst: "Create your first vote",
    noneYet: "You have not created any votes yet.",
    ariaList: "Your votes",
  },
  notFound: {
    title: "Page not found",
    text: "This page or vote does not exist. Check the link you were given — it may have been mistyped or the vote was deleted by its owner.",
    cta: "Create your own vote",
  },
  error: {
    title: "Something went wrong",
    text: "An unexpected error occurred. Please try again.",
    retry: "Try again",
  },
  metadata: {
    defaultTitle: "FlashVote — real-time voting",
    description:
      "Create a vote in seconds, share the link or QR code, and watch responses come in live.",
  },
};

export type Dictionary = typeof en;

const ru: Dictionary = {
  brand: "FlashVote",
  nav: {
    create: "Создать",
    myPolls: "Мои голосования",
  },
  landing: {
    heading: "Спросите о чём угодно —",
    headingAccent: "и смотрите ответы в реальном времени.",
    subtitle:
      "FlashVote превращает вопрос в голосование с общей ссылкой и живыми результатами — без регистрации и лишних шагов.",
    featuresLabel: "Возможности",
    instant: { title: "Мгновенно", text: "Без регистрации — напишите вопрос и вперёд." },
    shareable: {
      title: "Удобно делиться",
      text: "Отправьте ссылку или дайте отсканировать QR-код.",
    },
    live: { title: "Живые результаты", text: "Ответы появляются на графике в реальном времени." },
    cardTitle: "Новое голосование",
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
    expiry: "Срок голосования",
    expiryNever: "Без срока",
    expiryHour: "1 час",
    expiryDay: "1 день",
    expiryWeek: "1 неделя",
    submit: "Создать голосование",
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
    ownerDescription: "Участники видят кнопки для ответа, а вы — панель управления ниже.",
    participantDescription: "Выберите вариант. Результаты обновляются в реальном времени.",
    statusOpen: "Открыто",
    statusClosed: "Завершено",
    statusExpired: "Истекло",
    voteFieldsetSr: "Выберите вариант для голосования",
    voting: "Голосуем…",
    votedNotice: "Голос учтён — результаты обновляются ниже в реальном времени.",
    closedNotice: "Голосование завершено.",
    resultsHeading: "Результаты в реальном времени",
    noVotesYet:
      "Пока никто не ответил — результаты появятся здесь, как только придёт первый голос.",
    youVotedForSr: "Вы проголосовали за",
    changeVote: "Изменить голос",
    voteErrors: {
      already_voted: "Вы уже отдали свой голос.",
      poll_closed: "Голосование закрыто и больше не принимает ответы.",
      invalid_option: "Этот вариант не относится к данному голосованию.",
      rate_limited: "Слишком быстро! Пожалуйста, помедленнее.",
      session_expired: "Сессия истекла. Попробуйте ещё раз.",
      no_vote_to_change: "Вы ещё не голосовали.",
      vote_change_failed: "Не удалось изменить голос. Попробуйте ещё раз.",
    },
    chart: {
      bars: "Столбцы",
      donut: "Кольцо",
      totalLabel: "Всего",
      tableCaption: "Результаты голосования",
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
    title: "Это ваше голосование",
    badgeAccepting: "Принимает ответы",
    badgeClosed: "Завершено",
    qrCaption: "Отправьте ссылку или дайте отсканировать QR-код.",
    shareLink: "Ссылка на голосование",
    copied: "Скопировано",
    copyLink: "Копировать ссылку",
    emailShare: "Поделиться по почте",
    emailSubject: "Пожалуйста, проголосуйте",
    closePoll: "Завершить голосование",
    reopenPoll: "Возобновить голосование",
    delete: "Удалить",
    deleteTitle: "Удалить это голосование?",
    deleteDescription:
      "Вопрос, варианты и все ответы будут удалены безвозвратно. Действие нельзя отменить.",
    cancel: "Отмена",
    confirmDelete: "Удалить голосование",
    deleting: "Удаляем…",
    toasts: {
      linkCopied: "Ссылка скопирована в буфер обмена",
      copyFailed: "Не удалось скопировать ссылку.",
      closed: "Голосование завершено",
      reopened: "Голосование возобновлено",
      deleted: "Голосование удалено",
    },
  },
  myPolls: {
    title: "Мои голосования",
    hint: "Этот список видите только вы — участники открывают ваши голосования по прямой ссылке.",
    newPoll: "Новое голосование",
    created: "Создано",
    expires: "истекает",
    expired: "истекло",
    emptyTitle: "Пока нет голосований",
    emptyText: "Голосования, созданные в этом браузере, появятся здесь.",
    createFirst: "Создать первое голосование",
    noneYet: "Вы ещё не создавали голосований.",
    ariaList: "Ваши голосования",
  },
  notFound: {
    title: "Страница не найдена",
    text: "Такой страницы или голосования не существует. Проверьте ссылку — возможно, она введена с ошибкой или голосование удалено владельцем.",
    cta: "Создать своё голосование",
  },
  error: {
    title: "Что-то пошло не так",
    text: "Произошла непредвиденная ошибка. Попробуйте ещё раз.",
    retry: "Повторить",
  },
  metadata: {
    defaultTitle: "FlashVote — голосование в реальном времени",
    description:
      "Создайте голосование за секунды, поделитесь ссылкой или QR-кодом и смотрите, как приходят ответы.",
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
