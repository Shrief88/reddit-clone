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
    await axiosClient.get("/auth/demoUser");
    navigate("/");
  };

  return (
    <div className="bg-muted flex-1 flex flex-col justify-center items-center">
      <MaxWidthWrapper>
        <div className="bg-background rounded-3xl py-5 container sm:w-[400px]">
          <div className="mx-auto flex w-full flex-col justify-center ">
            <div className="flex flex-col items-center text-center space-y-4">
              <img src={logo} className="h-20 w-20" />
              <p className="text-sm max-w-sm mx-auto text-muted-foreground">
                By continuing, you are sitting up a Briddit account and agree to
                our User Agreement and Privacy Policy.
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
    </div>
  );
};

export default Login;
