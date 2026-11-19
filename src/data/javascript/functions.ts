import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-functions',
  title: 'Функції та область видимості',
  summary: 'Винеси розрахунок у функцію, передай аргументи й поверни результат для інтерфейсу.',
  minutes: 15,
  sections: [
    {
      heading: 'Контракт функції',
      body: 'Параметри описують дані, які функція очікує. Аргументи є конкретними значеннями під час виклику. Повернене через return число можна використати у формулі або порівнянні.',
      code: `function lessonPoints(correct, bonus = 0) {
  return correct * 10 + bonus;
}
const points = lessonPoints(4, 5); // 45`,
    },
    {
      heading: 'Межі імен',
      body: 'Локальні змінні належать своєму блоку чи функції. Дві функції можуть мати параметр з однаковим іменем. Якщо обчислення залежить лише від параметрів, у тесті достатньо передати відомі аргументи й перевірити результат.',
      code: `function percent(done, total) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}`,
    },
    {
      heading: 'Виведення і повернення',
      body: 'console.log показує значення в консолі. Щоб виклик став частиною подальшого обчислення, функція має повернути значення. Коротку функцію з одним виразом можна записати через стрілку. У тілі стрілки з фігурними дужками потрібен явний return.',
      code: `const double = value => value * 2;
const reward = double(6) + 1; // 13`,
    },
  ],
  questions: [
    {
      id: 'js-functions-q1',
      prompt: 'Функція lessonPoints(correct, bonus = 0) повертає correct * 10 + bonus. Що поверне lessonPoints(3)?',
      options: ['3', '30', 'undefined', 'NaN'],
      correctIndex: 1,
      explanation: 'Параметр bonus за замовчуванням дорівнює нулю, тому 3 × 10 + 0 = 30.',
    },
    {
      id: 'js-functions-q2',
      prompt: 'Що робить return всередині функції?',
      options: [
        'Переходить до наступного рядка',
        'Виводить текст на екран',
        'Завершує поточний виклик і повертає значення',
        'Повторює виклик',
      ],
      correctIndex: 2,
      explanation: 'Далі керування повертається до місця виклику.',
    },
    {
      id: 'js-functions-q3',
      prompt: 'Функція percent(done, total) спочатку перевіряє if (total === 0) return 0, а далі обчислює відсоток. Чому percent(0, 0) поверне 0?',
      options: [
        'Спрацює ранній return',
        'Math.round завжди дає 0',
        '0 / 0 дорівнює 0',
        'Параметри ігноруються',
      ],
      correctIndex: 0,
      explanation: 'Перевірка total === 0 спрацьовує ще до ділення.',
    },
    {
      id: 'js-functions-q4',
      prompt: 'Яка стрілкова функція поверне квадрат числа?',
      options: ['n => { n * n; }', 'n => console.log(n * n)', 'n => n + n', 'n => n * n'],
      correctIndex: 3,
      explanation: 'Тіло без фігурних дужок неявно повертає значення свого виразу.',
    },
    {
      id: 'js-functions-q5',
      prompt: 'Що поверне function ping() { console.log(1); } при виклику?',
      options: ['1', 'undefined', 'true', 'null'],
      correctIndex: 1,
      explanation:
        'Виклик console.log здійснює виведення. Досягнувши кінця тіла без return, ping повертає undefined.',
    },
  ],
}

export default lesson
