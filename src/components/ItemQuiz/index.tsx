// @ts-nocheck 
import { Author, Container, CoverImage, Description, ItemWrapper, Link, Title } from "./styles"

interface QuizTypes {
  author: string
  authorHandle: string
  cardBackground: string
  dmcaNotice: boolean
  id: string
  quizDescription: string
  quizName: string
}

const ItemQuiz = ({ quiz }) => {
  const { author, authorHandle, cardBackground, dmcaNotice, id, quizDescription, quizName } = quiz

  return (
    <ItemWrapper href={`/quiz/${id}`}>
      <CoverImage src={cardBackground}/>
      <Container>
        <Title>
          {quizName}
          {
          dmcaNotice ? 
            (<svg alt='12139182' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M 11,4L 13,4L 13,15L 11,15L 11,4 Z M 13,18L 13,20L 11,20L 11,18L 13,18 Z" />
            </svg>) 
          : 
            null
          }
          
        </Title>
        <Author>
          Por:{" "}
          <Link 
            target="_blank" rel="noopener noreferrer"
            href={authorHandle ? `https://twitter.com/${authorHandle.slice(1)}`: null}
          >
            {authorHandle || author}
          </Link>
        </Author>
        <Description>{quizDescription}</Description>
      </Container>
    </ItemWrapper>
  )
}
export default ItemQuiz
