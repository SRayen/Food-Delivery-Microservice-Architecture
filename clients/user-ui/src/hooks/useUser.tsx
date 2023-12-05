import { useQuery } from "@apollo/client";
import { GET_USER } from "../graphql/actions/getUser.action";

const useUser = () => {
  const { loading, data } = useQuery(GET_USER);

  return {
    loading,
    user: data?.getLoggedInUser?.user,
    accessToken: data?.getLoggedInUser?.accessToken,
    refreshToken: data?.getLoggedInUser?.refreshToken,
  };
};

export default useUser;
