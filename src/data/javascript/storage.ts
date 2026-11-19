import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-storage',
  title: 'Практикум із локального збереження',
  summary: 'Збери мінісховище, яке читає JSON, перевіряє вміст і переживає пошкоджений запис.',
  minutes: 20,
  sections: [
    {
      heading: 'Формат на межі системи',
      body: 'localStorage зберігає рядки для поточного походження сайту. Перед записом об’єкта серіалізуй його через JSON.stringify. Замість кількох неузгоджених ключів запиши одну невелику структуру з версією формату.',
      code: `const record = { version: 1, completed: ["intro"] };
localStorage.setItem("progress", JSON.stringify(record));`,
    },
    {
      heading: 'Перевірка після читання',
      body: 'Синтаксично правильний JSON може містити null, число чи об’єкт з помилковими полями. Перевір тип кожного потрібного поля. Для списку завершених уроків перевір сам масив та типи всіх його елементів. У реальному каталозі варто перевіряти також наявність кожного ID.',
      code: `function isRecord(value) {
  return value !== null && typeof value === "object"
    && value.version === 1
    && Array.isArray(value.completed)
    && value.completed.every(id => typeof id === "string");
}`,
    },
    {
      heading: 'Відновлення після збою',
      body: 'Відсутній ключ дає null, а пошкоджений JSON спричиняє виняток під час розбору. Оброби обидві ситуації. Повертай новий початковий об’єкт для кожного невдалого читання. Саме читання не повинно перезаписувати вміст сховища.',
      code: `function readProgress() {
  const empty = { version: 1, completed: [] };
  try {
    const raw = localStorage.getItem("progress");
    if (raw === null) return empty;
    const data = JSON.parse(raw);
    return isRecord(data) ? data : empty;
  } catch {
    return empty;
  }
}`,
    },
  ],
  questions: [
    {
      id: 'js-storage-q1',
      prompt: 'Чим підготувати об’єкт для запису через localStorage.setItem?',
      options: ['Number', 'JSON.parse', 'toFixed', 'JSON.stringify'],
      correctIndex: 3,
      explanation: 'JSON.stringify серіалізує підтримувані значення у текст JSON.',
    },
    {
      id: 'js-storage-q2',
      prompt: 'Що повертає localStorage.getItem для відсутнього ключа?',
      options: ['[]', 'null', '""', 'false'],
      correctIndex: 1,
      explanation: 'Відсутність ключа сховище представляє значенням null.',
    },
    {
      id: 'js-storage-q3',
      prompt: 'Навіщо перевіряти результат успішного JSON.parse?',
      options: [
        'Результат завжди масив',
        'JSON повертає тільки текст',
        'Синтаксис може бути валідним, а структура — непридатною',
        'Щоб запустити код із файлу',
      ],
      correctIndex: 2,
      explanation: 'Парсер не знає, які версії, поля й типи підтримує застосунок.',
    },
    {
      id: 'js-storage-q4',
      prompt: 'Поле ids прочитано з JSON. Яка перевірка підтвердить, що це масив рядків?',
      options: [
        'Array.isArray(ids) && ids.every(x => typeof x === "string")',
        'typeof ids === "array"',
        'ids.length > 0',
        'ids === []',
      ],
      correctIndex: 0,
      explanation: 'Array.isArray перевіряє контейнер, а every — кожне його значення.',
    },
    {
      id: 'js-storage-q5',
      prompt: 'Що має зробити читання після помилки розбору пошкодженого запису?',
      options: [
        'Безумовно зупинити весь сайт',
        'Виконати пошкоджений текст',
        'Зарахувати всі уроки',
        'Повернути контрольований початковий стан',
      ],
      correctIndex: 3,
      explanation: 'Початковий стан дозволяє інтерфейсу відкритися та відновити нормальну роботу.',
    },
  ],
}

export default lesson
