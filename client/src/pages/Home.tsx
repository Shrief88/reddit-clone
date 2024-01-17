import useAuth from "@/hooks/useAuth";

const Home = () => {
  const { user, isLoading } = useAuth();
  console.log(user, isLoading);
  return <div className="bg-muted flex-1">Home</div>;
};

export default Home;
