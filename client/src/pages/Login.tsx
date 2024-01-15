import { NavLink } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/logo.png";
import googleIcon from "../assets/google.svg";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signInWithGoogle = () => {
    setIsLoading(true);
    {/* TODO: Sign in with Google */}
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="bg-muted flex-1 flex flex-col justify-center items-center">
      <MaxWidthWrapper>
        <div className="bg-background rounded-3xl py-5 container sm:w-[400px]">
          <div className="mx-auto flex w-full flex-col justify-center ">
            <div className="flex flex-col items-center text-center space-y-4">
              <img src={logo} className="h-20 w-20" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome Back
              </h1>
              <p className="text-sm max-w-sm mx-auto text-muted-foreground">
                By continuing, you are sitting up a Briddit account and agree to
                our User Agreement and Privacy Policy.
              </p>

              <Button
                variant="destructive"
                className={"w-full flex justify-center gap-2 bg-foreground hover:bg-foreground/85"}
                onClick={signInWithGoogle}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <img className="h-6" src={googleIcon} />
                )}
                <p>Google</p>
              </Button>
              <NavLink
                className="text-blue-700 text-sm hover:underline underline-offset-4"
                to={"/signup"}
              >
                Don't have an account? Sign up here
              </NavLink>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Login;
