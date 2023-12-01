"use client";

import styles from "@/src/utils/style";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/src/graphql/actions/register.actions";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(8, "Name must be at least 3 characters long!"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long!"),
  phone_number: z
    .number()
    .min(11, "Phone number must be at least 11 characters"),
});

type SignUpSchema = z.infer<typeof formSchema>;

const Signup = ({
  setActiveState,
}: {
  setActiveState: (e: string) => void;
}) => {
  const [registerUserMutation, { loading}] =
    useMutation(REGISTER_USER);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpSchema>({ resolver: zodResolver(formSchema) });

  const [show, setShow] = useState(false);

  const onSubmit = async (signup_data: SignUpSchema) => {
    try {
      const response = await registerUserMutation({ variables: signup_data });
      localStorage.setItem('activation_token',response.data.register.activation_token)
      console.log(response.data);
      toast.success("Please check your email to activate your account");
      reset()
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1 className={`${styles.title}`}>SignUp with SRayen</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full relative mb-3">
          <label className={`${styles.label}`}>Enter your Name</label>
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            className={`${styles.input}`}
          />
        </div>

        <label className={`${styles.label}`}>Enter your Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="loginmail@gmail.com"
          className={`${styles.input}`}
        />
        {errors.email && (
          <span className="text-red-500 block mt-1">{`${errors.email.message}`}</span>
        )}

        <div className="w-full relative mt-3">
          <label className={`${styles.label}`}>Enter your Phone Number</label>
          <input
            {...register("phone_number", { valueAsNumber: true })}
            type="number"
            placeholder="+216********"
            className={`${styles.input}`}
          />
        </div>

        <div className="w-full mt-5 relative mb-1">
          <label htmlFor="password" className={`${styles.label}`}>
            Enter your Password
          </label>
          <input
            {...register("password")}
            type={!show ? "password" : "text"}
            placeholder="password!@"
            className={`${styles.input}`}
          />

          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>

        {errors.password && (
          <span className="text-red-500">{`${errors.password.message}`}</span>
        )}
        <div className="w-full mt-2">
          <input
            type="submit"
            value="Sign Up"
            disabled={isSubmitting || loading}
            className={`${styles.input} mt-2`}
          />
        </div>
        <br />
        <h5 className="text-center pt-1 font-Poppins text-[16px] text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>
        <h5 className="text-center pt-2 font-Poppins text-[14px]">
          Already have any account
          <span
            className="text-[#2190ff] pl-2 cursor-pointer"
            onClick={() => setActiveState("Login")}
          >
            Login
          </span>
        </h5>
        <br />
      </form>
    </div>
  );
};

export default Signup;
