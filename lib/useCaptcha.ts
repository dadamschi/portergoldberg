import { useState, useCallback } from 'react'

type CaptchaState = {
  num1: number
  num2: number
  answer: string
  isValid: boolean
}

export function useCaptcha() {
  const generateProblem = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    return { num1, num2, answer: '', isValid: false }
  }, [])

  const [captcha, setCaptcha] = useState<CaptchaState>(generateProblem)

  const setAnswer = useCallback((value: string) => {
    const correctAnswer = captcha.num1 + captcha.num2
    setCaptcha(prev => ({
      ...prev,
      answer: value,
      isValid: parseInt(value, 10) === correctAnswer
    }))
  }, [captcha.num1, captcha.num2])

  const reset = useCallback(() => {
    setCaptcha(generateProblem())
  }, [generateProblem])

  const question = `${captcha.num1} + ${captcha.num2} = ?`

  return {
    question,
    answer: captcha.answer,
    isValid: captcha.isValid,
    setAnswer,
    reset
  }
}
