import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-arrays',
  title: 'Масиви та ітерації',
  summary: 'Оброби список результатів, знайди потрібний елемент і побудуй нову колекцію.',
  minutes: 16,
  sections: [
    {
      heading: 'Послідовність даних',
      body: 'Масив зберігає елементи в певному порядку. Індекс першого елемента дорівнює нулю. Властивість length дорівнює кількості позицій, тому останній індекс непорожнього масиву на одиницю менший.',
      code: `const scores = [2, 5, 4];
const first = scores[0]; // 2
const last = scores[scores.length - 1]; // 4`,
    },
    {
      heading: 'Перебір із накопичувачем',
      body: 'Цикл for...of по черзі надає значення елементів. Тримай проміжний результат поза тілом циклу, щоб кожна ітерація доповнювала попередню. Для порожнього списку сума залишиться початковим нулем.',
      code: `let total = 0;
for (const score of scores) {
  total += score;
}
// total дорівнює 11`,
    },
    {
      heading: 'Відбір і перетворення',
      body: 'filter зберігає елементи, для яких умова повернула істину. map будує елемент нового масиву з кожного початкового. У тесті п’ять запитань, кожна правильна відповідь дає 20 %. Спершу відбери спроби з чотирма або п’ятьма правильними відповідями, тоді переведи результати у відсотки.',
      code: `const percentages = scores
  .filter(score => score >= 4)
  .map(score => score * 20);
// [100, 80]`,
    },
  ],
  questions: [
    {
      id: 'js-arrays-q1',
      prompt: 'Що містить [7, 9, 2][1]?',
      options: ['7', '9', '2', 'undefined'],
      correctIndex: 1,
      explanation: 'Індекс 1 посилається на другий елемент.',
    },
    {
      id: 'js-arrays-q2',
      prompt: 'Яка операція збере лише додатні числа?',
      options: ['values.map(n => n > 0)', 'values.length', 'values.filter(n => n > 0)', 'values[0]'],
      correctIndex: 2,
      explanation: 'filter залишає початкові елементи, що задовольняють умову.',
    },
    {
      id: 'js-arrays-q3',
      prompt: 'Який результат [1, 3].map(n => n * 2)?',
      options: ['[2, 6]', '[1, 3, 2]', '6', '[true, true]'],
      correctIndex: 0,
      explanation: 'map застосовує множення окремо до кожного числа.',
    },
    {
      id: 'js-arrays-q4',
      prompt: 'Які значення послідовно отримає n у for (const n of [8, 3])?',
      options: ['0 і 1', '1 і 2', 'Лише 8', '8 і 3'],
      correctIndex: 3,
      explanation: 'for...of читає значення ітерованого об’єкта в його порядку.',
    },
    {
      id: 'js-arrays-q5',
      prompt: 'Що поверне [2, 3].filter(n => n > 10)?',
      options: ['undefined', '[]', '[false, false]', '0'],
      correctIndex: 1,
      explanation: 'Результат filter завжди є масивом. Цього разу підходящих значень немає.',
    },
  ],
}

export default lesson
