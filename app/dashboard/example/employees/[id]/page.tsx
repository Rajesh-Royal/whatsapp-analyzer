import { Loading } from "@/components/common/loading";
import { EmployeeForm } from "@/components/page-component/example/employee/employee-form";
import { getUserByEmail } from "@/data/user";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/router";
import React from "react";

const Employee = () => {
  const router = useRouter();
  const { id } = router.query;
  const user = useCurrentUser();

  if (typeof id !== "string") {
    return <Loading />;
  }

  if (false) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <EmployeeForm initialData={[user]} />
      </div>
    </div>
  );
};

export default Employee;
