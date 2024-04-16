import { Anchor, MainHeader } from './styles'

const Header = () => {

  return (
    <MainHeader>
      <Anchor href='/'>Escolha um Quiz</Anchor>
      <Anchor href='/create'>Crie seu Quiz</Anchor>
    </MainHeader>
  )
}
export default Header