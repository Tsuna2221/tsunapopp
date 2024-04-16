// @ts-nocheck 
import { createContext, Dispatch, useState } from 'react'

interface CreationTypes {
  volume: number
  setVolume: Dispatch<React.SetStateAction<number>>
}

export const QuizContext = createContext<CreationTypes>({} as CreationTypes)

const QuizProvider: React.FC<Props> = ({ children }) => {
  const [volume, setVolume] = useState<number>(75)

  return (
    <QuizContext.Provider
      value={{
        volume, setVolume
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}


export default QuizProvider