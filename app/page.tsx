import FileUpload from "@/components/FileUpload";
import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Index() {

  return (
    <div className="flex flex-col gap-6">
     Home Page 
     <LoginButton>
      <Button>Login</Button>
     </LoginButton>
    </div>
  )
}
