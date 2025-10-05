import { logout } from "../api/auth"

const NavBar: React.FC = () => {

    return (
        <div className="flex justify-between m-5">
            <div>
                Task Flow
            </div>
            <button onClick={logout} className="text-violet-500 text-xl cursor-pointer">
                Logout
            </button>
        </div>
    )
}
export default NavBar