import FileUpload from "@/components/FileUpload";

export default async function Index() {

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">User Session Next Auth github</h1>
      <div className="flex flex-col rounded-md bg-neutral-100">
        <div className="p-4 font-bold rounded-t-md bg-neutral-200 text-black">
          Current Session
        </div>
        <pre className="py-6 px-4 whitespace-pre-wrap break-all text-black">
          {JSON.stringify({}, null, 2)}
        </pre>
      </div>
    <div>
    <h1 className="text-3xl font-bold mb-4">Upload whatsapp exported chat file</h1>
      <FileUpload />
    </div>
    </div>
  )
}
