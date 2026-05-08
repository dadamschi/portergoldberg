import { useState, useCallback, useEffect } from 'react'

type CaptchaState = {
  num1: number
  num2: number
  answer: string
  isValid: boolean
}

function generateProblem(): CaptchaState {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  return { num1, num2, answer: '', isValid: false }
}

export function useCaptcha() {
  // Start with zeros to avoid hydration mismatch, then generate on client
  const [captcha, setCaptcha] = useState<CaptchaState>({ num1: 0, num2: 0, answer: '', isValid: false })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCaptcha(generateProblem())
    setMounted(true)
  }, [])

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
  }, [])

  const question = mounted ? `${captcha.num1} + ${captcha.num2} = ?` : 'Loading...'

  return {
    question,
    answer: captcha.answer,
    isValid: captcha.isValid,
    setAnswer,
    reset,
    mounted
  }
}
