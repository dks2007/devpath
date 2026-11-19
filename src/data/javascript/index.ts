import type { Course } from '../../types/course'
import variables from './variables'
import conditions from './conditions'
import functions from './functions'
import arrays from './arrays'
import objects from './objects'
import strings from './strings'
import dom from './dom'
import asyncLesson from './async'
import modules from './modules'
import storage from './storage'

export const javascript: Course = {
  id: 'javascript',
  title: 'Основи JavaScript',
  description: 'Опануй змінні, функції та DOM, щоб додавати інтерактивність вебсторінкам.',
  lessons: [variables, conditions, functions, arrays, objects, strings, dom, asyncLesson, modules, storage],
}
