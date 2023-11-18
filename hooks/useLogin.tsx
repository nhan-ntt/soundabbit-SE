import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export const useLogin = () => {
    const { status, user } = useSelector((state: any) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [router, user, status]);
};
