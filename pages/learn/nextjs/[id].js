import { useRouter } from "next/router"

const NextJSDynamic = () => {
  const router = useRouter()
  return <div>{router.query.id}</div>
}

export default NextJSDynamic;
