import { Card } from "@/components/ui/card";
import React from "react";
import { BeatLoader } from "react-spinners";

const Loading = () => {
  return (
    <Card className="flex h-[300px] w-[600px] justify-center align-middle shadow-md">
      <BeatLoader className="m-auto h-[25px]" />
    </Card>
  );
};

export default Loading;
