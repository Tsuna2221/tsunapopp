// @ts-nocheck 
import { createContext, Dispatch, useEffect, useState, useRef } from 'react'
import { useImmer } from "use-immer";
import { useParams } from 'react-router-dom';

import { firebaseConfig } from "../../config/config";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";

import { socket } from '../../config/socket';


const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getDatabase(app);

interface CreationTypes {
  volume: number
  setVolume: Dispatch<React.SetStateAction<number>>
  quiz: {
    quizItems: Array<{
      guessedBy: string
    }>
  }
  connect: boolean
}

interface Props {
  leaderboard: Array<{
    points: number
    user: string
  }>
}

export const QuizContext = createContext<CreationTypes>({} as CreationTypes)

const QuizProvider: React.FC<Props> = ({ children }) => {
  const { id } = useParams()
  const [volume, setVolume] = useState<number>(75)
  const [leaderboard, setLeaderboard] = useImmer([])
  const [currentPlaying, setCurrent] = useImmer(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connect, setConnect] = useState(false)

  const join = ({ user }) => {
    setLeaderboard(previous => {
      const userIndex = previous?.findIndex(({ user: name }) => name === user)

      if(userIndex < 0) return [...previous, { user, points: 0 }]
      return previous
    })
  }

  useEffect(() => {
    const starCountRef = ref(db, `quiz/${id}`)

    onValue(starCountRef, async (snapshot) => {
      const data = snapshot.val();
      const { quizItems, id } = data
      const cache = JSON.parse(window.localStorage.getItem("imageCache") || `{}`)
      let cardUrl = ""

      if(cache[`${id}_cover`]){
        cardUrl = cache[`${id}_cover`]
      }else{
        const cardRef = await storageRef(storage, `gs://tsunapop-c2887.appspot.com/cover/${id}_cover`)
        cardUrl = await getDownloadURL(cardRef)

        cache[`${id}_cover`] = cardUrl
      }

      const mappedQuiz = await quizItems.map(async ({ name, variations, audioId, imageId }) => {
        let imageUrl = ""
        let audioUrl = ""

        if(cache[imageId]){
          imageUrl = cache[imageId]
        }else{
          const imageRef = await storageRef(storage, `gs://tsunapop-c2887.appspot.com/${imageId}`)
          imageUrl = await getDownloadURL(imageRef)

          cache[imageId] = imageUrl
        }

        if(cache[audioId]){
          audioUrl = cache[audioId]
        }else{
          const audioRef = await storageRef(storage, `gs://tsunapop-c2887.appspot.com/${audioId}`)
          audioUrl = await getDownloadURL(audioRef)

          cache[audioId] = audioUrl
        }

        window.localStorage.setItem("imageCache", JSON.stringify(cache))

        return {
          name,
          variations,
          imageUrl,
          audioUrl
        }
      })

      setQuiz({
        ...data,
        cardBackground: await cardUrl,
        quizItems: await Promise.all(mappedQuiz).then(e => {
          setLoading(false)
          return e
        })
      })
    });
  }, [])

  useEffect(() => {
    const handler = (details) => {
      const { message, user, color } = details;
      const userIndex = leaderboard?.findIndex(({ user: name }) => name === user)

      if(message) join(details)
      if(userIndex != -1) {
        console.log(message, currentPlaying)
      }

      // console.log(message, user, currentPlaying, leaderboard)

      setCurrent(currentPlaying => {
        if(currentPlaying != null && currentPlaying >= 0){
          setQuiz(quizData => {
            const { quizItems } = quizData
            const itemsClone = [...quizItems]

            if(itemsClone[currentPlaying]?.guessedBy) return quizData
            
            if(!itemsClone[currentPlaying].variations.map(e => e.toLowerCase()).includes(message.trim().toLowerCase())) return quizData

            itemsClone[currentPlaying].guessedBy = user
            itemsClone[currentPlaying].guessedColor = color

            return {
              ...quizData,
              quizItems: itemsClone
            }
          })
        }

        return currentPlaying
      })
    }

    socket.on("message", handler)

    // return () => {
    //   // BAD: this will remove all listeners for the 'foo' event, which may
    //   // include the ones registered in another component
    //   socket.off('message', handler);
    // };
  }, [])


  return (
    <QuizContext.Provider
      value={{
        volume, setVolume, loading, setQuiz, quiz, setCurrent, currentPlaying, connect, setConnect
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}


export default QuizProvider