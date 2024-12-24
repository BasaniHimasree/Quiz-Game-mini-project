import {Link} from 'react-router-dom'
import QuestionContext from '../../context/QuestionsContext'

import './index.css'

const GameReportRoute = () => (
  <QuestionContext.Consumer>
    {value => {
      const {
        correctlyAttempted,
        totalQuestions = 10,
        unAttemptedQuestions,
        wrongAnswers,
      } = value

      return (
        <div className="game-reportr">
          {unAttemptedQuestions === 0 ? (
            <div className="game-report">
              <p>
                ({correctlyAttempted + wrongAnswers})/{totalQuestions}
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
                You attempted {correctlyAttempted} out of {totalQuestions}{' '}
                questions as correct
              </p>
              <Link to="/game-report">
                <button type="button">Report</button>
              </Link>
            </>
          )}
        </div>
      )
    }}
  </QuestionContext.Consumer>
)

export default GameReportRoute
