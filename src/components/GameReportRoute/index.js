import {Component} from 'react'

import './index.css'

class GameReportRoute extends Component {
  render() {
    let {
      correctlyAttempted,
      totalQuestions,
      unAttemptedQuestions,
      wrongAnswers,
    } = localStorage

    // Fallback to localStorage if data is lost
    if (
      correctlyAttempted === undefined ||
      totalQuestions === undefined ||
      unAttemptedQuestions === undefined ||
      wrongAnswers === undefined
    ) {
      const savedReport = JSON.parse(localStorage.getItem('quizResults'))
      correctlyAttempted = savedReport?.correctlyAttempted || 0
      totalQuestions = savedReport?.totalQuestions || 0
      unAttemptedQuestions = savedReport?.unAttemptedQuestions || 0
      wrongAnswers = savedReport?.wrongAnswers || 0
    }
    console.log(correctlyAttempted, totalQuestions, wrongAnswers)
    return (
      <div className="game-reportr">
        {unAttemptedQuestions === 0 ? (
          <div className="game-report">
            <p>
              {totalQuestions}/{totalQuestions}
            </p>
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-right-check-img.png"
                alt="correct answer icon"
              />
              <p>{correctlyAttempted} Correct answers</p>
            </div>
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-wrong-check-img.png"
                alt="incorrect answer icon"
              />
              <p>{wrongAnswers} Incorrect answers</p>
            </div>
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/quiz-game-un-answered-img.png"
                alt="unattempted icon"
              />
              <p>{unAttemptedQuestions} Unattempted answers</p>
            </div>
            <h1>Attempted all the questions</h1>
          </div>
        ) : (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-lose-img.png"
              alt="lose"
              className="results-image"
            />

            <h1>You lose</h1>
            <p>
              You attempted {correctlyAttempted} out of {totalQuestions}
              questions as correct
            </p>

            <button type="button">Report</button>
          </>
        )}
      </div>
    )
  }
}

export default GameReportRoute
