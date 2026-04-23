"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Profile from "@/public/svg/user.svg";

const GoToProfile = ({ isLightMode }: { isLightMode: boolean }) => {
  const { data: session } = useSession();
  if (!session) return <></>;

  return (
    <Link href="/account">
      <Image
        src={Profile}
        alt="Favourites"
        className={`w-7 transition-all duration-300 ${!!isLightMode ? "invert" : ""}`}
      />
    </Link>
  );
};

export default GoToProfile;
