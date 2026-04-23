import Image from "next/image";
import Cube from "@/public/svg/logo/cube.svg";
export default function Logo() {
  return (
    <div className="flex  justify-center items-center gap-2">
      <Image src={Cube} alt="Logo" className="w-8" />
    </div>
  );
}
