// src/@types/react-color.d.ts
declare module 'react-color' {
  import { Component } from 'react'

  // Определяем интерфейс для результата цвета
  export interface ColorResult {
    hex: string
    rgb: { r: number; g: number; b: number; a?: number }
    hsl: { h: number; s: number; l: number; a?: number }
    // Добавьте другие свойства по мере необходимости
  }

  // Определяем интерфейс для свойств SketchPicker
  export interface SketchPickerProps {
    color?: string
    onChange?: (color: ColorResult) => void
    onChangeComplete?: (color: ColorResult) => void
    // Добавьте другие свойства по мере необходимости
  }

  // Определяем класс SketchPicker с конкретными пропсами
  export class SketchPicker extends Component<SketchPickerProps> {}

  // Экспортируем по умолчанию
  export default SketchPicker
}
