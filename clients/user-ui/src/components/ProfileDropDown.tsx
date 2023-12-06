"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import AuthScreen from "../screens/AuthScreen";
import useUser from "../hooks/useUser";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import { registerUser } from "../actions/register-user";

const ProfileDropDown = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, loading, accessToken, refreshToken } = useUser();
  const { data } = useSession();

  console.log(data);

  useEffect(() => {
    if (!loading) {
      setSignedIn(!!user);
    }
    // Case SignIn with Google ...
    if (data?.user) {
      setSignedIn(true);
      addUser(data?.user);
    }
  }, [loading, user, open, data]);

  useEffect(() => {
    if (accessToken && refreshToken) {
      Cookies.set("access_token", accessToken);
      Cookies.set("refresh_token", refreshToken);
    }
  }, [accessToken, refreshToken]);

  const logoutHandler = () => {
    if (data?.user) {
      signOut();
    } else {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      toast.success("Log out successful!");
      window.location.reload();
    }
  };

  const addUser = async (user: any) => {
    await registerUser(user);
  };

  return (
    <div className="flex items-center gap-4">
      {signedIn ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src={data?.user ? data.user.image : user.image}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2" color="success">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">
                {data?.user ? data.user.email : user.email}
              </p>
            </DropdownItem>
            <DropdownItem key="settings">My Profile</DropdownItem>
            <DropdownItem key="all_orders">All Orders</DropdownItem>
            <DropdownItem key="team_settings">
              Apply for seller account
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onClick={() => logoutHandler()}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <CgProfile
          className="text-2xl cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      )}

      {open && <AuthScreen setOpen={setOpen} />}
    </div>
  );
};

export default ProfileDropDown;
