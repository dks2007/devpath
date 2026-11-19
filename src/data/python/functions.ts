import type { Lesson } from '../../types/course'

const lesson: Lesson = {
  id: 'py-functions',
  title: 'Функції та параметри',
  summary: 'Опиши повторювані обчислення, використай іменовані аргументи та безпечні стандартні значення.',
  minutes: 15,
  sections: [
    {
      heading: 'Повернення результату',
      body: 'Функція через def дає назву дії. Запис return повертає значення виклику. Якщо залишити тільки print, функція покаже повідомлення й поверне None. Відділення обчислення від виведення дозволяє повторно використати результат у звіті.',
      code: `def line_total(price, quantity=1):
    return price * quantity

amount = line_total(30, quantity=2)
print(amount)  # 60`,
    },
    {
      heading: 'Імена аргументів',
      body: 'Позиційні аргументи пов’язуються з параметрами за порядком. Іменовані явно вказують, що означає передане значення. Не передавай один параметр одночасно за позицією й за іменем. Стандартне значення працює, коли аргумент пропущено.',
      code: `single = line_total(30)
pair = line_total(quantity=2, price=30)`,
    },
    {
      heading: 'Окремий список для виклику',
      body: 'Значення параметра за замовчуванням створюється під час визначення функції. Якщо використати список [] і доповнювати його, наступний виклик може успадкувати попередні елементи. None як ознака пропущеного аргументу дає змогу створити новий список у тілі.',
      code: `def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags`,
    },
  ],
  questions: [
    {
      id: 'py-functions-q1',
      prompt: 'Функція line_total(price, quantity=1) повертає price * quantity. Що поверне line_total(8)?',
      options: ['8', '1', 'None', 'Помилку'],
      correctIndex: 0,
      explanation: 'Пропущена quantity має стандартне значення 1.',
    },
    {
      id: 'py-functions-q2',
      prompt: 'Який виклик передасть обидва аргументи за іменем?',
      options: [
        'line_total(5, 3)',
        'line_total(5, quantity=3)',
        'line_total(price=5, quantity=3)',
        'line_total[5, 3]',
      ],
      correctIndex: 2,
      explanation: 'Позначення parameter=value у виклику зіставляє значення з конкретним параметром.',
    },
    {
      id: 'py-functions-q3',
      prompt: 'Що повертає функція після досягнення кінця тіла без return?',
      options: ['0', 'None', 'False', 'Останній надрукований текст'],
      correctIndex: 1,
      explanation: 'За відсутності явного повернення Python повертає None.',
    },
    {
      id: 'py-functions-q4',
      prompt: 'Чому список як змінне стандартне значення може накопичувати дані між викликами?',
      options: [
        'Усі локальні імена глобальні',
        'Python завжди копіює список',
        'def забороняє списки',
        'Значення за замовчуванням створено один раз',
      ],
      correctIndex: 3,
      explanation: 'Кілька викликів з пропущеним аргументом отримують той самий об’єкт.',
    },
    {
      id: 'py-functions-q5',
      prompt: 'Функція line_total має параметри price і quantity=1 саме в такому порядку. У чому проблема виклику line_total(10, price=3)?',
      options: [
        'Параметр price передано двічі',
        'Передати число 10 неможливо',
        'quantity має бути рядком',
        'Іменовані аргументи заборонені',
      ],
      correctIndex: 0,
      explanation:
        'Перший позиційний аргумент уже надав значення price, тому повторне надання спричинить TypeError.',
    },
  ],
}

export default lesson
