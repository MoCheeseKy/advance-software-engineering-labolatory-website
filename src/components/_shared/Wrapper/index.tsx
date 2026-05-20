import WrapperInterface from '@/interfaces/Wrapper';

export default function Wrapper({
  children,
  className,
  backgroundColor = 'bg-white',
}: WrapperInterface) {
  return (
    <>
      <div
        className={`flex justify-center items-center flex-grow w-full text-black ${backgroundColor}`}
      >
        <div
          className={`px-4 md:px-[36px] w-full md:w-[85%] lg:w-full max-w-[1200px] ${className}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
