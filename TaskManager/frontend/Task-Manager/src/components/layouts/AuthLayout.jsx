import UI_IMG from "../../assets/auth-img.jpg"
import NeuroCore_IMG from "../../assets/Neurocore.jpeg"

const AuthLayout = ({ children }) => {
  return <div className="flex">
    <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
      <h2 className="text-lg font-medium text-black">Organizador de Tareas</h2>
      {children}
    </div>

    <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-img.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
      <div className="grid grid-rows-2">
        <img src={NeuroCore_IMG} className="w-80 lg:w-[95%]" />
        <img src={UI_IMG} className="w-80 lg:w-[95%]" />
      </div>
    </div>
  </div>
}

export default AuthLayout
