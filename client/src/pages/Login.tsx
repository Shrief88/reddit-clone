import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.svg";
import googleIcon from "../assets/google.svg";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { axiosClient } from "@/api/axios";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const loginDemo = async () => {
    const res =await axiosClient.get("/auth/demoUser");
    localStorage.setItem("token", res.data.token);
    navigate("/");
  };

  return (
    <MaxWidthWrapper className="flex flex-col justify-center">
      <div className="bg-card rounded-3xl py-5 container sm:w-[400px]">
        <div className="mx-auto flex w-full flex-col justify-center ">
          <div className="flex flex-col items-center text-center space-y-4">
            <img src={logo} className="h-20 w-20" />
            <p className="text-sm max-w-sm mx-auto text-muted-foreground">
              By continuing with your Google account, you are sitting up a
              Briddit account and agree to our User Agreement and Privacy
              Policy.
            </p>
            <p className="text-sm max-w-sm mx-auto text-muted-foreground">
              By continuing as a Demo user, you will have limited access to app
              features until you log out or your token expires.
            </p>
            <Button className="w-full" variant="outline" asChild>
              <Link
                to={import.meta.env.VITE_API_URI + "/auth/google"}
                className="flex justify-center gap-2"
              >
                <img src={googleIcon} className="w-5" />
                <p>Continue with Google</p>
              </Link>
            </Button>
            <Button className="w-full" variant="outline" onClick={loginDemo}>
              Login as Demo User
            </Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Login;
