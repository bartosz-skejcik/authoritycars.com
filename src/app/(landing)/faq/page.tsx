import { Faq } from "@/features/ui/faq";

function Page() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 px-12">
      <h1 className="text-3xl font-extrabold md:text-4xl">
        Popularne <span className="text-orange-400">pytania</span>
      </h1>
      <Faq />
    </div>
  );
}

export default Page;
