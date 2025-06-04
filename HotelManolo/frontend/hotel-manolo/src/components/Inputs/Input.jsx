import { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ label, value, onChange, placeholder = "", type = "text" }) => {
  const [show, setShow] = useState(false);
  const inputType = type === "password" ? (show ? "text" : "password") : type;

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="input-box">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
        />
        {type === 'password' && (
          show ? <FaRegEye onClick={() => setShow(false)} /> : <FaRegEyeSlash onClick={() => setShow(true)} />
        )}
      </div>
    </div>
  );
};

export default Input
