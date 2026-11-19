import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-objects',
  title: 'Об’єкти та копіювання',
  summary: 'Опиши профіль учня, прочитай вкладені дані й онови їх без випадкової зміни оригіналу.',
  minutes: 15,
  sections: [
    {
      heading: 'Доступ до властивостей',
      body: 'Об’єкт об’єднує іменовані значення. Крапка читає властивість із відомою назвою. Квадратні дужки обчислюють ключ, тому зручні, якщо його назву вибирає користувач.',
      code: `const learner = { name: "Іра", points: 40 };
const field = "points";
console.log(learner[field]); // 40`,
    },
    {
      heading: 'Посилання й копія',
      body: 'Присвоєння об’єкта іншій змінній зберігає посилання на той самий об’єкт. Щоб зберегти попередній профіль для історії, створи новий через розгортання. Розмісти оновлене поле після ...learner, і його значення матиме перевагу.',
      code: `const updated = { ...learner, points: 50 };
// learner.points досі дорівнює 40`,
    },
    {
      heading: 'Вкладене значення',
      body: 'Розгортання копіює лише один рівень об’єкта. Якщо зміна торкається вкладених налаштувань профілю, створи окрему копію також для них. Оператор ?. дозволяє прочитати поле, коли проміжний об’єкт може бути відсутнім.',
      code: `const profile = { settings: { theme: "light" } };
const dark = {
  ...profile,
  settings: { ...profile.settings, theme: "dark" },
};
console.log(dark.settings?.theme);`,
    },
  ],
  questions: [
    {
      id: 'js-objects-q1',
      prompt: 'Як прочитати учнівські бали за ключем, назва якого зберігається у field?',
      options: ['learner.field', 'learner[field]', 'learner("field")', 'field.learner'],
      correctIndex: 1,
      explanation: 'Квадратні дужки обчислюють змінну field та використовують її значення як ключ.',
    },
    {
      id: 'js-objects-q2',
      prompt: 'Нехай a = { points: 0 }. Після оголошення const b = a у властивість b.points записали 2. Що змінилося?',
      options: [
        'a матиме окрему копію',
        'Зміниться лише ім’я b',
        'a.points теж стане 2',
        'JavaScript завжди викине помилку',
      ],
      correctIndex: 2,
      explanation: 'Імена a та b посилаються на один об’єкт.',
    },
    {
      id: 'js-objects-q3',
      prompt: 'Яке значення points у { ...{ points: 5 }, points: 8 }?',
      options: ['8', '5', '13', 'undefined'],
      correctIndex: 0,
      explanation: 'Пізніший запис властивості з таким самим ключем замінює попереднє значення.',
    },
    {
      id: 'js-objects-q4',
      prompt: 'Після оголошення const a = {} яким буде значення виразу a.settings?.theme?',
      options: ['null', 'false', '"theme"', 'undefined'],
      correctIndex: 3,
      explanation:
        'Проміжне значення settings відсутнє. Опціональний ланцюжок завершується значенням undefined.',
    },
    {
      id: 'js-objects-q5',
      prompt: 'Що скопіює { ...profile } для profile = { settings: { theme: "dark" } }?',
      options: [
        'Усі вкладені об’єкти рекурсивно',
        'Верхній рівень зі спільним посиланням на settings',
        'Лише рядкові значення',
        'Порожній об’єкт',
      ],
      correctIndex: 1,
      explanation:
        'Операція розгортання є поверхневою. Вкладений settings треба копіювати окремо для незалежних змін.',
    },
  ],
}

export default lesson
