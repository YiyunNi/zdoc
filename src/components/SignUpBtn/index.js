import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'

export default function SignUpBtn(props) {
  const location = useLocation();
  const utm = `?utm_page=${location.pathname.replace(/^\//g, '')}&utm_button=doc_nav_right`

  return (
    <Link to={props.href + utm} className="navbar__item navbar__link header-btn">{props.label}</Link>
  )
}