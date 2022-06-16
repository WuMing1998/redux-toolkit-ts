import { FC, useRef } from "react";

const TInput: FC = () => {
  const inpRef = useRef({} as HTMLInputElement);

  const inputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" ? console.log(inpRef.current.value) : undefined;
  };

  return <input ref={inpRef} type="text" onKeyUp={inputHandler} />;
};

export default TInput;
