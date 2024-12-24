import React from 'react'

const QuestionContext = React.createContext({
  reports: [],
  score: 0,
  correctlyAttempted: 0,
  unAttemptedQuestions: 0,
  wrongAnswers: 0,
  totalQuestions: 10,
})

export default QuestionContext
