import React from "react";
import { Loading } from "@/components/common/loading";
import { EmployeeClient } from "@/components/page-component/example/employee/client";
import { getAllUsers } from "@/data/user";

const Employees = async () => {
  const data = await getAllUsers();

  // if (isLoading) return <Loading />;

  // if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 md:p-8">
        <EmployeeClient data={data as any} />
      </div>
    </div>
  );
};

export default Employees;
