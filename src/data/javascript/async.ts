import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-async',
  title: 'Проміси та async/await',
  summary: 'Дочекайся даних у потрібному порядку й оброби помилки асинхронної операції.',
  minutes: 17,
  sections: [
    {
      heading: 'Обіцянка майбутнього значення',
      body: 'Асинхронна операція може завершитися значенням або помилкою. Функція з async завжди повертає проміс. await усередині неї призупиняє продовження цієї функції до завершення промісу, а браузер у цей час обробляє інші події.',
      code: `async function readTitle() {
  const course = await Promise.resolve({ title: "Python" });
  return course.title;
}
// readTitle() повертає проміс`,
    },
    {
      heading: 'Статус відповіді',
      body: 'fetch виконує HTTP-запит і повертає проміс об’єкта Response. Відповідь із кодом 404 теж може успішно надійти мережею. Перевір response.ok перед читанням тіла. Перетворення тіла через json() також потребує очікування.',
      code: `async function loadCourse(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Курс недоступний");
  return await response.json();
}`,
    },
    {
      heading: 'Завжди заверши стан завантаження',
      body: 'Передай у refresh два елементи сторінки — поле повідомлення та індикатор завантаження. Огорни очікування в try. Якщо проміс відхилено, керування перейде в catch. У finally сховай індикатор і після успішної відповіді, і після помилки.',
      code: `async function refresh(status, indicator) {
  indicator.hidden = false;
  try {
    const course = await loadCourse("/course.json");
    status.textContent = course.title;
  } catch {
    status.textContent = "Не вдалося завантажити курс. Повтори спробу.";
  } finally {
    indicator.hidden = true;
  }
}`,
    },
  ],
  questions: [
    {
      id: 'js-async-q1',
      prompt: 'Що повертає async function count() { return 2; } при виклику?',
      options: [
        'Число 2 безпосередньо',
        'Проміс, що виконається зі значенням 2',
        'undefined',
        'Функцію count',
      ],
      correctIndex: 1,
      explanation: 'async обгортає повернене значення у проміс.',
    },
    {
      id: 'js-async-q2',
      prompt: 'Яке поле Response показує, що HTTP-статус у діапазоні 200–299?',
      options: ['response.body', 'response.url', 'response.ok', 'response.done'],
      correctIndex: 2,
      explanation: 'Булева ознака ok відповідає успішному діапазону статусів.',
    },
    {
      id: 'js-async-q3',
      prompt: 'Коли try/catch перехопить відхилення промісу у своєму блоці?',
      options: [
        'Коли в try очікують цей проміс через await',
        'Лише за статусу 200',
        'За будь-якого створення промісу десь у програмі',
        'Тільки через finally',
      ],
      correctIndex: 0,
      explanation: 'Відхилений await породжує помилку в межах поточного try.',
    },
    {
      id: 'js-async-q4',
      prompt: 'У який блок помістити вимкнення індикатора після будь-якого результату?',
      options: ['Тільки catch', 'Лише на початок try', 'Перед fetch', 'finally'],
      correctIndex: 3,
      explanation: 'finally виконується після try або catch незалежно від результату операції.',
    },
    {
      id: 'js-async-q5',
      prompt: 'Яке значення поверне await Promise.resolve("готово")?',
      options: ['Об’єкт Promise', '"готово"', 'true', 'null'],
      correctIndex: 1,
      explanation: 'await отримує значення успішно виконаного промісу.',
    },
  ],
}

export default lesson
