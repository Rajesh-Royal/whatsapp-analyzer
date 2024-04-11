import { Suspense } from "react";
import { Navbar } from "./_components/navbar";
import { BeatLoader } from "react-spinners";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Navbar />
      <Suspense fallback={<BeatLoader />}>
      {children}
      </Suspense>
    </div>
   );
}
 
export default ProtectedLayout;