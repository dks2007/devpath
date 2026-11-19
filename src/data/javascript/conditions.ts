import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-conditions',
  title: 'Умови та логічні вирази',
  summary: 'Опиши правила допуску до тесту за допомогою порівнянь, if та логічних операторів.',
  minutes: 13,
  sections: [
    {
      heading: 'Умова доступу',
      body: 'Порівняння повертає true або false. Познач мінімум балів і перевір його через >=, щоб зарахувати також граничне значення. У гілці else передбач повідомлення для учня, якому бракує балів.',
      code: `const score = 4;
if (score >= 4) {
  console.log("Тест складено");
} else {
  console.log("Спробуй ще раз");
}`,
    },
    {
      heading: 'Кілька вимог одночасно',
      body: 'Оператор && вимагає істинності обох умов. Оператор || підходить, якщо достатньо однієї. Групуй пов’язані перевірки дужками. Строга рівність === порівнює значення без перетворення тексту на число.',
      code: `const hasProfile = true;
const isFree = false;
const hasPass = true;
const canStart = hasProfile && (isFree || hasPass);
// canStart дорівнює true`,
    },
    {
      heading: 'Перевір межі',
      body: 'Розглянь три значення для правила «від чотирьох балів» — 3, 4 і 5. Саме 4 виявляє різницю між > і >=. Гілки if / else if перевіряються зверху вниз. Якщо кілька умов можуть бути істинними, починай із найвужчої.',
      code: `if (score === 5) {
  console.log("Бездоганно");
} else if (score >= 4) {
  console.log("Складено");
}`,
    },
  ],
  questions: [
    {
      id: 'js-conditions-q1',
      prompt: 'Яка умова включає рівно 10 XP у правило «від 10 XP»?',
      options: ['xp > 10', 'xp === 9', 'xp < 10', 'xp >= 10'],
      correctIndex: 3,
      explanation: 'Оператор >= включає граничне значення 10.',
    },
    {
      id: 'js-conditions-q2',
      prompt: 'Що поверне 5 === "5"?',
      options: ['true', 'false', '5', 'undefined'],
      correctIndex: 1,
      explanation: 'Рядок і число мають різні типи, тому строга рівність дає false.',
    },
    {
      id: 'js-conditions-q3',
      prompt: 'Доступ вимагає і квитка, і підтвердження. Який вираз це описує?',
      options: ['ticket || confirmed', '!ticket', 'ticket && confirmed', 'ticket === confirmed'],
      correctIndex: 2,
      explanation: 'Логічне І вимагає, щоб обидві ознаки були істинними.',
    },
    {
      id: 'js-conditions-q4',
      prompt: 'Коли виконається else після if (count > 0), якщо count — звичайне ціле число?',
      options: ['Для count <= 0', 'Лише для count === 0', 'Для будь-якого count', 'Для count > 1'],
      correctIndex: 0,
      explanation: 'Гілка else виконується для всіх чисел, які не перевищують нуль.',
    },
    {
      id: 'js-conditions-q5',
      prompt: 'Яка перевірка найкраще виявляє помилку між score > 4 та score >= 4?',
      options: ['score = 6', 'score = 1', 'score = 3', 'score = 4'],
      correctIndex: 3,
      explanation: 'Для значення 4 два порівняння повертають різні результати.',
    },
  ],
}

export default lesson
