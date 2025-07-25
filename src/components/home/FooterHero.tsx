import Image from "next/image";
import Link from "next/link";

const FooterHero = () => {
  return (
    <div className="bg-primary">
      <div className="flex flex-wrap md:flex-nowrap justify-between container py-20 px-6 sm:px-0">
        <div className="max-w-[802px]">
          <h2 className="font-montserrat text-wrap text-white not-italic text-3xl md:text-[57px] font-semibold sm:leading-[109.3%] sm:tracking-[-1.425px] leading-[97.3%] tracking-[-0.75px] pb-[31px] sm:pb-[38px]">
            Discover Your AI Journey Today
          </h2>
          <p className="text-white max-w-[681px] text-xl sm:text-3xl not-italic font-normal leading-[103.3%] tracking-[-0.75px] font-montserrat pb-[66px] sm:pb-[53px]">
            Upload your ChatGPT history and get beautiful insights about your AI interactions
          </p>
          <Link href={"/upload"}>
            <button
              type="button"
              className="linear_gradient flex max-w-[438px] w-full justify-center items-center gap-2.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] px-8 py-4 rounded-[11px]  text-black text-xl sm:text-3xl not-italic font-semibold leading-[90.3%] tracking-[-0.75px]"
            >
              Get Started For Free
            </button>
          </Link>
        </div>
        <div className="mt-20 md:mt-0">
          <Image
            src="/images/monitor.png"
            alt="hero"
            width={560}
            height={456}
          />
        </div>
      </div>
    </div>
  );
};

export default FooterHero;
