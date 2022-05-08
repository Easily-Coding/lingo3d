import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

const OpenIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className="icon"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="#fff"
        d="M870.4 342.4c-12.8 0-24-11.2-24-24V153.6c0-12.8 11.2-24 24-24s24 11.2 24 24v164.8c0 12.8-11.2 24-24 24z"
      ></path>
      <path
        fill="#fff"
        d="M870.4 177.6H705.6c-12.8 0-24-11.2-24-24s11.2-24 24-24h164.8c12.8 0 24 11.2 24 24s-11.2 24-24 24zm-96 716.8H249.6c-65.6 0-120-54.4-120-120V249.6c0-65.6 54.4-120 120-120H512c12.8 0 24 11.2 24 24s-11.2 24-24 24H249.6c-40 0-72 32-72 72v524.8c0 40 32 72 72 72h524.8c40 0 72-32 72-72V512c0-12.8 11.2-24 24-24s24 11.2 24 24v262.4c0 65.6-54.4 120-120 120z"
      ></path>
      <path
        fill="#fff"
        d="M526.4 521.6c-6.4 0-12.8-1.6-17.6-6.4-9.6-9.6-9.6-24 0-33.6l344-344c9.6-9.6 24-9.6 33.6 0 9.6 9.6 9.6 24 0 33.6l-344 344c-4.8 4.8-11.2 6.4-16 6.4z"
      ></path>
    </svg>
  )
}

export default OpenIcon
