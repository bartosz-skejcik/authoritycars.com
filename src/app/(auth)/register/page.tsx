"use client";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    router.push("/");
    // return (
    //   <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    //     <div className="w-full max-w-sm md:max-w-3xl">
    //       <Suspense fallback={<div>Loading...</div>}>
    //         <RegisterFormWithParams />
    //       </Suspense>
    //     </div>
    //   </div>
    // );
}
