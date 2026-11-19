import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'js-modules',
  title: 'Модулі та відповідальність',
  summary: 'Розділи розрахунки й відображення між файлами та зв’яжи їх через імпорт.',
  minutes: 13,
  sections: [
    {
      heading: 'Межа модуля',
      body: 'Окремий файл може містити правила, потрібні кільком сторінкам. Експортуй функцію розрахунку відсотків, а допоміжні деталі залишай всередині модуля. Використання export робить доступними лише вибрані імена.',
      code: `// progress.js
export function percent(done, total) {
  return total === 0 ? 0 : Math.round(done / total * 100);
}`,
    },
    {
      heading: 'Явна залежність',
      body: 'Для іменованого експорту вкажи точну назву у фігурних дужках. Відносний шлях читається від поточного файлу. У браузерному HTML підключи вхідний скрипт із type="module", щоб браузер розібрав імпорти.',
      code: `// dashboard.js
import { percent } from "./progress.js";
const label = percent(3, 4) + "%";`,
    },
    {
      heading: 'Перевірка окремого правила',
      body: 'Правилу підрахунку не потрібні document або localStorage. Тест імпортує ту саму функцію, яку використовує інтерфейс. Залежність спрямована від сторінки до обчислення. Оновлення тексту кнопки тоді не впливає на формулу.',
      code: `import { percent } from "./progress.js";
const actual = percent(1, 4);
if (actual !== 25) throw new Error("Очікували 25");`,
    },
  ],
  questions: [
    {
      id: 'js-modules-q1',
      prompt: 'Який імпорт відповідає export function percent() {}?',
      options: [
        'import percent from "./progress.js"',
        'import { percent } from "./progress.js"',
        'include "percent"',
        'export percent from "./progress.js"',
      ],
      correctIndex: 1,
      explanation: 'Фігурні дужки позначають імпорт за експортованим ім’ям.',
    },
    {
      id: 'js-modules-q2',
      prompt: 'Від чого залежить шлях "./progress.js" у відносному import?',
      options: [
        'Від файлу, який містить import',
        'Від назви функції',
        'Від останнього кліку',
        'Від першого відкритого модуля',
      ],
      correctIndex: 0,
      explanation: 'Відносний шлях розв’язується з розташування поточного модуля.',
    },
    {
      id: 'js-modules-q3',
      prompt: 'Яка ознака робить функцію зручнішою для окремих модульних тестів?',
      options: [
        'Вона щоразу читає DOM',
        'Вона залежить від системного часу',
        'Вона приймає аргументи й повертає передбачуваний результат',
        'Вона показує alert',
      ],
      correctIndex: 2,
      explanation: 'Тест контролює аргументи й може порівняти результат без браузерних побічних ефектів.',
    },
    {
      id: 'js-modules-q4',
      prompt: 'Як підключити в HTML вхідний файл із браузерними import?',
      options: [
        '<script lang="import" src="app.js"></script>',
        '<link href="app.js">',
        '<style src="app.js"></style>',
        '<script type="module" src="app.js"></script>',
      ],
      correctIndex: 3,
      explanation: 'Тип module вмикає обробку скрипту як модуля ECMAScript.',
    },
    {
      id: 'js-modules-q5',
      prompt: 'Навіщо тримати розрахунок XP в одному модулі для кількох сторінок?',
      options: [
        'Щоб одна зміна формули застосувалася до всіх імпортерів',
        'Щоб прибрати потребу у перевірках',
        'Щоб обчислення виконувалося лише при запуску',
        'Щоб приховати код від браузера',
      ],
      correctIndex: 0,
      explanation: 'Спільна функція підтримує однаковий результат у різних частинах інтерфейсу.',
    },
  ],
}

export default lesson
