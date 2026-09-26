import './ArrowButton.css'

const arrowRight = '/assets/common/arrow-right-white.svg'

type ArrowButtonProps = {
  href?: string
  children: string
}

export default function ArrowButton({ href = '#', children }: ArrowButtonProps) {
  return (
    <a className="arrow-button" href={href}>
      <span>{children}</span>
      <img className="arrow-button__icon" src={arrowRight} alt="" aria-hidden="true" />
    </a>
  )
}
