'use client'
import React, { useEffect, useState } from "react";
import { Loading } from "@/components/common/loading";
import { EmployeeClient } from "@/components/page-component/example/employee/client";

const Employees = () => {
  const [whatsappChat, setWhatsappChat] = useState([]);
  const [responseState, setResponseState] = useState({loading: true, isError: false, error: {message: ''}});

  useEffect(() => {
    fetch('/api/whatsapp-chat').then(async (result) => {
      setResponseState((prev) => ({...prev, loading: false}))
      let res = await result.json();
      setWhatsappChat(res.data)
    }).catch((error) => {
      setResponseState({loading: false, isError: true, error});
    })
  }, [])

  if (responseState.loading) return <Loading />;

  if (responseState.isError) return <div>Error: {responseState.error.message}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 md:p-8">
        <EmployeeClient data={whatsappChat} />
      </div>
    </div>
  );
};

export default Employees;
