import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-variables',
  title: 'Змінні та типи даних',
  summary: 'Збережи дані першого профілю, добери типи для його полів і передбач результат виразу.',
  minutes: 12,
  sections: [
    {
      heading: 'Ім’я для значення',
      body: 'У профілі учня є ім’я, кількість балів і ознака підписки. JavaScript представляє їх як рядок, число й логічне значення. Лапки зберігають запис як текст, тому «42» і 42 поводяться по-різному під час обчислень.',
      code: `const name = "Оля";
let points = 40;
const subscribed = false;`,
    },
    {
      heading: 'Коли потрібен let',
      body: 'Використовуй const для імені, якому не плануєш присвоювати нове значення. Для лічильника, що змінюється після уроку, підійде let. Рядки у зворотних лапках дозволяють підставити поточне значення у підпис.',
      code: `points = points + 10;
const label = \`\${name} має \${points} XP\`;
// Оля має 50 XP`,
    },
    {
      heading: 'Передбач результат',
      body: 'Оператор + з двома числами виконує додавання. Якщо один з операндів є рядком, поєднує текст. Уяви поле форми зі значенням «12». Спочатку переведи текст у число через Number, а потім додай нагороду. Для значення «код» Number поверне NaN.',
      code: `const fromForm = "12";
const total = Number(fromForm) + 3;
// total дорівнює 15`,
    },
  ],
  questions: [
    {
      id: 'js-variables-q1',
      prompt: 'Після кожного уроку змінна points отримує нове число. Як її оголосити?',
      options: ['const points = 0;', 'let points = 0;', 'string points = 0;', 'const = points;'],
      correctIndex: 1,
      explanation: 'let дозволяє повторно присвоювати значення оголошеній змінній.',
    },
    {
      id: 'js-variables-q2',
      prompt: 'Яке значення має вираз "8" + 2?',
      options: ['10', '"82"', '82', '"10"'],
      correctIndex: 1,
      explanation: 'Лівий операнд є рядком, тому + перетворює 2 на текст і поєднує символи.',
    },
    {
      id: 'js-variables-q3',
      prompt: 'Яке значення найкраще зберігає факт завершення уроку?',
      options: ['"true"', '1', 'true', '"так"'],
      correctIndex: 2,
      explanation: 'Логічне значення true прямо представляє стан, який може бути істинним або хибним.',
    },
    {
      id: 'js-variables-q4',
      prompt: 'Чому дорівнює Number("16") + 4?',
      options: ['20', '"164"', '"20"', 'NaN'],
      correctIndex: 0,
      explanation: 'Number перетворює десятковий текст на число, тож далі виконується додавання.',
    },
    {
      id: 'js-variables-q5',
      prompt: 'Що поверне typeof "25"?',
      options: ['"number"', '"boolean"', '"integer"', '"string"'],
      correctIndex: 3,
      explanation: 'Лапки створюють рядкове значення незалежно від його вмісту.',
    },
  ],
}

export default lesson
