import MyPosts from "@/components/myPost";
import GlobalLayout from "../globallayout";
const Home = () => {
    return <GlobalLayout children={<MyPosts />}>
    </GlobalLayout>
}
export default Home;