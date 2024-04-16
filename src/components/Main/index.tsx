// @ts-nocheck 

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Main as MainWrapper, Grid, Count, Container, Title, Description, InputRange } from "./styles"
import ItemGuess from "../ItemGuess";

import { firebaseConfig } from "../../config/config";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import Loader from '../Loader';
import { QuizContext } from '../context/QuizContext';

const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getDatabase(app);

const Main = () => {
  const { setVolume, volume } = useContext(QuizContext)
  const { id } = useParams()
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [time, setTime] = useState(0);

  const addCount = () => setCount(count + 1)

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
    if(count === quiz?.quizItems?.length) return
    setTimeout(() => {
      setTime((time + 100))
    }, 1000)
  }, [time]);

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);

  return (
    <MainWrapper>
      <Grid>
        {
          loading ? <Loader/> : 
          <>
            <Container>
              <Count>{count}/{quiz.quizItems.length}</Count>
              <Title>{quiz.quizName}</Title>
              <Description>{quiz.quizDescription} por: {quiz.author}</Description>
              <Count>{minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </Count>
            </Container>
            { quiz.quizItems.map((item) => <ItemGuess addCount={addCount} cardBackground={quiz.cardBackground} quizItem={item}/>) }
            <InputRange onChange={({ target: { value } }) => setVolume(parseInt(value))} value={volume} min={0} max={100} type="range" />
          </>
        }
      </Grid>
    </MainWrapper>
  )
}

export default Main
