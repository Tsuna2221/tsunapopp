// @ts-nocheck 

import { v4 as uuidv4 } from 'uuid';
import { createContext, useState, Dispatch } from 'react'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/config";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

interface Props {
  children: React.ReactNode
}

interface InstanceType {
  name: string
  audioBlob: Blob
  imageBlob: Blob
  variations: string[]
  youtubeUrl: number
}

interface InputType {
  quizName: string,
  quizDescription: string,
  author: string,
  authorHandle: string,
  mainImage: null | Blob,
  quizItems: any | InstanceType
}

interface CreationTypes {
  appendImageBlob: (blob: Blob, index: number) => void,
  appendAudioBlob: (blob: Blob, index: number) => void,
  input: InputType,
  setInput: Dispatch<React.SetStateAction<InputType | any>>,
  setQuizInput: (arg1: any, arg2: any) => void
  removeField: (index: number) => void,
  musicList: InstanceType[]
  setMusicList: Dispatch<React.SetStateAction<InstanceType[]>>
  logger: Dispatch<React.SetStateAction<string>>
  setLogger: Dispatch<React.SetStateAction<string>>
  setMainImage: (arg1: Blob) => void 
  createInstance: () => void
  uploadProgress: number[]
}

const uuid = uuidv4()
const storage = getStorage();

export const CreationContext = createContext<CreationTypes>({} as CreationTypes)

const CreationProvider: React.FC<Props> = ({ children }) => {
  const [logger, setLogger] = useState<string>(null)
  const navigate = useNavigate();
  const [uploadProgress, setUpload] = useState<number[]>([0, 0])
  const [musicList, setMusicList] = useState<InstanceType[]>([])
  const [youtubeUrl, setYTUrl] = useState<string>("")
  const [input, setInput] = useState({
    quizName: "",
    quizDescription: "",
    author: "",
    authorHandle: "",
    dmcaNotice: false,
    mainImage: null as null | Blob,
    quizItems: [

    ]
  })

  const setMainImage = (blob: Blob) => setInput({...input, mainImage: blob})

  const appendImageBlob = (blob: Blob, index: number) => {
    const clone = [...input.quizItems]
    clone[index].imageBlob = blob

    return setInput({...input, quizItems: clone})
  }

  const appendAudioBlob = (blob: Blob, index: number) => {
    const clone = [...input.quizItems]
    clone[index].audioBlob = blob

    return setInput({...input, quizItems: clone})
  }

  const setQuizInput = ({ target: { name, value } }, index: number) => {
    const currentQuiz = [...input.quizItems]

    currentQuiz[index] = { ...currentQuiz[index] }
    currentQuiz[index][name] = value

    setInput({...input, quizItems: currentQuiz})
  }

  const removeField = (index: number) => {
    const inputClone = [...input.quizItems]
    const filterQuiz = inputClone.filter((_, ind) => index !== ind)

    setInput({...input, quizItems: filterQuiz })
    // setMusicList(filterMusic)
  }

  const addProgress = (prog: number, max: number) => setUpload([prog, max])

  const createInstance = async () => {
    let prog = 0
    const max = 2 + input.quizItems.length * 2

    const storageRef = ref(storage, `cover/${uuid}_cover`);
    await uploadBytes(storageRef, input.mainImage)
    ++prog;addProgress(prog, max)

    const mediaStorePromise = input.quizItems.map(async ({ imageBlob, audioBlob }, index) => {
      const imageRef = ref(storage, `cards/${uuid}_${index}`);
      const audioRef = ref(storage, `audio/${uuid}_${index}`);

      const storedImage = await uploadBytes(imageRef, imageBlob)
      ++prog;addProgress(prog, max)
      const storedAudio = await uploadBytes(audioRef, audioBlob)
      ++prog;addProgress(prog, max)

      return [storedImage, storedAudio]
    })

    await set(dbRef(database, `quiz/${uuid}`), {
      id: uuid,
      quizName: input.quizName,
      quizDescription: input.quizDescription,
      author: input.author,
      authorHandle: input.authorHandle,
      dmcaNotice: input.dmcaNotice,
      createdAt: +new Date(),
      quizItems: input.quizItems.map(({cardTitle, variations, youtubeUrl}, index) => ({
        name: cardTitle,
        youtubeUrl,
        variations: variations.split(',').map((x: string) => x.trim()),
        audioId: `audio/${uuid}_${index}`,
        imageId: `cards/${uuid}_${index}`
      }))
    })

    
    try {
      const promise = await Promise.all(mediaStorePromise).then(() => {
        ++prog;addProgress(prog, max)

        setTimeout(() => navigate(`/quiz/${uuid}`), 2000)
      })

      console.log(promise)
    } catch (error) {
      setLogger(error)
    }
  }

  return (
    <CreationContext.Provider
      value={{
        appendImageBlob,
        appendAudioBlob,
        input,
        setInput,
        setQuizInput,
        removeField,
        musicList,
        setMusicList,
        setMainImage,
        createInstance,
        uploadProgress,
        logger,
        setLogger,
        youtubeUrl,
        setYTUrl
      }}
    >
      {children}
    </CreationContext.Provider>
  )
}


export default CreationProvider