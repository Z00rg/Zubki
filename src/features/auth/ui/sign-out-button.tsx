import {useSignOut} from "../model/use-sign-out";
import clsx from "clsx";

export function SignOutButton({className}: { className?: string }) {
    const {signOut} = useSignOut();

    return (
        <button
            className={clsx(className, "ml-auto text-rose-500 hover:text-rose-700 text-[20px] cursor-pointer")}
            onClick={() => signOut({})}
        >
            Выйти из аккаунта
        </button>
    );
}
