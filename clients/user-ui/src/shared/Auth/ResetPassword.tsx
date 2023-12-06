"use client";

import styles from "@/src/utils/style";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "@/src/graphql/actions/reset-password.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long!"),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords do not match!",
      path: ["confirmPassword"],
    }
  );

type ResetPasswordSchema = z.infer<typeof formSchema>;

const ResetPassword = ({
  activationToken,
}: {
  activationToken: string | string[] | undefined;
}) => {
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({ resolver: zodResolver(formSchema) });

  const [show, setShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const response = await resetPassword({
        variables: {
          password: data.password,
          activationToken,
        },
      });
      toast.success("Password updated successfully!");
      router.push(process.env.NEXT_PUBLIC_CLIENT_SIDE_URI as string);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <div className="md:w-[500px] w-full mx-2">
        <h1 className={`${styles.title}`}>Reset Your password</h1>
        {loading && <Spinner size="lg" className="flex" />}
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <span className="text-red-500 ">{`${errors.password.message}`}</span>
          )}

          <div className="w-full mt-5 relative mb-1">
            <label htmlFor="password" className={`${styles.label}`}>
              Enter your confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type={!confirmPasswordShow ? "password" : "text"}
              placeholder="password!@"
              className={`${styles.input}`}
            />

            {!confirmPasswordShow ? (
              <AiOutlineEyeInvisible
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setConfirmPasswordShow(true)}
              />
            ) : (
              <AiOutlineEye
                className="absolute bottom-3 right-2 z-1 cursor-pointer"
                size={20}
                onClick={() => setConfirmPasswordShow(false)}
              />
            )}
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 ">{`${errors.confirmPassword.message}`}</span>
          )}
          <br />
          <input
            type="submit"
            value="Submit"
            disabled={isSubmitting || loading}
            className={`${styles.input} mt-3 cursor-pointer`}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
