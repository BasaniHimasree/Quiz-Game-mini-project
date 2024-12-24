import {Component} from 'react'

class GameResults extends Component {
  render() {
    let {correctlyAttempted, totalQuestions} = this.props
    const {unAttemptedQuestions, wrongAnswers} = this.props
    console.log(this.props)
    if (correctlyAttempted === undefined || totalQuestions === undefined) {
      const savedReport = JSON.parse(localStorage.getItem('quizReport'))
      correctlyAttempted = savedReport?.correctlyAttempted || 0
      totalQuestions = savedReport?.totalQuestions || 0
    }
    const percentage = parseInt((correctlyAttempted / totalQuestions) * 100, 10)

    const onClickReport = () => {
      const {history} = this.props
      const quizResults = {
        correctlyAttempted,
        totalQuestions,
        unAttemptedQuestions,
        wrongAnswers,
      }

      // Store in localStorage
      localStorage.setItem('quizReport', JSON.stringify(quizResults))

      // Pass the results via history.push
      history.push('/game-report', quizResults)
    }

    console.log('Correctly Attempted:', correctlyAttempted)
    console.log('Total Questions:', totalQuestions)

    return (
      <div className="results-container">
        {percentage >= 60 ? (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-congrats-trophy-img.png"
              alt="won"
              className="results-image"
            />
            <h1>Congrats</h1>
            <h1>{percentage}% Correctly Answered</h1>
            <h1>Quiz completed successfully</h1>
            <p>
              You attempted {correctlyAttempted} out of {totalQuestions}
              questions as correct
            </p>
          </>
        ) : (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/quiz-game-lose-img.png"
              alt="lose"
              className="results-image"
            />
            <h1>{percentage}% Correctly Answered</h1>
            <h1>You lose</h1>
            <p>
              You attempted {correctlyAttempted} out of {totalQuestions}{' '}
              questions as correct
            </p>
          </>
        )}

        <button type="button" onClick={onClickReport}>
          Report
        </button>
      </div>
    )
  }
}

export default GameResults
