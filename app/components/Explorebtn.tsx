"use client";
import Image from "next/image";

import posthog from "posthog-js";

const button = () => {
  return (
    <div className=" flex items-center justify-center">
      <button
        type="button"
        className="mt-7 mx-auto "
        onClick={() => console.log("Hello Baby")}
        id="explore-btn"
      >
        <a href="#events">Explore Events</a>

        <Image
          src="./icons/arrow-down.svg"
          width={24}
          height={24}
          priority
          alt="arrow-down"
        />
      </button>

      <button onClick={() => posthog.capture("test_event")}>
        Click me for an event
      </button>
    </div>
  );
};

export default button;
