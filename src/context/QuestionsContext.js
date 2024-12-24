import React from 'react'

const QuestionContext = React.createContext({
  reports: [],

  correctlyAttempted: 0,
  unAttemptedQuestions: 0,
  wrongAnswers: 0,
})

export default QuestionContext
